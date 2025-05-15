
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { InfoIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  color?: string;
  suffix?: React.ReactNode;
  "title-tooltip"?: string; // Optional tooltip text for the title
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className,
  color,
  suffix,
  "title-tooltip": titleTooltip
}) => {
  return (
    <div className={cn(
      "bg-truckmaster-card-bg p-5 rounded-lg border border-white/5 card-hover",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-truckmaster-gray-light mb-1 flex items-center">
            {title}
            {titleTooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-3 w-3 ml-1 text-truckmaster-gray-light cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{titleTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {trend && (
            <span className={cn(
              "text-xs font-medium flex items-center mt-1",
              trend.isPositive ? "text-green-400" : "text-red-400"
            )}>
              {trend.isPositive ? "▲" : "▼"} {trend.value}%
              <span className="ml-1 text-truckmaster-gray-light">vs last week</span>
            </span>
          )}
        </div>
        <div className={cn(
          "h-10 w-10 rounded-md flex items-center justify-center",
          color ? color : "bg-truckmaster-purple/20 text-truckmaster-purple"
        )}>
          {icon}
        </div>
        {suffix}
      </div>
    </div>
  );
};

export default MetricCard;
