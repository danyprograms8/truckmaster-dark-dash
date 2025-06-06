
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from "@/components/ui/use-toast";
import { isInTransitStatus, normalizeStatus } from '@/lib/loadStatusUtils';

// Define types for our context data
interface Load {
  id: number;
  load_id: string;
  broker_name?: string;
  broker_load_number?: string;
  driver_id?: number;
  status: string;
  load_type?: string;
  rate?: number;
  temperature?: string;
  created_at?: string;
  updated_at?: string;
  pickup_city?: string;
  pickup_state?: string;
  pickup_zip?: string;
  pickup_date?: string;
  pickup_time?: string;
  delivery_city?: string;
  delivery_state?: string;
  delivery_zip?: string;
  delivery_date?: string;
  delivery_time?: string;
}

interface Driver {
  id: number;
  name: string;
  status?: string;
  truck_number?: string;
  current_location_city?: string;
  current_location_state?: string;
  phone?: string;
  email?: string;
  available_date?: string;
  available_time?: string;
}

interface Activity {
  activity_type?: string;
  activity_id?: number;
  note_id?: number;
  load_id?: string;
  note_text?: string;
  note_type?: string;
  previous_status?: string;
  new_status?: string;
  changed_by?: string;
  created_at?: string;
  broker_load_number?: string;
  load_type?: string;
}

interface LoadTrendData {
  date: string;
  count: number;
}

interface DashboardMetrics {
  activeLoads: number;
  availableDrivers: number;
  todayPickups: number;
  todayDeliveries: number;
  loadTrend: LoadTrendData[];
}

