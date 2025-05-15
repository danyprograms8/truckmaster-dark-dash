import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useData } from './DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusDropdown from './StatusDropdown';
import { 
  LoadStatus, 
  statusOptions, 
  getStatusColor, 
  isActiveStatus, 
  isInTransitStatus, 
  formatStatusLabel,
  normalizeStatus
} from '@/lib/loadStatusUtils';
import LoadDetailsDrawer from './LoadDetailsDrawer';
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoadsPage: React.FC = () => {
  const { loads, isLoading, refreshData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoadStatus | 'all'>('all');
  const [localLoads, setLocalLoads] = useState(loads);
  const [selectedLoad, setSelectedLoad] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadDetailLoading, setLoadDetailLoading] = useState(false);
  const [updatingLoadIds, setUpdatingLoadIds] = useState<string[]>([]);
  const [countInconsistency, setCountInconsistency] = useState(false);
  const { toast } = useToast();
  
  // Initialize localLoads with loads from DataProvider
  useEffect(() => {
    setLocalLoads(loads);
    
    // Debug logging to check status distributions
    const statusCounts: Record<string, number> = { all: 0 };
    const statusMap: Record<string, string[]> = {};
    
    // Get detailed status breakdown
    loads.forEach(load => {
      const normalizedStatus = normalizeStatus(load.status);
      if (!statusMap[normalizedStatus]) {
        statusMap[normalizedStatus] = [];
      }
      statusMap[normalizedStatus].push(load.load_id);
      statusCounts.all++;
    });
    
    console.log('Current load status distribution:', statusMap);
  }, [loads]);
  
  // Handle status change in a load - optimistic update
  const handleStatusChange = useCallback((loadId: string, newStatus: LoadStatus) => {
    // Set this load as updating
    setUpdatingLoadIds(prev => [...prev, loadId]);
    
    // Update local state immediately for optimistic UI
    setLocalLoads(prevLoads => 
      prevLoads.map(load => 
        load.load_id === loadId ? { ...load, status: newStatus } : load
      )
    );
    
    // Remove from updating after short delay
    setTimeout(() => {
      setUpdatingLoadIds(prev => prev.filter(id => id !== loadId));
    }, 2000);
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
  
  // Filter loads based on status and search term
  const filteredLoads = useMemo(() => {
    return localLoads.filter(load => {
      // Normalize load status for consistent comparison 
      const normalizedLoadStatus = normalizeStatus(load.status);
      
      // Filter by status if a specific status is selected
      if (statusFilter !== 'all') {
        const normalizedFilterStatus = normalizeStatus(statusFilter);
        
        if (normalizedLoadStatus !== normalizedFilterStatus) {
          return false;
        }
      }
      
      // Search term filtering
      return (
        load.load_id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        load.broker_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.broker_load_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [localLoads, statusFilter, searchTerm]);

  // Calculate counts of loads by status - will update automatically with localLoads
  const loadCounts = useMemo(() => {
    console.log("Recalculating load counts from", localLoads.length, "loads");
    
    // Initialize counts object with zero counts
    const counts: Record<string, number> = {
      all: localLoads.length,
    };
    
    // Set all status options to 0 initially
    statusOptions.forEach(option => {
      counts[option.value] = 0;
    });
    
    // Track which loads are counted for each status (for debugging)
    const statusTracker: Record<string, string[]> = {};
    
    // Count loads for each status
    localLoads.forEach(load => {
      const normalizedStatus = normalizeStatus(load.status);
      
      if (!statusTracker[normalizedStatus]) {
        statusTracker[normalizedStatus] = [];
      }
      statusTracker[normalizedStatus].push(load.load_id);
      
      // Count for each specific normalized status
      statusOptions.forEach(option => {
        const normalizedOption = normalizeStatus(option.value);
        if (normalizedStatus === normalizedOption) {
          counts[option.value] = (counts[option.value] || 0) + 1;
        }
      });
    });
    
    // Debug log
    console.log("Status counts:", counts);
    console.log("Status breakdown:", statusTracker);
    
    // Data integrity check - sum of all specific statuses should equal total
    const specificStatusSum = statusOptions.reduce((sum, option) => sum + (counts[option.value] || 0), 0);
    
    // Check for inconsistencies
    setCountInconsistency(specificStatusSum !== counts.all);
    
    if (specificStatusSum !== counts.all) {
      console.warn(`Status count mismatch: Total=${counts.all}, Sum of categories=${specificStatusSum}`);
    }
    
    return counts;
  }, [localLoads]);

  // Add highlight class to recently updated rows
  const getRowClassName = (loadId: string) => {
    if (updatingLoadIds.includes(loadId)) {
      return "bg-amber-900/20 transition-colors duration-500";
    }
    return "";
  };
  
  // Force refresh loads from server
  const handleForceRefresh = async () => {
    try {
      await refreshData();
      toast({
        title: "Data refreshed",
        description: "Load counts have been updated from the server.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh load data. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
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
      
      {countInconsistency && (
        <Alert variant="destructive" className="mb-4 bg-amber-900/20 text-amber-300 border-amber-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Status count inconsistency detected. Please check the diagnostics page or refresh the data.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-6 flex flex-wrap gap-2 items-center">
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
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleForceRefresh}
                className="ml-2 p-1.5 h-8 w-8"
              >
                <RefreshCw className="h-4 w-4 transition-transform hover:rotate-180 duration-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh counts from server</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
                    <TableRow 
                      key={load.id} 
                      className={getRowClassName(load.load_id)}
                    >
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

export default LoadsPage;
