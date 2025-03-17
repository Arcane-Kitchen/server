interface user {
  supabase_id: string;
  username: string;
}

export interface UserGoals {
  daily_calorie_goal: number,
  daily_carb_goal: number,
  daily_fat_goal: number,
  daily_protein_goal: number,
}

export interface Pet {
  pet_name: string,
  pet_img_happy: string,
  pet_img_normal: string,
  pet_img_sad: string,
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

// update user stat
export const updateUserStat = async (
  userId: number,
  statAmount: number,
  chosenStat: string,
  supabase: any
) => {
  if (chosenStat === "calorie") {
    const { error } = await supabase
      .from("User")
      .update({ pet_calorie_exp: statAmount })
      .eq("id", userId);
    if (error) {
      console.error("Error updating stat: ", error);
      return null;
    } else {
      return "success";
    }
  } else if (chosenStat === "carb") {
    const { error } = await supabase
      .from("User")
      .update({ pet_carb_exp: statAmount })
      .eq("id", userId);
    if (error) {
      console.error("Error updating stat: ", error);
      return null;
    } else {
      return "success";
    }
  } else if (chosenStat === "protein") {
    const { error } = await supabase
      .from("User")
      .update({ pet_protein_exp: statAmount })
      .eq("id", userId);
    if (error) {
      console.error("Error updating stat: ", error);
      return null;
    } else {
      return "success";
    }
  } else if (chosenStat === "fat") {
    const { error } = await supabase
      .from("User")
      .update({ pet_fat_exp: statAmount })
      .eq("id", userId);
    if (error) {
      console.error("Error updating stat: ", error);
      return null;
    } else {
      return "success";
    }
  } else if (chosenStat === "wisdom") {
    const { error } = await supabase
      .from("User")
      .update({ pet_wisdom_exp: statAmount })
      .eq("id", userId);
    if (error) {
      console.error("Error updating stat: ", error);
      return null;
    } else {
      return "success";
    }
  }
};

// update daily calorie and macros goal
export const updateCalorieAndMacrosGoal = async (
  userId: number,
  supabase: any,
  userGoals: UserGoals,
) => {
  const { error } = await supabase
    .from("User")
    .update(userGoals)
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
};

// update pet information
export const updatePet = async (
  userId: number,
  supabase: any,
  pet: Pet,
) => {
  const { error } = await supabase
    .from("User")
    .update(pet)
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
};
