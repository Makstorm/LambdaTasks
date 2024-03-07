import { UserDocument } from "../controllers";
import { Request } from "express";

export interface RequestWithUser extends Request {
  user: any;
}
