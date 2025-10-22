import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization: string[] = req.headers.authorization?.split(" ") || [];

  if (authorization.length < 2 || authorization[0] !== "Bearer") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token: string = req.cookies.token || authorization[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
