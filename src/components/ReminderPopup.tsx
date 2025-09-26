import React from 'react';
import { Medicine } from '../types/medicine';
import { formatTime } from '../utils/dateUtils';
import { Bell, X, Check, Clock } from 'lucide-react';

interface ReminderPopupProps {
  medicine: Medicine;
  time: string;
  onTake: () => void;
  onSkip: () => void;
  onSnooze: () => void;
  onClose: () => void;
}

export const ReminderPopup: React.FC<ReminderPopupProps> = ({
  medicine,
  time,
  onTake,
  onSkip,
  onSnooze,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-pulse-once">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Medicine Reminder</h3>
                <p className="text-sm text-gray-600">Time to take your medicine</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: medicine.color }}
              ></div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{medicine.name}</h4>
                <p className="text-gray-600">{medicine.dosage}</p>
                <p className="text-sm text-blue-600 font-medium">{formatTime(time)}</p>
              </div>
            </div>
            {medicine.instructions && (
              <p className="text-sm text-gray-600 mt-3 pl-7">{medicine.instructions}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onTake}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Take Now</span>
            </button>
            <button
              onClick={onSnooze}
              className="flex-1 bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Clock className="h-4 w-4" />
              <span>Snooze 5min</span>
            </button>
            <button
              onClick={onSkip}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Skip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};