
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
  count: number;
}

interface LoadsChartProps {
  data?: ChartData[];
}

// Format date string to a more readable format (e.g., "May 8")
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 px-3 border rounded-md shadow-md">
        <p className="text-sm font-medium">{formatDate(label as string)}</p>
        <p className="text-primary font-bold">
          {`${payload[0].value} Loads`}
        </p>
      </div>
    );
  }
  return null;
};

const LoadsChart: React.FC<LoadsChartProps> = ({ data = [] }) => {
  // Transform the data for display
  const chartData = data.map(item => ({
    date: item.date,
    loads: item.count
  }));
  
  // If no data is provided, use sample data
  const displayData = chartData.length > 0 ? chartData : [
    { date: '2025-05-08', loads: 8 },
    { date: '2025-05-09', loads: 3 },
    { date: '2025-05-10', loads: 3 },
    { date: '2025-05-11', loads: 7 },
    { date: '2025-05-12', loads: 7 },
    { date: '2025-05-13', loads: 10 },
    { date: '2025-05-14', loads: 4 },
  ];

  // Find max value to set y-axis domain
  const maxLoads = Math.max(...displayData.map(d => d.loads), 10);
  const yAxisMax = Math.ceil(maxLoads * 1.2); // Add 20% headroom

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={displayData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={false}
            tickLine={false}
            domain={[0, yAxisMax]}
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
