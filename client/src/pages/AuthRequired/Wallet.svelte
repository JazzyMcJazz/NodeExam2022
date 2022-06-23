<script>
    import {onMount} from "svelte";
    import {base_url} from "../../stores/general-store";
    import {navigate} from "svelte-navigator";

    let dataLoaded = false;
    let wallet;

    onMount(async () => {
        const response = await fetch(`${$base_url}/gw2/wallet`);

        if (!response.ok)
            navigate('/');

        wallet = await response.json();
        formatValues(wallet);
        setTimeout(() => dataLoaded = true, 500);
    });

    function formatValues(wallet) {
        for (let item of wallet) {
            if (item.name === 'Coin') {
                const copper = Math.floor((item.value / 100 - Math.floor(item.value / 100)) * 100);
                const silver = Math.floor((((item.value - copper) / 10000) - Math.floor(((item.value - copper) / 10000))) * 100);
                const gold   = Math.floor((item.value - copper - silver*100) / 10000)
                item.value = {
                    gold: gold,
                    silver: silver,
                    copper: copper,
                }

            } else item.value = item.value.toLocaleString('en-UK');
        }
    }

</script>

{#if dataLoaded}
    <div class="contents">
        <h2>Wallet</h2>
        <table>
            {#each wallet as item}
                <tr>
                    <td>
                        <div class="cell-container">
                            <code>{item.name}</code>
                        </div>
                    </td>
                    {#if (item.name === 'Coin')}
                        <td>
                            <div class="cell-container">
                                <code>{item.value.gold}</code>
                                <div class="coin-container">
                                    <img class="coin" alt="gold" title="gold" src="./img/Gold_coin.png"/>
                                </div>
                                <code>{item.value.silver}</code>
                                <div class="coin-container">
                                    <img class="coin" alt="silver" title="silver" src="./img/Silver_coin.png"/>
                                </div>
                                <code>{item.value.copper}</code>
                                <div class="coin-container">
                                    <img class="coin" alt="copper" title="copper" src="./img/Copper_coin.png"/>
                                </div>
                            </div>
                        </td>
                    {:else}
                        <td>
                            <div class="cell-container">
                                <code>{item.value}</code>
                            </div>
                        </td>
                    {/if}
                    <td >
                        <div class="icon-container cell-container">
                            <img class="currency-icon" alt={item.name + 'iconx'} title={item.name} src={item.icon}/>
                        </div>
                    </td>
                </tr>
            {/each}
        </table>
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

    table {
        margin: 0 auto;
        text-align: left;
        border-collapse: collapse;
    }

    tr:nth-child(odd) {
        background-color: #282828;
    }

    tr:nth-child(even) {
        background-color: #333333;
    }

    td {
        vertical-align: middle;
        padding: 0 10px;
    }

    td:first-child {
        padding-left: 40px;
    }

    td:last-child {
        padding-right: 40px;
    }

    td:nth-child(2) {
        text-align: right;
    }

    .cell-container {
        display: flex;
    }

    .cell-container:nth-child(even) {
        justify-content: end;
    }

    .coin-container {
        display: inline-flex;
        width: fit-content;
        height: 15px;
        margin-right: 5px;
    }

    .coin-container:last-child {
        margin-right: 0;
    }

    .icon-container {
        height: 30px;
        width: 30px;
        margin: 5px 0;
    }

    .currency-icon {
        width: 30px;
    }

    .spinner {
        margin-top: calc(50vh - 100px);
        width: 40px;
    }
</style>