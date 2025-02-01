import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
const envFile = `.env.${env}`;
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan(env === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
    res.json({ health: "OK" });
});

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

export default { app, server };
