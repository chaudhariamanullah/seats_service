import dotenv from "dotenv";
dotenv.config();

import seatRouter from "../src/routers/router.seats.js";
import express from "express";
import cors from "cors";
import "./config/cron.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/seats",seatRouter);

export default app;