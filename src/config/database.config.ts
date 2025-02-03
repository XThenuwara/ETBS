import { DataSource } from "typeorm";
const env = process.env.NODE_ENV || "development";

export const SqlLiteDataSource = new DataSource({
    type: "sqlite",
    database: process.env.DB_PATH || "./database/database.sqlite",
    entities: ["src/**/*.entity.ts"],
    migrations: ["./database/migrations/**/*.ts"],
    synchronize: env === "development",
    logging: env === "development",
});