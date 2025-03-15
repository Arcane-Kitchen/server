import { Request, Response } from "express";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const newSupabase = await getSupabaseAdminClient();
// const userData = await getAllUserData(newSupabase);

export const addActivity = async (
    req: Request,
    res: Response
): Promise<void> => {
  const { userId, recipeId } = req.body;

  if (!userId || !recipeId) {
    res.status(400).json({ error: 'User ID and Recipe ID are required' });
    return
}

  try {
    // Save activity to user_activity table
    const { data: activityData, error: activityError } = await supabase
      .from('user_activity')
      .insert([{ user_id: userId, recipe_id: recipeId }]);

    if (activityError) {
      throw activityError;
    }

    // Check if it's the first time the user adds a recipe to their calendar
    const { data: activityCount, error: countError } = await supabase
      .from('user_activity')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (countError) {
      throw countError;
    }

    if (activityCount.length === 1) {
      // Save achievement to user_achievement table
      const { data: achievementData, error: achievementError } = await supabase
        .from('user_achievement')
        .insert([{ user_id: userId, achievement: 'First Recipe Added' }]);

      if (achievementError) {
        throw achievementError;
      }

      res.status(200).json({ message: 'Achievement unlocked: First Recipe Added' });
      return
    }

    res.status(200).json({ message: 'Activity added successfully' });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
};

