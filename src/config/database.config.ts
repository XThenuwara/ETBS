import { DataSource } from "typeorm";
import { Event } from "@/event/entity/event.entity";
import { Booking } from "@/event/entity/booking.entity";
import { WaitingList } from "@/waiting-list/entity/waitingList.entity";
const env = process.env.NODE_ENV || "development";

export const SqlLiteDataSource = new DataSource({
    type: "sqlite",
    database: process.env.DB_PATH || "./database/database.sqlite",
    entities: [Event, Booking, WaitingList, "src/**/*.entity.ts"],
    migrations: ["./database/migrations/**/*.ts"],
    synchronize: env === "development",
    logging: env === "development",
});