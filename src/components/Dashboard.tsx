import React from 'react';
import { Medicine, MedicineLog } from '../types/medicine';
import { Patient } from '../types/patient';
import { formatTime, getTodayString, getCurrentTime } from '../utils/dateUtils';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { MedicineChart } from './MedicineChart';
import { PatientProfile } from './PatientProfile';

interface DashboardProps {
  patient: Patient;
  medicines: Medicine[];
  logs: MedicineLog[];
  onLogMedicine: (medicineId: string, time: string, taken: boolean) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ patient, medicines, logs, onLogMedicine, onLogout }) => {
  const today = getTodayString();
  const currentTime = getCurrentTime();
  
  const todaysMedicines = medicines.flatMap(medicine => 
    medicine.times.map(time => ({
      ...medicine,
      time,
      id: `${medicine.id}-${time}`,
      originalId: medicine.id
    }))
  ).sort((a, b) => a.time.localeCompare(b.time));

  const getLogForMedicine = (medicineId: string, time: string) => {
    return logs.find(log => 
      log.medicineId === medicineId && 
      log.date === today && 
      log.time === time
    );
  };

  const getMedicineStatus = (medicineId: string, time: string) => {
    const log = getLogForMedicine(medicineId, time);
    if (log) {
      return log.taken ? 'taken' : 'skipped';
    }
    
    // Check if time has passed
    const [hours, minutes] = time.split(':').map(Number);
    const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    
    if (currentTimeInMinutes > timeInMinutes + 30) { // 30 minutes grace period
      return 'overdue';
    } else if (currentTimeInMinutes >= timeInMinutes - 15) { // 15 minutes before
      return 'due';
    }
    
    return 'pending';
  };

  const handleMedicineAction = (medicineId: string, time: string, taken: boolean) => {
    onLogMedicine(medicineId, time, taken);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken': return 'bg-green-50 border-green-200';
      case 'skipped': return 'bg-red-50 border-red-200';
      case 'overdue': return 'bg-orange-50 border-orange-200';
      case 'due': return 'bg-blue-50 border-blue-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'skipped': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'overdue': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'due': return <Clock className="h-5 w-5 text-blue-600" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const todayStats = {
    total: todaysMedicines.length,
    taken: todaysMedicines.filter(m => getLogForMedicine(m.originalId, m.time)?.taken).length,
    overdue: todaysMedicines.filter(m => getMedicineStatus(m.originalId, m.time) === 'overdue').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Patient Profile */}
      <div className="mb-8">
        <PatientProfile patient={patient} onLogout={onLogout} />
      </div>

      {/* Medicine Chart */}
      <div className="mb-8">
        <MedicineChart medicines={medicines} logs={logs} />
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Today's Medicine Schedule</h2>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Today</p>
              <p className="text-2xl font-bold text-blue-900">{todayStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-600 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900">{todayStats.taken}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-orange-600 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Overdue</p>
              <p className="text-2xl font-bold text-orange-900">{todayStats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Schedule */}
      <div className="space-y-4">
        {todaysMedicines.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines scheduled for today</h3>
            <p className="text-gray-600">Add some medicines to get started with your daily routine.</p>
          </div>
        ) : (
          todaysMedicines.map((medicine) => {
            const status = getMedicineStatus(medicine.originalId, medicine.time);
            const log = getLogForMedicine(medicine.originalId, medicine.time);
            
            return (
              <div
                key={medicine.id}
                className={`border rounded-lg p-6 transition-colors ${getStatusColor(status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: medicine.color }}
                    ></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                      <p className="text-gray-600">{medicine.dosage}</p>
                      {medicine.instructions && (
                        <p className="text-sm text-gray-500 mt-1">{medicine.instructions}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <span className="text-lg font-medium text-gray-900">
                          {formatTime(medicine.time)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 capitalize">{status}</p>
                    </div>
                    
                    {!log && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMedicineAction(medicine.originalId, medicine.time, true)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Take
                        </button>
                        <button
                          onClick={() => handleMedicineAction(medicine.originalId, medicine.time, false)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Skip
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};