import { Request, Response } from "express";
import { create, findById, updateLastLogin } from "../models/userModel.js";
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
