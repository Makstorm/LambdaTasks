import "dotenv/config";
import { validateEnv } from "./utils/validate-env";
import { App } from "./app";
import { CurrencyController } from "./controllers/currency.controller";

validateEnv();

const app = new App([new CurrencyController()]);

app.listen();
