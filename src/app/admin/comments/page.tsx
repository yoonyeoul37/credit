'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react'

export default function CommentManagement() {
  const [comments] = useState([
    {
      id: 1,
      content: '정말 도움이 되는 정보네요! 감사합니다.',
      author: '감사인',
      postTitle: '신용점수 200점 올린 후기 공유합니다',
      createdAt: '2024-01-15 15:30',
      isReported: false,
      status: 'published'
    },
    {
      id: 2,
      content: '저도 비슷한 상황이었는데 희망이 생기네요.',
      author: '희망찾기',
      postTitle: '개인회생 인가 결정 받았습니다!',
      createdAt: '2024-01-15 14:45',
      isReported: false,
      status: 'published'
    },
    {
      id: 3,
      content: '스팸성 댓글입니다. 대출 문의하세요!',
      author: '스팸러',
      postTitle: '부채 5천만원에서 완전 탈출까지의 여정',
      createdAt: '2024-01-15 13:20',
      isReported: true,
      status: 'hidden'
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
              <MessageSquare className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">댓글 관리</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">댓글 관리 페이지</h2>
          <p className="text-gray-600">댓글 목록과 관리 기능이 여기에 구현됩니다.</p>
          
          <div className="mt-6 space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className={`p-4 border rounded-lg ${comment.isReported ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{comment.content}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <span>{comment.author}</span> • <span>{comment.postTitle}</span> • <span>{comment.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {comment.isReported && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`px-2 py-1 rounded text-xs ${comment.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {comment.status === 'published' ? '게시됨' : '숨김'}
                    </span>
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
                  총 <span className="font-medium">23</span>개 중 <span className="font-medium">1</span>-<span className="font-medium">10</span> 표시
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
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    3
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