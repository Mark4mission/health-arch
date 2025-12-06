import React from 'react';
import { useHealth } from '../contexts/HealthContext';
import { Briefcase, Coffee, Dumbbell, Moon, Sun, Utensils, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { DailyRoutineItem } from '../types';

const IconMap = {
  sun: Sun,
  coffee: Coffee,
  briefcase: Briefcase,
  utensils: Utensils,
  dumbbell: Dumbbell,
  moon: Moon
};

const LifestylePlan: React.FC = () => {
  const { routine } = useHealth();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Priority Actions */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
        <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-4">
          <CheckCircle2 className="text-indigo-600" />
          최상일님을 위한 3가지 핵심 실천 사항
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2">1. 야식 절대 금지</h4>
            <p className="text-sm text-slate-600">
              <strong>위염과 위궤양</strong> 회복을 위해 가장 중요합니다. 취침 3~4시간 전 공복 상태를 유지해야 위가 쉴 수 있습니다.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2">2. 저강도 유산소 운동</h4>
            <p className="text-sm text-slate-600">
              <strong>족저근막염</strong> 보호가 우선입니다. 트레드밀 러닝 대신 실내 자전거 또는 수영을 하세요. 발바닥 충격을 최소화해야 합니다.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2">3. 이상지질혈증 관리</h4>
            <p className="text-sm text-slate-600">
              기름진 고기 섭취를 줄이세요. 체중을 5kg 감량하면 콜레스테롤과 간 수치가 자연스럽게 좋아집니다.
            </p>
          </div>
        </div>
      </div>

      {/* Daily Routine Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="text-teal-600" />
          맞춤형 데일리 루틴 (바쁜 일정 고려)
        </h3>
        
        <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
          {routine.map((item: DailyRoutineItem, idx) => {
            const Icon = IconMap[item.icon];
            return (
              <div key={idx} className="relative pl-8">
                <div className="absolute -left-[9px] top-0 bg-white border-2 border-teal-500 rounded-full p-1">
                  <Icon size={14} className="text-teal-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-600 tracking-wide uppercase">{item.time}</span>
                  <h4 className="text-md font-bold text-slate-800 mt-1">{item.activity}</h4>
                  <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-900">조언: </span>
                    {item.advice}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warning Section */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-4 items-start">
        <AlertCircle className="text-orange-500 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-orange-800">필수 의료 관리 사항</h4>
          <p className="text-sm text-orange-700 mt-1">
            결과지에 <strong>장상피화생(Intestinal Metaplasia)</strong> 소견이 있습니다. 이는 위 점막이 장 점막처럼 변한 상태로, 위암 발생 위험을 높일 수 있습니다.
            <strong>매 1-2년 위내시경 검사</strong>가 필수입니다. 흡연은 절대 금물이며, 맵고 짠 국물 음식 섭취를 엄격히 제한하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LifestylePlan;
