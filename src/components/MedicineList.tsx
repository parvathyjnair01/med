import React from 'react';
import { Medicine } from '../types/medicine';
import { formatTime } from '../utils/dateUtils';
import { CreditCard as Edit2, Trash2, Clock } from 'lucide-react';

interface MedicineListProps {
  medicines: Medicine[];
  onEditMedicine: (medicine: Medicine) => void;
  onDeleteMedicine: (medicineId: string) => void;
}

export const MedicineList: React.FC<MedicineListProps> = ({
  medicines,
  onEditMedicine,
  onDeleteMedicine
}) => {
  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Once daily';
      case 'twice-daily': return 'Twice daily';
      case 'three-times-daily': return 'Three times daily';
      case 'weekly': return 'Weekly';
      default: return frequency;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Medicines</h2>
        <p className="text-gray-600">Manage your medicine schedule</p>
      </div>

      {medicines.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines added yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first medicine to create a schedule.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: medicine.color }}
                  ></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                    <p className="text-gray-600">{medicine.dosage}</p>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => onEditMedicine(medicine)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteMedicine(medicine.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Frequency</p>
                  <p className="text-gray-600">{getFrequencyText(medicine.frequency)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Times</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {medicine.times.map((time, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {formatTime(time)}
                      </span>
                    ))}
                  </div>
                </div>

                {medicine.instructions && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Instructions</p>
                    <p className="text-gray-600 text-sm">{medicine.instructions}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(medicine.startDate).toLocaleDateString()} - {
                      medicine.endDate ? new Date(medicine.endDate).toLocaleDateString() : 'Ongoing'
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};