import React, { useState, useEffect } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { Save, RefreshCw, Activity, Scale, HeartPulse, RotateCcw } from 'lucide-react';

const HealthUpdateForm: React.FC = () => {
  const { profile, metrics, updateProfile, updateMetric, recalculateBMI, resetData } = useHealth();
  
  // Helper to safely get metric values
  const getMetricVal = (label: string, defaultVal: number | string) => {
    const m = metrics.find(m => m.label === label);
    return m ? m.value : defaultVal;
  };

  // Helper to parse BP
  const getInitialBP = () => {
    const bpStr = getMetricVal('Blood Pressure', '114/62') as string;
    if (bpStr && bpStr.includes('/')) {
      const parts = bpStr.split('/');
      return { sys: Number(parts[0]), dia: Number(parts[1]) };
    }
    return { sys: 114, dia: 62 };
  };

  // State Initialization - Pulling strictly from Context (profile/metrics)
  const [weight, setWeight] = useState(profile.weight); 
  const [height] = useState(profile.height); 
  const [waist, setWaist] = useState(profile.waist);
  
  const [glucose, setGlucose] = useState(Number(getMetricVal('Fasting Glucose', 77)));
  const [liverALT, setLiverALT] = useState(Number(getMetricVal('Liver (ALT)', 39)));
  
  const initialBP = getInitialBP();
  const [bpSystolic, setBpSystolic] = useState(initialBP.sys);
  const [bpDiastolic, setBpDiastolic] = useState(initialBP.dia);
  
  const [ldl, setLdl] = useState(Number(getMetricVal('LDL Cholesterol', 130))); 

  const [isSaved, setIsSaved] = useState(false);

  // Sync state if context changes externally (e.g., reset)
  useEffect(() => {
    setWeight(profile.weight);
    setWaist(profile.waist);
    setGlucose(Number(getMetricVal('Fasting Glucose', 77)));
    setLiverALT(Number(getMetricVal('Liver (ALT)', 39)));
    setLdl(Number(getMetricVal('LDL Cholesterol', 130)));
    
    const bp = getInitialBP();
    setBpSystolic(bp.sys);
    setBpDiastolic(bp.dia);
  }, [profile, metrics]);

  const handleSave = () => {
    // 1. Update Profile Biometrics (Recalculate BMI and save Weight/Height)
    recalculateBMI(height, weight);
    updateProfile({ waist: Number(waist) });
    
    // 2. Update Metrics
    updateMetric('Waist', waist);
    updateMetric('Fasting Glucose', glucose);
    updateMetric('Liver (ALT)', liverALT);
    updateMetric('Blood Pressure', `${bpSystolic}/${bpDiastolic}`);
    updateMetric('LDL Cholesterol', ldl);
    
    // Show feedback
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if(window.confirm("모든 데이터를 초기 검진 결과 상태로 되돌리시겠습니까?")) {
      resetData();
    }
  };

  const inputClass = "w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder-slate-400";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <RefreshCw size={20} className="text-teal-600" />
              건강 데이터 수정 (Update Data)
            </h3>
            <p className="text-sm text-slate-500">최신 측정값을 입력하면 대시보드가 자동으로 업데이트됩니다.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              title="초기값으로 복구"
            >
              <RotateCcw size={18} />
              <span className="hidden md:inline">초기화</span>
            </button>
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors shadow-sm ${
                  isSaved ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              <Save size={18} />
              {isSaved ? '저장 완료!' : '변경사항 저장'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Biometrics Section */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Scale size={18} className="text-orange-500" />
              체성분 (Body Composition)
            </h4>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>체중 (Weight, kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>허리 둘레 (Waist, cm)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={waist}
                  onChange={(e) => setWaist(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-500 border border-slate-200">
                현재 BMI: <span className="font-bold text-slate-800">{profile.bmi}</span>
                {profile.bmi > 25 && <span className="text-orange-500 ml-2 font-semibold">(과체중)</span>}
                {profile.bmi <= 23 && <span className="text-teal-600 ml-2 font-semibold">(정상)</span>}
              </div>
            </div>
          </div>

          {/* Vitals Section */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Activity size={18} className="text-teal-500" />
              혈액 검사 (Blood Test)
            </h4>
            <div className="space-y-4">
               <div>
                <label className={labelClass}>공복 혈당 (Glucose, mg/dL)</label>
                <input 
                  type="number" 
                  value={glucose}
                  onChange={(e) => setGlucose(Number(e.target.value))}
                  className={inputClass}
                />
                <p className="text-xs text-slate-400 mt-1">목표: &lt; 100 mg/dL</p>
              </div>
              <div>
                <label className={labelClass}>간 수치 (ALT, IU/L)</label>
                <input 
                  type="number" 
                  value={liverALT}
                  onChange={(e) => setLiverALT(Number(e.target.value))}
                  className={inputClass}
                />
                <p className="text-xs text-slate-400 mt-1">목표: &lt; 35 IU/L</p>
              </div>
            </div>
          </div>

          {/* Cardiovascular Section */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              <HeartPulse size={18} className="text-red-500" />
              심혈관 건강 (Cardio)
            </h4>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className={labelClass}>혈압 (수축기)</label>
                  <input 
                    type="number" 
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(Number(e.target.value))}
                    className={inputClass}
                    placeholder="120"
                  />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>혈압 (이완기)</label>
                  <input 
                    type="number" 
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(Number(e.target.value))}
                    className={inputClass}
                    placeholder="80"
                  />
                </div>
              </div>
              
              <div>
                <label className={labelClass}>LDL 콜레스테롤 (mg/dL)</label>
                <input 
                  type="number" 
                  value={ldl}
                  onChange={(e) => setLdl(Number(e.target.value))}
                  className={inputClass}
                  placeholder="입력 필요"
                />
                <p className="text-xs text-slate-400 mt-1">목표: &lt; 130 (위험군 100)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
        <Activity className="text-blue-600 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-blue-800">업데이트 효과</h4>
          <p className="text-sm text-blue-700 mt-1">
            체중, 혈당, 콜레스테롤 수치를 업데이트하면 <strong>대시보드</strong>의 위험도 그래프가 실시간으로 변경됩니다.
            또한, <strong>AI 상담사</strong>가 새로운 수치를 바탕으로 더 정확한 식단과 운동법을 제안해 줍니다.
            데이터는 브라우저에 자동 저장되어 다음에 접속해도 유지됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthUpdateForm;
