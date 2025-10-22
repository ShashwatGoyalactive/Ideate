import { Router, Request, Response } from "express";
import { userMiddleware } from "../auth";
import { prismaClient } from "@repo/db/client";


const router: Router = Router();

router.post("/join-room", (req: Request, res: Response) => {});

router.post(
  "/create-room",
  userMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    try {
      const room = await prismaClient.room.create({});
      if (!room) {
        return res.status(500).json({ message: "Room creation failed" });
      }

      const roomId = room.id;
      res.json({ roomId });
    } catch (error) {
      res.json({ message: error });
    }
  }
);


export { router as roomRouter };
