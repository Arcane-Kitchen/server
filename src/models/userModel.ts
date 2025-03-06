import supabase from "../supabaseClient"

interface user {
    supabase_id: string;
    username: string;
}

// Insert new user to Supabase
export const create = async (user:user) => {
    const { data, error } = await supabase
        .from("User")
        .insert(user)
        .select()

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

