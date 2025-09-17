import { Router } from "express";
import { getProductsController } from "../controllers/products.js";

const router = Router();

router.get("/products", getProductsController);

export default router;
