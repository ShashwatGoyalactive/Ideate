import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IncomingMessage } from "http";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
const wss = new WebSocketServer({ port: 8080 });

interface User {
  userId: string;
  rooms: string[];
  ws: WebSocket;
}

// a global user state to keep the track of all the users connected
const users: User[] = [];

// ffunction to authenticate user
function checkUser(token: string | null): string | null {
  try {
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return null;
    }

    return decoded.id;
  } catch (error) {
    return null;
  }
}

wss.on(
  "connection",
  function connection(ws: WebSocket, request: IncomingMessage) {
    const url = request.url;
    if (!url) {
      return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId: string | null = checkUser(token);

    if (!userId) {
      ws.close();
      return;
    }

    users.push({
      userId,
      rooms: [],
      ws,
    });

    ws.on("message", async function incoming(data) {
      const parsedData = JSON.parse(data as unknown as string);

      if (parsedData.type === "join_room") {
        const { roomId } = parsedData;
        const user = users.find((user) => user.userId === userId);
        if (user) {
          user.rooms.push(roomId);
        }
      }

      if (parsedData.type === "leave_room") {
        const { roomId } = parsedData;
        const user = users.find((user) => user.userId === userId);

        if (!user) {
          ws.close();
          return;
        }
        user.rooms = user?.rooms.filter((room) => room !== roomId);
      }

      if (parsedData.type === "chat") {
        const { roomId, message } = parsedData;

        await prismaClient.chat.create({
          data: {
           roomId :  Number(roomId),
            message,
            userId,
          },
        });
        
        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({ message, senderId: userId }));
          }
        });
      }
    });
  }
);



/* TODO: 
    Add the logic to check if the room exists 
    Add message validation 
    Add the pipeline method of handling the database chat calls (use pipline queues) to reduce the time 
    Implement the global state of the connected users on some DB
    Rate Limiting 
    Implement state management instead of global user array 
 */ 