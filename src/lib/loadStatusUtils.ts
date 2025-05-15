
import { supabase } from './supabaseClient';
import { toast } from '@/components/ui/use-toast';

export type LoadStatus = 'booked' | 'assigned' | 'in_transit' | 'delivered' | 'completed' | 'cancelled' | 'active';

export const statusOptions: { value: LoadStatus, label: string }[] = [
  { value: 'booked', label: 'Booked' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'active', label: 'Active' }
];

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-900 text-green-300';
    case 'booked':
      return 'bg-blue-900 text-blue-300';
    case 'assigned':
      return 'bg-purple-900 text-purple-300';
    case 'in_transit':
      return 'bg-amber-900 text-amber-300';
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

export const updateLoadStatus = async (loadId: string, newStatus: LoadStatus): Promise<boolean> => {
  try {
    // Show toast indicating status update in progress
    const loadingToast = toast({
      title: "Updating Status",
      description: `Changing load #${loadId} status to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}...`,
    });
    
    // Update the load status in the database
    const { error } = await supabase
      .from('loads')
      .update({ status: newStatus })
      .eq('load_id', loadId);
    
    // Handle errors if any
    if (error) {
      console.error('Error updating load status:', error);
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }

    // Show success toast
    toast({
      title: "Status Updated",
      description: `Load #${loadId} status changed to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
    });
    
    return true;
  } catch (error) {
    console.error('Exception updating load status:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Format activity for display
export const formatActivity = (activity: any): string => {
  if (activity.activity_type === 'status_change') {
    return `Load #${activity.load_id} changed from ${activity.previous_status} to ${activity.new_status}`;
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
