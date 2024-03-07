import { MongoClient, Db } from "mongodb";
import { App } from "./App";
import { AuthController } from "./controllers";
import * as dotenv from "dotenv";
import { error } from "console";

dotenv.config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

const app = new App([new AuthController()]);

app.listen();
