import React, { useState } from 'react';
import { useData } from './DataProvider';
import { Truck, Users, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadsChart from '@/components/LoadsChart';
import RecentActivity from '@/components/RecentActivity';
import QuickActions from '@/components/QuickActions';
import MetricCard from '@/components/MetricCard';
import TruckList from '@/components/TruckList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isInTransitStatus } from '@/lib/loadStatusUtils';

const Dashboard: React.FC = () => {
  const { loads, drivers, isLoading, dashboardMetrics } = useData();
  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
  
  // Calculate metrics
  const inTransitLoads = loads.filter(load => isInTransitStatus(load.status)).length;
  const availableTrucks = drivers.filter(driver => driver.status?.toLowerCase() === 'active').length;
  
  // Get metrics from the dashboardMetrics object
  const { todayPickups, todayDeliveries, loadTrend } = dashboardMetrics;

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
        {/* Available Trucks Card - now opens a modal */}
        <div onClick={() => setIsTruckModalOpen(true)}>
          <MetricCard 
            title="Available Trucks" 
            value={availableTrucks} 
            icon={<Truck className="h-6 w-6" />} 
            color="bg-green-500" 
            className="cursor-pointer hover:ring-2 hover:ring-green-400 transition-all"
          />
        </div>
        
        <MetricCard 
          title="In Transit Loads" 
          value={inTransitLoads} 
          icon={<Users className="h-6 w-6" />} 
          color="bg-blue-500" 
          title-tooltip="Loads currently being transported"
        />
        <MetricCard 
          title="Today's Pickups" 
          value={todayPickups} 
          icon={<Calendar className="h-6 w-6" />} 
          color="bg-amber-500" 
        />
        <MetricCard 
          title="Today's Deliveries" 
          value={todayDeliveries} 
          icon={<CheckCircle className="h-6 w-6" />} 
          color="bg-purple-500" 
        />
      </div>

      {/* Truck Availability Modal */}
      <Dialog open={isTruckModalOpen} onOpenChange={setIsTruckModalOpen}>
        <DialogContent className="sm:max-w-md bg-truckmaster-darker text-white border-truckmaster-gray-dark">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-400" />
              Truck Availability
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <TruckList />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Chart and Activity Section - with fixed styling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 border-none">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-none overflow-hidden box-border">
            <CardHeader className="border-none">
              <CardTitle>Loads Booked (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 border-none">
              <LoadsChart data={loadTrend} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full border-none shadow-none overflow-hidden box-border">
            <CardHeader className="border-none">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 border-none">
              <RecentActivity />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Quick Actions */}
      <Card className="border-none shadow-none overflow-hidden box-border">
        <CardHeader className="border-none">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="border-none">
          <QuickActions />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
