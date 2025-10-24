import axios from "axios";
import { BACKEND_URL } from "../../config";
import ChatRoom from "../../../components/ChatRoom";

async function getRoom(slug: string) {
 try {
   console.log(`${BACKEND_URL}/api/v1/room/chat/${slug}`);
   const response = await axios.get(`${BACKEND_URL}/api/v1/room/chat/${slug}`);
   console.log(response.data);
   
   return response.data.room.id;
 } catch (error) {
  console.error(error);
  return -1;
 }
}

export default async  function Chat({params}: {
   params :Promise<{
    slug: string
  }>
}) {
  const {slug} = await params;
  console.log(slug);
  const roomId = await getRoom(slug);

  return <ChatRoom roomId={roomId}></ChatRoom>;
}
