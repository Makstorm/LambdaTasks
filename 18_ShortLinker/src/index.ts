import "dotenv/config";
import { validateEnv } from "./utils/validate-env";
import { App } from "./app";
import { LinksController } from "./controllers/link.controller";

validateEnv();

const app = new App([new LinksController()]);

app.listen();
