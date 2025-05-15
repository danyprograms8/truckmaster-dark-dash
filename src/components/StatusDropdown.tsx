
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LoadStatus, 
  statusOptions, 
  getStatusColor, 
  updateLoadStatus, 
  formatStatusLabel, 
  normalizeStatus 
} from "@/lib/loadStatusUtils";
import { useToast } from "@/hooks/use-toast";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface StatusDropdownProps {
  loadId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: LoadStatus) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ loadId, currentStatus, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<LoadStatus>(normalizeStatus(currentStatus) as LoadStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState<LoadStatus | null>(null);
  const { toast } = useToast();

  // Sync local state when currentStatus prop changes
  useEffect(() => {
    // Use normalizeStatus to ensure consistent format 
    // This will also convert any 'active' status to 'in_transit'
    const normalized = normalizeStatus(currentStatus) as LoadStatus;
    console.log(`StatusDropdown: setting normalized status for load ${loadId}: "${currentStatus}" -> "${normalized}"`);
    setStatus(normalized);
  }, [currentStatus, loadId]);

  const handleStatusChange = async (newStatus: LoadStatus) => {
    // Normalize both statuses for comparison
    const normalizedNewStatus = normalizeStatus(newStatus) as LoadStatus;
    const normalizedCurrentStatus = normalizeStatus(status) as LoadStatus;
    
    if (normalizedNewStatus === normalizedCurrentStatus) {
      setOpen(false);
      return;
    }
    
    // Debug log
    console.log(`Changing status from ${normalizedCurrentStatus} to ${normalizedNewStatus} for load ${loadId}`);
    
    // Set optimistic UI update
    const previousStatus = status;
    setOptimisticStatus(normalizedNewStatus);
    setIsUpdating(true);
    
    // Call parent callback immediately for optimistic update
    if (onStatusChange) {
      onStatusChange(normalizedNewStatus);
    }
    
    try {
      const success = await updateLoadStatus(loadId, normalizedNewStatus);
      
      if (success) {
        // Update local state
        setStatus(normalizedNewStatus);
        
        // Show success indicator briefly
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        
        // Show additional message when moving to Issues status
        if (normalizedNewStatus === 'issues') {
          toast({
            title: "Load marked with Issues",
            description: "This load requires attention to resolve problems.",
            duration: 5000,
          });
        }
      } else {
        // Revert optimistic update if server update failed
        setOptimisticStatus(null);
        // Call parent callback to revert
        if (onStatusChange) {
          onStatusChange(previousStatus);
        }
        
        toast({
          title: "Status update failed",
          description: "The status could not be updated. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert optimistic update if server update failed
      setOptimisticStatus(null);
      // Call parent callback to revert
      if (onStatusChange) {
        onStatusChange(previousStatus);
      }
      
      toast({
        title: "Status update failed",
        description: "An error occurred while updating the status.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
      setOpen(false);
    }
  };

  // Determine which status to display - use optimistic first if available
  const displayStatus = optimisticStatus || status;
  const displayLabel = formatStatusLabel(displayStatus);
  
  // Check if status is "Issues" to show additional info icon
  const isIssuesStatus = normalizeStatus(displayStatus) === 'issues';

  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={isUpdating}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center justify-between px-3 w-auto h-8 transition-all",
              getStatusColor(displayStatus),
              isUpdating && "opacity-70"
            )}
          >
            <span>{displayLabel || 'Unknown'}</span>
            {isIssuesStatus && (
              <AlertCircle className="ml-1 h-3 w-3" />
            )}
            {open ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            {isUpdating && (
              <span className="ml-2 h-3 w-3 rounded-full animate-pulse bg-white/30"></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40 bg-gray-900 border-gray-800">
          {statusOptions.map((option) => (
            <TooltipProvider key={option.value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem 
                    className={cn(
                      "flex justify-between",
                      normalizeStatus(displayStatus) === normalizeStatus(option.value) && "bg-gray-800"
                    )}
                    onClick={() => handleStatusChange(option.value)}
                  >
                    <span>{option.label}</span>
                    {normalizeStatus(displayStatus) === normalizeStatus(option.value) && <Check className="h-4 w-4" />}
                    {option.value === 'issues' && <AlertCircle className="h-3 w-3 ml-1 text-amber-400" />}
                  </DropdownMenuItem>
                </TooltipTrigger>
                {option.value === 'issues' && (
                  <TooltipContent side="right" className="max-w-xs">
                    <p>Issues status indicates loads that have encountered problems requiring attention</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {showSuccess && (
        <div className="absolute -right-4 -top-2 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
