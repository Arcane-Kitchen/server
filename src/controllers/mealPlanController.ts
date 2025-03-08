import { Request, Response } from "express";
import { getMealPlan, getRecipe, addRecipe, updateRecipe, deleteRecipe } from "../models/mealPlanModel.ts"
import { findById } from "../models/recipeModel.ts"
import getSupabaseClientWithAuth from "../utils/supabase.ts";
import { setXPForRecipeDifficulty } from "../utils/xpHelper.ts";
import { validateToken, validateProps } from "../utils/validation.ts"

// Format date to YYYY-MM-DD
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Define the recipe interface
export interface recipe {
    user_id: string,
    recipe_id: string,
    day_to_eat: string,
    servings?: number
    exp: number
    chosen_meal_type: string,
    has_been_eaten?: boolean,
}

// Fetch the user's meal plan for the week
export const getUserWeeklyMealPlan = async (req: Request, res: Response) => {
    const { id } = req.params;
    const token = req.get("X-Supabase-Auth");

    // Token validation
    if (!validateToken(token, res)) return;

    const supabase = await getSupabaseClientWithAuth(token!, res);
    if (!supabase) return;

    try {
        // calculate the start and end of the weekly meal plan
        const currentDate = new Date();
        const currentDay = currentDate.getDay();

        const startOfWeek = new Date();
        startOfWeek.setDate(currentDate.getDate() - currentDay);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const formattedStartOfWeek = formatDate(startOfWeek);
        const formattedEndOfWeek = formatDate(endOfWeek);

        // Fetch the user's meal plan
        const results = await getMealPlan(id, formattedStartOfWeek, formattedEndOfWeek, supabase);
        res.status(200).json(results);
    } catch (error:any) {
        res.status(500).json({ error: error.message })
    }
}

// Add a recipe to the user's weekly meal plan
export const addRecipeToMealPlan = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { recipeId, dayToEat, servings, hasBeenEaten, chosenMealType } = req.body;
    const token = req.get("X-Supabase-Auth");

    // Token Validation
    if (!validateToken(token, res)) return;

    const supabase = await getSupabaseClientWithAuth(token!, res);
    if (!supabase) return;

    // Validate required props
    const requiredProps = ["recipeId", "dayToEat", "chosenMealType"];
    if (!validateProps(req.body, requiredProps, res)) return;


    try {
        // Check and fetch the recipe from the meal plan
        const recipe = await findById(recipeId, supabase);
        if (!recipe || recipe.length === 0) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
    
        const difficulty = recipe[0].difficulty;
        const exp = setXPForRecipeDifficulty(difficulty);

        const recipeProps: recipe = {
            "user_id": id,
            "recipe_id": recipeId,
            "day_to_eat": dayToEat,
            exp,
            "chosen_meal_type": chosenMealType,
            ...servings && {servings},
            ...hasBeenEaten && { "has_been_eaten": hasBeenEaten },
        }

        await addRecipe(recipeProps, supabase);
        res.status(201).json({ message: "New recipe added to meal plan successfully" });

    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

// Update a recipe in the user's meal plan
export const updateRecipeInMealPlan = async (req: Request, res: Response) => {
    const { mealPlanId } = req.params;
    const { dayToEat, servings, hasBeenEaten, chosenMealType } = req.body;
    const token = req.get("X-Supabase-Auth");

    // Token Validation
    if (!validateToken(token, res)) return;

    const supabase = await getSupabaseClientWithAuth(token!, res);
    if (!supabase) return;

    try {
        // Check if the recipe exists in the meal plan
        const recipe = await getRecipe(mealPlanId, supabase);
        if (!recipe || recipe.length === 0) {
            res.status(404).json({ message: "Recipe not found in the meal plan" });
            return;
        }

        const recipeProps:Partial<recipe> = {
            ...servings && {servings},
            ...dayToEat && { "day_to_eat": dayToEat },
            ...hasBeenEaten && { "has_been_eaten": hasBeenEaten },
            ...chosenMealType && { "chosen_meal_type": chosenMealType }
        };

        // Update the recipe in the meal plan
        await updateRecipe(mealPlanId, recipeProps, supabase);
        res.status(200).json({ message: "Meal plan updated successfully" });

    } catch (error:any) {
        res.status(500).json({ error: error.message })
    }
}

// Delete recipe from the user's meal plan
export const removeRecipeFromMealPlan = async(req: Request, res: Response) => {
    const { mealPlanId } = req.params;
    const token = req.get("X-Supabase-Auth");

    // Token Validation
    if (!validateToken(token, res)) return;

    const supabase = await getSupabaseClientWithAuth(token!, res);
    if (!supabase) return;

    try {
        // Check if the recipe exists in the meal plan
        const recipe = await getRecipe(mealPlanId, supabase);
        if (!recipe || recipe.length === 0) {
            res.status(404).json({ message: "Recipe not found in the meal plan" });
            return;
        }

        // Delete recipe from the meal plan
        await deleteRecipe(mealPlanId, supabase);
        res.status(204).json({ message: "Recipe deleted from meal plan successfully" });

    } catch (error:any) {
        res.status(500).json({ error: error.message })
    }
}