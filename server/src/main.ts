import { config } from "dotenv";
config();

import express from "express";
import pino from "express-pino-logger";
import { toRequestHandler } from "hyper-ts/lib/express";

import * as HS from "./handlers";

const PORT = process.env.PORT || 8000;

const app = express();
const logger = pino();

/**
 * Setup Routers
 */
const vote = express
  .Router()
  .post("/ballot", toRequestHandler(HS.postBallotHandler));

/**
 * Setup Application
 */
app.use(logger);
app.use(vote);
app.disable("x-powered-by");

/**
 * Start App
 */
app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
