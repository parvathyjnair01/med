import { Medicine, MedicineLog } from '../types/medicine';

const MEDICINES_KEY = 'medicine-reminder-medicines';
const LOGS_KEY = 'medicine-reminder-logs';

export const saveMedicines = (medicines: Medicine[]): void => {
  localStorage.setItem(MEDICINES_KEY, JSON.stringify(medicines));
};

export const loadMedicines = (): Medicine[] => {
  const stored = localStorage.getItem(MEDICINES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveLogs = (logs: MedicineLog[]): void => {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const loadLogs = (): MedicineLog[] => {
  const stored = localStorage.getItem(LOGS_KEY);
  return stored ? JSON.parse(stored) : [];
};