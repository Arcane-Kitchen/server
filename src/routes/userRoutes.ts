import express, { Request, Response } from "express";
import { createNewUser, findUserBySupabaseId } from "../controllers/userController";
const router = express.Router();

router.post("/", createNewUser);
router.get("/:id", findUserBySupabaseId);

export default router;