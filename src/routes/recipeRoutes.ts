import express from "express";
import { getAllRecipes, getRecipeById, addRecipe } from "../controllers/recipeController";

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", addRecipe);

export default router;