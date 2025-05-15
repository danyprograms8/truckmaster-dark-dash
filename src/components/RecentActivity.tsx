
import React from 'react';

interface ActivityItem {
  id: string;
  description: string;
  timeAgo: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    description: "Load #L1234 changed to In Transit",
    timeAgo: "2 hours ago"
  },
  {
    id: "2",
    description: "John Doe assigned to Load #L5678",
    timeAgo: "4 hours ago"
  },
  {
    id: "3",
    description: "Load #L9012 delivered successfully",
    timeAgo: "8 hours ago"
  },
  {
    id: "4",
    description: "New load #L3456 booked with ABC Logistics",
    timeAgo: "Yesterday"
  },
  {
    id: "5",
    description: "Mike Johnson marked as available",
    timeAgo: "Yesterday"
  },
];

const RecentActivity: React.FC = () => {
  return (
    <div className="bg-truckmaster-card-bg p-5 rounded-lg border border-white/5 h-full">
      <h2 className="text-white font-medium mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start pb-4 border-b border-white/5 last:border-0 last:pb-0"
          >
            <div className="h-2 w-2 mt-2 rounded-full bg-truckmaster-purple mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-white">{activity.description}</p>
              <span className="text-xs text-truckmaster-gray-light">{activity.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
