import express from 'express'
import http from 'http'
import {matchRouter} from "./routes/matches.js"
import {commentaryRouter} from "./routes/commentary.js"
import { attachWebSocketServer } from './ws/server.js';
import { securityMiddleware } from './arcjet.js';

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

const server = http.createServer(app);



app.use(express.json());

app.get('/',(req,res)=>{
    res.send('hello from express server!');
})

app.use(securityMiddleware())

app.use('/matches',matchRouter)
app.use('/matches/:id/commentary',commentaryRouter)

// initialize the  WebSocket setup and getting access to broadcastMatchCreated

const {broadcastMatchCreated} = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

//app.locals is used to store data that can be accessed by all routes  express global obejct 



server.listen(PORT, HOST, () => {
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

    console.log(`Server is running on ${baseUrl}`);
    console.log(`WebSocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);
});