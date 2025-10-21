import WebSocket , { WebSocketServer } from 'ws';


const wss = new WebSocketServer({ port: 8080 });

wss.on('connection',function connection(ws: WebSocket){

    ws.on('message' , function incoming(message) {
        ws.send('ws connected');
    })
})