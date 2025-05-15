import { supabase } from './supabaseClient';
import { toast } from '@/hooks/use-toast';

export type LoadStatus = 'booked' | 'in_transit' | 'delivered' | 'completed' | 'cancelled' | 'active';

export const statusOptions: { value: LoadStatus, label: string }[] = [
  { value: 'booked', label: 'Booked' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'active', label: 'Active' }
];

export const getStatusColor = (status: string): string => {
  // Normalize status to lowercase for comparison
  const normalizedStatus = status?.toLowerCase();
  
  switch (normalizedStatus) {
    case 'active':
      return 'bg-green-900 text-green-300';
    case 'in_transit':
      return 'bg-blue-500 text-white';
    case 'booked':
      return 'bg-blue-900 text-blue-300';
    case 'delivered':
      return 'bg-teal-900 text-teal-300';
    case 'completed':
      return 'bg-gray-700 text-gray-300';
    case 'cancelled':
      return 'bg-red-900 text-red-300';
    default:
      return 'bg-gray-800 text-gray-400';
  }
};

// This helper function returns true if a status is considered "active"
// IMPORTANT: We've changed this to ONLY include loads with exactly 'active' status
// and NOT include 'in_transit' loads as active
export const isActiveStatus = (status: string): boolean => {
  const normalizedStatus = status?.toLowerCase();
  return normalizedStatus === 'active';
};

// This helper function returns true if a status is "in_transit"
export const isInTransitStatus = (status: string): boolean => {
  const normalizedStatus = status?.toLowerCase();
  return normalizedStatus === 'in_transit';
};

// Normalize any status string to our standard format
export const normalizeStatus = (status: string): string => {
  if (!status) return '';
  
  const lowercaseStatus = status.toLowerCase();
  
  // Handle special cases
  if (lowercaseStatus === 'in_transit' || lowercaseStatus === 'in transit') {
    return 'in_transit';
  }
  
  // Remove any spaces and return the lowercase version
  return lowercaseStatus.replace(/\s+/g, '');
};

// Format status for display (proper capitalization and spacing)
export const formatStatusLabel = (status: string): string => {
  if (!status) return '';
  
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus === 'in_transit') {
    return 'In Transit';
  }
  
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1).toLowerCase();
};

export const updateLoadStatus = async (loadId: string, newStatus: LoadStatus): Promise<boolean> => {
  try {
    // Update the load status in the database
    const { error } = await supabase
      .from('loads')
      .update({ status: newStatus })
      .eq('load_id', loadId);
    
    // Handle errors if any
    if (error) {
      console.error('Error updating load status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating load status:', error);
    return false;
  }
};

// Format activity for display
export const formatActivity = (activity: any): string => {
  if (activity.activity_type === 'status_change') {
    return `Load #${activity.load_id} changed from ${formatStatusLabel(activity.previous_status)} to ${formatStatusLabel(activity.new_status)}`;
  } else if (activity.note_text) {
    return activity.note_text;
  }
  return "";
};

// Format time ago for display
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 172800) {
    return 'Yesterday';
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} days ago`;
  }
};
