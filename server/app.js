import 'dotenv/config';
import express from 'express'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import path from "path";
import helmet from "helmet";
import {authLimiter} from "./security/AuthConfig.js";
import createDB from "./database/create-database.js";
import UserRouter from "./routers/UserRouter.js";
import AuthRouter from "./routers/AuthRouter.js";
import ApiKeyRouter from "./routers/ApiKeyRouter.js";
import GW2ApiRouter from "./routers/GW2ApiRouter.js";
import http from "http";
import socket from './io/socket.js';
import {Server} from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
await createDB();

socket.start(io);

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api', helmet()); // restrict helmet headers to /api endpoints
app.use('/api/auth', authLimiter); // limit requests to 6 per 15 minutes
app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRouter);
app.use('/api/keys', ApiKeyRouter);
app.use('/api/gw2', GW2ApiRouter);

app.use(express.static(path.resolve('../client/public')));
app.get('*', (req, res) => res.sendFile(path.resolve('../client/public/index.html')))

// await saveNewUser({email: 'bob@email.com', password: 'asdf'});

const PORT = process.env.PORT || 3000;
server.listen(PORT, (err) => {
   if (err) console.log(err);
   else console.log(`[${new Date().toLocaleString()}] SERVER: Server running on port`, PORT)
});

