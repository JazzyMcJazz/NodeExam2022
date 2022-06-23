<script>

    import {onMount} from "svelte";
    import {base_url} from "../../stores/general-store";
    import {navigate} from "svelte-navigator";

    let dataLoaded = false
    let accountData;

    onMount(async () => {
        const response = await fetch(`${$base_url}/gw2/account`);

        if (!response.ok)
            navigate('/');

        accountData = await response.json();

        setTimeout(() => dataLoaded = true, 500);
    });

</script>

{#if dataLoaded}
    <div class="contents">
        <h2>Account Information</h2>
        <table>
            <tr>
                <th><code>Account Name</code></th>
                <td><code>{accountData.name}</code></td>
            </tr>
            <tr>
                <th><code>Created</code></th>
                <td><code>{accountData.created.slice(0, 10)}</code></td>
            </tr>
            <tr>
                <th><code>World</code></th>
                <td><code>{accountData.world.name}</code></td>
            </tr>
            <tr>
                <th><code>Fractal Level</code></th>
                <td><code>{accountData.fractal_level}</code></td>
            </tr>
            <tr>
                <th colspan="2" class="center access"><code>Access</code></th>
            </tr>
            {#each accountData.access as expac}
                <tr>
                    <td colspan="2" class="center"><code>{expac}</code></td>
                </tr>
            {/each}

        </table>
    </div>
{:else}
    <div class="contents">
        <img alt="loading-spinner" src="./img/Gray_circles_rotate.gif"/>
    </div>
{/if}

<style>
    .contents {
        width: 100%;
        color: white;
        text-align: center;
    }

    table {
        margin: 0 auto;
        width: 250px;
    }

    td, th {
        text-align: left;
    }

    .access {
        padding-top: 20px;
    }

    .center {
        text-align: center;
    }

    img {
        margin-top: calc(50vh - 100px);
        width: 40px;
    }
</style>