import "dotenv/config";
import { validateEnv } from "./utils/validate-env";
import { App } from "./app";
import { StorageController } from "./controllers/storage.controller";

validateEnv();

const app = new App([new StorageController()]);

app.listen();
