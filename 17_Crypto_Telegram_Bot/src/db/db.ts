import { DataSource } from "typeorm";
import { UserEntity } from "./user.entity";

export const myDataSource = new DataSource({
  type: "sqlite",
  database: "./src/db/mydatabase.sqlite",
  synchronize: true,
  logging: false,
  entities: [UserEntity],
});
