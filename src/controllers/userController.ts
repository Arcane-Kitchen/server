import { Request, Response } from "express";
import {
  create,
  findById,
  updateLastLogin,
  updateUserStat,
  updateCalorieAndMacrosGoal,
  updatePet,
  UserGoals,
  Pet
} from "../models/userModel.js";
import getSupabaseClientWithAuth from "../utils/supabase.js";
import { validateToken, validateProps } from "../utils/validation.js";

// create a new user
export const createNewUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { supabaseId, username } = req.body;
  const token = req.get("X-Supabase-Auth");

  // Token Validation
  if (!validateToken(token, res)) return;

  const supabase = await getSupabaseClientWithAuth(token!, res);
  if (!supabase) return;

  // Validate required props
  const requiredProps = ["supabaseId", "username"];
  if (!validateProps(req.body, requiredProps, res)) return;

  try {
    await create({ supabase_id: supabaseId, username }, supabase);
    res.status(201).json({ message: "New user added successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Find a user by Supabase Id
export const findUserBySupabaseId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const token = req.get("X-Supabase-Auth");

  // Token validation
  if (!validateToken(token, res)) return;

  const supabase = await getSupabaseClientWithAuth(token!, res);
  if (!supabase) return;

  try {
    const result = await findById(id, supabase);

    if (!result || result.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userProfile = result[0];
    res.status(200).json(userProfile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// update last user login date
export const updateUserLastLogin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idToNum = Number(id);
  const { date } = req.body;
  const token = req.get("X-Supabase-Auth");

  // Token validation
  if (!validateToken(token, res)) return;

  const supabase = await getSupabaseClientWithAuth(token!, res);
  if (!supabase) return;

  try {
    await updateLastLogin(idToNum, date, supabase);

    res.status(200).json({ message: "Login date updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// update user stat by certain amount
export const updateUserStatController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idToNum = Number(id);
  const { statAmount, chosenStat } = req.body;
  const token = req.get("X-Supabase-Auth");

  // Token validation
  if (!validateToken(token, res)) return;

  const supabase = await getSupabaseClientWithAuth(token!, res);
  if (!supabase) return;

  try {
    await updateUserStat(
      idToNum,
      statAmount,
      chosenStat,
      supabase
    );
    res.status(200).json({ message: "User stat updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update user's daily calorie and macros goal
export const updateUserCalorieAndMacrosGoal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { calories, carbs, fats, protein } = req.body;
  const token = req.get("X-Supabase-Auth");

  // Token Validation
  if (!validateToken(token, res)) return;

  const supabase = await getSupabaseClientWithAuth(token!, res);
  if (!supabase) return;
  
  // Validate required props
  const requiredProps = ["calories", "carbs", "fats", "protein"];
  if (!validateProps(req.body, requiredProps, res)) return;

  try {
    const userGoalProps: UserGoals = {
      "daily_calorie_goal": Math.floor(calories),
      "daily_carb_goal": carbs.percentage,
      "daily_fat_goal": fats.percentage,
      "daily_protein_goal": protein.percentage,
    };

    // Update user's goals
    await updateCalorieAndMacrosGoal(parseInt(id, 10), supabase, userGoalProps);
    res.status(200).json({ message: "User daily calorie and macros goal updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update user's pet information
export const updateUserPet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, imageUrl } = req.body;
  const token = req.get("X-Supabase-Auth");

  // Token Validation
  if (!validateToken(token, res)) return;

  const supabase = await getSupabaseClientWithAuth(token!, res);
  if (!supabase) return;
  
  // Validate required props
  const requiredProps = ["name", "imageUrl"];
  if (!validateProps(req.body, requiredProps, res)) return;

  try {
    const petProps: Pet = {
      "pet_name": name,
      "pet_img_happy": imageUrl.happy,
      "pet_img_normal": imageUrl.neutral,
      "pet_img_sad": imageUrl.sad,
    };

    // Update user's pet
    await updatePet(parseInt(id, 10), supabase, petProps);
    res.status(200).json({ message: "User pet information updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
