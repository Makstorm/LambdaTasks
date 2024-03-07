import * as mongoose from "mongoose";
import { Route } from "../interfaces";

const routeSchema = new mongoose.Schema({
  route: String,
  response: Object,
});

export const routeModel = mongoose.model<Route & mongoose.Document>(
  "Route",
  routeSchema
);
