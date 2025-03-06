import supabase from "../supabaseClient"

// Fetch meal plan from Supabase database by user Id
export const getMealPlan = async(userId:string, start:string, end:string) => {
    const { data, error } = await supabase
        .from("User_Recipe")
        .select()
        .gte("day_to_eat", start)
        .lte("day_to_eat", end)

    if (error) {
        console.error("Error fetching meal plan: ", error);
    }

    return data;
}