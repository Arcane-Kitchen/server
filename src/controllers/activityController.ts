import { Request, Response } from "express";
import { addActivityToDb, getUserAchievements } from "../models/activityModel.js";

export const addActivity = async (req: Request, res: Response): Promise<void> => {
  const { userId, recipeId, activity_type } = req.body;

  if (typeof userId !== 'number' || typeof recipeId !== 'number' || typeof activity_type !== 'string') {
    res.status(400).json({ error: 'User ID and Recipe ID must be numbers, and Activity Type must be a string' });
    return;
  }

  try {
    // Save activity to user_activity table
    await addActivityToDb(userId, recipeId, activity_type);

    res.status(200).json({ message: 'Activity added successfully' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding activity:', error.message);
    } else {
      console.error('Error adding activity:', error);
    }
    res.status(500).json({ error: 'Failed to add activity' });
  }
};

export const fetchUserAchievements = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    res.status(400).json({ error: 'User ID must be a number' });
    return;
  }

  try {
    const achievements = await getUserAchievements(userId);
    res.status(200).json(achievements);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching achievements:', error.message);
    } else {
      console.error('Error fetching achievements:', error);
    }
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
};