// Fetch meal plan from Supabase by user Id
export const getMealPlan = async(userId:string, start:string, end:string, supabase:any) => {
    const { data, error } = await supabase
        .from("User_Recipe")
        .select()
        .eq("user_id", userId)
        .gte("day_to_eat", start)
        .lte("day_to_eat", end)

    if (error) {
        console.error("Error fetching meal plan: ", error);
    }

    return data;
}

export const addRecipe = async()