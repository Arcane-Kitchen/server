import { Request, Response } from "express";
import { addActivityToDb, getActivityCount, addAchievementToDb } from "../models/activityModel.js";

export const addActivity = async (req: Request, res: Response): Promise<void> => {
  const { userId, recipeId } = req.body;

  if (!userId || !recipeId) {
    res.status(400).json({ error: 'User ID and Recipe ID are required' });
    return;
  }

  try {
    // Save activity to user_activity table
    await addActivityToDb(userId, recipeId);

    // Check if it's the first time the user adds a recipe to their calendar
    const activityCount = await getActivityCount(userId);

    if (activityCount.length === 1) {
      // Save achievement to user_achievement table
      await addAchievementToDb(userId, 'First Recipe Added');
      res.status(200).json({ message: 'Achievement unlocked: First Recipe Added' });
      return;
    }

    res.status(200).json({ message: 'Activity added successfully' });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
};