import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile, HealthMetric, DiseaseRisk, DailyRoutineItem, HealthContextType, MedicalVisit } from '../types';
import { USER_PROFILE, KEY_METRICS, RISKS, ROUTINE_PLAN } from '../constants';

const HealthContext = createContext<HealthContextType | undefined>(undefined);
const STORAGE_KEY = 'health_arch_data_v1';

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available, otherwise use constants
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).profile : USER_PROFILE;
  });

  const [metrics, setMetrics] = useState<HealthMetric[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).metrics : KEY_METRICS;
  });

  const [risks, setRisks] = useState<DiseaseRisk[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).risks : RISKS;
  });

  const [routine, setRoutine] = useState<DailyRoutineItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).routine : ROUTINE_PLAN;
  });

  const [medicalVisits, setMedicalVisits] = useState<MedicalVisit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved).medicalVisits || []) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    const dataToSave = {
      profile,
      metrics,
      risks,
      routine,
      medicalVisits
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [profile, metrics, risks, routine, medicalVisits]);

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  const updateMetric = (label: string, newValue: string | number) => {
    setMetrics(prevMetrics => {
      // Check if metric exists
      const exists = prevMetrics.some(m => m.label === label);
      
      const newMetricBase = {
          label,
          value: newValue,
          unit: getUnitForMetric(label),
          reference: getReferenceForMetric(label),
          status: calculateStatus(label, newValue) as any
      };

      if (exists) {
        return prevMetrics.map(metric => {
          if (metric.label === label) {
            return { 
                ...metric, 
                value: newValue, 
                status: calculateStatus(label, newValue) as any
            };
          }
          return metric;
        });
      } else {
        // Add new metric if it doesn't exist
        return [...prevMetrics, newMetricBase];
      }
    });
  };

  const recalculateBMI = (heightCm: number, weightKg: number) => {
    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    // Important: Update weight and height in profile as well as BMI
    updateProfile({ bmi, weight: weightKg, height: heightCm });
    updateMetric('BMI', bmi);
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(USER_PROFILE);
    setMetrics(KEY_METRICS);
    setRisks(RISKS);
    setRoutine(ROUTINE_PLAN);
    setMedicalVisits([]);
  };

  const addMedicalVisit = (visit: Omit<MedicalVisit, 'id'>) => {
    const newVisit: MedicalVisit = {
      ...visit,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setMedicalVisits(prev => [newVisit, ...prev]);
  };

  const updateMedicalVisit = (id: string, updates: Partial<MedicalVisit>) => {
    setMedicalVisits(prev =>
      prev.map(visit => visit.id === id ? { ...visit, ...updates } : visit)
    );
  };

  const deleteMedicalVisit = (id: string) => {
    setMedicalVisits(prev => prev.filter(visit => visit.id !== id));
  };

  return (
    <HealthContext.Provider value={{
      profile,
      metrics,
      risks,
      routine,
      medicalVisits,
      updateProfile,
      updateMetric,
      recalculateBMI,
      resetData,
      addMedicalVisit,
      updateMedicalVisit,
      deleteMedicalVisit
    }}>
      {children}
    </HealthContext.Provider>
  );
};

// Helper functions for logic
function getUnitForMetric(label: string) {
    if (label.includes('Blood Pressure')) return 'mmHg';
    if (label.includes('LDL')) return 'mg/dL';
    return '';
}

function getReferenceForMetric(label: string) {
    if (label.includes('Blood Pressure')) return '< 120/80';
    if (label.includes('LDL')) return '< 130';
    return '';
}

function calculateStatus(label: string, val: string | number): string {
    const numVal = Number(val);
    
    if (label === 'BMI') {
        if (numVal < 23) return 'Normal';
        if (numVal < 25) return 'Caution';
        return 'Warning';
    }
    if (label === 'Fasting Glucose') {
        if (numVal < 100) return 'Normal';
        if (numVal < 126) return 'Caution';
        return 'Warning';
    }
    if (label === 'Liver (ALT)') {
        if (numVal <= 35) return 'Normal';
        if (numVal <= 45) return 'Caution';
        return 'Warning';
    }
    if (label === 'Waist') {
        if (numVal < 90) return 'Normal';
        return 'Caution';
    }
    if (label === 'LDL Cholesterol') {
        if (numVal < 130) return 'Normal';
        if (numVal < 160) return 'Caution';
        return 'Warning';
    }
    if (label === 'Blood Pressure') {
        // Format "120/80"
        if (typeof val === 'string' && val.includes('/')) {
            const [sys, dia] = val.split('/').map(Number);
            if (sys < 120 && dia < 80) return 'Normal';
            if (sys < 140 || dia < 90) return 'Caution';
            return 'Warning';
        }
    }
    return 'Normal';
}

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
