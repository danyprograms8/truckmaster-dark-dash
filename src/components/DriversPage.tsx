
import React, { useState } from 'react';
import { useData } from './DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';

const DriversPage: React.FC = () => {
  const { drivers, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDrivers = drivers.filter(driver => 
    driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    driver.current_location_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.truck_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading drivers data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-3xl font-bold">Drivers</h2>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drivers..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Add Driver
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Truck #</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Current Location</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Phone</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-800">
                      <td className="py-3 px-4 text-sm">{driver.name}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          driver.status === 'active' ? 'bg-green-900 text-green-300' :
                          driver.status === 'on_duty' ? 'bg-blue-900 text-blue-300' :
                          driver.status === 'off_duty' ? 'bg-amber-900 text-amber-300' :
                          'bg-gray-800 text-gray-400'
                        }`}>
                          {driver.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{driver.truck_number || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">
                        {driver.current_location_city && driver.current_location_state 
                          ? `${driver.current_location_city}, ${driver.current_location_state}`
                          : 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-sm">{driver.phone || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{driver.email || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">
                        {driver.available_date 
                          ? new Date(driver.available_date).toLocaleDateString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-400">
                      No drivers found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriversPage;
