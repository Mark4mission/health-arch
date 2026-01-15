export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  job: string;
  height: number; // Added
  weight: number; // Added
  bmi: number;
  waist: number;
  history: string;
  habits: {
    smoking: string;
    drinking: string;
    exercise: string;
    sleep: string;
    work: string;
  };
}

export interface HealthMetric {
  label: string;
  value: string | number;
  unit: string;
  status: 'Normal' | 'Caution' | 'Warning' | 'Critical';
  reference?: string;
}

export interface DiseaseRisk {
  condition: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  description: string;
}

export interface DailyRoutineItem {
  time: string;
  activity: string;
  advice: string;
  icon: 'coffee' | 'moon' | 'sun' | 'briefcase' | 'dumbbell' | 'utensils';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface MedicalDocument {
  id: string;
  name: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  dataUrl: string; // Base64 encoded file data
}

export interface MedicalVisit {
  id: string;
  date: string;
  facilityName: string;
  facilityType: 'hospital' | 'clinic' | 'pharmacy';
  department?: string;
  symptoms: string;
  diagnosis: string;
  prescription?: string;
  cost: number;
  notes?: string;
  documents: MedicalDocument[];
}

export enum TabOption {
  DASHBOARD = 'DASHBOARD',
  PLAN = 'PLAN',
  ADVISOR = 'ADVISOR',
  REPORT = 'REPORT',
  UPDATE = 'UPDATE',
  MEDICAL_RECORDS = 'MEDICAL_RECORDS'
}

export interface HealthContextType {
  profile: UserProfile;
  metrics: HealthMetric[];
  risks: DiseaseRisk[];
  routine: DailyRoutineItem[];
  medicalVisits: MedicalVisit[];
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  updateMetric: (label: string, newValue: string | number) => void;
  recalculateBMI: (heightCm: number, weightKg: number) => void;
  resetData: () => void;
  addMedicalVisit: (visit: Omit<MedicalVisit, 'id'>) => void;
  updateMedicalVisit: (id: string, updates: Partial<MedicalVisit>) => void;
  deleteMedicalVisit: (id: string) => void;
}
