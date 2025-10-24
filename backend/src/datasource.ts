import { DataSource } from "typeorm";

const syncMode = process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "testing";

export const datasource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ["./src/entities/*.ts"],
  // Automatic synchronization only in dev
  synchronize: syncMode,
  migrations: ["./migrations/*.ts"],
  // runs migrations automatically in prod and staging
  migrationsRun: !syncMode,
  logging: true,
});
