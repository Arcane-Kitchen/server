import express from "express";
import { addActivity } from "../controllers/activityController.js";

const router = express.Router();

router.post("/add-activity", addActivity);

export default router;