
import React from 'react';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import LoadsChart from '@/components/LoadsChart';
import RecentActivity from '@/components/RecentActivity';
import QuickActions from '@/components/QuickActions';
import { Truck, Users, Calendar, Check } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 animate-fade-in">
      <Header title="TruckMaster" subtitle="Load Management" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Active Loads" 
          value={12} 
          icon={<Truck className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard 
          title="Available Drivers" 
          value={8} 
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 2, isPositive: false }}
        />
        <MetricCard 
          title="Today's Pickups" 
          value={5} 
          icon={<Calendar className="h-5 w-5" />}
        />
        <MetricCard 
          title="Today's Deliveries" 
          value={7} 
          icon={<Check className="h-5 w-5" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <LoadsChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
      
      <div className="mb-6">
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
