import express from "express";
import * as randomstring from "randomstring";
import { Controller } from "../interfaces";
import { myDataSource } from "../db";
import { LinkEntity } from "../entities";
import { validationMiddleware } from "../middlewares";
import { LinkDto } from "../dto";

export class LinksController implements Controller {
  public router = express.Router();
  private readonly repository = myDataSource.getRepository(LinkEntity);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/shortit",
      validationMiddleware(LinkDto),
      this.shortLink.bind(this)
    );
    this.router.get("/:path", this.redirectToOrigin.bind(this));
  }

  private async shortLink(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const dto: LinkDto = req.body;

    const shortUrl = randomstring.generate({ length: 8 });

    const entity = new LinkEntity();

    entity.originalLink = dto.link;
    entity.shortLink = shortUrl;

    await this.repository.save(entity);

    res.json({
      newLink: `http://localhost:3000/${shortUrl}`,
    });
  }

  private async redirectToOrigin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { path } = req.params;

    if (!path) {
      res.status(400).send({ err: "Sorry, you provided wrong path" });
    }

    const entity = await this.repository.findOne({
      where: { shortLink: path },
    });

    if (!entity) {
      res.status(400).send({ err: "Sorry, path you provided doesn't exists" });
    }

    res.redirect(entity.originalLink);
  }
}