interface DataContextType {
  loads: Load[];
  drivers: Driver[];
  recentActivity: Activity[];
  dashboardMetrics: DashboardMetrics;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    activeLoads: 0,
    availableDrivers: 0,
    todayPickups: 0,
    todayDeliveries: 0,
    loadTrend: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Format date for database queries (YYYY-MM-DD)
  const getTodayFormatted = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get date for 7 days ago
  const getSevenDaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  };

  // Fetch all loads with pickup and delivery information
  const fetchLoads = async () => {
    try {
      // First fetch basic load information
      const { data: loadsData, error: loadsError } = await supabase
        .from('loads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (loadsError) throw loadsError;
      if (!loadsData) return [];
      
      // Fetch first pickup location for each load
      const { data: pickupData, error: pickupError } = await supabase
        .from('pickup_locations')
        .select('load_id, city, state, zipcode, pickup_date, pickup_time')
        .eq('sequence', 1);
      
      if (pickupError) throw pickupError;
      
      // Create a map of load_id to pickup location for easy lookup
      const pickupMap: Record<string, any> = {};
      if (pickupData) {
        pickupData.forEach(pickup => {
          pickupMap[pickup.load_id] = pickup;
        });
      }
      
      // Fetch last delivery location for each load
      const deliveryPromises = loadsData.map(async (load) => {
        // Get the delivery location with highest sequence number for this load
        const { data: deliveryData, error: deliveryError } = await supabase
          .from('delivery_locations')
          .select('load_id, city, state, zipcode, delivery_date, delivery_time, sequence')
          .eq('load_id', load.load_id)
          .order('sequence', { ascending: false })
          .limit(1);
        
        if (deliveryError) {
          console.error('Error fetching delivery location:', deliveryError);
          return null;
        }
        
        return deliveryData?.[0] || null;
      });
      
      const deliveryResults = await Promise.all(deliveryPromises);
      
      // Create a map of load_id to delivery location for easy lookup
      const deliveryMap: Record<string, any> = {};
      deliveryResults.forEach(delivery => {
        if (delivery) {
          deliveryMap[delivery.load_id] = delivery;
        }
      });
      
      // Combine load data with pickup and delivery information
      const enhancedLoads = loadsData.map(load => {
        const pickup = pickupMap[load.load_id];
        const delivery = deliveryMap[load.load_id];
        
        return {
          ...load,
          status: normalizeStatus(load.status),
          pickup_city: pickup?.city,
          pickup_state: pickup?.state,
          pickup_zip: pickup?.zipcode,
          pickup_date: pickup?.pickup_date,
          pickup_time: pickup?.pickup_time,
          delivery_city: delivery?.city,
          delivery_state: delivery?.state,
          delivery_zip: delivery?.zipcode,
          delivery_date: delivery?.delivery_date,
          delivery_time: delivery?.delivery_time,
        };
      });
      
      return enhancedLoads;
    } catch (error) {
      console.error('Error fetching loads:', error);
      return [];
    }
  };

  // Fetch all drivers
  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching drivers:', error);
      return [];
    }
  };

  // Fetch recent activity from combined view
  const fetchRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('combined_activity_view')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  };

  // Fetch today's pickups
  const fetchTodayPickups = async () => {
    try {
      const today = getTodayFormatted();
      const { data, error } = await supabase
        .from('pickup_locations')
        .select('id')
        .eq('pickup_date', today);
      
      if (error) throw error;
      return data ? data.length : 0;
    } catch (error) {
      console.error('Error fetching today\'s pickups:', error);
      return 0;
    }
  };

  // Fetch today's deliveries
  const fetchTodayDeliveries = async () => {
    try {
      const today = getTodayFormatted();
      const { data, error } = await supabase
        .from('delivery_locations')
        .select('id')
        .eq('delivery_date', today);
      
      if (error) throw error;
      return data ? data.length : 0;
    } catch (error) {
      console.error('Error fetching today\'s deliveries:', error);
      return 0;
    }
  };

  // Fetch load trend data for the last 7 days
  const fetchLoadTrend = async () => {
    try {
      const sevenDaysAgo = getSevenDaysAgo();
      const { data, error } = await supabase
        .from('loads')
        .select('created_at')
        .gte('created_at', sevenDaysAgo);
      
      if (error) throw error;
      
      // Process data to get count per day
      const trend: { [key: string]: number } = {};
      const today = new Date();
      
      // Initialize last 7 days with 0 counts
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        trend[dateStr] = 0;
      }
      
      // Count loads per day
      if (data) {
        data.forEach(load => {
          if (load.created_at) {
            const dateStr = new Date(load.created_at).toISOString().split('T')[0];
            if (trend[dateStr] !== undefined) {
              trend[dateStr]++;
            }
          }
        });
      }
      
      // Convert to array sorted by date
      return Object.entries(trend)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Error fetching load trend:', error);
      return [];
    }
  };

  // Calculate metrics
  const calculateMetrics = (loads: Load[], drivers: Driver[]) => {
    const inTransitLoads = loads.filter(load => 
      isInTransitStatus(load.status)
    ).length;
    
    const availableDrivers = drivers.filter(driver => 
      driver.status?.toLowerCase() === 'active'
    ).length;
    
    return { activeLoads: inTransitLoads, availableDrivers };
  };

  // Main function to fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [
        loadsData, 
        driversData, 
        activityData,
        todayPickups,
        todayDeliveries,
        loadTrendData
      ] = await Promise.all([
        fetchLoads(),
        fetchDrivers(),
        fetchRecentActivity(),
        fetchTodayPickups(),
        fetchTodayDeliveries(),
        fetchLoadTrend()
      ]);
      
      setLoads(loadsData);
      setDrivers(driversData);
      setRecentActivity(activityData);
      
      // Calculate metrics
      const { activeLoads, availableDrivers } = calculateMetrics(loadsData, driversData);
      
      setDashboardMetrics({
        activeLoads,
        availableDrivers,
        todayPickups,
        todayDeliveries,
        loadTrend: loadTrendData
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error fetching data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
    const loadsSubscription = supabase
      .channel('loads-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'loads' }, fetchData)
      .subscribe();

    const driversSubscription = supabase
      .channel('drivers-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, fetchData)
      .subscribe();
    
    const notesSubscription = supabase
      .channel('notes-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'load_notes' }, fetchData)
      .subscribe();

    // Add subscription for the new load_activities table
    const activitiesSubscription = supabase
      .channel('activities-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'load_activities' }, fetchData)
      .subscribe();

    const pickupsSubscription = supabase
      .channel('pickups-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pickup_locations' }, fetchData)
      .subscribe();
    
    const deliveriesSubscription = supabase
      .channel('deliveries-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_locations' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(loadsSubscription);
      supabase.removeChannel(driversSubscription);
      supabase.removeChannel(notesSubscription);
      supabase.removeChannel(activitiesSubscription);
      supabase.removeChannel(pickupsSubscription);
      supabase.removeChannel(deliveriesSubscription);
    };
  }, []);

  const value = {
    loads,
    drivers,
    recentActivity,
    dashboardMetrics,
    isLoading,
    refreshData: fetchData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
