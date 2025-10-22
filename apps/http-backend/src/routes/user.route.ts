import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {SignInSchema , SignUpSchema } from '@repo/common/zod';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router: Router = Router();


router.post("/signup", async (req: Request, res: Response) => {
  const { firstName, lastName, userName, email, password } = req.body;

  try {
    const data = SignUpSchema.safeParse({
      firstName,
      lastName,
      userName,
      email,
      password,
    });
    if (!data) {
      return res.status(411).json({ message: "Invalid Data" });
    }

    const user = await prisma.User.create({
      data: {
        firstName,
        lastName,
        userName,
        email,
        password,
      },
    });

    if(!user){
        return res.status(500).json({message : "User signup failed"});
    }

    const token = jwt.sign({
        id : user.id
    }, process.env.JWT_SECRET as string);


    res.status(200).cookie("token", token).json({message:  "Signed up successfully", token});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "User signup failed" });
  }
});


router.post("/signin", (req: Request, res: Response) => {
    const {email , password} = req.body;

    try {
      const data = SignInSchema.safeParse({
        email,
        password,
      })  

      if(!data){
        return res.status(411).json({message : "Invalid Data"});
      }

      const user = prisma.User.findUnique({
        where : {
            email
        }
      });

      if(!user){
        return res.status(500).json({message : "User signin failed"});
      }

      const token = jwt.sign({
        id : user.id
      }, process.env.JWT_SECRET as string);

      res.status(200).cookie("token", token).json({message : "Signed in successfully", token});

    } catch (error) {
        res.status(500).json({message : "signin failed"});
    }
    return;
});

export { router as userRouter };
