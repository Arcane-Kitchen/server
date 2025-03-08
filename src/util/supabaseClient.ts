import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

// Initialize a supabase client with JWT token
const getSupabaseClientWithAuth = (token: string) => {
    return createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        }
    );
};

export default getSupabaseClientWithAuth;