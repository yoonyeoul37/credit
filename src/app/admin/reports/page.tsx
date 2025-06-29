'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, Check, X } from 'lucide-react'

export default function ReportManagement() {
  const [reports] = useState([
    {
      id: 1,
      type: 'post',
      targetTitle: '부채 5천만원에서 완전 탈출까지의 여정',
      targetAuthor: '탈출성공자',
      reason: '허위 정보',
      reporterNickname: '신고자1',
      reportedAt: '2024-01-15 16:20',
      status: 'pending'
    },
    {
      id: 2,
      type: 'comment',
      targetTitle: '스팸성 댓글입니다. 대출 문의하세요!',
      targetAuthor: '스팸러',
      reason: '스팸/광고',
      reporterNickname: '신고자2',
      reportedAt: '2024-01-15 15:10',
      status: 'pending'
    },
    {
      id: 3,
      type: 'post',
      targetTitle: '스팸성 광고 게시글입니다',
      targetAuthor: '스팸계정',
      reason: '스팸/광고',
      reporterNickname: '신고자3',
      reportedAt: '2024-01-15 14:00',
      status: 'approved'
    }
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link 
                href="/admin"
                className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                대시보드
              </Link>
              <AlertTriangle className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">신고 처리</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">신고 처리 페이지</h2>
          <p className="text-gray-600 mb-6">신고된 게시글과 댓글을 검토하고 처리합니다.</p>
          
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        report.type === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {report.type === 'post' ? '게시글' : '댓글'}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{report.targetTitle}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      작성자: {report.targetAuthor} | 신고자: {report.reporterNickname}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      신고 사유: {report.reason} | 신고 시간: {report.reportedAt}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      report.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : report.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {report.status === 'pending' ? '대기 중' : report.status === 'approved' ? '승인됨' : '거부됨'}
                    </span>
                    {report.status === 'pending' && (
                      <div className="flex space-x-1">
                        <button className="p-1 text-green-600 hover:text-green-800">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이징 */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                이전
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                다음
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  총 <span className="font-medium">12</span>건 중 <span className="font-medium">1</span>-<span className="font-medium">10</span> 표시
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    이전
                  </button>
                  <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    1
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    다음
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 