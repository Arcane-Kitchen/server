import supabase from "../supabaseClient"

interface user {
    supabase_id: string;
    username: string;
}

// Insert new user to Supabase
export const create = async (user:user) => {
    const { error } = await supabase
        .from("User")
        .insert(user)

    if (error) {
        throw new Error(error.message);
    }
}

// Fetch user from Supabase by Supabase Id
export const findById = async (supabaseId:string) => {
    const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("supabase_id", supabaseId);

    if (error) {
        console.error("Error fetching user: ", error);
        return null;
    }

    return data;
}