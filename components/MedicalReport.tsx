import React from 'react';
import { useHealth } from '../contexts/HealthContext';
import { AlertTriangle, Info } from 'lucide-react';

const MedicalReport: React.FC = () => {
  const { risks, profile } = useHealth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2">
        {risks.map((risk, idx) => (
          <div key={idx} className={`p-5 rounded-xl border-l-4 shadow-sm bg-white ${
            risk.riskLevel === 'High' ? 'border-l-red-500' : 
            risk.riskLevel === 'Moderate' ? 'border-l-orange-500' : 'border-l-teal-500'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-800 text-lg">{risk.condition}</h3>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                risk.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                risk.riskLevel === 'Moderate' ? 'bg-orange-100 text-orange-700' : 'bg-teal-100 text-teal-700'
              }`}>
                {risk.riskLevel === 'High' ? '위험' : risk.riskLevel === 'Moderate' ? '주의' : '양호'}
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {risk.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 text-slate-200 p-6 rounded-xl mt-8">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Info className="text-blue-400" />
          의사 소견 요약
        </h3>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>심뇌혈관 나이는 <strong>44세</strong>로 실제 나이(50세)보다 젊습니다. 기본적인 신체 활력도는 좋습니다.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>하지만 <strong>위궤양</strong>과 <strong>장상피화생</strong>은 생활습관병입니다. 식습관 교정이 없으면 약물 치료 효과가 떨어집니다.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>현재 목표: BMI를 25 이하로 유지(현재: {profile.bmi})하고, 발바닥에 무리를 주지 않으면서 체지방 3%를 감량하세요.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MedicalReport;
