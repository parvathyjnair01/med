import React from 'react';
import { Patient } from '../types/patient';
import { Pill as Pills, Calendar, Plus } from 'lucide-react';

interface HeaderProps {
  patient: Patient;
  currentView: 'dashboard' | 'medicines' | 'add';
  onViewChange: (view: 'dashboard' | 'medicines' | 'add') => void;
}

export const Header: React.FC<HeaderProps> = ({ patient, currentView, onViewChange }) => {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Pills className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MedReminder</h1>
              <p className="text-sm text-gray-600">Welcome, {patient.firstName}!</p>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => onViewChange('medicines')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'medicines'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Pills className="h-4 w-4 inline mr-2" />
              Medicines
            </button>
            <button
              onClick={() => onViewChange('add')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'add'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Add Medicine
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};