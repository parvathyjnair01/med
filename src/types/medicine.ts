export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice-daily' | 'three-times-daily' | 'weekly';
  times: string[];
  startDate: string;
  endDate?: string;
  instructions?: string;
  color: string;
}

export interface MedicineLog {
  id: string;
  medicineId: string;
  date: string;
  time: string;
  taken: boolean;
  timestamp: number;
}