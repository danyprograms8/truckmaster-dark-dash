
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

// Function to get notes for a specific load
export async function getLoadNotes(loadId: string) {
  const { data, error } = await supabase
    .from('load_notes')
    .select('*')
    .eq('load_id', loadId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Function to add a new note to a load
export async function addLoadNote(loadId: string, noteText: string, noteType: string = 'general') {
  const { data, error } = await supabase
    .from('load_notes')
    .insert([
      { 
        load_id: loadId,
        note_text: noteText,
        note_type: noteType
      }
    ])
    .select();
  
  if (error) throw error;
  return data;
}

// Function to fetch location data (pickup and delivery) for a load
export async function fetchLocationData(loadId: string) {
  const [pickupLocations, deliveryLocations] = await Promise.all([
    fetchPickupLocations(loadId),
    fetchDeliveryLocations(loadId)
  ]);
  
  // Transform pickup locations to common format
  const pickups = pickupLocations.map(pl => ({
    id: pl.id,
    type: 'pickup' as const,
    company_name: pl.company_name || undefined,
    street_address: pl.street_address || undefined,
    city: pl.city,
    state: pl.state,
    zipcode: pl.zipcode,
    date: pl.pickup_date,
    time: pl.pickup_time,
    sequence: pl.sequence,
    load_id: pl.load_id
  }));
  
  // Transform delivery locations to common format
  const deliveries = deliveryLocations.map(dl => ({
    id: dl.id,
    type: 'delivery' as const,
    company_name: dl.company_name || undefined,
    street_address: dl.street_address || undefined,
    city: dl.city,
    state: dl.state,
    zipcode: dl.zipcode,
    date: dl.delivery_date,
    time: dl.delivery_time,
    sequence: dl.sequence,
    load_id: dl.load_id
  }));
  
  // Combine and return all locations
  return [...pickups, ...deliveries];
}

// Helper function to fetch pickup locations
async function fetchPickupLocations(loadId: string) {
  const { data, error } = await supabase
    .from('pickup_locations')
    .select('*')
    .eq('load_id', loadId)
    .order('sequence', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Helper function to fetch delivery locations
async function fetchDeliveryLocations(loadId: string) {
  const { data, error } = await supabase
    .from('delivery_locations')
    .select('*')
    .eq('load_id', loadId)
    .order('sequence', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Function to update load information
export async function updateLoad(load: any) {
  const { data, error } = await supabase
    .from('loads')
    .update({
      broker_name: load.broker_name,
      broker_load_number: load.broker_load_number,
      load_type: load.load_type,
      rate: load.rate,
      temperature: load.temperature,
      updated_at: new Date().toISOString()
    })
    .eq('id', load.id)
    .select();
  
  if (error) throw error;
  return data;
}
