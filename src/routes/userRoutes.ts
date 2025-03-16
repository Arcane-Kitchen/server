import express from "express";
import {
  createNewUser,
  findUserBySupabaseId,
  updateUserLastLogin,
  updateUserStatController,
} from "../controllers/userController.js";
import {
  addRecipeToMealPlan,
  updateRecipeInMealPlanById,
  removeRecipeFromMealPlan,
  getUserMealPlan,
} from "../controllers/mealPlanController.js";

const router = express.Router();

// user-related methods
router.post("/", createNewUser);
router.get("/:id", findUserBySupabaseId);
router.patch("/:id/login", updateUserLastLogin);
router.patch("/:id/stat", updateUserStatController);

//meal plan-related methods
router.get("/:id/meal-plan", getUserMealPlan); // meal-plan?start-date=<date>&end-date=<date>
router.post("/:id/meal-plan", addRecipeToMealPlan);
router.patch("/:id/meal-plan/:mealPlanId", updateRecipeInMealPlanById);
router.delete("/:id/meal-plan/:mealPlanId", removeRecipeFromMealPlan);

export default router;
