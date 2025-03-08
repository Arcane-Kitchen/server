// Fetch recipe from Supabase by id
export const findById = async (recipeId:string, supabase:any) => {
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
}

export const getAll = async (supabase:any) => {
    const { data, error } = await supabase
        .from("Recipe")
        .select();
    
    if (error) {
        console.error("Error fetching all recipes: ", error);
        return null;
    }

    return data;
}