import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Filter, DollarSign, Clock, Eye, MessageCircle, ThumbsUp } from 'lucide-react'
import Advertisement from '@/components/Advertisement'
import { categoryAds } from '@/lib/ads'

export const metadata: Metadata = {
  title: '대출이야기',
  description: '대출 후기와 정보를 공유하는 공간입니다.'
}

const posts = [
  {
    id: 1,
    title: '2금융권 대출 후기 - 솔직한 경험담',
    content: '은행 대출이 안 되어서 2금융권을 알아보며 겪은 경험들을 솔직하게 나누고 싶어요.',
    author: '다시일어서기',
    tags: ['2금융권', '대출후기', '경험담'],
    likes: 18,
    comments: 12,
    views: 189,
    time: '1일 전',
    isHot: true
  },
  {
    id: 2,
    title: '무직자 대출 가능한 곳 정리',
    content: '무직 상태에서 급전이 필요해서 알아본 대출 가능한 곳들을 정리해드려요.',
    author: '정보공유맨',
    tags: ['무직자대출', '급전', '정보'],
    likes: 43,
    comments: 28,
    views: 412,
    time: '2일 전',
    isHot: true
  },
  {
    id: 3,
    title: '신불자도 가능한 대출 업체 후기',
    content: '신용불량자도 가능하다는 곳들을 직접 경험해본 후기입니다.',
    author: '경험자',
    tags: ['신불자', '대출가능', '후기'],
    likes: 35,
    comments: 19,
    views: 298,
    time: '3일 전',
    isHot: false
  },
  {
    id: 4,
    title: '대출 사기 주의! 이런 곳은 피하세요',
    content: '대출 급하다고 아무 곳이나 알아보다가 사기 당할 뻔한 경험담입니다.',
    author: '주의깊은',
    tags: ['대출사기', '주의사항', '경고'],
    likes: 67,
    comments: 41,
    views: 523,
    time: '4일 전',
    isHot: false
  }
]

const warningTips = [
  '선수금 요구하는 곳은 100% 사기',
  '개인정보 무분별하게 요구하는 곳 주의',
  '금리가 너무 낮다면 의심하기',
  '대출 전 수수료 요구하는 곳 피하기',
  '정식 등록된 금융업체인지 확인'
]

export default function LoanStoryPage() {
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
                <DollarSign className="w-8 h-8 mr-3 text-yellow-600" />
                대출이야기
              </h1>
              <p className="text-gray-600 mt-2">
                대출 후기와 정보를 공유하는 현실적인 공간입니다
              </p>
            </div>
            
            <Link
              href="/write?category=loan-story"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-full hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" />
              후기 공유하기
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            {/* 경고 메시지 */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">⚠️ 대출 사기 주의하세요</h3>
                  <p className="text-gray-700 mb-3">
                    급한 마음을 이용하는 불법 대출 업체들이 많습니다. 선수금을 요구하거나 과도한 개인정보를 요구하는 곳은 피하세요.
                  </p>
                  <p className="text-sm text-gray-600">
                    💡 정식 등록된 금융업체인지 반드시 확인하고, 의심스러우면 금융감독원에 문의하세요.
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
                    placeholder="대출 관련 궁금한 내용을 검색해보세요..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Filter className="w-4 h-4 mr-2" />
                    필터
                  </button>
                  <select className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-yellow-500">
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
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-yellow-600">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full hover:bg-yellow-100 cursor-pointer"
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
                          <span className="flex items-center hover:text-yellow-600 cursor-pointer">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {post.likes}
                          </span>
                          <span className="flex items-center hover:text-yellow-600 cursor-pointer">
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
            {/* 대출 관련 맞춤 광고 */}
            {categoryAds.loanStory.map((ad, index) => (
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
            
            {/* 구글 애드센스 광고 자리 */}
            <Advertisement
              position="adsense"
              title="사이드바 하단 (300x250)"
              description=""
              link="#"
              size="medium"
              adType="adsense"
            />
            
            {/* 주의사항 */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-5 h-5 mr-2 text-red-500">⚠️</span>
                대출 사기 주의사항
              </h3>
              <ul className="space-y-3">
                {warningTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 안내 메시지 */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 현명한 대출을 위해</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                급할 때일수록 신중하게 판단하세요. 
                높은 금리라도 안전한 곳에서 대출받는 것이 
                나중에 더 큰 문제를 예방할 수 있습니다.
              </p>
              <p className="text-xs text-gray-600">
                📞 금융감독원 불법사금융신고센터: 1332
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 