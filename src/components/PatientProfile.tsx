import React from 'react';
import { Patient } from '../types/patient';
import { User, Mail, Phone, Calendar, Heart, AlertTriangle, LogOut } from 'lucide-react';

interface PatientProfileProps {
  patient: Patient;
  onLogout: () => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onLogout }) => {
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-3 rounded-full">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-gray-600">Patient Profile</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{patient.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{patient.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="font-medium">{age} years old</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              Emergency Contact
            </h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="font-medium">{patient.emergencyContact.name}</p>
              <p className="text-sm text-gray-600">{patient.emergencyContact.relationship}</p>
              <p className="text-sm text-gray-600">{patient.emergencyContact.phone}</p>
            </div>
          </div>

          {patient.medicalConditions && patient.medicalConditions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Medical Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {patient.medicalConditions.map((condition, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}

          {patient.allergies && patient.allergies.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                Allergies
              </h4>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};