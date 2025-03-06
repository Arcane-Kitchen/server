import { Request, Response } from "express";
import { create } from "../models/userModel";

// create a new user
export const createNewUser = async (req: Request, res: Response): Promise<void> => {
    const { supabaseId, username } = req.body;

    if (!supabaseId || !username) {
        res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
        await create({ "supabase_id": supabaseId, username });
        res.status(201).json({ message: 'New user added successfully'});
    } catch (error:any) {
        res.status(500).json({ error: error.message })
    }
}