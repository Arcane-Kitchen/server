import express from "express";
import {
  createNewUser,
  findUserBySupabaseId,
} from "../controllers/userController.js";
import {
  getUserWeeklyMealPlan,
  addRecipeToMealPlan,
  updateRecipeInMealPlanById,
  removeRecipeFromMealPlan,
  getUserFullMealPlan,
  updateRecipeInMealPlanByDateAndMealType
} from "../controllers/mealPlanController.js";

const router = express.Router();

// user-related methods
router.post("/", createNewUser);
router.get("/:id", findUserBySupabaseId);

//meal plan-related methods
router.get("/:id/full-meal-plan", getUserFullMealPlan);
router.get("/:id/meal-plan", getUserWeeklyMealPlan);
router.post("/:id/meal-plan", addRecipeToMealPlan);
router.patch("/:id/meal-plan/:mealPlanId", updateRecipeInMealPlanById);
router.patch("/:id/meal-plan", updateRecipeInMealPlanByDateAndMealType); // meal-plan?date=<date>&meal-type=<meal-type>
router.delete("/:id/meal-plan/:mealPlanId", removeRecipeFromMealPlan);

export default router;
