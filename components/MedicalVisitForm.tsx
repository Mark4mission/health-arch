import React, { useState, useRef, ChangeEvent } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { MedicalVisit, MedicalDocument } from '../types';
import { X, Upload, FileText, Trash2, Calendar } from 'lucide-react';

interface MedicalVisitFormProps {
  visit?: MedicalVisit | null;
  onClose: () => void;
}

const MedicalVisitForm: React.FC<MedicalVisitFormProps> = ({ visit, onClose }) => {
  const { addMedicalVisit, updateMedicalVisit } = useHealth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    date: visit?.date || new Date().toISOString().split('T')[0],
    facilityName: visit?.facilityName || '',
    facilityType: visit?.facilityType || 'hospital' as 'hospital' | 'clinic' | 'pharmacy',
    department: visit?.department || '',
    symptoms: visit?.symptoms || '',
    diagnosis: visit?.diagnosis || '',
    prescription: visit?.prescription || '',
    cost: visit?.cost !== undefined ? visit.cost : '' as any,
    notes: visit?.notes || '',
  });

  const [documents, setDocuments] = useState<MedicalDocument[]>(visit?.documents || []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Check file type
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      alert('PDF 또는 이미지 파일만 업로드 가능합니다.');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const newDoc: MedicalDocument = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        dataUrl: reader.result as string
      };
      setDocuments(prev => [...prev, newDoc]);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.facilityName || !formData.symptoms || !formData.diagnosis) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const visitData = {
      ...formData,
      cost: formData.cost === '' ? 0 : Number(formData.cost),
      documents
    };

    if (visit) {
      // Update existing visit
      updateMedicalVisit(visit.id, visitData);
    } else {
      // Add new visit
      addMedicalVisit(visitData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {visit ? '진료 기록 수정' : '새 진료 기록'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date and Facility Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                방문 날짜 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시설 유형 <span className="text-red-500">*</span>
              </label>
              <select
                name="facilityType"
                value={formData.facilityType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="hospital">병원</option>
                <option value="clinic">의원</option>
                <option value="pharmacy">약국</option>
              </select>
            </div>
          </div>

          {/* Facility Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              병원/의원/약국 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="facilityName"
              value={formData.facilityName}
              onChange={handleChange}
              required
              placeholder="예: 서울대학교병원, 강남연세의원, 온누리약국"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Department (optional for hospital/clinic) */}
          {(formData.facilityType === 'hospital' || formData.facilityType === 'clinic') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                진료과
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="예: 내과, 정형외과, 피부과"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              증상 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              required
              rows={3}
              placeholder="예: 복통, 두통, 발열 등"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              진단/병명 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              rows={2}
              placeholder="예: 급성 위염, 감기, 근육통"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Prescription */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              처방
            </label>
            <textarea
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              rows={3}
              placeholder="예: 타이레놀 500mg, 1일 3회, 식후 복용"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비용 (원) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              min="0"
              placeholder="비용을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메모
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="추가 메모사항"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              진료비 내역서, 진단서 등 (PDF, 이미지)
            </label>
            <div className="space-y-3">
              {/* Upload Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 text-gray-700"
                >
                  <Upload className="w-5 h-5" />
                  파일 업로드 (최대 5MB)
                </button>
              </div>

              {/* Uploaded Files List */}
              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <FileText className="w-8 h-8 text-red-600" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{doc.name}</div>
                        <div className="text-xs text-gray-600">
                          {(doc.fileSize / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              {visit ? '수정하기' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalVisitForm;
