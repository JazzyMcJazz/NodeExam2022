<script>
    import {onMount} from "svelte";
    import {base_url, checkApiKeys} from "../../stores/general-store";
    import {expireCookie} from "../../stores/cookie-store";
    import {navigate} from "svelte-navigator";

    let authorized = false;
    let keys = [];
    let newKey;

    onMount(async () => {
        await fetchKeys();
    });

    async function fetchKeys() {
        // uses jwt cookie to authenticate
        const response = await fetch(`${$base_url}/users/apikeys`);

        if (!response.ok) {
            expireCookie('jwt');
            navigate('/');
        } else {
            const data = await response.json();
            await checkApiKeys();
            keys = data.data;
            authorized = true;
        }
    }

    async function saveNewKey() {
        const response = await fetch(`${$base_url}/users/apikey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: newKey
            }),
        });

        if (response.ok) {
            newKey = '';
            await fetchKeys();
        }
    }

</script>
{#if authorized}
    <div class="contents">
        <h2>My Keys</h2>

        <table>
            <tbody>
                {#each keys as key}
                    <tr>
                        <td>{key}</td>
                        <td class="remove">remove</td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <h4>Add Key</h4>
        <form on:submit|preventDefault={saveNewKey}>
            <input type="text" required placeholder="API Key" bind:value={newKey}/>
            <button type="submit">Add</button>
        </form>
    </div>
{/if}
<style>
    .contents {
        width: 100%;
        text-align: center;
        color: white;
    }

    table {
        margin: 0 auto;
    }

    td {
        text-align: left;
    }

    .remove {
        color: red;
    }

    .remove:hover {
        cursor: pointer;
    }

    input, button {
        padding: 0.2em;
    }

    input {
        width: 250px;
    }
</style>