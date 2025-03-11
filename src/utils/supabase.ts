import { createClient } from "@supabase/supabase-js";
import { Response } from "express";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY as string;

// Initialize a supabase client with JWT token
const getSupabaseClientWithAuth = async (token: string, res: Response) => {
  // Create the Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // Validate the user by retrieving the user info
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return null;
  }

  return supabase;
};

export const getSupabaseAdminClient = async () => {
  // Create the Supabase admin client
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  return supabase;
};

export default getSupabaseClientWithAuth;
