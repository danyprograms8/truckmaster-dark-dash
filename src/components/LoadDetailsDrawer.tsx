
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, PenLine, Save, X } from 'lucide-react';
import LoadNotes from '@/components/LoadNotes';
import { Separator } from '@/components/ui/separator';
import { formatStatusLabel } from '@/lib/loadStatusUtils';
import { Input } from "@/components/ui/input";
import { toast } from './ui/use-toast';
import { fetchLocationData, updateLoad } from '@/lib/supabaseClient';
import LocationsSection from '@/components/LocationsSection';

interface Load {
  id: number;
  load_id: string;
  broker_name?: string;
  broker_load_number?: string;
  driver_id?: number;
  status: string;
  load_type?: string;
  rate?: number;
  temperature?: string;
  created_at?: string;
  updated_at?: string;
}

interface Location {
  id: number;
  type: 'pickup' | 'delivery';
  company_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  date?: string;
  time?: string;
  sequence: number;
  load_id: string;
}

interface LoadDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedLoad: Load | null;
  isLoading: boolean;
}

const LoadDetailsDrawer: React.FC<LoadDetailsDrawerProps> = ({
  open,
  onClose,
  selectedLoad,
  isLoading: initialLoading
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLoad, setEditedLoad] = useState<Load | null>(null);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [isSaving, setIsSaving] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    setIsLoading(initialLoading);
    setEditedLoad(selectedLoad);
    setIsEditing(false);
  }, [selectedLoad, initialLoading]);

  useEffect(() => {
    if (selectedLoad?.load_id && open) {
      fetchLocations(selectedLoad.load_id);
    }
  }, [selectedLoad?.load_id, open]);

  const fetchLocations = async (loadId: string) => {
    setLoadingLocations(true);
    try {
      const locationsData = await fetchLocationData(loadId);
      setLocations(locationsData);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: "Error",
        description: "Failed to load pickup and delivery locations",
        variant: "destructive",
      });
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleInputChange = (field: keyof Load, value: any) => {
    if (!editedLoad) return;
    setEditedLoad({
      ...editedLoad,
      [field]: value
    });
  };

  const handleSave = async () => {
    if (!editedLoad) return;
    setIsSaving(true);
    try {
      await updateLoad(editedLoad);
      toast({
        title: "Success",
        description: "Load information updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating load:', error);
      toast({
        title: "Error",
        description: "Failed to update load information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedLoad(selectedLoad);
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex justify-between items-center">
            <div className="flex items-center">
              {selectedLoad ? `Load ${selectedLoad.load_id}` : 'Load Details'}
              {!isEditing && selectedLoad && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2"
                  onClick={() => setIsEditing(true)}
                >
                  <PenLine className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                  Save
                </Button>
              </div>
            ) : null}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : selectedLoad ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p>{formatStatusLabel(selectedLoad.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Broker</p>
                  {isEditing ? (
                    <Input
                      value={editedLoad?.broker_name || ''}
                      onChange={(e) => handleInputChange('broker_name', e.target.value)}
                      className="h-8 mt-1"
                    />
                  ) : (
                    <p>{selectedLoad.broker_name || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Broker Load #</p>
                  {isEditing ? (
                    <Input
                      value={editedLoad?.broker_load_number || ''}
                      onChange={(e) => handleInputChange('broker_load_number', e.target.value)}
                      className="h-8 mt-1"
                    />
                  ) : (
                    <p>{selectedLoad.broker_load_number || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Driver ID</p>
                  <p>{selectedLoad.driver_id || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Load Type</p>
                  {isEditing ? (
                    <Input
                      value={editedLoad?.load_type || ''}
                      onChange={(e) => handleInputChange('load_type', e.target.value)}
                      className="h-8 mt-1"
                    />
                  ) : (
                    <p>{selectedLoad.load_type || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rate</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedLoad?.rate?.toString() || ''}
                      onChange={(e) => handleInputChange('rate', parseFloat(e.target.value) || 0)}
                      className="h-8 mt-1"
                    />
                  ) : (
                    <p>{selectedLoad.rate ? `$${selectedLoad.rate.toFixed(2)}` : 'N/A'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Temperature</p>
                  {isEditing ? (
                    <Input
                      value={editedLoad?.temperature || ''}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                      className="h-8 mt-1"
                    />
                  ) : (
                    <p>{selectedLoad.temperature || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p>{formatDate(selectedLoad.created_at)}</p>
                </div>
              </div>
            </div>
            
            <LocationsSection 
              locations={locations} 
              isLoading={loadingLocations} 
            />
            
            <LoadNotes 
              loadId={selectedLoad.load_id} 
              brokerName={selectedLoad.broker_name}
            />
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">
            No load selected
          </p>
        )}

        <SheetFooter className="pt-2">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default LoadDetailsDrawer;
