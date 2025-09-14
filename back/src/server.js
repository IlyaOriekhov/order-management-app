import express from "express";
import cors from "cors";
import { env } from "./utils/env";

export const startServer = () => {
  const app = express;

  app.use(express.json());
  app.use(cors());

  app.use("*", (req, res) => {
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
