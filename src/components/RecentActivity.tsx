import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useData } from './DataProvider';
import { formatActivity, formatTimeAgo } from '@/lib/loadStatusUtils';

interface Activity {
  activity_id: number;
  activity_type: string;
  load_id: string;
  previous_status?: string;
  new_status?: string;
  changed_by?: string;
  note_text?: string;
  created_at: string;
  broker_load_number?: string;
}

const RecentActivity: React.FC = () => {
  const { recentActivity, isLoading } = useData();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Convert the recentActivity from DataProvider to our Activity type
    if (recentActivity) {
      const formattedActivities = recentActivity.map(item => ({
        activity_id: item.note_id || item.activity_id || 0,
        activity_type: item.note_type === 'general' ? 'note' : (item.activity_type || 'status_change'),
        load_id: item.load_id || '',
        previous_status: item.previous_status,
        new_status: item.new_status,
        changed_by: item.changed_by,
        note_text: item.note_text,
        created_at: item.created_at || new Date().toISOString(),
        broker_load_number: item.broker_load_number
      }));
      
      setActivities(formattedActivities);
    }
  }, [recentActivity]);

  // Set up realtime subscription for combined activities
  useEffect(() => {
    // Listen for changes to load_activities
    const activitiesChannel = supabase
      .channel('load-activities-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'load_activities'
        },
        (payload) => {
          console.log('New activity:', payload);
          // Refresh data when a new activity is inserted
          // The DataProvider will handle the actual fetching
        }
      )
      .subscribe();

    // Listen for changes to load_notes
    const notesChannel = supabase
      .channel('load-notes-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'load_notes'
        },
        (payload) => {
          console.log('New note:', payload);
          // Refresh data when a new note is inserted
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(activitiesChannel);
      supabase.removeChannel(notesChannel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="space-y-4">
        {recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
            <div 
              key={`${activity.note_id || activity.activity_id || ''}-${activity.created_at}`} 
              className="flex items-start pb-4 last:pb-0"
            >
              <div className="h-2 w-2 mt-2 rounded-full bg-truckmaster-purple mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-white">
                  {activity.note_text ? 
                    `Note on Load #${activity.load_id || activity.broker_load_number}: ${activity.note_text}` : 
                    `Status change on Load #${activity.load_id || activity.broker_load_number}: ${activity.previous_status} → ${activity.new_status}`
                  }
                </p>
                <span className="text-xs text-truckmaster-gray-light">
                  {activity.created_at ? formatTimeAgo(activity.created_at) : ''}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-truckmaster-gray-light">
            No recent activity to display
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
