import {Router} from "express";
import {getUserByEmailOrUsername} from "../repository/UserRepo.js";
import {authenticate} from "../security/AuthConfig.js";

const router = Router();

// endpoints are preceded by '/api/users'

router.get('/self', authenticate, async (req, res) => {
    res.send(req.user);
});

router.get('/isverified', authenticate, (req, res) => {
   if (req.user.verified)
       res.send({verified: true});
   else
       res.send({verified: false});
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