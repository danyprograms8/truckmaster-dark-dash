
import { createClient } from '@supabase/supabase-js';

// Supabase connection
const supabaseUrl = 'https://rvpgmdkpmcaerktnntgx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cGdtZGtwbWNhZXJrdG5udGd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzgzNjAsImV4cCI6MjA2Mjc1NDM2MH0.u7eCrAy5WI0QFN1vQw0eOi7zP6qoOAA_jBiJAmi9Sw8';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  }
});

// Data fetching functions
export const getLoads = async () => {
  const { data, error } = await supabase
    .from('loads')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching loads:', error);
    return [];
  }
  
  return data || [];
};

export const getDrivers = async () => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
  
  return data || [];
};

export const getRecentActivity = async () => {
  // This is a mock function, in a real app you might have a dedicated table for activity
  // or combine data from multiple tables
  
  // For now, we'll use load_notes as our activity source
  const { data, error } = await supabase
    .from('load_notes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error('Error fetching activity:', error);
    return [];
  }
  
  return data || [];
};
