import { DataSource } from "typeorm";

// const isTest = process.env.NODE_ENV === "testing";

export const datasource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  //  || (isTest ? "localhost" : "db"),
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  // || (isTest ? "5434" : "5432")),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ["./src/entities/*.ts"],
  synchronize: true,
  logging: true,
});
