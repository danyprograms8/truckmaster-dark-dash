
import React from 'react';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ 
  title, 
  description, 
  icon, 
  color,
  onClick 
}) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "bg-truckmaster-card-bg p-4 rounded-lg border border-white/5 flex items-center gap-4 text-left w-full card-hover",
        "transition-all duration-300"
      )}
    >
      <div 
        className="h-10 w-10 rounded-md flex items-center justify-center"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-xs text-truckmaster-gray-light">{description}</p>
      </div>
    </button>
  );
};

const QuickActions: React.FC = () => {
  return (
    <div className="bg-truckmaster-dark p-5 rounded-lg border-none shadow-none">
      <h2 className="text-white font-medium mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction 
          title="Add New Load" 
          description="Create a new shipment" 
          icon={<Truck className="h-5 w-5" />} 
          color="#9b87f5" 
        />
        <QuickAction 
          title="Assign Driver" 
          description="Assign driver to a load" 
          icon={<UserPlus className="h-5 w-5" />} 
          color="#1EAEDB" 
        />
        <QuickAction 
          title="Update Status" 
          description="Change load status" 
          icon={<ArrowRight className="h-5 w-5" />} 
          color="#ea384c" 
        />
        <QuickAction 
          title="View Reports" 
          description="Check analytics data" 
          icon={<FileText className="h-5 w-5" />} 
          color="#38cea4" 
        />
      </div>
    </div>
  );
};

// Import the Lucide React icons used in this component
import { Truck, ArrowRight, FileText, UserPlus } from 'lucide-react';

export default QuickActions;
