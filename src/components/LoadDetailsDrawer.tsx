
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, X } from 'lucide-react';
import LoadNotes from '@/components/LoadNotes';
import { Separator } from '@/components/ui/separator';
import { formatStatusLabel } from '@/lib/loadStatusUtils';

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
  isLoading
}) => {
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
            <div>
              {selectedLoad ? `Load ${selectedLoad.load_id}` : 'Load Details'}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="-mt-2">
              <X className="h-4 w-4" />
            </Button>
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
                  <p>{selectedLoad.broker_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Broker Load #</p>
                  <p>{selectedLoad.broker_load_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Driver ID</p>
                  <p>{selectedLoad.driver_id || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Load Type</p>
                  <p>{selectedLoad.load_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rate</p>
                  <p>{selectedLoad.rate ? `$${selectedLoad.rate.toFixed(2)}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Temperature</p>
                  <p>{selectedLoad.temperature || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p>{formatDate(selectedLoad.created_at)}</p>
                </div>
              </div>
            </div>
            
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
