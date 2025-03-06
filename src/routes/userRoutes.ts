import express, { Request, Response } from "express";
import { createNewUser } from "../controllers/userController";
const router = express.Router();

router.post("/", createNewUser);

export default router;