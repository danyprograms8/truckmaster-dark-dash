
import React, { useState } from 'react';
import { useData } from './DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';

const LoadsPage: React.FC = () => {
  const { loads, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLoads = loads.filter(load => 
    load.load_id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    load.broker_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    load.broker_load_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading loads data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-3xl font-bold">Loads</h2>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search loads..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Add Load
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Loads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Load ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Broker</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Broker Load #</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Rate</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLoads.length > 0 ? (
                  filteredLoads.map((load) => (
                    <tr key={load.id} className="hover:bg-gray-800">
                      <td className="py-3 px-4 text-sm">{load.load_id}</td>
                      <td className="py-3 px-4 text-sm">{load.broker_name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{load.broker_load_number || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{load.load_type || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          load.status === 'active' ? 'bg-green-900 text-green-300' :
                          load.status === 'in_transit' ? 'bg-blue-900 text-blue-300' :
                          load.status === 'completed' ? 'bg-gray-700 text-gray-300' :
                          load.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                          'bg-gray-800 text-gray-400'
                        }`}>
                          {load.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">${load.rate?.toFixed(2) || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">
                        {/* In a real app, you'd join with drivers table */}
                        {load.driver_id || 'Unassigned'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-400">
                      No loads found matching your search criteria
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

export default LoadsPage;
