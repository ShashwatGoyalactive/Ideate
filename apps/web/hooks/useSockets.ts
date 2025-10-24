"use client";
import {  useEffect, useState } from "react";
import { WS_URL } from "../app/config";
export function useSocket() {
  const [loading, setLoading] = useState<Boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=123abcd`);
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return { socket, loading };
}
