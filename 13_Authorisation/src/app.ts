import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Controller } from "./interfaces";
import { errorMiddleware } from "./middlewares";

export class App {
  public app: express.Application;

  public constructor(controllers: Controller[]) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  // private connectToTheDatabase() {
  //   const {
  //     MONGO_USER,
  //     MONGO_PASSWORD,
  //     MONGO_PATH,
  //   } = process.env;
  //   mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
  // }
}
