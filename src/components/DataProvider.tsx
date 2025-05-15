
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, getLoads, getDrivers, getRecentActivity } from '../lib/supabaseClient';
import { toast } from "@/components/ui/use-toast";

interface DataContextType {
  loads: any[];
  drivers: any[];
  recentActivity: any[];
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
  const [loads, setLoads] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [loadsData, driversData, activityData] = await Promise.all([
        getLoads(),
        getDrivers(),
        getRecentActivity()
      ]);
      
      setLoads(loadsData || []);
      setDrivers(driversData || []);
      setRecentActivity(activityData || []);
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

    return () => {
      supabase.removeChannel(loadsSubscription);
      supabase.removeChannel(driversSubscription);
    };
  }, []);

  const value = {
    loads,
    drivers,
    recentActivity,
    isLoading,
    refreshData: fetchData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
