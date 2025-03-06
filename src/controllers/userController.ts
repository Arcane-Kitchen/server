import { Request, Response } from "express";
import { create, findById } from "../models/userModel";

// create a new user
export const createNewUser = async (req: Request, res: Response): Promise<void> => {
    const { supabaseId, username } = req.body;

    if (!supabaseId || !username) {
        res.status(400).json({ error: 'Required fields are missing' });
        return;
    }

    try {
        await create({ "supabase_id": supabaseId, username });
        res.status(201).json({ message: 'New user added successfully'});
    } catch (error:any) {
        res.status(500).json({ error: error.message })
    }
}

// Find a user by Supabase Id
export const findUserBySupabaseId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await findById(id);
    
        if (!result || result.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }
    
        const user = result[0];
        res.status(200).json(user);
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
}