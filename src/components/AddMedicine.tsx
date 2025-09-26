import React, { useState, useEffect } from 'react';
import { Medicine } from '../types/medicine';
import { Save, X, Plus } from 'lucide-react';

interface AddMedicineProps {
  medicine?: Medicine;
  onSave: (medicine: Omit<Medicine, 'id'>) => void;
  onCancel: () => void;
}

const MEDICINE_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Once daily', times: 1 },
  { value: 'twice-daily', label: 'Twice daily', times: 2 },
  { value: 'three-times-daily', label: 'Three times daily', times: 3 },
  { value: 'weekly', label: 'Weekly', times: 1 }
];

export const AddMedicine: React.FC<AddMedicineProps> = ({ medicine, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily' as Medicine['frequency'],
    times: ['09:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
    color: MEDICINE_COLORS[0]
  });

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name,
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        times: medicine.times,
        startDate: medicine.startDate,
        endDate: medicine.endDate || '',
        instructions: medicine.instructions || '',
        color: medicine.color
      });
    }
  }, [medicine]);

  const handleFrequencyChange = (frequency: Medicine['frequency']) => {
    const option = FREQUENCY_OPTIONS.find(opt => opt.value === frequency);
    if (option) {
      const defaultTimes = [];
      switch (frequency) {
        case 'daily':
          defaultTimes.push('09:00');
          break;
        case 'twice-daily':
          defaultTimes.push('09:00', '21:00');
          break;
        case 'three-times-daily':
          defaultTimes.push('08:00', '14:00', '20:00');
          break;
        case 'weekly':
          defaultTimes.push('09:00');
          break;
      }
      setFormData(prev => ({ 
        ...prev, 
        frequency, 
        times: prev.times.length === option.times ? prev.times : defaultTimes 
      }));
    }
  };

  const handleTimeChange = (index: number, time: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = time;
    setFormData(prev => ({ ...prev, times: newTimes }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({ 
      ...prev, 
      times: [...prev.times, '12:00'] 
    }));
  };

  const removeTimeSlot = (index: number) => {
    if (formData.times.length > 1) {
      const newTimes = formData.times.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, times: newTimes }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isEditing = !!medicine;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Edit Medicine' : 'Add New Medicine'}
          </h2>
          <p className="text-gray-600">
            {isEditing ? 'Update your medicine details' : 'Create a new medicine reminder'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Aspirin, Vitamin D"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                required
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 100mg, 2 tablets"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency *
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => handleFrequencyChange(e.target.value as Medicine['frequency'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {FREQUENCY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Times *
            </label>
            <div className="space-y-2">
              {formData.times.map((time, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTimeSlot}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add another time</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex space-x-2">
              {MEDICINE_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-gray-600' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions (Optional)
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Take with food, Before bedtime"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isEditing ? 'Update Medicine' : 'Add Medicine'}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};