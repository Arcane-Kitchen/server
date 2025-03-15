import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  addRecipe,
  getAllRecipesEatenPastDay,
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/:id/pastday", getAllRecipesEatenPastDay);
router.post("/", addRecipe);

export default router;
