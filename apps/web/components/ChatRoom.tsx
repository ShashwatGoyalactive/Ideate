import axios from "axios";
import { BACKEND_URL } from "../app/config";
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats({roomId }: {roomId : string}){
try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/room/${roomId}`);
        console.log(response.data);
        return response.data.messages;
} catch (error) {
    console.log(error);
    return 1;
}
}

export default async function ChatRoom({ roomId }: { roomId: string }) {
    const messages = await getChats({roomId});
    console.log(messages);
    console.log(roomId);
    return (
        <ChatRoomClient messages={messages} id={roomId}></ChatRoomClient>
    );
}
