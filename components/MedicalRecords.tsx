import React, { useState, useMemo } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { MedicalVisit } from '../types';
import { FileText, Plus, Calendar, MapPin, Trash2, Edit, Download, ChevronDown, ChevronUp, Building2, Pill, Search, Printer, X } from 'lucide-react';
import MedicalVisitForm from './MedicalVisitForm';

const MedicalRecords: React.FC = () => {
  const { medicalVisits, deleteMedicalVisit } = useHealth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<MedicalVisit | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'hospital' | 'clinic' | 'pharmacy'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  // Advanced filtering with search and date range
  const filteredVisits = useMemo(() => {
    let filtered = medicalVisits;

    // Filter by facility type
    if (filterType !== 'all') {
      filtered = filtered.filter(visit => visit.facilityType === filterType);
    }

    // Filter by keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(visit =>
        visit.facilityName.toLowerCase().includes(keyword) ||
        visit.symptoms.toLowerCase().includes(keyword) ||
        visit.diagnosis.toLowerCase().includes(keyword) ||
        (visit.department && visit.department.toLowerCase().includes(keyword)) ||
        (visit.prescription && visit.prescription.toLowerCase().includes(keyword))
      );
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(visit => new Date(visit.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(visit => new Date(visit.date) <= new Date(endDate));
    }

    return filtered;
  }, [medicalVisits, filterType, searchKeyword, startDate, endDate]);

  const totalCost = filteredVisits.reduce((sum, visit) => sum + visit.cost, 0);

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

  const handlePrintVisit = (visit: MedicalVisit) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>진료 기록 - ${visit.facilityName}</title>
          <style>
            body { font-family: 'Malgun Gothic', sans-serif; padding: 40px; }
            h1 { color: #0d9488; border-bottom: 3px solid #0d9488; padding-bottom: 10px; }
            .header { margin-bottom: 30px; }
            .info-row { display: flex; margin-bottom: 15px; }
            .info-label { font-weight: bold; width: 120px; color: #4b5563; }
            .info-value { flex: 1; }
            .section { margin: 30px 0; padding: 20px; background: #f9fafb; border-left: 4px solid #0d9488; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #0d9488; }
            .documents { margin-top: 20px; }
            .document-item { padding: 10px; background: white; margin: 5px 0; border: 1px solid #e5e7eb; }
            @media print {
              body { padding: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>진료 기록</h1>
          </div>
          <div class="info-row">
            <div class="info-label">의료기관:</div>
            <div class="info-value">${visit.facilityName} (${getFacilityTypeText(visit.facilityType)})</div>
          </div>
          <div class="info-row">
            <div class="info-label">방문일:</div>
            <div class="info-value">${new Date(visit.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          ${visit.department ? `
          <div class="info-row">
            <div class="info-label">진료과:</div>
            <div class="info-value">${visit.department}</div>
          </div>` : ''}
          <div class="info-row">
            <div class="info-label">비용:</div>
            <div class="info-value">${visit.cost.toLocaleString()}원</div>
          </div>

          <div class="section">
            <div class="section-title">증상</div>
            <div>${visit.symptoms}</div>
          </div>

          <div class="section">
            <div class="section-title">진단</div>
            <div>${visit.diagnosis}</div>
          </div>

          ${visit.prescription ? `
          <div class="section">
            <div class="section-title">처방</div>
            <div>${visit.prescription}</div>
          </div>` : ''}

          ${visit.notes ? `
          <div class="section">
            <div class="section-title">메모</div>
            <div>${visit.notes}</div>
          </div>` : ''}

          ${visit.documents && visit.documents.length > 0 ? `
          <div class="documents">
            <div class="section-title">첨부 문서</div>
            ${visit.documents.map(doc => `
              <div class="document-item">
                📄 ${doc.name} (${(doc.fileSize / 1024).toFixed(1)} KB)
              </div>
            `).join('')}
          </div>` : ''}

          <div style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px;">
            출력일: ${new Date().toLocaleDateString('ko-KR')}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>전체 진료 기록</title>
          <style>
            body { font-family: 'Malgun Gothic', sans-serif; padding: 40px; }
            h1 { color: #0d9488; border-bottom: 3px solid #0d9488; padding-bottom: 10px; margin-bottom: 30px; }
            .stats { display: flex; gap: 20px; margin-bottom: 30px; padding: 20px; background: #f0fdfa; border-radius: 8px; }
            .stat-item { flex: 1; }
            .stat-label { font-size: 12px; color: #6b7280; }
            .stat-value { font-size: 24px; font-weight: bold; color: #0d9488; }
            .visit-card { margin-bottom: 30px; padding: 20px; border: 2px solid #e5e7eb; border-radius: 8px; page-break-inside: avoid; }
            .visit-header { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #0d9488; }
            .facility-name { font-size: 20px; font-weight: bold; color: #111827; }
            .visit-date { color: #6b7280; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
            .info-item { }
            .info-label { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
            .info-value { font-weight: 500; }
            @media print {
              body { padding: 20px; }
              .visit-card { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>진료 기록 전체 목록</h1>

          <div class="stats">
            <div class="stat-item">
              <div class="stat-label">총 방문 횟수</div>
              <div class="stat-value">${filteredVisits.length}회</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">총 비용</div>
              <div class="stat-value">${totalCost.toLocaleString()}원</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">출력일</div>
              <div class="stat-value" style="font-size: 16px;">${new Date().toLocaleDateString('ko-KR')}</div>
            </div>
          </div>

          ${filteredVisits.map(visit => `
            <div class="visit-card">
              <div class="visit-header">
                <div>
                  <div class="facility-name">${visit.facilityName}</div>
                  <div class="visit-date">${new Date(visit.date).toLocaleDateString('ko-KR')} • ${getFacilityTypeText(visit.facilityType)}${visit.department ? ' • ' + visit.department : ''}</div>
                </div>
                <div style="text-align: right; font-size: 18px; font-weight: bold; color: #0d9488;">
                  ${visit.cost.toLocaleString()}원
                </div>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">증상</div>
                  <div class="info-value">${visit.symptoms}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">진단</div>
                  <div class="info-value">${visit.diagnosis}</div>
                </div>
              </div>

              ${visit.prescription ? `
              <div style="margin-top: 15px;">
                <div class="info-label">처방</div>
                <div class="info-value">${visit.prescription}</div>
              </div>` : ''}

              ${visit.notes ? `
              <div style="margin-top: 15px;">
                <div class="info-label">메모</div>
                <div class="info-value">${visit.notes}</div>
              </div>` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const clearSearch = () => {
    setSearchKeyword('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearchPanel(!showSearchPanel)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showSearchPanel ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <Search className="w-5 h-5" />
              검색
            </button>
            {filteredVisits.length > 0 && (
              <button
                onClick={handlePrintAll}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
              >
                <Printer className="w-5 h-5" />
                전체 인쇄
              </button>
            )}
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              새 기록 추가
            </button>
          </div>
        </div>

        {/* Search Panel */}
        {showSearchPanel && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">고급 검색</h3>
              <button
                onClick={() => setShowSearchPanel(false)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  키워드 검색
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="시설명, 증상, 진단명 등..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작일
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료일
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            {(searchKeyword || startDate || endDate) && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  검색 결과: <span className="font-semibold text-teal-600">{filteredVisits.length}건</span>
                </div>
                <button
                  onClick={clearSearch}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  검색 초기화
                </button>
              </div>
            )}
          </div>
        )}


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

                      <div className="flex items-center gap-1 text-gray-700">
                        <span className="font-semibold">₩ {visit.cost.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handlePrintVisit(visit)}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="인쇄"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
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
