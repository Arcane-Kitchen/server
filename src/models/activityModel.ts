import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const addActivityToDb = async (userId: string, recipeId: string) => {
  const { data, error } = await supabase
    .from('User_Activity')
    .insert([{ user_id: userId, recipe_id: recipeId }]);

  if (error) {
    throw error;
  }

  return data;
};

export const getActivityCount = async (userId: string) => {
  const { data, error } = await supabase
    .from('User_Activity')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return data;
};

export const addAchievementToDb = async (userId: string, achievement: string) => {
  const { data, error } = await supabase
    .from('User_Achievements')
    .insert([{ user_id: userId, achievement }]);

  if (error) {
    throw error;
  }

  return data;
};

export const getUserAchievements = async (userId: string) => {
  const { data, error } = await supabase
    .from('User_Achievements')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return data;
};