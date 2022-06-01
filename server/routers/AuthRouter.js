import {Router} from 'express';
import {
    checkUserCredentialsAndReturnUser,
    getUserByEmail, getUserByEmailOrUsername,
    saveNewUser,
    verifyUserById
} from "../repository/UserRepo.js";
import {issueToken} from "../security/JwtToken.js";
import crypto from "crypto";
import {
    checkVerificationToken,
    removeVerificationTokenByUser_id,
    saveNewVerificationToken
} from "../repository/VerificationTokenRepo.js";
import {sendMail} from "../util/mailer.js";
import {authenticate} from "../security/AuthConfig.js";

const router = Router();

// endpoints are preceded by '/api/auth'

router.post('/login', async (req, res) => {

    // In order to log in with either username or email
    const user = await getUserByEmailOrUsername(req.body.username);
    user.password = req.body.password;

    // needs email to verify credentials
    if (await checkUserCredentialsAndReturnUser(user)) {
        res.cookie('jwt', issueToken(user), {expires: new Date(Date.now() + 604800000)}); // one week
        console.log(`[${new Date().toLocaleString()}] AUTH: ${user.email} logged in`)
        return res.send({message: `${user.email} successfully logged in`
        });
    }

    console.log(`[${new Date().toLocaleString()}] AUTH: Login attempt unauthorized`)
    res.status(401).send({message: 'Email or password is incorrect'});
});

router.post('/signup', async (req, res) => {
    const user = req.body;
    if (!user.email || !user.password) return res.status(400).send({message: 'Bad request'});
    if (await getUserByEmail(req.body.email))
        return res.status(302).send({message: 'Email already in use'});

    req.body.id = await saveNewUser(req.body);
    await sendVerificationEmail(req.body);

    res.cookie('jwt', issueToken(req.body), {expires: new Date(Date.now() + 604800000)});
    res.send({message: `Successfully signed. A verification link has been sent to ${req.body.email}`});
});

router.get('/verify/:id/:token', async (req, res) => {
    const user_id = req.params.id;
    const token = req.params.token;

    const isMatch = await checkVerificationToken(user_id, token);
    if (!isMatch) return res.status(400).send({message: 'Invalid link'});

    await verifyUserById(user_id);
    await removeVerificationTokenByUser_id(user_id);

    console.log(`[${new Date().toLocaleString()}] AUTH: User verified their email`)
    res.send({message: 'Account Verification Successful'});
});

router.get('/request-verification-email', authenticate, async (req, res) => {
    if (req.user.verified) {
        res.send({error: true, message: 'user has already been verified'});
        return;
    }

    await sendVerificationEmail(req.user);
    res.send({});
});

async function sendVerificationEmail(user) {

    // generate and save token for account verification
    const verificationToken = crypto.randomBytes(16).toString('hex');
    await saveNewVerificationToken(user.id, verificationToken);

    // send account verification email
    const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const link = `${BASE_URL}/api/auth/verify/${user.id}/${verificationToken}`;
    const html = `<p>Click link to verify your account</p><a href="${link}" target="_blank">${link}</a>`
    await sendMail(user.email, 'Verify Account', html);
}

export default router;