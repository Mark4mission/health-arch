import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, HealthMetric, DiseaseRisk, DailyRoutineItem, HealthContextType } from '../types';
import { USER_PROFILE, KEY_METRICS, RISKS, ROUTINE_PLAN } from '../constants';

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(USER_PROFILE);
  const [metrics, setMetrics] = useState<HealthMetric[]>(KEY_METRICS);
  const [risks, setRisks] = useState<DiseaseRisk[]>(RISKS);
  const [routine, setRoutine] = useState<DailyRoutineItem[]>(ROUTINE_PLAN);

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
    updateProfile({ bmi });
    updateMetric('BMI', bmi);
  };

  return (
    <HealthContext.Provider value={{ 
      profile, 
      metrics, 
      risks, 
      routine, 
      updateProfile, 
      updateMetric,
      recalculateBMI
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
