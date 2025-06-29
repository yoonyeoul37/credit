'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  FileText,
  MessageCircle,
  ThumbsUp,
  AlertTriangle,
  Calendar,
  User,
  Tag
} from 'lucide-react'

interface Post {
  id: number
  title: string
  content: string
  category: string
  categoryName: string
  author: string
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  comments: number
  tags: string[]
  isReported: boolean
  reportCount: number
  status: 'published' | 'hidden' | 'pending'
  images: string[]
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: '신용점수 200점 올린 후기 공유합니다',
      content: '안녕하세요. 6개월 전 신용점수가 400점대였던 절망적인 상황에서 드디어 600점대까지 올렸습니다...',
      category: 'credit-story',
      categoryName: '신용이야기',
      author: '희망찬시작',
      createdAt: '2024-01-15 14:30',
      updatedAt: '2024-01-15 14:30',
      views: 156,
      likes: 23,
      comments: 8,
      tags: ['신용점수', '후기', '성공'],
      isReported: false,
      reportCount: 0,
      status: 'published',
      images: []
    },
    {
      id: 2,
      title: '개인회생 인가 결정 받았습니다!',
      content: '드디어 개인회생 인가 결정을 받았어요. 앞으로 3년간 열심히 변제하겠습니다...',
      category: 'personal-recovery',
      categoryName: '개인회생',
      author: '새출발123',
      createdAt: '2024-01-15 13:15',
      updatedAt: '2024-01-15 13:15',
      views: 89,
      likes: 34,
      comments: 12,
      tags: ['개인회생', '인가결정', '성공'],
      isReported: false,
      reportCount: 0,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=300&fit=crop']
    },
    {
      id: 3,
      title: '부채 5천만원에서 완전 탈출까지의 여정',
      content: '5천만원의 부채로 시작해서 5년 만에 완전히 탈출한 이야기를 나누고 싶어요...',
      category: 'success-story',
      categoryName: '성공사례',
      author: '탈출성공자',
      createdAt: '2024-01-15 11:45',
      updatedAt: '2024-01-15 11:45',
      views: 234,
      likes: 67,
      comments: 23,
      tags: ['부채탈출', '5년여정', '완전해결'],
      isReported: true,
      reportCount: 2,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&h=300&fit=crop']
    },
    {
      id: 4,
      title: '법인회생 절차 문의드립니다',
      content: '사업을 운영하다가 어려움에 처해서 법인회생을 고려하고 있습니다...',
      category: 'corporate-recovery',
      categoryName: '법인회생',
      author: '사업자123',
      createdAt: '2024-01-15 10:20',
      updatedAt: '2024-01-15 10:20',
      views: 45,
      likes: 8,
      comments: 5,
      tags: ['법인회생', '절차', '문의'],
      isReported: false,
      reportCount: 0,
      status: 'published',
      images: []
    },
    {
      id: 5,
      title: '스팸성 광고 게시글입니다',
      content: '대출 100% 승인! 무조건 가능! 연락주세요...',
      category: 'loan-story',
      categoryName: '대출이야기',
      author: '스팸계정',
      createdAt: '2024-01-15 09:10',
      updatedAt: '2024-01-15 09:10',
      views: 12,
      likes: 0,
      comments: 0,
      tags: ['대출', '광고'],
      isReported: true,
      reportCount: 5,
      status: 'hidden',
      images: []
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showReportedOnly, setShowReportedOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const categories = [
    { value: 'all', label: '전체 카테고리' },
    { value: 'credit-story', label: '신용이야기' },
    { value: 'personal-recovery', label: '개인회생' },
    { value: 'corporate-recovery', label: '법인회생' },
    { value: 'loan-story', label: '대출이야기' },
    { value: 'success-story', label: '성공사례' }
  ]

  const statuses = [
    { value: 'all', label: '전체 상태' },
    { value: 'published', label: '게시됨' },
    { value: 'hidden', label: '숨김' },
    { value: 'pending', label: '검토 중' }
  ]

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus
    const matchesReported = !showReportedOnly || post.isReported

    return matchesSearch && matchesCategory && matchesStatus && matchesReported
  })

  // 페이징 계산
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const togglePostStatus = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, status: post.status === 'published' ? 'hidden' : 'published' }
        : post
    ))
  }

  const deletePost = (id: number) => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      setPosts(posts.filter(post => post.id !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">게시됨</span>
      case 'hidden':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">숨김</span>
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">검토 중</span>
      default:
        return null
    }
  }

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
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">게시글 관리</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">게시글 목록</h3>
          </div>
          
          {/* 게시글 테이블 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    게시글 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    통계
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">신용점수 200점 올린 후기</div>
                    <div className="text-sm text-gray-500">안녕하세요. 6개월 전 신용점수가...</div>
                    <div className="text-xs text-gray-500 mt-1">2024-01-15 14:30</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      신용이야기
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">희망찬시작</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>조회: 156</div>
                    <div>좋아요: 23</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      게시됨
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">수정</button>
                    <button className="text-red-600 hover:text-red-900">삭제</button>
                  </td>
                </tr>
                {/* 더 많은 게시글들... */}
                <tr>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">개인회생 인가 결정 받았습니다!</div>
                    <div className="text-sm text-gray-500">드디어 개인회생 인가 결정을...</div>
                    <div className="text-xs text-gray-500 mt-1">2024-01-15 13:15</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      개인회생
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">새출발123</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>조회: 89</div>
                    <div>좋아요: 34</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      게시됨
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">수정</button>
                    <button className="text-red-600 hover:text-red-900">삭제</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 페이징 */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                  총 <span className="font-medium">97</span>개 중 <span className="font-medium">1</span>-<span className="font-medium">10</span> 표시
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">이전</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
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
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    10
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">다음</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
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