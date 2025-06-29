import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Filter, TrendingUp, Clock, Eye, MessageCircle, ThumbsUp, RefreshCw } from 'lucide-react'
import Advertisement from '@/components/Advertisement'
import { categoryAds } from '@/lib/ads'

export const metadata: Metadata = {
  title: '개인회생',
  description: '개인회생 절차와 경험담을 나누는 공간입니다.'
}

const posts = [
  {
    id: 1,
    title: '개인회생 신청 과정 상세 후기',
    content: '개인회생을 신청하면서 겪었던 과정들을 상세히 공유드립니다. 같은 상황에 계신 분들께 도움이 되길 바랍니다.',
    author: '새시작',
    tags: ['개인회생', '법적절차', '후기'],
    likes: 34,
    comments: 18,
    views: 256,
    time: '4시간 전',
    isHot: true
  },
  {
    id: 2,
    title: '개인회생 인가 결정 받았습니다!',
    content: '드디어 개인회생 인가 결정을 받았어요. 앞으로 3년간 열심히 변제하겠습니다.',
    author: '희망의빛',
    tags: ['개인회생', '인가결정', '성공'],
    likes: 52,
    comments: 31,
    views: 423,
    time: '1일 전',
    isHot: true
  },
  {
    id: 3,
    title: '개인회생 중 추가 대출 가능한가요?',
    content: '개인회생 진행 중인데 긴급한 자금이 필요해서 문의드립니다.',
    author: '궁금한사람',
    tags: ['개인회생', '추가대출', '질문'],
    likes: 12,
    comments: 24,
    views: 189,
    time: '2일 전',
    isHot: false
  },
  {
    id: 4,
    title: '개인회생 변제금 낮추는 방법',
    content: '변제금이 너무 부담스러워서 조정 방법을 찾고 있습니다.',
    author: '부담스러운',
    tags: ['개인회생', '변제금', '조정'],
    likes: 28,
    comments: 19,
    views: 298,
    time: '3일 전',
    isHot: false
  }
]

const helpfulInfo = [
  '개인회생 신청 자격 확인하기',
  '필요 서류 미리 준비하기',
  '변제계획안 작성 요령',
  '채권자집회 준비사항',
  '개인회생 후 신용회복 방법'
]

export default function PersonalRecoveryPage() {
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
                <RefreshCw className="w-8 h-8 mr-3 text-green-600" />
                개인회생
              </h1>
              <p className="text-gray-600 mt-2">
                개인회생 절차와 경험담을 나누는 따뜻한 공간입니다
              </p>
            </div>
            
            <Link
              href="/write?category=personal-recovery"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-full hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <RefreshCw className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">💪 새로운 시작을 응원합니다</h3>
                  <p className="text-gray-700 mb-3">
                    개인회생은 새로운 출발의 기회입니다. 여기서 나누는 모든 경험과 정보가 누군가에게 큰 도움이 됩니다.
                  </p>
                  <p className="text-sm text-gray-600">
                    ⚠️ 법적 조언이 필요한 경우 반드시 전문가와 상담하시기 바랍니다.
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
                    placeholder="개인회생 관련 궁금한 내용을 검색해보세요..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Filter className="w-4 h-4 mr-2" />
                    필터
                  </button>
                  <select className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500">
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
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full hover:bg-green-100 cursor-pointer"
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
                          <span className="flex items-center hover:text-green-600 cursor-pointer">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {post.likes}
                          </span>
                          <span className="flex items-center hover:text-green-600 cursor-pointer">
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
          <div className="lg:col-span-1 space-y-6">
            {/* 개인회생 전문 법무사/변호사 광고 */}
            <div className="space-y-4">
              {categoryAds.personalRecovery.map((ad, index) => (
                <Advertisement
                  key={index}
                  position="sidebar"
                  title={ad.title}
                  description={ad.description}
                  link={ad.link}
                  size="medium"
                  closeable={true}
                />
              ))}
            </div>
            
            {/* 구글 애드센스 광고 자리 */}
            <Advertisement
              position="adsense"
              title="사이드바 중간 (300x250)"
              description=""
              link="#"
              size="medium"
              adType="adsense"
            />
            
            {/* 도움말 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                도움되는 정보
              </h3>
              <ul className="space-y-3">
                {helpfulInfo.map((info, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 hover:text-green-600 cursor-pointer">
                      {info}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 격려 메시지 */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🌟 힘내세요!</h3>
              <p className="text-gray-700 italic leading-relaxed text-sm">
                "개인회생은 끝이 아니라 새로운 시작입니다. 
                어려운 결정을 내리신 용기에 박수를 보내며, 
                더 나은 내일을 위해 함께 걸어가요."
              </p>
              <div className="mt-4 text-right">
                <span className="text-sm text-gray-500">- 새출발커뮤니티</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 