import { Router } from "express";
import { getUsersController } from "../controllers/users.js";

const router = Router();

router.get("/users", getUsersController);

export default router;
