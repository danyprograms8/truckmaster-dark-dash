
import React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className 
}) => {
  return (
    <div className={cn(
      "bg-truckmaster-card-bg p-5 rounded-lg border border-white/5 card-hover",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-truckmaster-gray-light mb-1">{title}</p>
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
        <div className="h-10 w-10 rounded-md bg-truckmaster-purple/20 text-truckmaster-purple flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
