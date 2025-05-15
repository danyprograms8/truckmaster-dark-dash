
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadStatus, statusOptions, getStatusColor, updateLoadStatus, formatStatusLabel } from "@/lib/loadStatusUtils";

interface StatusDropdownProps {
  loadId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: LoadStatus) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ loadId, currentStatus, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<LoadStatus>(currentStatus as LoadStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync local state when currentStatus prop changes
  useEffect(() => {
    setStatus(currentStatus as LoadStatus);
  }, [currentStatus]);

  const handleStatusChange = async (newStatus: LoadStatus) => {
    if (newStatus === status) {
      setOpen(false);
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const success = await updateLoadStatus(loadId, newStatus);
      
      if (success) {
        // Update local state
        setStatus(newStatus);
        
        // Show success indicator briefly
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        
        // Call parent callback if provided
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={isUpdating}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center justify-between px-3 w-auto h-8 transition-all",
              getStatusColor(status),
              isUpdating && "opacity-70"
            )}
          >
            <span>{formatStatusLabel(status) || 'Unknown'}</span>
            {open ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            {isUpdating && (
              <span className="ml-2 h-3 w-3 rounded-full animate-pulse bg-white/30"></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40 bg-gray-900 border-gray-800">
          {statusOptions.map((option) => (
            <DropdownMenuItem 
              key={option.value}
              className={cn(
                "flex justify-between",
                status === option.value && "bg-gray-800"
              )}
              onClick={() => handleStatusChange(option.value)}
            >
              <span>{option.label}</span>
              {status === option.value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
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
