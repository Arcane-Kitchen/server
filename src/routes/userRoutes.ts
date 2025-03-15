import express from "express";
import {
  createNewUser,
  findUserBySupabaseId,
  updateUserLastLogin,
} from "../controllers/userController.js";
import {
  addRecipeToMealPlan,
  updateRecipeInMealPlanById,
  removeRecipeFromMealPlan,
  updateRecipeInMealPlanByDateAndMealType,
  getUserMealPlan,
} from "../controllers/mealPlanController.js";
import { addActivity } from "../utils/achievement.js";

const router = express.Router();

// user-related methods
router.post("/", createNewUser);
router.get("/:id", findUserBySupabaseId);
router.patch("/:id/login", updateUserLastLogin);

//meal plan-related methods
router.get("/:id/meal-plan", getUserMealPlan); // meal-plan?start-date=<date>&end-date=<date>
router.post("/:id/meal-plan", addRecipeToMealPlan);
router.patch("/:id/meal-plan/:mealPlanId", updateRecipeInMealPlanById);
router.patch("/:id/meal-plan", updateRecipeInMealPlanByDateAndMealType); // meal-plan?date=<date>&meal-type=<meal-type>
router.delete("/:id/meal-plan/:mealPlanId", removeRecipeFromMealPlan);

export default router;
