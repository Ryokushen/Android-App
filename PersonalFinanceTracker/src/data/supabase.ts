import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hardcode the values for now to fix the environment variable issue
const supabaseUrl = 'https://tupfmqgnirxjyhpkieka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cGZtcWduaXJ4anlocGtpZWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NTcyMTAsImV4cCI6MjA3MDQzMzIxMH0.Coulib2MVXxusqFag6ImveqpTYxU_ZaRxrZSNbKn0tE';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});