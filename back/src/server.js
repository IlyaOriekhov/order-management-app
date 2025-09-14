import express from "express";
import cors from "cors";
import { env } from "./utils/env.js";

import orderRouter from "./routers/orders.js";

import { apiLimiter } from "./middleware/rateLimiter.js";
import logger from "./utils/logger.js";

export const startServer = () => {
  const app = express();

  app.use(apiLimiter);

  app.use(express.json());
  app.use(cors());

  app.use(orderRouter);

  app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  });

  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  app.use((err, req, res) => {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  });

  const PORT = env("PORT", "3000");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
