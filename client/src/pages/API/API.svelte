<script>
    import {onMount} from "svelte";
    import {base_url, checkApiKeys} from "../../stores/general-store";
    import {expireCookie} from "../../stores/cookie-store";
    import {navigate} from "svelte-navigator";

    let authorized = false;
    let key;
    let newKey;
    let loading = true;

    onMount(async () => {
        await fetchKeys();
    });

    async function fetchKeys() {
        loading = true;
        // uses jwt cookie to authenticate
        const response = await fetch(`${$base_url}/keys/apikeys`);

        if (!response.ok) {
            expireCookie('jwt');
            navigate('/');
        } else {
            const data = await response.json();
            await checkApiKeys();
            key = data.data;
            authorized = true;
        }

        setTimeout(() => loading = false, 1500);
    }

    async function saveNewKey() {
        const response = await fetch(`${$base_url}/keys/apikey`, {
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

    async function deleteKey(key) {
        const response = await fetch(`${$base_url}/keys`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: key
            }),
        });

        if (response.ok)
            await fetchKeys();
    }

</script>
{#if authorized}
    <div class="contents">
        <h2>My Keys</h2>

        <table>
            <tbody>
                {#if loading}
                    <tr>
                        <td>
                            <img alt="loading-spinner" src="./Gray_circles_rotate.gif"/>
                        </td>
                    </tr>
                {:else}
                {#if key}
                    <tr>
                        <td>{key}</td>
                        <td class="remove" on:click={() => deleteKey(key)}>remove</td>
                    </tr>
                {:else}

                {/if}
                {/if}
            </tbody>
        </table>

        <h4>{#if key}Replace{:else}Add{/if} Key</h4>
        <form on:submit|preventDefault={saveNewKey}>
            <input type="text" required placeholder="API Key" bind:value={newKey}/>
            <button type="submit">{#if key}Replace{:else}Add{/if}</button>
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

    img {
        width: 40px
    }
</style>