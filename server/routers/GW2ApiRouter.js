import {Router} from "express";
import {authenticate} from "../security/AuthConfig.js";
import {getApiKeyByUserId} from "../repository/ApiKeyRepo.js";
import {
    fetchAccountData,
    fetchGuildData,
    fetchGuildMembers, fetchPvpStats,
    fetchWallet,
    fetchWorldData
} from "../service/Gw2ApiService.js";

const router = Router();

// endpoints are preceded by '/api/gw2'

router.get('/account', authenticate, async (req, res) => {

    const key = await getApiKeyByUserId(req.user.id);

    if (!key) {
        res.status(401).send({message: 'Valid API key required'});
        return;
    }

    const accountData = await fetchAccountData(key);
    accountData.world = await fetchWorldData(accountData.world);

    res.send(accountData);
});

router.get('/guilds', authenticate, async (req, res) => {

    const key = await getApiKeyByUserId(req.user.id);

    if (!key) {
        res.status(401).send({message: 'Valid API key required'});
        return;
    }

    const accountData = await fetchAccountData(key);

    const guilds = [];
    for (const guildId of accountData.guilds) { // guild is an ID
        const guild = await fetchGuildData(guildId, key);
        guilds.push({id: guild.id, name: guild.name, tag: guild.tag});
    }


    res.send(guilds);
});

router.get('/guild/:id', authenticate, async (req, res) => {

    const key = await getApiKeyByUserId(req.user.id);

    if (!key) {
        res.status(401).send({message: 'Valid API key required'});
        return;
    }

    const guild = await fetchGuildData(req.params.id, key);
    res.send(guild)
});

router.get('/guild-members/:id', authenticate, async (req, res) => {

    const key = await getApiKeyByUserId(req.user.id);

    if (!key) {
        res.status(401).send({message: 'Valid API key required'});
        return;
    }

    const members = await fetchGuildMembers(req.params.id, key);

    if (!members) res.status(403).send({message: 'You do not have permission to access this resource'});

    else res.send(members);
});

router.get('/wallet', authenticate, async (req, res) => {

    const key = await getApiKeyByUserId(req.user.id);

    if (!key) {
        res.status(401).send({message: 'Valid API key required'});
        return;
    }

    const wallet = await fetchWallet(key);
    res.send(wallet);
});

router.get('/pvp', authenticate, async (req, res) => {

    const key = await getApiKeyByUserId(req.user.id);

    if (!key) {
        res.status(401).send({message: 'Valid API key required'});
        return;
    }

    const stats = await fetchPvpStats(key);
    res.send(stats);

});

export default router;