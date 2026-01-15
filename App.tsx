import React, { useState } from 'react';
import { TabOption } from './types';
import Dashboard from './components/Dashboard';
import LifestylePlan from './components/LifestylePlan';
import GeminiAdvisor from './components/GeminiAdvisor';
import MedicalReport from './components/MedicalReport';
import HealthUpdateForm from './components/HealthUpdateForm';
import MedicalRecords from './components/MedicalRecords';
import { LayoutDashboard, ClipboardList, Stethoscope, MessageSquareText, Menu, X, Settings2, FileText } from 'lucide-react';
import { HealthProvider, useHealth } from './contexts/HealthContext';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile } = useHealth();

  const renderContent = () => {
    switch (activeTab) {
      case TabOption.DASHBOARD: return <Dashboard />;
      case TabOption.PLAN: return <LifestylePlan />;
      case TabOption.REPORT: return <MedicalReport />;
      case TabOption.ADVISOR: return <GeminiAdvisor />;
      case TabOption.UPDATE: return <HealthUpdateForm />;
      case TabOption.MEDICAL_RECORDS: return <MedicalRecords />;
      default: return <Dashboard />;
    }
  };

  const NavItem = ({ tab, label, icon: Icon }: { tab: TabOption, label: string, icon: any }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200 ${
        activeTab === tab 
          ? 'bg-teal-700 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-teal-700'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <h1 className="text-xl font-bold text-teal-800">HealthArchitect</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-teal-800 flex items-center gap-2">
            <Stethoscope className="text-secondary" />
            Health<span className="text-slate-800">Arch</span>
          </h1>
          <p className="text-xs text-slate-400 mt-2">Personalized Health Engine</p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                CS
              </div>
              <div>
                <p className="font-bold text-slate-800">{profile.name}</p>
                <p className="text-xs text-slate-500">{profile.age}세 • 항공사 사무직</p>
              </div>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 w-3/4" title="Overall Risk Score"></div>
            </div>
            <p className="text-xs text-right text-orange-500 mt-1 font-medium">관리 필요 (Attention Needed)</p>
          </div>

          <nav className="space-y-2">
            <NavItem tab={TabOption.DASHBOARD} label="대시보드 (Overview)" icon={LayoutDashboard} />
            <NavItem tab={TabOption.UPDATE} label="데이터 수정 (Update)" icon={Settings2} />
            <NavItem tab={TabOption.MEDICAL_RECORDS} label="진료 기록 (Records)" icon={FileText} />
            <NavItem tab={TabOption.REPORT} label="의학 분석 (Report)" icon={Stethoscope} />
            <NavItem tab={TabOption.PLAN} label="실천 계획 (Plan)" icon={ClipboardList} />
            <NavItem tab={TabOption.ADVISOR} label="AI 상담 (Advisor)" icon={MessageSquareText} />
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            Last checkup: 2025-11-03
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              {activeTab === TabOption.DASHBOARD && "건강 대시보드"}
              {activeTab === TabOption.UPDATE && "건강 지표 업데이트"}
              {activeTab === TabOption.MEDICAL_RECORDS && "진료 및 처방 기록"}
              {activeTab === TabOption.PLAN && "맞춤형 실천 계획"}
              {activeTab === TabOption.REPORT && "상세 의료 분석 보고서"}
              {activeTab === TabOption.ADVISOR && "AI 닥터 상담"}
            </h2>
            <p className="text-slate-500 mt-1">
              {activeTab === TabOption.DASHBOARD && "최근 검진 결과를 바탕으로 한 건강 상태 요약입니다."}
              {activeTab === TabOption.UPDATE && "새로운 측정값을 입력하여 프로필을 최신 상태로 유지하세요."}
              {activeTab === TabOption.MEDICAL_RECORDS && "병원, 의원, 약국 방문 기록을 관리하세요."}
              {activeTab === TabOption.PLAN && "바쁜 일상 속에서 실천 가능한 구체적인 행동 가이드입니다."}
              {activeTab === TabOption.REPORT && "질환 위험도와 검사 결과에 대한 심층 분석입니다."}
              {activeTab === TabOption.ADVISOR && "나의 건강 데이터를 알고 있는 AI와 상담해보세요."}
            </p>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-0 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HealthProvider>
      <MainContent />
    </HealthProvider>
  );
};

export default App;
