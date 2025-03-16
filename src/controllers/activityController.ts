import { Request, Response } from "express";
import { addActivityToDb, getActivityCount, getUserAchievements } from "../models/activityModel.js";

export const addActivity = async (req: Request, res: Response): Promise<void> => {
  const { userId, recipeId } = req.body;

  if (typeof userId !== 'number' || typeof recipeId !== 'number') {
    res.status(400).json({ error: 'User ID and Recipe ID must be numbers' });
    return;
  }

  try {
    // Save activity to user_activity table
    await addActivityToDb(userId, recipeId);

    // Check if it's the first time the user adds a recipe to their calendar
    const activityCount = await getActivityCount(userId);

    if (activityCount.length === 1) {
      res.status(200).json({ message: 'First activity added' });
      return;
    }

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