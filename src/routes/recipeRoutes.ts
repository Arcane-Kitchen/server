import express from "express";
import { getAllRecipes } from "../controllers/recipeController"

const router = express.Router();

router.get("/", getAllRecipes);


export default router;