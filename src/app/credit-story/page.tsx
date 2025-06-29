import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Filter, TrendingUp, Clock, Eye, MessageCircle, ThumbsUp } from 'lucide-react'
import Advertisement from '@/components/Advertisement'

export const metadata: Metadata = {
  title: '신용이야기',
  description: '신용점수 관리와 신용카드 관련 정보를 나누는 공간입니다.'
}

// 임시 데이터 (나중에 Supabase에서 가져올 데이터)
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
    title: '신용카드 발급 거절 5번 후 드디어 성공!',
    content: '계속 거절당해서 마음이 힘들었지만, 이 방법으로 드디어 카드를 발급받았어요.',
    author: '다시시작',
    tags: ['신용카드', '발급성공', '팁'],
    likes: 32,
    comments: 18,
    views: 245,
    time: '5시간 전',
    isHot: true
  },
  {
    id: 3,
    title: '체크카드만 5년 사용한 후 신용점수 변화',
    content: '신용카드 사용이 무서워서 체크카드만 사용했는데, 신용점수에 어떤 영향이 있었는지 공유드려요.',
    author: '조심스러운',
    tags: ['체크카드', '신용점수', '경험담'],
    likes: 28,
    comments: 15,
    views: 189,
    time: '1일 전',
    isHot: false
  },
  {
    id: 4,
    title: '연체 기록 삭제 신청 방법과 후기',
    content: '오래된 연체 기록을 삭제 신청하는 방법과 실제 경험을 나눠드립니다.',
    author: '깨끗한기록',
    tags: ['연체기록', '삭제신청', '방법'],
    likes: 41,
    comments: 29,
    views: 356,
    time: '2일 전',
    isHot: false
  }
]

const popularTags = [
  '신용점수', '신용카드', '신용회복', '연체기록', '체크카드', 
  '발급거절', '신용등급', '신용조회', '무직자', '대학생'
]

// 신용 관련 맞춤 광고
const creditAds = {
  sidebar: {
    title: '신용점수 무료 조회 서비스',
    description: '3개 신용평가사 점수를 한 번에 확인하세요. 100% 무료!',
    link: 'https://example.com/credit-check'
  },
  content: {
    title: '신용카드 발급 도우미',
    description: '나에게 맞는 신용카드를 찾아드립니다. 승인 가능성까지!',
    link: 'https://example.com/card-helper'
  }
}

export default function CreditStoryPage() {
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
                💳 신용이야기
              </h1>
              <p className="text-gray-600 mt-2">
                신용점수 관리와 신용카드 관련 정보를 나누는 따뜻한 공간입니다
              </p>
            </div>
            
            <Link
              href="/write?category=credit-story"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" />
              글쓰기
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            {/* 검색 및 필터 */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="궁금한 신용 관련 내용을 검색해보세요..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Filter className="w-4 h-4 mr-2" />
                    필터
                  </button>
                  <select className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
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
              {posts.map((post, index) => (
                <div key={post.id}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          {post.isHot && (
                            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                              🔥 HOT
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer"
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
                            <span className="flex items-center hover:text-blue-600 cursor-pointer">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {post.likes}
                            </span>
                            <span className="flex items-center hover:text-blue-600 cursor-pointer">
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
                        title={creditAds.content.title}
                        description={creditAds.content.description}
                        link={creditAds.content.link}
                        size="medium"
                        closeable={true}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
                  이전
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">2</button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">3</button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
                  다음
                </button>
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            {/* 신용 관련 맞춤 광고 */}
            <div className="mb-6">
              <Advertisement
                position="sidebar"
                title={creditAds.sidebar.title}
                description={creditAds.sidebar.description}
                link={creditAds.sidebar.link}
                size="medium"
                closeable={true}
              />
            </div>

            {/* 인기 태그 */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 text-sm px-3 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 도움말 */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 신용 관리 팁</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 연체는 절대 금물! 자동이체 설정하기</li>
                <li>• 신용카드 사용 후 바로바로 결제하기</li>
                <li>• 무분별한 카드 발급 신청 피하기</li>
                <li>• 정기적으로 신용점수 확인하기</li>
                <li>• 장기 미사용 카드는 해지 고려하기</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 