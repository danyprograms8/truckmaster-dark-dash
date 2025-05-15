import React, { useState, useEffect, useCallback } from 'react';
import { useData } from './DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusDropdown from './StatusDropdown';
import { LoadStatus, statusOptions, getStatusColor, isActiveStatus, formatStatusLabel } from '@/lib/loadStatusUtils';
import LoadDetailsDrawer from './LoadDetailsDrawer';

const LoadsTable: React.FC = () => {
  const { loads, isLoading, refreshData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoadStatus | 'all'>('all');
  const [localLoads, setLocalLoads] = useState(loads);
  const [selectedLoad, setSelectedLoad] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadDetailLoading, setLoadDetailLoading] = useState(false);
  
  // Initialize localLoads with loads from DataProvider
  useEffect(() => {
    setLocalLoads(loads);
  }, [loads]);
  
  // Handle status change in a load
  const handleStatusChange = useCallback((loadId: string, newStatus: LoadStatus) => {
    setLocalLoads(prevLoads => 
      prevLoads.map(load => 
        load.load_id === loadId ? { ...load, status: newStatus } : load
      )
    );
  }, []);

  // Open load details drawer
  const handleViewLoad = (load: any) => {
    setSelectedLoad(load);
    setLoadDetailLoading(true);
    setIsDrawerOpen(true);
    
    // Simulate loading
    setTimeout(() => {
      setLoadDetailLoading(false);
    }, 500);
  };
  
  const filteredLoads = localLoads.filter(load => {
    // Special handling for "active" filter to include both "active" and "in_transit"
    if (statusFilter === 'active') {
      if (!isActiveStatus(load.status)) {
        return false;
      }
    } else if (statusFilter !== 'all' && load.status !== statusFilter) {
      return false;
    }
    
    // Search term filtering
    return (
      load.load_id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      load.broker_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.broker_load_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Maintain counts of loads by status
  const loadCounts = {
    all: localLoads.length,
    ...statusOptions.reduce((acc, option) => {
      // For "active" status, count both "active" and "in_transit"
      if (option.value === 'active') {
        acc[option.value] = localLoads.filter(load => isActiveStatus(load.status)).length;
      } else {
        acc[option.value] = localLoads.filter(load => load.status === option.value).length;
      }
      return acc;
    }, {} as Record<string, number>)
  };

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
      
      <div className="mb-6 flex flex-wrap gap-2">
        <Button 
          variant={statusFilter === 'all' ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter('all')}
          className="flex items-center"
        >
          <Filter className="mr-1 h-4 w-4" />
          All <span className="ml-1 text-xs bg-gray-700 px-1.5 py-0.5 rounded-full">{loadCounts.all}</span>
        </Button>
        
        {statusOptions.map(status => (
          <Button 
            key={status.value}
            variant={statusFilter === status.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status.value)}
            className={`${statusFilter === status.value ? '' : 'bg-opacity-20'}`}
          >
            {status.label} 
            <span className="ml-1 text-xs bg-gray-700 px-1.5 py-0.5 rounded-full">
              {loadCounts[status.value] || 0}
            </span>
          </Button>
        ))}
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>
            {statusFilter === 'all' 
              ? 'All Loads' 
              : `${formatStatusLabel(statusFilter)} Loads`}
          </CardTitle>
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
                  <TableHead>Actions</TableHead>
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
                        <StatusDropdown 
                          loadId={load.load_id} 
                          currentStatus={load.status}
                          onStatusChange={(newStatus) => handleStatusChange(load.load_id, newStatus)} 
                        />
                      </TableCell>
                      <TableCell>${load.rate?.toFixed(2) || 'N/A'}</TableCell>
                      <TableCell>
                        {load.driver_id || 'Unassigned'}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewLoad(load)}
                          title="View load details and notes"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-6 text-center text-gray-400">
                      {searchTerm ? 'No loads found matching your search criteria' : 'No loads found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <LoadDetailsDrawer 
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedLoad={selectedLoad}
        isLoading={loadDetailLoading}
      />
    </div>
  );
};

export default LoadsTable;
