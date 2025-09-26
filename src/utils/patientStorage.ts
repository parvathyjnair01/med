import { Patient } from '../types/patient';

const PATIENT_KEY = 'medicine-reminder-patient';
const CURRENT_PATIENT_KEY = 'medicine-reminder-current-patient';

export const savePatient = (patient: Patient): void => {
  localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));
  localStorage.setItem(CURRENT_PATIENT_KEY, patient.id);
};

export const loadPatient = (): Patient | null => {
  const stored = localStorage.getItem(PATIENT_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const getCurrentPatientId = (): string | null => {
  return localStorage.getItem(CURRENT_PATIENT_KEY);
};

export const clearPatient = (): void => {
  localStorage.removeItem(PATIENT_KEY);
  localStorage.removeItem(CURRENT_PATIENT_KEY);
};