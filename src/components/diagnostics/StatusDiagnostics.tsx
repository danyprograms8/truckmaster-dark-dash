
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { normalizeStatus, formatStatusLabel } from '@/lib/loadStatusUtils';
import { useToast } from "@/hooks/use-toast";

const StatusDiagnostics: React.FC = () => {
  const [loads, setLoads] = useState<any[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [queriesRun, setQueriesRun] = useState<string[]>([]);
  const { toast } = useToast();

  // Function to fetch all loads with their statuses
  const fetchLoads = async () => {
    setIsLoading(true);
    try {
      // Add query to diagnostic log
      const query = 'SELECT * FROM loads ORDER BY created_at DESC';
      setQueriesRun(prev => [...prev, query]);
      
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLoads(data || []);
      
      // Calculate status counts
      const counts: Record<string, number> = { all: data?.length || 0 };
      const trackedLoads: Record<string, string[]> = {};
      
      // Process each load and track its status
      data?.forEach(load => {
        const normalizedStatus = normalizeStatus(load.status);
        if (!counts[normalizedStatus]) {
          counts[normalizedStatus] = 0;
          trackedLoads[normalizedStatus] = [];
        }
        counts[normalizedStatus]++;
        trackedLoads[normalizedStatus].push(load.load_id);
      });
      
      setStatusCounts(counts);
      console.log('Status breakdown diagnostic:', trackedLoads);
      
      // Validate status counts
      let totalSpecificCounts = 0;
      Object.keys(counts).forEach(key => {
        if (key !== 'all') totalSpecificCounts += counts[key];
      });
      
      if (totalSpecificCounts !== counts.all) {
        console.error(`Status count integrity check failed: Total=${counts.all}, Sum=${totalSpecificCounts}`);
      } else {
        console.log(`Status count integrity check passed: Total=${counts.all}, Sum=${totalSpecificCounts}`);
      }
    } catch (err) {
      console.error('Error fetching loads:', err);
      toast({
        title: "Error fetching data",
        description: "Could not load diagnostic data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLoads();
  }, []);

  // Cleanup database (fix any inconsistencies)
  const handleCleanupDatabase = async () => {
    try {
      toast({
        title: "Database cleanup",
        description: "Checking for and fixing any status inconsistencies...",
      });
      
      // Standardize all statuses to normalized format
      const updateQuery = `
        UPDATE loads 
        SET status = 
          CASE 
            WHEN LOWER(status) IN ('in_transit', 'in transit', 'in-transit', 'intransit') THEN 'in_transit'
            WHEN LOWER(status) IN ('cancelled', 'canceled') THEN 'cancelled'
            ELSE LOWER(REPLACE(status, ' ', ''))
          END
        WHERE status IS NOT NULL
      `;
      
      setQueriesRun(prev => [...prev, updateQuery]);
      
      const { error } = await supabase.rpc('run_status_cleanup');
      
      if (error) throw error;
      
      toast({
        title: "Database cleanup complete",
        description: "Status values have been standardized",
      });
      
      // Refresh the data
      fetchLoads();
    } catch (err) {
      console.error('Error during database cleanup:', err);
      toast({
        title: "Error during cleanup",
        description: "Could not complete database cleanup",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Status Diagnostics</h2>
        <div className="flex space-x-2">
          <Button onClick={fetchLoads} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button onClick={handleCleanupDatabase} variant="outline" size="sm" disabled={isLoading}>
            Run Database Cleanup
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Status Counts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Normalized Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>All Loads</TableCell>
                <TableCell>{statusCounts.all || 0}</TableCell>
                <TableCell>N/A</TableCell>
              </TableRow>
              {Object.keys(statusCounts).filter(key => key !== 'all').sort().map((status) => (
                <TableRow key={status}>
                  <TableCell>{formatStatusLabel(status)}</TableCell>
                  <TableCell>{statusCounts[status]}</TableCell>
                  <TableCell><code>{status}</code></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>All Loads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Load ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Normalized Status</TableHead>
                  <TableHead>Broker</TableHead>
                  <TableHead>Broker Load #</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      <div className="flex justify-center items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : loads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No loads found in the database
                    </TableCell>
                  </TableRow>
                ) : (
                  loads.map((load) => (
                    <TableRow key={load.id}>
                      <TableCell>{load.load_id}</TableCell>
                      <TableCell>{load.status}</TableCell>
                      <TableCell><code>{normalizeStatus(load.status)}</code></TableCell>
                      <TableCell>{load.broker_name || 'N/A'}</TableCell>
                      <TableCell>{load.broker_load_number || 'N/A'}</TableCell>
                      <TableCell>{new Date(load.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Executed Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto p-2 bg-gray-900 rounded">
            {queriesRun.map((query, index) => (
              <div key={index} className="font-mono text-sm text-gray-300 whitespace-pre-wrap p-2 border-b border-gray-700">
                {query}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusDiagnostics;
