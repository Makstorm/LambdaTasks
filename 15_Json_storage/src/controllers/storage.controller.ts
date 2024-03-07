import express from "express";
import { Controller } from "../interfaces";
import { routeModel } from "../schemas/route.schema";

export class StorageController implements Controller {
  public router = express.Router();
  private model = routeModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/:myRouteToGet", this.getRouteData.bind(this));
    this.router.post("/:myRouteToSave", this.saveRouteData.bind(this));
  }

  private async saveRouteData(req: express.Request, res: express.Response) {
    const { myRouteToSave } = req.params;
    const responseBody = req.body;

    try {
      await this.model.create({
        route: myRouteToSave.toLowerCase(),
        response: responseBody,
      });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error saving response to database" });
    }
  }

  private async getRouteData(req: express.Request, res: express.Response) {
    const { myRouteToGet } = req.params;

    try {
      const savedResponse = await this.model.find({
        route: myRouteToGet.toLocaleLowerCase(),
      });

      if (!savedResponse) {
        return res
          .status(404)
          .json({ message: "Response not found for this route" });
      }

      const response = savedResponse.map((el) => el.response);

      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving response from database" });
    }
  }
}
