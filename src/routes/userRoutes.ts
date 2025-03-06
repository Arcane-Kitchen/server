import express from "express";
import { createNewUser, findUserBySupabaseId } from "../controllers/userController.ts";
import { getUserWeeklyMealPlan } from "../controllers/mealPlanController";

const router = express.Router();

// user-related methods
router.post("/", createNewUser);
router.get("/:id", findUserBySupabaseId);

//meal plan-related methods
router.get("/:id/meal-plan", getUserWeeklyMealPlan);

export default router;