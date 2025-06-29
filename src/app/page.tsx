import Link from 'next/link'
import { ArrowRight, TrendingUp, MessageCircleHeart, Users, Sparkles, Heart, Eye, MessageCircle, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import Advertisement from '@/components/Advertisement'
import { sampleAds } from '@/lib/ads'

// 임시 데이터 (나중에 Supabase에서 가져올 데이터)
const hotPosts = [
  {
    id: 1,
    title: '신용점수 300점에서 700점까지 회복 후기',
    content: '3년 전 신용점수가 300점대였던 절망적인 상황에서, 지금은 700점까지 회복했습니다...',
    author: '희망나무',
    category: '신용이야기',
    tags: ['신용점수', '신용회복', '성공사례'],
    likes: 45,
    comments: 23,
    views: 312,
    time: '3시간 전',
    isHot: true
  },
  {
    id: 2,
    title: '개인회생 신청 과정 상세 후기',
    content: '개인회생을 신청하면서 겪었던 과정들을 상세히 공유드립니다...',
    author: '새시작',
    category: '개인회생',
    tags: ['개인회생', '법적절차', '후기'],
    likes: 34,
    comments: 18,
    views: 256,
    time: '4시간 전',
    isHot: true
  },
  {
    id: 3,
    title: '2금융권 대출 후기 - 솔직한 경험담',
    content: '은행 대출이 안 되어서 2금융권을 알아보며 겪은 경험들을 나누고 싶어요...',
    author: '다시일어서기',
    category: '대출이야기',
    tags: ['2금융권', '대출후기', '경험담'],
    likes: 18,
    comments: 12,
    views: 189,
    time: '1일 전',
    isHot: false
  }
]

const categories = [
  {
    name: '신용이야기',
    description: '신용점수 관리와 신용카드 관련 정보',
    icon: '💳',
    href: '/credit-story',
    posts: 156,
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: '개인회생',
    description: '개인회생 절차와 경험담',
    icon: '🔄',
    href: '/personal-recovery',
    posts: 89,
    color: 'from-green-500 to-green-600'
  },
  {
    name: '법인회생',
    description: '법인회생과 사업 관련 정보',
    icon: '🏢',
    href: '/corporate-recovery',
    posts: 34,
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: '대출이야기',
    description: '대출 후기와 정보 공유',
    icon: '💰',
    href: '/loan-story',
    posts: 203,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    name: '성공사례',
    description: '신용 회복 성공 사례',
    icon: '⭐',
    href: '/success-story',
    posts: 67,
    color: 'from-pink-500 to-pink-600'
  },
  {
    name: '실시간상담',
    description: '실시간 상담과 질문',
    icon: '💬',
    href: '/live-chat',
    posts: 124,
    color: 'from-indigo-500 to-indigo-600'
  }
]

const stats = [
  { label: '총 게시글', value: '1,234', icon: MessageCircle },
  { label: '총 댓글', value: '5,678', icon: MessageCircleHeart },
  { label: '활성 회원', value: '890', icon: Users },
  { label: '성공 사례', value: '156', icon: Sparkles }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              혼자가 아니에요
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                함께 새 출발해요!
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              신용회복과 새로운 시작을 함께하는 따뜻한 커뮤니티입니다.
              <br />
              당신의 이야기가 누군가에게 희망이 됩니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/write"
                className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                📝 고민 나누기
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/success-story"
                className="inline-flex items-center px-8 py-3 rounded-full bg-white text-gray-700 font-semibold border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                ⭐ 성공사례 보기
              </Link>
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* 실시간 응원 메시지 */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-gray-900">실시간 응원</span>
            </div>
            <p className="text-gray-600">
              오늘도 <span className="font-semibold text-blue-600">156명</span>이 서로 응원했어요 💪
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2">
            {/* 인기 게시글 */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-6 h-6 text-red-500 mr-2" />
                  🔥 지금 뜨거운 이야기
                </h2>
                <Link
                  href="/hot"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  더보기 <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {hotPosts.map((post, index) => (
                  <div key={post.id}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            {post.isHot && (
                              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                                🔥 HOT
                              </span>
                            )}
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                              {post.category}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {post.content}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="font-medium text-green-700">💚 {post.author}</span>
                              <span>{post.time}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {post.likes}
                              </span>
                              <span className="flex items-center">
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
                    
                    {/* 두 번째 게시글 다음에 중간 광고 삽입 */}
                    {index === 1 && (
                      <div className="my-6">
                        <Advertisement
                          position="content"
                          title={sampleAds.content.title}
                          description={sampleAds.content.description}
                          link={sampleAds.content.link}
                          size="medium"
                          closeable={true}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            {/* 사이드바 광고 */}
            <div className="mb-6">
              <Advertisement
                position="sidebar"
                title={sampleAds.sidebar.title}
                description={sampleAds.sidebar.description}
                link={sampleAds.sidebar.link}
                size="medium"
                closeable={true}
              />
            </div>

            {/* 카테고리 */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📱 카테고리별 게시판</h3>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br",
                        category.color
                      )}>
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-1">
                          {category.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {category.posts}개의 게시글
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 오늘의 격려 */}
            <section className="mb-8">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">💝 오늘의 격려</h3>
                <p className="text-gray-700 italic leading-relaxed">
                  "어려운 시기를 겪고 있는 모든 분들께 말씀드리고 싶어요. 
                  지금은 힘들지만, 반드시 좋은 날이 올 거예요. 
                  함께 힘내어요!"
                </p>
                <div className="mt-4 text-right">
                  <span className="text-sm text-gray-500">- 희망찬내일님</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
