import React, { useState } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { MedicalVisit } from '../types';
import { FileText, Plus, Calendar, MapPin, DollarSign, Trash2, Edit, Download, ChevronDown, ChevronUp, Building2, Pill } from 'lucide-react';
import MedicalVisitForm from './MedicalVisitForm';

const MedicalRecords: React.FC = () => {
  const { medicalVisits, deleteMedicalVisit } = useHealth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<MedicalVisit | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'hospital' | 'clinic' | 'pharmacy'>('all');

  const filteredVisits = filterType === 'all'
    ? medicalVisits
    : medicalVisits.filter(visit => visit.facilityType === filterType);

  const totalCost = medicalVisits.reduce((sum, visit) => sum + visit.cost, 0);

  const handleEdit = (visit: MedicalVisit) => {
    setEditingVisit(visit);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('이 기록을 삭제하시겠습니까?')) {
      deleteMedicalVisit(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVisit(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Building2 className="w-5 h-5" />;
      case 'clinic': return <Building2 className="w-5 h-5 opacity-70" />;
      case 'pharmacy': return <Pill className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const getFacilityColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-red-100 text-red-700';
      case 'clinic': return 'bg-blue-100 text-blue-700';
      case 'pharmacy': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFacilityTypeText = (type: string) => {
    switch (type) {
      case 'hospital': return '병원';
      case 'clinic': return '의원';
      case 'pharmacy': return '약국';
      default: return '';
    }
  };

  const downloadDocument = (doc: any) => {
    const link = document.createElement('a');
    link.href = doc.dataUrl;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">진료 및 처방 기록</h1>
            <p className="text-gray-600 mt-2">병원, 의원, 약국 방문 기록을 관리하세요</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            새 기록 추가
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-teal-500">
            <div className="text-sm text-gray-600 mb-1">총 방문 횟수</div>
            <div className="text-2xl font-bold text-gray-900">{medicalVisits.length}회</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-1">병원</div>
            <div className="text-2xl font-bold text-gray-900">
              {medicalVisits.filter(v => v.facilityType === 'hospital').length}회
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-1">의원/약국</div>
            <div className="text-2xl font-bold text-gray-900">
              {medicalVisits.filter(v => v.facilityType === 'clinic' || v.facilityType === 'pharmacy').length}회
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="text-sm text-gray-600 mb-1">총 비용</div>
            <div className="text-2xl font-bold text-gray-900">{totalCost.toLocaleString()}원</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            전체 ({medicalVisits.length})
          </button>
          <button
            onClick={() => setFilterType('hospital')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'hospital'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            병원 ({medicalVisits.filter(v => v.facilityType === 'hospital').length})
          </button>
          <button
            onClick={() => setFilterType('clinic')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'clinic'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            의원 ({medicalVisits.filter(v => v.facilityType === 'clinic').length})
          </button>
          <button
            onClick={() => setFilterType('pharmacy')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'pharmacy'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            약국 ({medicalVisits.filter(v => v.facilityType === 'pharmacy').length})
          </button>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredVisits.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">기록이 없습니다</h3>
            <p className="text-gray-600 mb-6">새 진료 기록을 추가해보세요</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              새 기록 추가
            </button>
          </div>
        ) : (
          filteredVisits.map(visit => {
            const isExpanded = expandedId === visit.id;
            return (
              <div key={visit.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Collapsed View */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${getFacilityColor(visit.facilityType)}`}>
                          {getFacilityIcon(visit.facilityType)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{visit.facilityName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(visit.date).toLocaleDateString('ko-KR')}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getFacilityColor(visit.facilityType)}`}>
                              {getFacilityTypeText(visit.facilityType)}
                            </span>
                            {visit.department && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                {visit.department}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">증상</div>
                          <div className="text-gray-900">{visit.symptoms || '-'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">진단</div>
                          <div className="text-gray-900 font-medium">{visit.diagnosis || '-'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">{visit.cost.toLocaleString()}원</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(visit)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(visit.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => toggleExpand(visit.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={isExpanded ? '접기' : '자세히 보기'}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {visit.prescription && (
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">처방</div>
                          <div className="bg-blue-50 p-3 rounded-lg text-gray-800">{visit.prescription}</div>
                        </div>
                      )}

                      {visit.notes && (
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">메모</div>
                          <div className="bg-gray-50 p-3 rounded-lg text-gray-800">{visit.notes}</div>
                        </div>
                      )}

                      {visit.documents && visit.documents.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">첨부 파일</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {visit.documents.map(doc => (
                              <div
                                key={doc.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <FileText className="w-8 h-8 text-red-600" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 truncate">{doc.name}</div>
                                  <div className="text-xs text-gray-600">
                                    {(doc.fileSize / 1024).toFixed(1)} KB · {new Date(doc.uploadDate).toLocaleDateString('ko-KR')}
                                  </div>
                                </div>
                                <button
                                  onClick={() => downloadDocument(doc)}
                                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                  title="다운로드"
                                >
                                  <Download className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <MedicalVisitForm
          visit={editingVisit}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default MedicalRecords;
