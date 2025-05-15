
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://rvpgmdkpmcaerktnntgx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cGdtZGtwbWNhZXJrdG5udGd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzgzNjAsImV4cCI6MjA2Mjc1NDM2MH0.u7eCrAy5WI0QFN1vQw0eOi7zP6qoOAA_jBiJAmi9Sw8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Typed helper functions for database access
export async function getLoads() {
  const { data, error } = await supabase
    .from('loads')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function getDrivers() {
  const { data, error } = await supabase
    .from('drivers')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function getRecentActivity() {
  // Use the combined_activity_view that includes both load notes and status changes
  const { data, error } = await supabase
    .from('combined_activity_view')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) throw error;
  return data;
}

export async function getLoadActivities() {
  const { data, error } = await supabase
    .from('load_activities')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
