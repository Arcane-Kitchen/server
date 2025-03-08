import express from "express";
import { getAllRecipes, getRecipeById } from "../controllers/recipeController"

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/recipes/:id", getRecipeById);

export default router;