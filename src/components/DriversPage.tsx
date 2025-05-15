
import React, { useState, useMemo } from 'react';
import { useData } from './DataProvider';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Phone, User, Truck, MapPin, Users, Plus } from 'lucide-react';

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to get badge styling based on status
const getStatusBadge = (status: string | undefined) => {
  if (!status) return { color: 'bg-gray-800 text-gray-400', label: 'Unknown' };
  
  const statusLower = status.toLowerCase();
  
  if (statusLower === 'active') {
    return { color: 'bg-green-900 text-green-300', label: 'Available' };
  } else if (statusLower === 'on_duty' || statusLower === 'on duty') {
    return { color: 'bg-blue-900 text-blue-300', label: 'On Load' };
  } else if (statusLower === 'off_duty' || statusLower === 'off duty') {
    return { color: 'bg-amber-900 text-amber-300', label: 'Off Duty' };
  }
  
  return { color: 'bg-gray-800 text-gray-400', label: status };
};

const DriversPage: React.FC = () => {
  const { drivers, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter drivers based on search term and status
  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      const matchesSearch = 
        (driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        driver.truck_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.current_location_city?.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesStatus = 
        statusFilter === 'all' || 
        (driver.status?.toLowerCase() === statusFilter);
        
      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchTerm, statusFilter]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading drivers data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drivers by name, truck or location..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className="whitespace-nowrap"
            >
              All Drivers
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('active')}
              className="whitespace-nowrap"
            >
              Available
            </Button>
            <Button
              variant={statusFilter === 'on_duty' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('on_duty')}
              className="whitespace-nowrap"
            >
              On Load
            </Button>
          </div>
        </div>
        <Button className="mt-4 md:mt-0 whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </div>

      {/* Driver cards grid */}
      {filteredDrivers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => {
            const statusBadge = getStatusBadge(driver.status);
            return (
              <Card key={driver.id} className="overflow-hidden border-white/5 hover:border-primary/20 transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4 bg-primary/20 text-primary">
                        <AvatarFallback>{getInitials(driver.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{driver.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          {driver.truck_number ? (
                            <>
                              <Truck className="mr-1 h-3 w-3" />
                              <span>Truck #{driver.truck_number}</span>
                            </>
                          ) : (
                            <span>No truck assigned</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${statusBadge.color} font-medium`}>
                      {statusBadge.label}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {driver.current_location_city && driver.current_location_state
                          ? `${driver.current_location_city}, ${driver.current_location_state}`
                          : "Location unknown"}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      {driver.status?.toLowerCase() === 'active' ? (
                        <>
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            Available: {driver.available_date ? new Date(driver.available_date).toLocaleDateString() : 'Now'}
                            {driver.available_time ? ` at ${driver.available_time.substring(0, 5)}` : ''}
                          </span>
                        </>
                      ) : (
                        <>
                          <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{driver.status === 'off_duty' ? 'Off duty' : 'Currently on assignment'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {driver.phone && (
                      <Button variant="outline" className="flex-1">
                        <Phone className="mr-2 h-4 w-4" /> Call
                      </Button>
                    )}
                    <Button className="flex-1">
                      <User className="mr-2 h-4 w-4" /> View Profile
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-card text-card-foreground border rounded-lg p-10 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No drivers found</h3>
          <p className="text-muted-foreground mb-6">
            No drivers match your current search criteria. Try adjusting your search or filters.
          </p>
          <Button onClick={() => {setSearchTerm(''); setStatusFilter('all');}}>
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default DriversPage;
