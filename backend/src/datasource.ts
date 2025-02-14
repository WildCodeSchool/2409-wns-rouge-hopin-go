import { DataSource } from "typeorm";

export const datasource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "hopingo",
  password: "supersecret",
  database: "hopingo",
  entities: ["./src/entities/*.ts"],
  synchronize: true,
  logging: true,
});
