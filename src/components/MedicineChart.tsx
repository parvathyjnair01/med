import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Medicine, MedicineLog } from '../types/medicine';
import { getTodayString } from '../utils/dateUtils';
import { TrendingUp, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

interface MedicineChartProps {
  medicines: Medicine[];
  logs: MedicineLog[];
}

export const MedicineChart: React.FC<MedicineChartProps> = ({ medicines, logs }) => {
  const today = getTodayString();
  
  // Calculate today's medicine statistics
  const todaysMedicines = medicines.flatMap(medicine => 
    medicine.times.map(time => ({
      medicineId: medicine.id,
      time,
      name: medicine.name
    }))
  );

  const todaysLogs = logs.filter(log => log.date === today);
  
  const taken = todaysLogs.filter(log => log.taken).length;
  const skipped = todaysLogs.filter(log => !log.taken).length;
  const pending = todaysMedicines.length - todaysLogs.length;

  const chartData = [
    { name: 'Taken', value: taken, color: '#10B981' },
    { name: 'Skipped', value: skipped, color: '#EF4444' },
    { name: 'Pending', value: pending, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  // Calculate weekly statistics
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoString = weekAgo.toISOString().split('T')[0];
  
  const weeklyLogs = logs.filter(log => log.date >= weekAgoString);
  const weeklyTaken = weeklyLogs.filter(log => log.taken).length;
  const weeklyTotal = weeklyLogs.length;
  const adherenceRate = weeklyTotal > 0 ? Math.round((weeklyTaken / weeklyTotal) * 100) : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} medicine{data.value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Today's Medicine Overview
        </h3>
        <p className="text-gray-600">Track your daily medicine adherence</p>
      </div>

      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{taken}</p>
                    <p className="text-sm text-green-600">Medicines Taken</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircle className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-red-900">{skipped}</p>
                    <p className="text-sm text-red-600">Medicines Skipped</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">{pending}</p>
                    <p className="text-sm text-yellow-600">Medicines Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Adherence */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{adherenceRate}%</p>
                    <p className="text-sm text-blue-600">Weekly Adherence</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {weeklyTaken} of {weeklyTotal} taken
                  </p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h4>
          <p className="text-gray-600">Add some medicines and start tracking to see your statistics.</p>
        </div>
      )}
    </div>
  );
};