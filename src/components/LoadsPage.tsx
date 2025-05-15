
import React, { useState } from 'react';
import { useData } from './DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const LoadsTable: React.FC = () => {
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Load ID</TableHead>
                  <TableHead>Broker</TableHead>
                  <TableHead>Broker Load #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Driver</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoads.length > 0 ? (
                  filteredLoads.map((load) => (
                    <TableRow key={load.id}>
                      <TableCell>{load.load_id}</TableCell>
                      <TableCell>{load.broker_name || 'N/A'}</TableCell>
                      <TableCell>{load.broker_load_number || 'N/A'}</TableCell>
                      <TableCell>{load.load_type || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          load.status === 'active' ? 'bg-green-900 text-green-300' :
                          load.status === 'in_transit' ? 'bg-blue-900 text-blue-300' :
                          load.status === 'completed' ? 'bg-gray-700 text-gray-300' :
                          load.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                          'bg-gray-800 text-gray-400'
                        }`}>
                          {load.status || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell>${load.rate?.toFixed(2) || 'N/A'}</TableCell>
                      <TableCell>
                        {load.driver_id || 'Unassigned'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-6 text-center text-gray-400">
                      No loads found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadsTable;
