import express from "express";
import { createNewUser, findUserBySupabaseId } from "../controllers/userController.ts";
import { getUserWeeklyMealPlan, addRecipeToMealPlan, updateRecipeInMealPlan } from "../controllers/mealPlanController.ts";

const router = express.Router();

// user-related methods
router.post("/", createNewUser);
router.get("/:id", findUserBySupabaseId);

//meal plan-related methods
router.get("/:id/meal-plan", getUserWeeklyMealPlan);
router.post("/:id/meal-plan", addRecipeToMealPlan)
router.patch("/:id/meal-plan/:mealPlanId", updateRecipeInMealPlan)

export default router;