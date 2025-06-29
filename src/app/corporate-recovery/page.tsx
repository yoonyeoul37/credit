import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Filter, Building2, Clock, Eye, MessageCircle, ThumbsUp } from 'lucide-react'

export const metadata: Metadata = {
  title: '법인회생',
  description: '법인회생과 사업 관련 정보를 나누는 공간입니다.'
}

const posts = [
  {
    id: 1,
    title: '소상공인 법인회생 신청 경험담',
    content: '작은 카페를 운영하다가 코로나로 어려워져서 법인회생을 신청한 과정을 공유합니다.',
    author: '카페사장',
    tags: ['소상공인', '법인회생', '카페경영'],
    likes: 28,
    comments: 16,
    views: 234,
    time: '2일 전',
    isHot: true
  },
  {
    id: 2,
    title: '법인회생 vs 법인파산, 어떤 걸 선택해야 할까요?',
    content: '회사가 어려워졌을 때 법인회생과 법인파산 중 어떤 것을 선택해야 하는지 고민입니다.',
    author: '고민중인사장',
    tags: ['법인회생', '법인파산', '선택'],
    likes: 19,
    comments: 22,
    views: 189,
    time: '3일 전',
    isHot: false
  },
  {
    id: 3,
    title: '법인회생 중 직원 급여 문제',
    content: '법인회생 절차 중에 직원들 급여는 어떻게 처리해야 하는지 경험담을 나눠주세요.',
    author: '직원걱정사장',
    tags: ['법인회생', '직원급여', '노무'],
    likes: 31,
    comments: 18,
    views: 267,
    time: '4일 전',
    isHot: false
  },
  {
    id: 4,
    title: '법인회생 성공 후 사업 재건 이야기',
    content: '법인회생을 성공적으로 마치고 사업을 다시 일으켜 세운 경험을 공유합니다.',
    author: '재건성공',
    tags: ['법인회생성공', '사업재건', '성공사례'],
    likes: 47,
    comments: 29,
    views: 398,
    time: '5일 전',
    isHot: true
  }
]

const businessTips = [
  '법무사, 변호사 등 전문가 상담 필수',
  '모든 재무 자료 정확하게 준비',
  '채권자들과의 소통 중요',
  '직원들에게 투명하게 상황 공유',
  '재건 계획 구체적으로 수립'
]

export default function CorporateRecoveryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              홈으로
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Building2 className="w-8 h-8 mr-3 text-purple-600" />
                법인회생
              </h1>
              <p className="text-gray-600 mt-2">
                법인회생과 사업 관련 정보를 나누는 전문적인 공간입니다
              </p>
            </div>
            
            <Link
              href="/write?category=corporate-recovery"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" />
              경험 공유하기
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            {/* 안내 메시지 */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">🏢 사업의 재기를 응원합니다</h3>
                  <p className="text-gray-700 mb-3">
                    법인회생은 어려운 결정이지만, 때로는 사업을 지키기 위한 최선의 선택일 수 있습니다. 
                    여기서 나누는 경험들이 같은 상황의 사업자분들에게 도움이 되길 바랍니다.
                  </p>
                  <p className="text-sm text-gray-600">
                    ⚠️ 법인회생은 복잡한 법적 절차입니다. 반드시 전문가와 상담하시기 바랍니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="법인회생 관련 궁금한 내용을 검색해보세요..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Filter className="w-4 h-4 mr-2" />
                    필터
                  </button>
                  <select className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>최신순</option>
                    <option>인기순</option>
                    <option>댓글순</option>
                    <option>조회순</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 게시글 목록 */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        {post.isHot && (
                          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                            🔥 HOT
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full hover:bg-purple-100 cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="font-medium text-green-700">💚 {post.author}</span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center hover:text-purple-600 cursor-pointer">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {post.likes}
                          </span>
                          <span className="flex items-center hover:text-purple-600 cursor-pointer">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            {/* 도움말 */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-purple-500" />
                법인회생 핵심 포인트
              </h3>
              <ul className="space-y-3">
                {businessTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 연락처 정보 */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📞 전문기관 연락처</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <p className="font-medium text-gray-900">중소기업진흥공단</p>
                  <p className="text-gray-600">1357 (구조조정 상담)</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-medium text-gray-900">소상공인시장진흥공단</p>
                  <p className="text-gray-600">1588-7204</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-medium text-gray-900">대한법무사협회</p>
                  <p className="text-gray-600">1588-0012</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 