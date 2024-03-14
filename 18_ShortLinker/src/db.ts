import "reflect-metadata";
import { DataSource } from "typeorm";
import * as mysql12 from "mysql2";

import * as dotenv from "dotenv";
import { LinkEntity } from "./entities";

dotenv.config();

// const AppDataSource = new DataSource({
//   type: "mysql",
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: [CurrenciesRequestEntity, CurrencyDataEntity],
//   synchronize: true,
// });

export const myDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "mauFJcuf5dhRMQrjj",
  database: "links",
  entities: [LinkEntity],
  logging: true,
  synchronize: true,
  driver: mysql12,
});

// AppDataSource.initialize();
