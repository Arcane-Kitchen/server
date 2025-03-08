import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js"
import { getAll } from "../models/recipeModel"

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fetch all recipes from the database
export const getAllRecipes = async(req: Request, res: Response): Promise<void> => {
    try {
        const recipes = await getAll(supabase);
        
        if (!recipes || recipes.length === 0) {
            res.status(404).json({ message: "No recipes found" });
            return;
        }

        res.status(200).json(recipes);
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
}