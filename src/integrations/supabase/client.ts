
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fnyahpdgmveutdskqvgk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZueWFocGRnbXZldXRkc2txdmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNDEzMzUsImV4cCI6MjA2MjkxNzMzNX0.N6j7_JR3sSOH5HP70bJvc4C_iYv_9_ZwzxLJ5PR2ki0";

// Create a single Supabase client instance to be used throughout the app
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'chess-sac-auth-token',
      detectSessionInUrl: false,
      flowType: 'implicit'
    }
  }
);

// Add console logging for successful session refresh
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in successfully', session?.user.id);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Session token refreshed');
  } else if (event === 'USER_UPDATED') {
    console.log('User updated');
  }
});
