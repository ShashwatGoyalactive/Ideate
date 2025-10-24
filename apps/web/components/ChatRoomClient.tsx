"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSockets";
export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((prevChats) => [
            ...prevChats,
            { message: parsedData.message },
          ]);
        }
      };
    }
    return () => {
      if(socket && socket.readyState !== WebSocket.CLOSED)
     socket?.close();
    };
  }, [socket, loading, id]);

  
  
  return (
    <div>
      {chats &&
        chats.map((m, index) => {
          return <div key={index}>{m.message}</div>;
        })}

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
        placeholder="enter your message"
      ></input>

      <button
        onClick={() => {
          console.log(currentMessage);
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            })
          );
          chats.push({message : currentMessage});
          setCurrentMessage("");
        }}
      >
        Send Message
      </button>
    </div>
  );
}
