import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MedicineList } from './components/MedicineList';
import { AddMedicine } from './components/AddMedicine';
import { ReminderPopup } from './components/ReminderPopup';
import { NotificationPermission } from './components/NotificationPermission';
import { Medicine, MedicineLog } from './types/medicine';
import { Patient } from './types/patient';
import { saveMedicines, loadMedicines, saveLogs, loadLogs } from './utils/storage';
import { savePatient, loadPatient, clearPatient } from './utils/patientStorage';
import { getTodayString, getCurrentTime } from './utils/dateUtils';
import { useReminders } from './hooks/useReminders';

function App() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'medicines' | 'add'>('dashboard');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [logs, setLogs] = useState<MedicineLog[]>([]);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | undefined>();
  
  // Use the reminders hook
  const { pendingReminder, snoozeReminder, dismissReminder, notificationPermission } = useReminders(medicines, logs);

  // Load data on component mount
  useEffect(() => {
    const loadedPatient = loadPatient();
    const loadedMedicines = loadMedicines();
    const loadedLogs = loadLogs();
    setPatient(loadedPatient);
    setMedicines(loadedMedicines);
    setLogs(loadedLogs);
  }, []);

  // Save patient whenever it changes
  useEffect(() => {
    if (patient) {
      savePatient(patient);
    }
  }, [patient]);

  // Save medicines whenever they change
  useEffect(() => {
    saveMedicines(medicines);
  }, [medicines]);

  // Save logs whenever they change
  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  const handleLogin = (patientData: Patient) => {
    setPatient(patientData);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? This will clear all your data.')) {
      clearPatient();
      setPatient(null);
      setMedicines([]);
      setLogs([]);
      setCurrentView('dashboard');
    }
  };

  const handleSaveMedicine = (medicineData: Omit<Medicine, 'id'>) => {
    if (editingMedicine) {
      // Update existing medicine
      setMedicines(prev => prev.map(med => 
        med.id === editingMedicine.id 
          ? { ...medicineData, id: editingMedicine.id }
          : med
      ));
      setEditingMedicine(undefined);
    } else {
      // Add new medicine
      const newMedicine: Medicine = {
        ...medicineData,
        id: Date.now().toString()
      };
      setMedicines(prev => [...prev, newMedicine]);
    }
    setCurrentView('medicines');
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setCurrentView('add');
  };

  const handleDeleteMedicine = (medicineId: string) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(prev => prev.filter(med => med.id !== medicineId));
      // Also remove associated logs
      setLogs(prev => prev.filter(log => log.medicineId !== medicineId));
    }
  };

  const handleLogMedicine = (medicineId: string, time: string, taken: boolean) => {
    const newLog: MedicineLog = {
      id: Date.now().toString(),
      medicineId,
      date: getTodayString(),
      time,
      taken,
      timestamp: Date.now()
    };
    
    setLogs(prev => {
      // Remove any existing log for the same medicine, date, and time
      const filtered = prev.filter(log => 
        !(log.medicineId === medicineId && log.date === newLog.date && log.time === time)
      );
      return [...filtered, newLog];
    });
  };

  const handleCancelAddMedicine = () => {
    setEditingMedicine(undefined);
    setCurrentView('medicines');
  };

  const handleTakeFromPopup = () => {
    if (pendingReminder) {
      handleLogMedicine(pendingReminder.medicine.id, pendingReminder.time, true);
      dismissReminder();
    }
  };

  const handleSkipFromPopup = () => {
    if (pendingReminder) {
      handleLogMedicine(pendingReminder.medicine.id, pendingReminder.time, false);
      dismissReminder();
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  // Show login screen if no patient is logged in
  if (!patient) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header patient={patient} currentView={currentView} onViewChange={setCurrentView} />
      
      <main>
        {currentView === 'dashboard' && (
          <>
            <div className="max-w-6xl mx-auto px-4 pt-6">
              <NotificationPermission 
                permission={notificationPermission}
                onRequestPermission={requestNotificationPermission}
              />
            </div>
            <Dashboard 
              patient={patient}
              medicines={medicines}
              logs={logs}
              onLogMedicine={handleLogMedicine}
              onLogout={handleLogout}
            />
          </>
        )}
        
        {currentView === 'medicines' && (
          <MedicineList 
            medicines={medicines}
            onEditMedicine={handleEditMedicine}
            onDeleteMedicine={handleDeleteMedicine}
          />
        )}
        
        {currentView === 'add' && (
          <AddMedicine 
            medicine={editingMedicine}
            onSave={handleSaveMedicine}
            onCancel={handleCancelAddMedicine}
          />
        )}
      </main>
      
      {/* Reminder Popup */}
      {pendingReminder && (
        <ReminderPopup
          medicine={pendingReminder.medicine}
          time={pendingReminder.time}
          onTake={handleTakeFromPopup}
          onSkip={handleSkipFromPopup}
          onSnooze={snoozeReminder}
          onClose={dismissReminder}
        />
      )}
    </div>
  );
}

export default App;