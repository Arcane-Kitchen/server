import express from "express";
import { addActivity, fetchUserAchievements } from "../controllers/activityController.js";

const router = express.Router();

router.post("/add-activity", addActivity);
router.get("/achievements/:userId", fetchUserAchievements); 
export default router;