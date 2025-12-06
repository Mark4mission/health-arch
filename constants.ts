import { HealthMetric, DiseaseRisk, DailyRoutineItem } from './types';

// Data extracted from the provided OCR and user prompt
export const USER_PROFILE = {
  name: "Choi Sang-il",
  age: 50,
  gender: "Male",
  job: "Airline Employee (Office)",
  bmi: 25.8, // 173.8cm, 77.8kg
  waist: 87.0,
  history: "Plantar Fasciitis, Gastritis, Benign Gastric Ulcer",
  habits: {
    smoking: "Past smoker",
    drinking: "Rarely (1/month)", // User prompt overrides OCR high-risk flag which might be historical or error
    exercise: "Gym 1-2 times/week (limited by foot pain)",
    sleep: "01:00 AM - 07:00 AM (Late snacks)",
    work: "08:00 - 20:00 (Sedentary)"
  }
};

export const KEY_METRICS: HealthMetric[] = [
  { label: 'BMI', value: 25.8, unit: 'kg/m²', status: 'Caution', reference: 'Overweight' },
  { label: 'Waist', value: 87.0, unit: 'cm', status: 'Caution', reference: '< 90' },
  { label: 'Blood Pressure', value: '114/62', unit: 'mmHg', status: 'Normal', reference: '< 120/80' },
  { label: 'Fasting Glucose', value: 77, unit: 'mg/dL', status: 'Normal', reference: '< 100' },
  { label: 'LDL Cholesterol', value: 'N/A', unit: 'mg/dL', status: 'Warning', reference: 'Dyslipidemia Suspected' },
  { label: 'Liver (ALT)', value: 39, unit: 'IU/L', status: 'Caution', reference: '< 35' },
];

export const RISKS: DiseaseRisk[] = [
  { 
    condition: 'Gastric Issues', 
    riskLevel: 'High', 
    description: 'Diagnosis of Gastritis, Benign Ulcer, & Intestinal Metaplasia. Requires strict dietary control.' 
  },
  { 
    condition: 'Dyslipidemia', 
    riskLevel: 'High', 
    description: 'Marked as "Requires Management" in report. High risk factor for CV disease.' 
  },
  { 
    condition: 'Plantar Fasciitis', 
    riskLevel: 'Moderate', 
    description: 'Recurring pain limits high-impact cardio. Needs low-impact alternatives.' 
  },
  { 
    condition: 'Liver Function', 
    riskLevel: 'Moderate', 
    description: 'ALT is slightly elevated. Related to weight/visceral fat rather than alcohol.' 
  }
];

export const ROUTINE_PLAN: DailyRoutineItem[] = [
  {
    time: '07:30',
    activity: 'Morning Commute',
    advice: 'Park further away or walk briskly. Wear supportive shoes/inserts for Plantar Fasciitis.',
    icon: 'sun'
  },
  {
    time: '08:00 - 12:00',
    activity: 'Deep Work',
    advice: 'Use a standing desk for 20 mins every 2 hours if possible to aid metabolism.',
    icon: 'briefcase'
  },
  {
    time: '12:00',
    activity: 'Lunch & Coffee',
    advice: 'Avoid spicy/salty soups (Gastritis). Limit coffee to 1 cup (Ulcer irritant).',
    icon: 'utensils'
  },
  {
    time: '19:00',
    activity: 'Gym (1-2x/week)',
    advice: 'Focus: Stationary Bike/Swimming (No impact). Upper body weights. Avoid treadmill running.',
    icon: 'dumbbell'
  },
  {
    time: '22:00',
    activity: 'Evening Wind-down',
    advice: 'CRITICAL: No food 3 hours before sleep. Replace late snack with warm chamomile tea.',
    icon: 'moon'
  }
];

export const SYSTEM_INSTRUCTION = `
You are an expert medical health and lifestyle coach. You are analyzing the health profile of Mr. Choi (50M).
Profile:
- Job: Airline office worker (8am-8pm), Sedentary.
- Medical: BMI 25.8 (Overweight), Waist 87cm.
- Diagnoses: Gastritis, Benign Gastric Ulcer, Intestinal Metaplasia, Dyslipidemia, Plantar Fasciitis history.
- Habits: Late sleeper (1am), late night snacks, busy schedule (PhD, work, church), budget conscious.
- Constraints: Cannot do high impact running due to foot pain.

Your goal is to provide empathetic, realistic, and medically sound advice.
Focus on:
1. Gastritis management (dietary timing, avoiding irritants).
2. Low-impact weight loss (essential for liver/lipids and reducing foot load).
3. Time-efficient habits for a busy professional.

Keep answers concise, encouraging, and actionable.
`;
