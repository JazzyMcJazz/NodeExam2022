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

        setTimeout(() => dataLoaded = true, 1500);

    });

</script>

{#if dataLoaded}
    <div class="contents">
        <h2>Account Information</h2>
        <table>
            <tr>
                <td><code>Account Name</code></td>
                <td><code>{accountData.name}</code></td>
            </tr>
            <tr>
                <td><code>Created</code></td>
                <td><code>{accountData.created.slice(0, 10)}</code></td>
            </tr>
            <tr>
                <th class="guilds-header" colspan="2">Guilds</th>
            </tr>
            {#each accountData.guilds as guild}
                <tr>
                    <td colspan="2" class="guild-link"><code>{guild.name}[{guild.tag}]</code></td>
                </tr>
            {/each}

        </table>
    </div>
{:else}
    <div class="contents">
        <img alt="loading-spinner" src="./Gray_circles_rotate.gif"/>
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
    }

    td {
        text-align: left;
    }

    td:nth-child(odd) {
        padding-right: 20px ;
    }

    .guilds-header {
        padding-top: 20px;
    }

    img {
        margin-top: calc(50vh - 100px);
        width: 40px;
    }

    .guild-link {
        cursor: pointer;
        color: deepskyblue;
    }

    .guild-link:hover {
        text-decoration: underline;
    }
</style>