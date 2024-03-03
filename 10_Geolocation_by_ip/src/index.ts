import express, { Request } from "express";
import bodyParser from "body-parser";
import requestIp from "request-ip";
import cors from "cors";
import { findCountryByIp, ipToBigInt } from "./utils";

const app = express();
const port = 3000;

app.use(cors());
app.use(requestIp.mw());
app.use(bodyParser.json());

app.get("/get-country", async (req: Request, res) => {
  //   const ip = req.clientIp;

  const { ip } = req.query;
  console.log(ip);
  const numericIp = ipToBigInt(String(ip));
  console.log(numericIp);

  const country = await findCountryByIp(numericIp);
  if (country) {
    res.send({ country });
  } else {
    res.status(404).send("Country not found for the given IP address");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
