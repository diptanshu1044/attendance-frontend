import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card, { CardHeader } from '../ui/Card';

interface AttendanceData {
  date: string;
  attendance: number;
  sessions: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
  title?: string;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ 
  data, 
  title = 'Attendance Trends' 
}) => {
  return (
    <Card>
      <CardHeader title={title} />
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Attendance %"
              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="#14b8a6"
              strokeWidth={2}
              name="Total Sessions"
              dot={{ fill: '#14b8a6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AttendanceChart;