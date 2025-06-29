import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Filter, Star, Clock, Eye, MessageCircle, ThumbsUp } from 'lucide-react'
import Advertisement from '@/components/Advertisement'
import { categoryAds } from '@/lib/ads'

export const metadata: Metadata = {
  title: '성공사례',
  description: '신용 회복 성공 사례를 나누는 희망의 공간입니다.'
}

const posts = [
  {
    id: 1,
    title: '신용점수 300점에서 700점까지 회복 후기',
    content: '3년 전 신용점수가 300점대였던 절망적인 상황에서, 지금은 700점까지 회복했습니다. 포기하지 마세요!',
    author: '희망나무',
    tags: ['신용점수', '신용회복', '성공사례'],
    likes: 45,
    comments: 23,
    views: 312,
    time: '3시간 전',
    isHot: true
  },
  {
    id: 2,
    title: '개인회생 완료 후 첫 신용카드 발급!',
    content: '개인회생을 완료한 지 1년 만에 드디어 신용카드를 발급받았어요. 정말 감격스럽습니다.',
    author: '새출발성공',
    tags: ['개인회생', '신용카드발급', '성공'],
    likes: 78,
    comments: 45,
    views: 567,
    time: '1일 전',
    isHot: true
  },
  {
    id: 3,
    title: '부채 5천만원에서 완전 탈출까지의 여정',
    content: '5천만원의 부채로 시작해서 5년 만에 완전히 탈출한 이야기를 나누고 싶어요.',
    author: '탈출성공자',
    tags: ['부채탈출', '5년여정', '완전해결'],
    likes: 89,
    comments: 52,
    views: 743,
    time: '2일 전',
    isHot: true
  },
  {
    id: 4,
    title: '무직에서 사업자까지, 완전한 재기',
    content: '신용불량으로 무직이었던 제가 이제는 작은 사업을 운영하고 있어요.',
    author: '재기성공',
    tags: ['무직탈출', '사업시작', '재기성공'],
    likes: 65,
    comments: 38,
    views: 456,
    time: '3일 전',
    isHot: false
  }
]

const successTips = [
  '포기하지 않는 마음가짐',
  '체계적인 부채 관리',
  '꾸준한 신용 개선 노력',
  '전문가 도움 활용하기',
  '작은 성공부터 차근차근'
]

export default function SuccessStoryPage() {
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
                <Star className="w-8 h-8 mr-3 text-yellow-500" />
                성공사례
              </h1>
              <p className="text-gray-600 mt-2">
                신용 회복 성공 사례를 나누는 희망의 공간입니다
              </p>
            </div>
            
            <Link
              href="/write?category=success-story"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-pink-500 text-white font-semibold rounded-full hover:from-yellow-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" />
              성공사례 공유하기
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            {/* 응원 메시지 */}
            <div className="bg-gradient-to-r from-yellow-50 to-pink-50 border border-yellow-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">🌟 모든 성공은 작은 시작에서 비롯됩니다</h3>
                  <p className="text-gray-700 mb-3">
                    여기 있는 모든 성공사례들이 누군가에게는 큰 희망이 됩니다. 당신의 이야기도 소중한 희망의 씨앗이 될 수 있어요.
                  </p>
                  <p className="text-sm text-gray-600">
                    💪 지금 힘들어도 포기하지 마세요. 반드시 좋은 날이 올 거예요!
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
                    placeholder="성공사례를 검색해보세요..."
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
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
                >
                  {/* 성공 배지 */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ⭐ SUCCESS
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-1 pr-16">
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
            {/* 성공사례 관련 광고 */}
            {categoryAds.successStory.map((ad, index) => (
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
              title="사이드바 중간 (300x250)"
              description=""
              link="#"
              size="medium"
              adType="adsense"
            />
            
            {/* 성공 요인 */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                성공의 핵심 요소
              </h3>
              <ul className="space-y-3">
                {successTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 동기부여 */}
            <div className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-2xl p-6 border border-yellow-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">✨ 오늘의 동기부여</h3>
              <p className="text-gray-700 italic leading-relaxed text-sm mb-3">
                "성공한 사람들의 공통점은 포기하지 않았다는 것입니다. 
                어려운 시기를 견뎌낸 당신도 반드시 성공할 수 있어요."
              </p>
              <div className="bg-yellow-100 rounded-lg p-3 text-center">
                <p className="text-yellow-800 font-semibold text-sm">
                  💪 "오늘도 한 걸음 더 나아가세요!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 