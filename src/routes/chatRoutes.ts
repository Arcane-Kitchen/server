import express from "express";
import { chatWithAI, imageWithAi, parseRecipe } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", chatWithAI);
router.post("/generate-image", imageWithAi)
router.post("/parse-recipe", parseRecipe)

export default router;