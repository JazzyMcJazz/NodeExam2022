<script>
    import {onMount} from "svelte";
    import {base_url} from "../../stores/general-store";
    import {navigate} from "svelte-navigator";

    let dataLoaded = false;
    let stats;
    let showBreakdown = false;
    let showRanks = false;

    onMount(async () => {
        const response = await fetch(`${$base_url}/gw2/pvp`);

        if (!response.ok)
            navigate('/');

        stats = await response.json();

        setTimeout(() => dataLoaded = true, 500);

    });
</script>

{#if dataLoaded}
    <div class="contents">
        <h2>PvP Stats</h2>
        <div class="rank-icon" style={'background-image: url(' + stats.rank.icon + ')'}></div>
        <table>
            <tr>
                <th>Rank:</th>
                <td>{stats.rank.name}</td>
            </tr>
            <tr>
                <th>Total Wins:</th>
                <td>{stats.aggregate.wins}</td>
            </tr>
            <tr>
                <th>Total Losses:</th>
                <td>{stats.aggregate.losses}</td>
            </tr>
        </table>

        <div>
            <h3>
                Profession Breakdown
                <code class="show-hide" on:click={() => showBreakdown = !showBreakdown}>
                    {showBreakdown ? 'hide' : 'show'}
                </code>
            </h3>

            {#if showBreakdown}
                {#each Object.keys(stats.professions) as profession}
                    <ul>
                        <li><code>{profession[0].toUpperCase() + profession.substring(1)}</code></li>
                        <li><code>Wins: {stats.professions[profession].wins}</code></li>
                        <li><code>Losses: {stats.professions[profession].losses}</code></li>
                    </ul>
                {/each}
            {/if}
        </div>
        <div>
            <br><br>
            <h3>
                All Ranks
                <code class="show-hide" on:click={() => showRanks = !showRanks}>
                    {showRanks ? 'hide' : 'show'}
                </code>
            </h3>
            {#if showRanks}
                {#each stats.ranks as rank}
                    <div class="rank">
                        <img alt={rank.name} style={'background-image: url(' + rank.icon + ')'} src={rank.icon}>
                        <div class="rank-name">{rank.name}</div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>

{:else}
    <div class="contents">
        <img alt="loading-spinner" class="spinner" src="./img/Gray_circles_rotate.gif"/>
    </div>
{/if}

<style>
    .contents {
        width: 100%;
        color: white;
        text-align: center;
    }

    .rank-icon {
        width: 125px;
        height: 125px;
        background-position: center center;
        background-repeat: no-repeat;
        margin: 0 auto;
    }

    table {
        margin: 0 auto;
        text-align: left;
    }

    .show-hide {
        color: deepskyblue;
    }

    .show-hide:hover {
        cursor: pointer;
        text-decoration: underline;
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0
    }

    .rank {
        width: fit-content;
        display: inline-block;
    }

    .rank img {
        width: 200px;
        height: 200px;
        background-position: center center;
        background-repeat: no-repeat;
        margin: 0 auto;
    }

    .rank-name {
        margin-top: -45px
    }

    .spinner {
        margin-top: calc(50vh - 100px);
        width: 40px;
    }
</style>