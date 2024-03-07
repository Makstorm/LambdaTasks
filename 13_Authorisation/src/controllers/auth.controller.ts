import express, { NextFunction, Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Controller, RequestWithUser } from "../interfaces";
import { UserDto } from "../dtos";
import {
  authMiddleware,
  checkQueryParams,
  validationMiddleware,
} from "../middlewares";
import { HttpException } from "../errors";

export interface UserDocument {
  _id: ObjectId;
  login: string;
  password: string;
}

const genereteJwt = (id, login) => {
  return jwt.sign({ id, login }, process.env.SECRET_KEY, {
    expiresIn: "60s",
  });
};

export class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private db: MongoClient;

  constructor() {
    this.db = new MongoClient(process.env.MONGODB_URI);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware(UserDto),
      this.signUp.bind(this)
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(UserDto),
      this.singIn.bind(this)
    );
    this.router.post(`${this.path}/refresh`, authMiddleware, this.check);
    this.router.get(
      `${this.path}/me:requestNumber`,
      authMiddleware,
      this.getOneUser
    );
  }

  private async signUp(req: Request, res: Response, next: NextFunction) {
    const { login, password }: UserDto = req.body;

    await this.db.connect();
    const db = this.db.db("Auth");

    const collection = db.collection<UserDocument>("users");

    const user = await collection.findOne({ login });
    if (user) {
      return next(
        new HttpException(400, "User with that login already exists...")
      );
    }

    const hashPassword = await bcrypt.hash(password, 5);

    await collection.insertOne({
      _id: new ObjectId(),
      login,
      password: hashPassword,
    });

    const newUser = await collection.findOne({ login });

    console.log(newUser);

    const token = genereteJwt(newUser._id, newUser.login);

    return res.json({ token });
  }

  private async singIn(req: Request, res: Response, next: NextFunction) {
    const { login, password }: UserDto = req.body;

    await this.db.connect();
    const db = this.db.db("Auth");
    const collection = db.collection<UserDocument>("users");

    const user = await collection.findOne({ login });
    if (!user) {
      return next(new HttpException(403, "User not found..."));
    }

    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(new HttpException(404, "Wrong credentials..."));
    }

    const token = genereteJwt(user._id, user.login);
    return res.json({ token });
  }

  private async getOneUser(req: Request, res: Response, next: NextFunction) {
    const { requestNumber } = req.params;

    return res.json({
      requestNumber,
      data: {
        username: "login from user's token",
      },
    });
  }

  private async check(req: RequestWithUser, res: Response, next: NextFunction) {
    const { _id, login } = req.user;
    const token = genereteJwt(_id, login);
    return res.json({ token });
  }
}
