import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import zod from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router: Router = Router();

const signupBodySchema = zod.object({
  firstName: zod.string().min(3),
  lastName: zod.string(),
  userName: zod.string().min(3),
  email: zod.email(),
  password: zod.string().min(8),
});

router.post("/signup", async (req: Request, res: Response) => {
  const { firstName, lastName, userName, email, password } = req.body;

  try {
    const data = signupBodySchema.safeParse({
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

const signinBodySchema = zod.object({
  email: zod.email(),
  password: zod.string().min(8),
});

router.post("/signin", (req: Request, res: Response) => {
    const {email , password} = req.body;

    try {
      const data = signinBodySchema.safeParse({
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
