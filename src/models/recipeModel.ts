// Fetch recipe from Supabase by id
export const findById = async (recipeId: string, supabase: any) => {
  const { data, error } = await supabase
    .from("Recipe")
    .select()
    .eq("id", recipeId)
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching recipe: ", error);
    return null;
  }

  return data;
};

export const getAll = async (supabase: any) => {
  const { data, error } = await supabase.from("Recipe").select();

  if (error) {
    console.error("Error fetching all recipes: ", error);
    return null;
  }

  return data;
};

// get nutrition info for specific recipe id
export const getNutritionFromId = async (recipeId: number, supabase: any) => {
  const { data, error } = await supabase
    .from("Recipe")
    .select("nutrition")
    .eq("id", recipeId);

  if (error) {
    console.error("Error fetching nutrition: ", error);
    return null;
  }

  return data;
};

// Add a new recipe to the database
export const addRecipe = async (recipeData: any, supabase: any) => {
  const { data, error } = await supabase.from("Recipe").insert(recipeData).select();

  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};
