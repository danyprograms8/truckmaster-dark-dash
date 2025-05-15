
import React, { useEffect, useState } from 'react';
import { useData } from './DataProvider';
import { Truck } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface TruckDeliveryInfo {
  driverId: number;
  driverName: string;
  location: string;
  deliveryDate: string;
  deliveryTime: string;
}

const TruckList: React.FC = () => {
  const { drivers } = useData();
  const [deliveryInfo, setDeliveryInfo] = useState<TruckDeliveryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTruckDeliveryInfo = async () => {
      setIsLoading(true);
      try {
        // Get active drivers
        const activeDrivers = drivers.filter(driver => driver.status?.toLowerCase() === 'active');
        
        // For each driver, get their most recent/upcoming delivery
        const driversWithDeliveryInfo: TruckDeliveryInfo[] = [];
        
        for (const driver of activeDrivers) {
          // Get loads assigned to this driver
          const { data: driverLoads } = await supabase
            .from('loads')
            .select('load_id')
            .eq('driver_id', driver.id)
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (driverLoads && driverLoads.length > 0) {
            // Get the most recent delivery location for this load
            const { data: deliveryLocations } = await supabase
              .from('delivery_locations')
              .select('city, state, delivery_date, delivery_time')
              .eq('load_id', driverLoads[0].load_id)
              .order('delivery_date', { ascending: true })
              .limit(1);
            
            if (deliveryLocations && deliveryLocations.length > 0) {
              const delivery = deliveryLocations[0];
              
              // Format the date as MM/DD
              let formattedDate = '';
              if (delivery.delivery_date) {
                const date = new Date(delivery.delivery_date);
                formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
              }
              
              // Format the time (simplify display)
              let formattedTime = '';
              if (delivery.delivery_time) {
                const timeParts = delivery.delivery_time.split(':');
                const hour = parseInt(timeParts[0]);
                formattedTime = `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'pm' : 'am'}`;
              }
              
              driversWithDeliveryInfo.push({
                driverId: driver.id,
                driverName: driver.name,
                location: delivery.city && delivery.state ? `${delivery.city}, ${delivery.state}` : 'Unknown',
                deliveryDate: formattedDate || 'N/A',
                deliveryTime: formattedTime || 'N/A'
              });
            }
          } else {
            // No loads for this driver, use their current location
            driversWithDeliveryInfo.push({
              driverId: driver.id,
              driverName: driver.name,
              location: driver.current_location_city && driver.current_location_state 
                ? `${driver.current_location_city}, ${driver.current_location_state}` 
                : 'Unknown',
              deliveryDate: driver.available_date 
                ? new Date(driver.available_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) 
                : 'Now',
              deliveryTime: driver.available_time || 'Now'
            });
          }
        }
        
        setDeliveryInfo(driversWithDeliveryInfo);
      } catch (error) {
        console.error('Error fetching truck delivery info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTruckDeliveryInfo();
  }, [drivers]);

  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-spin h-5 w-5 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-sm text-gray-300">Loading truck information...</p>
      </div>
    );
  }

  if (deliveryInfo.length === 0) {
    return (
      <div className="py-6 text-center">
        <Truck className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-300">No active trucks available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-400 pb-1 border-b border-truckmaster-gray-dark">
        <div>Driver</div>
        <div>Location</div>
        <div>Date</div>
        <div>Time</div>
      </div>
      
      <div className="space-y-1">
        {deliveryInfo.map(info => (
          <div 
            key={info.driverId} 
            className="grid grid-cols-4 gap-2 py-2 border-b border-truckmaster-gray-dark text-sm hover:bg-white/5 transition-colors rounded-sm px-1"
          >
            <div className="font-medium text-white">{info.driverName}</div>
            <div className="text-gray-200">{info.location}</div>
            <div className="text-gray-200">{info.deliveryDate}</div>
            <div className="text-gray-200">{info.deliveryTime}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TruckList;
