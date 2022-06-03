import {Router} from "express";
import {authenticate} from "../security/AuthConfig.js";
import {getApiKeyByUserId} from "../repository/ApiKeyRepo.js";
import fetch from "node-fetch";

const router = Router();

// endpoints are preceded by '/api/gw2'

router.get('/account', authenticate, async (req, res) => {
    const key = await getApiKeyByUserId(req.user.id);
    console.log(key);
    if (!key) {
        res.status(401).send({message: 'Valid API key required'});
        return;
    }

    let response = await fetch(`https://api.guildwars2.com/v2/account?access_token=${key}`);

    // TODO: safeguard in case API key is invalid or other error occurs

    const accountData = await response.json();

    let guilds = [];
    for (const guild of accountData.guilds) { // guild is an ID
        response = await fetch(`https://api.guildwars2.com/v2/guild/${guild}?access_token=${key}`);
        const data = await response.json();
        guilds.push({id: guild, name: data.name, tag: data.tag});
    }
    accountData.guilds = guilds;

    res.send(accountData);
});

export default router;