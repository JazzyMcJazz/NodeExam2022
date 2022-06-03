import {Router} from "express";
import {authenticate} from "../security/AuthConfig.js";
import {deleteApiKey, getApiKeyByUserId, getUserIdByKey, saveNewApiKey} from "../repository/ApiKeyRepo.js";
import fetch from "node-fetch";
import {saveUsername} from "../repository/UserRepo.js";

const router = Router();

// endpoints are preceded by 'api/keys'

router.get('/hasapikeys', authenticate, async (req, res) => {
    const keys = await getApiKeyByUserId(req.user.id);
    res.send({hasKeys: !!keys});
});

router.get('/apikeys', authenticate, async (req, res) => {

    const key = await getApiKeyByUserId(req.user.id);
    res.send({data: key});
});

router.post('/apikey', authenticate, async (req, res) => {

    const response = await fetch(`https://api.guildwars2.com/v2/account?access_token=${req.body.key}`, {
    });

    if (!response.ok)
        res.status(404).send({message: 'Invalid API key'});

    const data = await response.json();

    if (!req.user.username)
        await saveUsername(data.name, req.user.id);

    await saveNewApiKey(req.user.id, req.body.key);

    res.send({message: 'Key successfully saved'});
});

router.delete('/', authenticate, async (req, res) => {
    const id = await getUserIdByKey(req.body.key);
    if (!id)
        res.status(404).send({message: 'That API key does n0t exist'});
    if (id !== req.user.id)
        res.status(401).send({message: 'You do not have permission to delete this key'});

    await deleteApiKey(req.body.key);

    res.send({message: 'key successfully deleted'});
});

export default router;