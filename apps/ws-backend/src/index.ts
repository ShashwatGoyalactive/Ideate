import WebSocket , { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import {JWT_SECRET} from '@repo/backend-common/config';

const wss = new WebSocketServer({ port: 8080 });
wss.on('connection',function connection(ws: WebSocket , request : IncomingMessage){
    const url = request.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get('token');

    if(!token){
        return;
    }

    const decoded = jwt.verify(token , JWT_SECRET) as JwtPayload;
    if(!decoded || !decoded.id){
        ws.close();
        return;
    }



    ws.on('message' , function incoming(message) {
        ws.send('ws connected');
    })
})