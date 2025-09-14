import { Router } from "express";
import {
  createOrderController,
  getOrdersByUserController,
} from "../controllers/orders.js";

const router = Router();

router.post("/orders", createOrderController);

router.get("/orders/:userId", getOrdersByUserController);

export default router;
