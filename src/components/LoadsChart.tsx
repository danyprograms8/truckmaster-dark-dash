
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  TooltipProps 
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface ChartData {
  date: string;
  loads: number;
}

const data: ChartData[] = [
  { date: 'May 8', loads: 8 },
  { date: 'May 9', loads: 3 },
  { date: 'May 10', loads: 3 },
  { date: 'May 11', loads: 7 },
  { date: 'May 12', loads: 7 },
  { date: 'May 13', loads: 10 },
  { date: 'May 14', loads: 4 },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-truckmaster-darker p-2 px-3 border border-white/10 rounded-md shadow-md">
        <p className="text-sm text-white font-medium">{label}</p>
        <p className="text-truckmaster-purple font-bold">
          {`${payload[0].value} Loads`}
        </p>
      </div>
    );
  }
  return null;
};

const LoadsChart: React.FC = () => {
  return (
    <div className="bg-truckmaster-card-bg p-5 rounded-lg border border-white/5 h-80">
      <h2 className="text-white font-medium mb-4">Loads Booked (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#9F9EA1' }}
            axisLine={{ stroke: '#333333' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#9F9EA1' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 12]}
            tickCount={7}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="loads" 
            stroke="#9b87f5" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#1A1F2C', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#9b87f5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoadsChart;
