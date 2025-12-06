import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { useHealth } from '../contexts/HealthContext';
import { Activity, AlertTriangle, Heart, UserCheck } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { profile, metrics } = useHealth();
  
  // Extract dynamic values for the chart
  const glucoseVal = Number(metrics.find(m => m.label === 'Fasting Glucose')?.value) || 0;
  const altVal = Number(metrics.find(m => m.label === 'Liver (ALT)')?.value) || 0;

  const chartData = [
    { name: 'BMI', value: profile.bmi, limit: 25, unit: 'kg/m²' },
    { name: 'Waist', value: profile.waist, limit: 90, unit: 'cm' },
    { name: 'ALT (간)', value: altVal, limit: 35, unit: 'IU/L' },
    { name: '공복혈당', value: glucoseVal, limit: 100, unit: 'mg/dL' },
  ];

  const getBarColor = (val: number, limit: number) => {
    return val > limit ? '#ef4444' : '#0f766e';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-full">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">체질량 지수 (BMI)</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-slate-800">{profile.bmi}</p>
              {profile.bmi > 25 && <span className="text-xs font-normal text-orange-500">(과체중)</span>}
              {profile.bmi <= 25 && <span className="text-xs font-normal text-green-500">(정상)</span>}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-700 rounded-full">
            <Heart size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">심혈관 위험도</p>
            <p className="text-xl font-bold text-slate-800">높음 (High)</p>
            <p className="text-xs text-slate-400">이상지질혈증 관리필요</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-700 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">위장 건강</p>
            <p className="text-xl font-bold text-slate-800">경고 (Warning)</p>
            <p className="text-xs text-slate-400">위궤양/장상피화생</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">간 기능 (ALT)</p>
            <p className="text-xl font-bold text-slate-800">
               {altVal > 35 ? '주의 단계' : '정상'}
            </p>
            <p className="text-xs text-slate-400">수치: {altVal}</p>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">주요 건강 지표 vs 정상 범위</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <ReferenceLine x={0} stroke="#000" />
                <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.value, entry.limit)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 text-sm justify-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-700"></span>
              <span>정상 범위</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>관리 필요</span>
            </div>
          </div>
        </div>

        {/* Quick Metrics Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold text-slate-800">상세 수치</h3>
           </div>
           <div className="overflow-y-auto max-h-64 space-y-3">
             {metrics.map((metric, idx) => (
               <div key={idx} className="flex justify-between items-center border-b border-slate-50 last:border-0 pb-2">
                 <div>
                   <p className="text-sm font-medium text-slate-700">{metric.label}</p>
                   <p className="text-xs text-slate-400">목표: {metric.reference}</p>
                 </div>
                 <div className="text-right">
                   <p className={`font-mono font-bold ${
                     metric.status === 'Normal' ? 'text-teal-600' : 
                     metric.status === 'Caution' ? 'text-orange-500' : 'text-red-500'
                   }`}>
                     {metric.value}
                   </p>
                   <p className="text-xs text-slate-400">{metric.unit}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
