const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors')
const { koaBody } = require("koa-body");
const app = new Koa();
const WS = require('ws');
const { v4 } = require('uuid');
const router = require('./routes');


app.use(koaBody({
	text: true,
	urlencoded: true,
	multipart: true,
	json: true,
}))
.use(cors());

app.use(router());

const port = process.env.PORT || 7200;
const server = http.createServer(app.callback());

const wsServer = new WS.Server( {
    server
});

const chat = [];
const clients = {};
let activeUsers = [];

wsServer.on('connection', (ws) => {
    let uniqueID = v4();
    activeUsers = Array.from(Object.values(clients));
    ws.on('close', () => {
        delete clients[uniqueID];
        activeUsers = Array.from(Object.values(clients));
        const eventData = JSON.stringify({ activeUsers: activeUsers })
        Array.from(wsServer.clients)
        .filter(client => client.readyState === WS.OPEN)
        .forEach(client => {
            client.send(eventData)
        });
    }) 
    
    ws.on('message', (message) => {
        message = JSON.parse(String(message));
        let eventData;
        console.log(message)
        if (!message.conn) {
            if (message.auth) {
                clients[uniqueID] = message.auth.name;
                activeUsers = Array.from(Object.values(clients));
                eventData = JSON.stringify({ activeUsers: activeUsers })
            } else {
                chat.push(message);
                eventData = JSON.stringify({ chat: [message], activeUsers: activeUsers });
            };
            Array.from(wsServer.clients)
                .filter(client => client.readyState === WS.OPEN)
                .forEach(client => {
                    client.send(eventData)
                });
        }

    });

    ws.send(JSON.stringify({ chat: chat.concat({user: "chatBot", dt: "", text: 'Welocme to chat'}), activeUsers: activeUsers }))
});

server.listen(port, (err)=> {
    if (err) {
        console.log(err)
    }
    console.log("Server is listening to " + port);
})