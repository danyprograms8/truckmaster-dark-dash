
import React from 'react';
import { useData } from './DataProvider';
import { Truck, Users, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadsChart from '@/components/LoadsChart';
import RecentActivity from '@/components/RecentActivity';
import QuickActions from '@/components/QuickActions';
import MetricCard from '@/components/MetricCard';

const Dashboard: React.FC = () => {
  const { loads, drivers, isLoading } = useData();
  
  // Calculate metrics
  const activeLoads = loads.filter(load => load.status === 'active' || load.status === 'in_transit').length;
  const availableDrivers = drivers.filter(driver => driver.status === 'active').length;
  
  // Mock data for pickups and deliveries today
  // In a real app, you'd calculate this from your delivery_locations and pickup_locations tables
  const todayPickups = 5;
  const todayDeliveries = 7;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Active Loads" 
          value={activeLoads} 
          icon={<Truck className="h-6 w-6" />} 
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard 
          title="Available Drivers" 
          value={availableDrivers} 
          icon={<Users className="h-6 w-6" />} 
          trend={{ value: 2, isPositive: false }}
        />
        <MetricCard 
          title="Today's Pickups" 
          value={todayPickups} 
          icon={<Calendar className="h-6 w-6" />} 
        />
        <MetricCard 
          title="Today's Deliveries" 
          value={todayDeliveries} 
          icon={<CheckCircle className="h-6 w-6" />} 
        />
      </div>
      
      {/* Chart and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Loads Booked (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <LoadsChart />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <RecentActivity />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickActions />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
