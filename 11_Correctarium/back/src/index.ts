import express, { Request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { validateRequest } from "./middlewares";
import { CorrectariumRequestBody, correctariumBodySchema } from "./models";
import { getDeadlineDetails, getPrice } from "./utils";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post(
  "/correctarium",
  validateRequest(correctariumBodySchema),
  async (req: Request, res) => {
    const body: CorrectariumRequestBody = req.body;

    res.send({ price: getPrice(body), ...getDeadlineDetails(body) });
  }
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
