
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { format } from 'date-fns';

interface Location {
  id: number;
  type: 'pickup' | 'delivery';
  company_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  date?: string | Date;
  time?: string;
  sequence: number;
  load_id: string;
}

interface LocationsSectionProps {
  locations: Location[];
  isLoading: boolean;
}

const LocationsSection: React.FC<LocationsSectionProps> = ({ locations, isLoading }) => {
  // Sort locations by type (pickup first) and sequence
  const sortedLocations = [...locations].sort((a, b) => {
    // First sort by sequence
    if (a.sequence !== b.sequence) {
      return a.sequence - b.sequence;
    }
    // If sequence is the same, pickups come before deliveries
    return a.type === 'pickup' ? -1 : 1;
  });

  const formatDate = (date?: string | Date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return 'N/A';
    return time;
  };

  const getAddress = (location: Location) => {
    const parts = [
      location.street_address,
      location.city,
      location.state,
      location.zipcode
    ].filter(Boolean);
    return parts.join(', ') || 'Address not available';
  };

  if (isLoading) {
    return (
      <div>
        <h3 className="text-lg font-medium">Locations</h3>
        <Separator className="my-2" />
        <div className="flex justify-center items-center h-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-medium">Locations</h3>
        <Separator className="my-2" />
        <p className="text-center text-muted-foreground py-4">No location information available</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium">Locations</h3>
      <Separator className="my-2" />
      <div className="space-y-4">
        {sortedLocations.map((location) => (
          <div 
            key={`${location.type}-${location.id}`} 
            className="border rounded-md p-3 bg-card"
          >
            <div className="flex items-center gap-2 mb-2">
              {location.type === 'pickup' ? (
                <MapPin className="h-4 w-4 text-green-500" />
              ) : (
                <Navigation className="h-4 w-4 text-blue-500" />
              )}
              <h4 className="font-semibold capitalize">
                {location.type} {location.sequence > 1 ? `#${location.sequence}` : ''}
              </h4>
            </div>
            
            <div className="pl-6 space-y-1">
              <p className="font-medium">{location.company_name || 'Unknown Company'}</p>
              <p className="text-muted-foreground text-sm">{getAddress(location)}</p>
              <div className="flex justify-between text-sm pt-1">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{formatDate(location.date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{formatTime(location.time)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsSection;
