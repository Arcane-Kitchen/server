import { Request, Response } from "express";
import { getMealPlan } from "../models/mealPlanModel"

// Format date to YYYY-MM-DD
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getUserWeeklyMealPlan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const currentDate = new Date();
        const currentDay = currentDate.getDay();

        const startOfWeek = new Date();
        startOfWeek.setDate(currentDate.getDate() - currentDay);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const formattedStartOfWeek = formatDate(startOfWeek);
        const formattedEndOfWeek = formatDate(endOfWeek);

        const results = await getMealPlan(id, formattedStartOfWeek, formattedEndOfWeek);
        res.status(200).json(results);
    } catch (error:any) {
        res.status(500).json({ error: error.message })
    }
}