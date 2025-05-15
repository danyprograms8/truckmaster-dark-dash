
import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { useData } from './DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CalendarPage: React.FC = () => {
  const { loads, drivers, isLoading } = useData();
  
  // Get current week dates
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
  const weekDays = [...Array(7)].map((_, i) => addDays(startOfCurrentWeek, i));
  
  // Get current month and year
  const currentMonth = format(today, 'MMMM yyyy');
  
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading calendar data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-3xl font-bold">Calendar</h2>
        <div className="text-xl font-medium">{currentMonth}</div>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center font-semibold">
                <div className="text-gray-400 mb-1">{format(day, 'EEE')}</div>
                <div className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                  format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') 
                    ? 'bg-primary text-primary-foreground' 
                    : ''
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => {
              // In a real app, you'd filter loads with pickups or deliveries on this day
              // For now, just show mock data
              const dayLoads = loads.filter((_, idx) => idx % 7 === index).slice(0, 3);
              
              return (
                <div key={`events-${index}`} className="min-h-[150px] border-t border-gray-700 pt-2">
                  {dayLoads.map((load, idx) => (
                    <div key={`event-${idx}`} className="mb-2 p-1 text-xs bg-blue-900/30 border border-blue-800 rounded">
                      <div className="font-semibold">{load.load_id}</div>
                      <div className="truncate">{load.broker_name || 'Unknown broker'}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* In a real app, you'd fetch actual pickup data */}
              {loads.slice(0, 5).map((load, idx) => (
                <div key={`pickup-${idx}`} className="flex items-start space-x-3 pb-3 border-b border-gray-700">
                  <div className="bg-amber-900/30 border border-amber-800 rounded p-2 text-center w-12">
                    <div className="text-xs text-gray-400">May</div>
                    <div className="font-bold">{(idx + 15) % 30 + 1}</div>
                  </div>
                  <div>
                    <div className="font-medium">{load.load_id}</div>
                    <div className="text-sm text-gray-300">{load.broker_name}</div>
                    <div className="text-xs text-gray-400">
                      {/* Mock location data */}
                      Los Angeles, CA → Chicago, IL
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* In a real app, you'd fetch actual delivery data */}
              {loads.slice(5, 10).map((load, idx) => (
                <div key={`delivery-${idx}`} className="flex items-start space-x-3 pb-3 border-b border-gray-700">
                  <div className="bg-green-900/30 border border-green-800 rounded p-2 text-center w-12">
                    <div className="text-xs text-gray-400">May</div>
                    <div className="font-bold">{(idx + 18) % 30 + 1}</div>
                  </div>
                  <div>
                    <div className="font-medium">{load.load_id}</div>
                    <div className="text-sm text-gray-300">{load.broker_name}</div>
                    <div className="text-xs text-gray-400">
                      {/* Mock location data */}
                      Seattle, WA → Denver, CO
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
