'use client';

import { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmit: (data: { reason: string; description: string }) => Promise<void>;
  targetType: 'post' | 'comment';
  targetId: string;
}

export default function ReportModal({ isOpen, onClose, onReportSubmit, targetType, targetId }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  const reasonOptions = [
    { value: 'spam', label: '스팸/도배' },
    { value: 'inappropriate', label: '부적절한 내용' },
    { value: 'advertising', label: '광고/홍보' },
    { value: 'other', label: '기타' }
  ];

  if (!isOpen) return null;

  const showToastMessage = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('신고 모달 제출 시작:', { reason, description, targetType, targetId });
    
    if (!reason) {
      showToastMessage('신고 사유를 선택해주세요.', 'warning');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onReportSubmit({ reason, description });
      console.log('신고 모달 제출 완료');
      showToastMessage('신고가 접수되었습니다.', 'success');
      setTimeout(() => handleClose(), 1500);
    } catch (error: any) {
      console.error('신고 제출 오류:', error);
      if (error.message === '이미 신고한 내용입니다.') {
        showToastMessage('이미 신고한 내용입니다.', 'warning');
        setTimeout(() => handleClose(), 1500);
      } else {
        showToastMessage('신고 처리 중 오류가 발생했습니다.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    console.log('신고 모달 닫기');
    setReason('');
    setDescription('');
    setIsSubmitting(false);
    setShowToast(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* 토스트 메시지 */}
        {showToast && (
          <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-60 ${
            toastType === 'success' ? 'bg-green-500 text-white' :
            toastType === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            {toastMessage}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {targetType === 'post' ? '게시글' : '댓글'} 신고
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                신고 사유 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {reasonOptions.map((option) => (
                  <div 
                    key={option.value} 
                    onClick={() => setReason(option.value)}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <div 
                      className="w-4 h-4 border-2 border-gray-400 rounded-full mr-3 flex items-center justify-center"
                      style={{
                        backgroundColor: reason === option.value ? '#ef4444' : 'white',
                        borderColor: reason === option.value ? '#ef4444' : '#9ca3af'
                      }}
                    >
                      {reason === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                상세 설명 (선택사항)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="신고 사유를 자세히 설명해주세요..."
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="text-sm text-gray-500 mt-1">
                {description.length}/500
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reason}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '처리 중...' : '신고하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 