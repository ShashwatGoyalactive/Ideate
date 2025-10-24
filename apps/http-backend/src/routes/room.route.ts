import { Router, Request, Response } from "express";
import { userMiddleware } from "../auth";
import { prismaClient } from "@repo/db-prisma/client";

const router: Router = Router();
//TODO add the middleware after the user is authenticated
router.get("/:roomId", async (req: Request, res: Response) => {
  const roomId = Number(req.params.roomId);
  if (isNaN(roomId)) {
    return res
      .status(400)
      .json({ message: "Invalid room ID. Must be a number." });
  }
  try {
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });
    res.json({ messages });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(
  "/create-room",
  userMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const { roomName } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "Missing authenticated user id" });
    }
    if (!roomName || typeof roomName !== "string") {
      return res
        .status(400)
        .json({ message: "roomName is required and must be a string" });
    }
    try {
      const room = await prismaClient.room.create({
        data: {
          slug: roomName as string,
          adminId: userId as string,
        },
      });
      if (!room) {
        return res.status(500).json({ message: "Room creation failed" });
      }

      console.log(room);
      const roomId = room.id;
      res.json({ roomId });
    } catch (error) {
      res.json({ message: error });
    }
  }
);

router.get(
  "/chat/:slug",
  async (req: Request, res: Response) => {
    const slug = req.params.slug;

    try {
      const room = await prismaClient.room.findFirst({
        where: {
          slug: slug,
        },
      });

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      res.json({ room});
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export { router as roomRouter };
