import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const addActivityToDb = async (userId: number, recipeId: number, activityType: string) => {
  const { data, error } = await supabase
    .from('User_Activity')
    .insert([{ user_id: userId, recipe_id: recipeId, activity_type: activityType }]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUserAchievements = async (userId: number) => {
  const { data, error } = await supabase
    .from('User_Achievements')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};