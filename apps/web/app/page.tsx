"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [slug, setSlug] = useState("");
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw"
      }}
    >
      <div>
        <input style={{padding : 10}}
          value={slug}
          type="text"
          placeholder="Room Slug"
          onChange={(e) => {
            setSlug(e.target.value);
          }}
        ></input>

        <button style={{padding: 10}}
          onClick={() => {
            router.push(`/room/${slug}`);
          }}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
