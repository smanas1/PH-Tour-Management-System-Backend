import express, { Request, Response } from "express";
import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";

let server: Server;

const app = express();

app.use(express.json());

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    // eslint-disable-next-line no-console
    console.log("Connected to mongoDB");

    server = app.listen(envVars.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Tour Management App");
});

startServer();

process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.log("Unhandled Rejection detected.... Server is shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  // eslint-disable-next-line no-console
  console.log("Uncaught exception detected.... Server is shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", () => {
  // eslint-disable-next-line no-console
  console.log("Signal Term detected.... Server is shutting down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// Promise.reject(new Error("I forgot to catch this promise"));
// throw new Error("I forgot to handle this local error");

export default app;
