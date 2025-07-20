import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import expressSession from "express-session";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/errorHelpers/notFound";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
import passport from "passport";
import "./app/config/passport";

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Tour Management App");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
