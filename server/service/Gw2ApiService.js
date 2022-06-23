import fetch from "node-fetch";

export async function fetchAccountData(key) {
    let response = await fetch(`https://api.guildwars2.com/v2/account?access_token=${key}`);
    // TODO: safeguard in case API key is invalid or other error occurs
    return await response.json();
}

export async function fetchWorldData(world) {
    let response = await fetch(`https://api.guildwars2.com/v2/worlds/${world}`);
    // TODO: safeguard in case API key is invalid or other error occurs
    return await response.json();
}

export async function fetchGuildData(guild, key) {
    const response = await fetch(`https://api.guildwars2.com/v2/guild/${guild}?access_token=${key}`);
    // TODO: safeguard in case API key is invalid or other error occurs
    return await response.json();
}

export async function fetchGuildMembers(guild, key) {
    const membersResponse = await fetch(`https://api.guildwars2.com/v2/guild/${guild}/members?access_token=${key}`);
    const ranksResponse = await fetch(`https://api.guildwars2.com/v2/guild/${guild}/ranks?access_token=${key}`);
    // TODO: safeguard in case API key is invalid or other error occurs

    if (!membersResponse.ok || !ranksResponse.ok)
        return false;

    const members = await membersResponse.json();
    const ranks = await ranksResponse.json();

    // Assign rank order to members
    for (let member of members)
        for (let rank of ranks)
            if (member.rank === rank.id)
                member.order = rank.order;

    return members;
}

export async function fetchWallet(key) {
    const currenciesResponse = await fetch(`https://api.guildwars2.com/v2/currencies?ids=all`);
    const walletResponse = await fetch(`https://api.guildwars2.com/v2/account/wallet?ids=all&access_token=${key}`);
    // TODO: safeguard in case API key is invalid or other error occurs

    const currencies = await currenciesResponse.json();
    const wallet = await walletResponse.json();

    // Assign wallet values to currency data. Currency data is now acting wallet
    for (let currency of currencies) {
        currency.value = 0;
        for (let item of wallet)
            if (currency.id === item.id)
                currency.value = item.value;
    }

    return currencies;
}

export async function fetchPvpStats(key) {
    const statsResponse = await fetch(`https://api.guildwars2.com/v2/pvp/stats?access_token=${key}`);
    const ranksResponse = await fetch(`https://api.guildwars2.com/v2/pvp/ranks?ids=all`);
    // TODO: safeguard in case API key is invalid or other error occurs

    const stats = await statsResponse.json();
    const ranks = await ranksResponse.json();

    ranks.sort((a, b) => a.min_rank - b.min_rank);

    for (let rank of ranks) {
        if (stats.pvp_rank >= rank.min_rank && stats.pvp_rank <= rank.max_rank)
            stats.rank = rank;
    }

    stats.ranks = ranks;

    return stats;
}