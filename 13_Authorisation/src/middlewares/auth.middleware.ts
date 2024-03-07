import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "interfaces";
import * as jwt from "jsonwebtoken";

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorised..." });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorised..." });
  }
};
