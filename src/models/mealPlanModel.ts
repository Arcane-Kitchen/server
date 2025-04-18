import { recipe } from "../controllers/mealPlanController.js";

// Fetch meal plan by meal plan Id
export const getById = async (
  mealPlanId: string, 
  supabase: any
) => {
  const { data, error } = await supabase
    .from("User_Recipe")
    .select()
    .eq("id", mealPlanId)

  if (error) {
    console.error("Error fetching meal plan: ", error);
  }

  return data;
};

// Fetch weekly meal plan from Supabase by user Id
export const getWeeklyMealPlan = async (
  userId: string,
  start: string,
  end: string,
  supabase: any
) => {
  const { data, error } = await supabase
    .from("User_Recipe")
    .select()
    .eq("user_id", userId)
    .gte("day_to_eat", start)
    .lte("day_to_eat", end);

  if (error) {
    console.error("Error fetching meal plan: ", error);
  }

  return data;
};

// Fetch all meal plan from Supabase by user Id
export const getFullMealPlan = async (userId: string, supabase: any) => {
  const { data, error } = await supabase
    .from("User_Recipe")
    .select("id, day_to_eat, chosen_meal_type, exp, has_been_eaten, Recipe(id, image, nutrition)")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching meal plan: ", error);
  }

  return data;
};

// Fetch a specific recipe from a meal plan
export const getRecipe = async (mealPlanId: string, supabase: any) => {
  const { data, error } = await supabase
    .from("User_Recipe")
    .select()
    .eq("id", mealPlanId);

  if (error) {
    console.error("Error fetching recipe from meal plan: ", error);
  }

  return data;
};

export const addRecipe = async (recipe: recipe, supabase: any) => {
  const { data, error } = await supabase.from("User_Recipe").insert(recipe).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateMealPlan = async (
  mealPlanId: string,
  recipe: Partial<recipe>,
  supabase: any
) => {

  const { error } = await supabase
    .from("User_Recipe")
    .update(recipe)
    .eq("id", mealPlanId);

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteRecipe = async (mealPlanId: string, supabase: any) => {
  const { error } = await supabase
    .from("User_Recipe")
    .delete()
    .eq("id", mealPlanId);

  if (error) {
    throw new Error(error.message);
  }
};
