import express from "express";
import { createNewUser, findUserBySupabaseId } from "../controllers/userController.ts";
const router = express.Router();

router.post("/", createNewUser);
router.get("/:id", findUserBySupabaseId);

export default router;