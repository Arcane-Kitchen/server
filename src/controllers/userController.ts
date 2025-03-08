import { Request, Response } from 'express';
import { create, findById } from "../models/userModel.ts";
import getSupabaseClientWithAuth from "../utils/supabase.ts";

// create a new user
export const createNewUser = async (req: Request, res: Response): Promise<void> => {
    const { supabaseId, username } = req.body;
    const token = req.get("X-Supabase-Auth");

    if (!supabaseId || !username) {
        res.status(400).json({ error: "Required fields are missing" });
        return;
    }

    if (!token) {
        res.status(403).json({ error: "No token provided" });
        return;
    }

    try {
        const supabase = getSupabaseClientWithAuth(token);
        const { data : { user } } = await supabase.auth.getUser();

        if (!user) {
            res.status(401).json({ error: "Invalid or expired token" });
            return;
        }

        await create({ "supabase_id": supabaseId, username }, supabase);
        res.status(201).json({ message: "New user added successfully" });
    } catch (error:any) {
        res.status(500).json({ error: error.message })
    }
}

// Find a user by Supabase Id
export const findUserBySupabaseId = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const token = req.get("X-Supabase-Auth");

    if (!token) {
        res.status(403).json({ error: "No token provided" });
        return;
    }

    try {

        const supabase = getSupabaseClientWithAuth(token);
        const { data : { user } } = await supabase.auth.getUser();

        if (!user) {
            res.status(401).json({ error: "Invalid or expired token" });
            return;
        }
        
        const result = await findById(id, supabase);
    
        if (!result || result.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }
    
        const userProfile = result[0];
        res.status(200).json(userProfile);
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
}