import 'module-alias/register';
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { SqlLiteDataSource } from "@/config/database.config";
import eventRouter from '@/event/event.controller';

const env = process.env.NODE_ENV || "development";
const envFile = `.env.${env}`;
dotenv.config({ path: envFile });

const initializeApp = async () => {
  const app = express();
  const port = process.env.PORT || 3000;

  // Initialize Database
  try {
    await SqlLiteDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  }

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(morgan(env === "production" ? "combined" : "dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req: Request, res: Response) => {
    res.json({
      health: "OK",
      database: SqlLiteDataSource.isInitialized ? "Connected" : "Disconnected",
    });
  });

  // Routes
  app.use("/api", eventRouter);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Something went wrong!",
      code: 500,
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  });

  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return { app, server };
};

const app = initializeApp();

export default app;
