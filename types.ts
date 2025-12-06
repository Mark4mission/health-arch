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

export enum TabOption {
  DASHBOARD = 'DASHBOARD',
  PLAN = 'PLAN',
  ADVISOR = 'ADVISOR',
  REPORT = 'REPORT',
  UPDATE = 'UPDATE'
}

export interface HealthContextType {
  profile: UserProfile;
  metrics: HealthMetric[];
  risks: DiseaseRisk[];
  routine: DailyRoutineItem[];
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  updateMetric: (label: string, newValue: string | number) => void;
  recalculateBMI: (heightCm: number, weightKg: number) => void;
  resetData: () => void;
}
