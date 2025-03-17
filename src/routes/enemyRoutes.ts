import express from "express";
import { getEnemyByIdController } from "../controllers/enemyController.js";

const router = express.Router();

router.get("/:id", getEnemyByIdController);

export default router;
