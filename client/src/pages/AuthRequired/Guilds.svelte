<script>

    import {onMount} from "svelte";
    import {base_url} from "../../stores/general-store";
    import {navigate} from "svelte-navigator";

    let dataLoaded = false;
    let guilds;

    onMount( async () => {
        const response = await fetch(`${$base_url}/gw2/guilds`);

        if (!response.ok)
            navigate('/');

        guilds = await response.json();

        setTimeout(() => dataLoaded = true, 500);
    });

</script>
{#if dataLoaded}
    <div class="contents">
        <h2>Your Guilds</h2>

        <table>
            {#each guilds as guild}
                <tr>
                    <td colspan="2">
                        <code class="guild-link" on:click={() => navigate(`/guild/${guild.id}`)}>
                            {guild.name}[{guild.tag}]
                        </code>
                    </td>
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
        font-size: 1.5em;
    }

    td {
        text-align: left;
    }

    .guild-link {
        cursor: pointer;
        color: deepskyblue;
    }

    .guild-link:hover {
        text-decoration: underline;
    }

    img {
        margin-top: calc(50vh - 100px);
        width: 40px;
    }

</style>