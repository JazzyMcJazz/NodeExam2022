import {Router} from "express";
import {getUserByEmailOrUsername, saveUsername} from "../repository/UserRepo.js";
import {authenticate} from "../security/AuthConfig.js";
import {getApiKeysByUserId, saveNewApiKey} from "../repository/ApiKeyRepo.js";
import fetch from "node-fetch";

const router = Router();

// endpoints are preceded by '/api/users'

router.get('/isverified', authenticate, (req, res) => {
   if (req.user.verified)
       res.send({verified: true});
   else
       res.send({verified: false});
});

router.get('/hasapikeys', authenticate, async (req, res) => {
    const keys = await getApiKeysByUserId(req.user.id);
    res.send({hasKeys: keys.length > 0});
});

router.get('/apikeys', authenticate, async (req, res) => {

    const keys = await getApiKeysByUserId(req.user.id);
    res.send({data: keys});
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

router.post('/userexists', async (req, res) => {
    const username = req.body.username;
    const user = await getUserByEmailOrUsername(username);

    if (user === undefined)
        res.status(404).send({message: 'No user exists with that email or password'});
    else
        res.status(302).send({message: 'user found'});
});

export default router;