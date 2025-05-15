import React, { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { useData } from './DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for dispatcher performance
interface DispatcherPerformance {
  name: string;
  emptyMiles: number;
  revenueMiles: number;
  totalMiles: number;
  basicFreightRate: number;
  oRate: number;
  rate: number;
  diff: number;
  revPerMile: number;
  bRevPerMile: number;
}

const mockDispatcherData: DispatcherPerformance[] = [
  {
    name: "John Smith",
    emptyMiles: 345,
    revenueMiles: 2850,
    totalMiles: 3195,
    basicFreightRate: 4200,
    oRate: 1.47,
    rate: 1.52,
    diff: 0.05,
    revPerMile: 1.31,
    bRevPerMile: 1.27
  },
  {
    name: "Mary Johnson",
    emptyMiles: 512,
    revenueMiles: 3100,
    totalMiles: 3612,
    basicFreightRate: 4750,
    oRate: 1.53,
    rate: 1.48,
    diff: -0.05,
    revPerMile: 1.28,
    bRevPerMile: 1.32
  },
  {
    name: "Alex Williams",
    emptyMiles: 275,
    revenueMiles: 2500,
    totalMiles: 2775,
    basicFreightRate: 3800,
    oRate: 1.52,
    rate: 1.58,
    diff: 0.06,
    revPerMile: 1.37,
    bRevPerMile: 1.33
  },
  {
    name: "Sarah Davis",
    emptyMiles: 425,
    revenueMiles: 3250,
    totalMiles: 3675,
    basicFreightRate: 5100,
    oRate: 1.57,
    rate: 1.54,
    diff: -0.03,
    revPerMile: 1.39,
    bRevPerMile: 1.41
  },
  {
    name: "Michael Brown",
    emptyMiles: 310,
    revenueMiles: 2950,
    totalMiles: 3260,
    basicFreightRate: 4500,
    oRate: 1.53,
    rate: 1.61,
    diff: 0.08,
    revPerMile: 1.38,
    bRevPerMile: 1.30
  }
];

const CalendarPage: React.FC = () => {
  const { loads, drivers, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get current week dates for calendar view
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
  const weekDays = [...Array(7)].map((_, i) => addDays(startOfCurrentWeek, i));
  
  // Get current month and year
  const currentMonth = format(today, 'MMMM yyyy');
  
  // Filter dispatchers based on search term
  const filteredDispatchers = mockDispatcherData.filter(
    dispatcher => dispatcher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleExportReport = () => {
    console.log("Exporting report...");
    // Implementation for exporting data would go here
  };
  
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading data...</p>
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
      
      {/* Weekly Calendar Card - Keeping existing code */}
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
      
      {/* Dispatcher Performance Metrics */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle>Dispatcher Performance</CardTitle>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search dispatchers..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filters</Button>
              <Button 
                onClick={handleExportReport}
                className="bg-purple-700 hover:bg-purple-800"
              >
                <FileText className="mr-2 h-4 w-4" />
                GETREPORT
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispatcher</TableHead>
                    <TableHead className="text-right">Empty Miles</TableHead>
                    <TableHead className="text-right">Revenue Miles</TableHead>
                    <TableHead className="text-right">Total Miles</TableHead>
                    <TableHead className="text-right">Basic Freight Rate</TableHead>
                    <TableHead className="text-right">ORate</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Diff</TableHead>
                    <TableHead className="text-right">Rev Per Mile</TableHead>
                    <TableHead className="text-right">BRevPerMile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDispatchers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center h-24">
                        No dispatchers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDispatchers.map((dispatcher, i) => (
                      <TableRow key={`${dispatcher.name}-${i}`}>
                        <TableCell className="font-medium">{dispatcher.name}</TableCell>
                        <TableCell className="text-right">{dispatcher.emptyMiles}</TableCell>
                        <TableCell className="text-right">{dispatcher.revenueMiles}</TableCell>
                        <TableCell className="text-right">{dispatcher.totalMiles}</TableCell>
                        <TableCell className="text-right">${dispatcher.basicFreightRate}</TableCell>
                        <TableCell className="text-right">{dispatcher.oRate.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{dispatcher.rate.toFixed(2)}</TableCell>
                        <TableCell className={`text-right ${
                          dispatcher.diff > 0 
                            ? 'text-green-500' 
                            : dispatcher.diff < 0 
                              ? 'text-red-500' 
                              : ''
                        }`}>
                          {dispatcher.diff > 0 ? '+' : ''}{dispatcher.diff.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">{dispatcher.revPerMile.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{dispatcher.bRevPerMile.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Upcoming Pickups and Deliveries - keep existing code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
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
