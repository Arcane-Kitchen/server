interface user {
  supabase_id: string;
  username: string;
}

// Insert new user to Supabase
export const create = async (user: user, supabase: any) => {
  const { error } = await supabase.from("User").insert(user);

  if (error) {
    throw new Error(error.message);
  }
};

// Fetch user from Supabase by Supabase Id
export const findById = async (supabaseId: string, supabase: any) => {
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("supabase_id", supabaseId);

  if (error) {
    console.error("Error fetching user: ", error);
    return null;
  }

  return data;
};

// fetch all user data (REQUIRES ADMIN CLIENT)
export const getAllUserData = async (supabase: any) => {
  const { data, error } = await supabase.from("User").select("*");

  if (error) {
    console.error("Error fetching users: ", error);
    return null;
  }

  return data;
};

// update user pet points (REQUIRES ADMIN CLIENT)
export const updateUserPetPoints = async (
  userId: number,
  caloriePoints: number,
  fatPoints: number,
  carbPoints: number,
  proteinPoints: number,
  supabase: any
) => {
  const { error } = await supabase
    .from("User")
    .update({
      pet_daily_calorie_happiness: caloriePoints,
      pet_daily_fat_happiness: fatPoints,
      pet_daily_carb_happiness: carbPoints,
      pet_daily_protein_happiness: proteinPoints,
    })
    .eq("id", userId);

  if (error) {
    console.error("Error fetching users: ", error);
    return null;
  } else {
    return "success";
  }
};

// update user login date
export const updateLastLogin = async (
  userId: number,
  date: string,
  supabase: any
) => {
  const { error } = await supabase
    .from("User")
    .update({
      updated_at: date,
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating last login: ", error);
    return null;
  } else {
    return "success";
  }
};
