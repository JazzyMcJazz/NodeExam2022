<script>
    import {onMount} from "svelte";
    import {base_url} from "../../stores/general-store";
    import {navigate} from "svelte-navigator";

    export let id;

    let dataLoaded = false;
    let showMembers = false;
    let guildData;
    let members;

    onMount( async () => {
        const guildResponse = await fetch(`${$base_url}/gw2/guild/${id}`);
        const membersResponse = await fetch(`${$base_url}/gw2/guild-members/${id}`);

        if (!guildResponse.ok)
            navigate('/guilds');

        guildData = await guildResponse.json();

        // member list is only accessible to Guild Leaders
        if (membersResponse.ok) {
            members = await membersResponse.json();

            // sort by rank order (highest rank first)
            members.sort((a, b) => a.order - b.order);

        } else members = false;

        setTimeout(() => dataLoaded = true, 500);
    });

</script>

{#if dataLoaded}
    <div class="contents">
        <h2>{guildData.name}[{guildData.tag}]</h2>

        <table id="motd">
            <tr><th colspan="2">Guild Message of the Day</th></tr>
            <tr><td colspan="2" class="motd"><code>{guildData.motd}</code></td></tr>
        </table>
        <br>
        <table id="guild-data">
            <tr>
                <th><code>Guild Level:</code></th>
                <td><code>{guildData.level}</code></td>
            </tr>
            <tr>
                <th><code>Influence:</code></th>
                <td><code>{guildData.influence}</code></td>
            </tr>
            <tr>
                <th><code>Favor:</code></th>
                <td><code>{guildData.favor}</code></td>
            </tr>
            <tr>
                <th><code>Aetherium:</code></th>
                <td><code>{guildData.aetherium}</code></td>
            </tr>
            <tr>
                <th><code>Member Capacity:</code></th>
                <td><code>{guildData.member_capacity}</code></td>
            </tr>
        </table>
        <br>
        <table id="members">
            <tr><th colspan="2" class="center">
                    Members: {guildData.member_count}
                    {#if members}
                        <code class="show-members" on:click={() => showMembers = !showMembers}>
                            [{showMembers ? 'hide' : 'show'}]
                        </code>
                    {/if}
                </th>
            </tr>

            {#if members}

                {#if showMembers}
                    <tr>
                        <th><code>Name</code></th>
                        <th><code>Rank</code></th>
                    </tr>

                    {#each members as member}
                        <tr>
                            <td><code>{member.name}</code></td>
                            <td><code>{member.rank}</code></td>
                        </tr>
                    {/each}
                {/if}

            {:else}
                <div class="center"><code>Member list only available to Guild Leaders</code></div>
            {/if}
        </table>
    </div>

{:else}
    <div class="contents">
        <img alt="loading-spinner" src="../img/Gray_circles_rotate.gif"/>
    </div>
{/if}

<style>
    .contents {
        width: 100%;
        color: white;
        text-align: center;
    }

    #motd {
        width: 50%;
        margin: 0 auto;
    }

    #guild-data {
        width: 250px;
        margin: 0 auto;
        text-align: left;
    }

    #members {
        width: 250px;
        margin: 0 auto;
        text-align: left;
    }

    .motd {
        background-color: #282828;
        padding: 5px;
        border-radius: 5px;
        border: 1.5px #666666 inset;
        text-align: start;
    }

    .show-members {
        font-size: 0.8em;
        color: deepskyblue;
    }

    .show-members:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    .center {
        text-align: center;
    }

    img {
        margin-top: calc(50vh - 100px);
        width: 40px;
    }
</style>