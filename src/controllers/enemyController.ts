import { getEnemyById } from "../models/enemyModel.js";
import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch enemy by id
export const getEnemyByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const enemy = await getEnemyById(id, supabase);

    if (!enemy) {
      res.status(404).json({ message: "Enemy not found" });
      return;
    }

    res.status(200).json(enemy);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
