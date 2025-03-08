// Fetch recipe from Supabase by id
export const findById = async (recipeId:string, supabase:any) => {
    const { data, error } = await supabase
        .from("Recipe")
        .select()
        .eq("id", recipeId);

    if (error) {
        console.error("Error fetching recipe: ", error);
        return null;
    }

    return data;
}