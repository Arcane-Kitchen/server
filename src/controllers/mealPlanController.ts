import { Request, Response } from "express";
import {
  getWeeklyMealPlan,
  getRecipe,
  addRecipe,
  updateMealPlan,
  deleteRecipe,
  getFullMealPlan,
  getById,
} from "../models/mealPlanModel.js";
import { findById } from "../models/recipeModel.js";
import getSupabaseClientWithAuth from "../utils/supabase.js";
import { setXPForRecipeDifficulty } from "../utils/xpHelper.js";
import { validateToken, validateProps } from "../utils/validation.js";

// Define the recipe interface
export interface recipe {
  user_id: string;
  recipe_id: string;
  day_to_eat: string;
  servings?: number;
  exp: number;
  chosen_meal_type: string;
  has_been_eaten?: boolean;
}

// Fetch the user's meal plan for the week
export const getUserMealPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { "start-date": startDate, "end-date": endDate } = req.query;
  const token = req.get("X-Supabase-Auth");

  // Token validation
  if (!validateToken(token, res)) return;

  const supabase = await getSupabaseClientWithAuth(token!, res);
  if (!supabase) return;

  try {
    // If both start-date and end-date are provided, fetch the weekly meal plan
    if (startDate && endDate) {
      if (typeof startDate !== "string" || typeof endDate !== "string") {
        res.status(400).json({ message: "Invalid date." });
        return;
      }
       // Fetch the user's weekly meal plan
      const results = await getWeeklyMealPlan(
        id,
        startDate,
        endDate,
        supabase
      );
      res.status(200).json(results);
      return;
    }

    // If no start-date or end-date, fetch the full meal plan
    const results = await getFullMealPlan(id, supabase);
    res.status(200).json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Add a recipe to the user's weekly meal plan
export const addRecipeToMealPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { recipeId, dayToEat, servings, hasBeenEaten, chosenMealType } =
    req.body;
  const token = req.get("X-Supabase-Auth");

  // Token Validation
  if (!validateToken(token, res)) return;

  const supabase = await getSupabaseClientWithAuth(token!, res);
  if (!supabase) return;

  // Validate required props
  const requiredProps = ["recipeId", "dayToEat", "chosenMealType"];
  if (!validateProps(req.body, requiredProps, res)) return;

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const mealDate = new Date(dayToEat);
  mealDate.setHours(0, 0, 0, 0);

  // Reject adding recipe if the meal date has already passed
  if (mealDate < currentDate) {
    res.status(400).json({ message: "Cannot add recipe for past dates." });
    return;
  }

  try {
    // Check and fetch the recipe from the meal plan
    const recipe = await findById(recipeId, supabase);
    if (!recipe) {
      res.status(404).json({ message: "Recipe not found" });
      return;
    }

    const difficulty = recipe.difficulty.toLowerCase();
    const exp = setXPForRecipeDifficulty(difficulty);

    const recipeProps: recipe = {
      user_id: id,
      recipe_id: recipeId,
      day_to_eat: mealDate.toISOString(),
      exp,
      chosen_meal_type: chosenMealType,
      ...(servings && { servings }),
      ...(hasBeenEaten && { has_been_eaten: hasBeenEaten }),
    };

    await addRecipe(recipeProps, supabase);
    res
      .status(201)
      .json({ message: "New recipe added to meal plan successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a recipe in the user's meal plan by meal plan Id
export const updateRecipeInMealPlanById = async (req: Request, res: Response) => {
  const { mealPlanId } = req.params;
  const { recipeId, dayToEat, servings, hasBeenEaten, chosenMealType } = req.body;
  const token = req.get("X-Supabase-Auth");

  // Token Validation
  if (!validateToken(token, res)) return;

  const supabase = await getSupabaseClientWithAuth(token!, res);
  if (!supabase) return;

  try {
    // Check if the the meal plan exists
    const mealPlan = await getById(mealPlanId, supabase);
    if (!mealPlan || mealPlan.length === 0) {
      res.status(404).json({ message: "Meal plan not found" });
      return;
    }

    const recipeProps: Partial<recipe> = {
      ...(servings && { servings }),
      ...(dayToEat && { day_to_eat: dayToEat }),
      ...(hasBeenEaten !== undefined && { has_been_eaten: hasBeenEaten }),
      ...(chosenMealType && { chosen_meal_type: chosenMealType }),
    };
    
    // Fetch the recipe from the meal plan and update the exp
    if (recipeId) {
      const recipe = await findById(recipeId, supabase);
      if (!recipe) {
        res.status(404).json({ message: "Recipe not found" });
        return;
      }

      const difficulty = recipe.difficulty.toLowerCase();
      const exp = setXPForRecipeDifficulty(difficulty);

      recipeProps.recipe_id = recipeId;
      recipeProps.exp = exp
    }

    // Update the recipe in the meal plan
    await updateMealPlan(mealPlanId, recipeProps, supabase);
    res.status(200).json({ message: "Meal plan updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete recipe from the user's meal plan
export const removeRecipeFromMealPlan = async (req: Request, res: Response) => {
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
    res
      .status(204)
      .json({ message: "Recipe deleted from meal plan successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
