
import React from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadStatus, statusOptions, getStatusColor, updateLoadStatus } from "@/lib/loadStatusUtils";

interface StatusDropdownProps {
  loadId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: LoadStatus) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ loadId, currentStatus, onStatusChange }) => {
  const [open, setOpen] = React.useState(false);

  const handleStatusChange = async (newStatus: LoadStatus) => {
    if (newStatus === currentStatus as LoadStatus) {
      setOpen(false);
      return;
    }
    
    const success = await updateLoadStatus(loadId, newStatus);
    if (success && onStatusChange) {
      onStatusChange(newStatus);
    }
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center justify-between px-3 w-auto h-8",
            getStatusColor(currentStatus)
          )}
        >
          <span className="capitalize">{currentStatus || 'Unknown'}</span>
          {open ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40 bg-gray-900 border-gray-800">
        {statusOptions.map((option) => (
          <DropdownMenuItem 
            key={option.value}
            className={cn(
              "flex justify-between",
              currentStatus === option.value && "bg-gray-800"
            )}
            onClick={() => handleStatusChange(option.value)}
          >
            <span>{option.label}</span>
            {currentStatus === option.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
