import { Router, Request, Response } from "express";
import { userMiddleware } from "../auth";
import { prismaClient } from "@repo/db/client";

const router: Router = Router();

router.get("/chat", (req: Request, res: Response) => {
  const roomId = req.query.roomId;
  try {
  } catch (error) {}
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

export { router as roomRouter };
