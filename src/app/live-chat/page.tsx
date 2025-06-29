import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Headphones, Clock, Users, MessageCircle, Send, Heart } from 'lucide-react'
import Advertisement from '@/components/Advertisement'
import { categoryAds } from '@/lib/ads'
import ChatRoom from '@/components/ChatRoom'

export const metadata: Metadata = {
  title: '실시간상담',
  description: '실시간 상담과 질문을 나누는 소통의 공간입니다.'
}

const liveChats = [
  {
    id: 1,
    title: '💬 신용점수 관련 즉석 질문방',
    description: '신용점수, 신용카드 관련 궁금한 것들을 바로바로 물어보세요!',
    participants: 23,
    status: 'active',
    category: '신용관리',
    time: '지금 활성화'
  },
  {
    id: 2,
    title: '🔄 개인회생 진행 중인 분들 모임',
    description: '개인회생 진행 과정에서 생기는 궁금증들을 함께 해결해요',
    participants: 15,
    status: 'active',
    category: '개인회생',
    time: '지금 활성화'
  },
  {
    id: 3,
    title: '💰 대출 정보 공유방',
    description: '안전한 대출 정보와 주의사항을 실시간으로 나눠요',
    participants: 31,
    status: 'active',
    category: '대출정보',
    time: '지금 활성화'
  },
  {
    id: 4,
    title: '⭐ 성공사례 라이브 토크',
    description: '신용회복에 성공한 분들이 직접 경험담을 들려드려요',
    participants: 8,
    status: 'scheduled',
    category: '성공사례',
    time: '저녁 8시 예정'
  }
]

const recentQuestions = [
  {
    id: 1,
    question: '신용점수 올리는 가장 빠른 방법이 뭔가요?',
    author: '급한사람',
    answers: 12,
    time: '5분 전'
  },
  {
    id: 2,
    question: '개인회생 중에도 체크카드는 사용 가능한가요?',
    author: '궁금한회생자',
    answers: 8,
    time: '15분 전'
  },
  {
    id: 3,
    question: '2금융권 대출 시 주의할 점 알려주세요',
    author: '조심스러운',
    answers: 15,
    time: '32분 전'
  }
]

const chatGuidelines = [
  '서로를 존중하고 따뜻하게 대해주세요',
  '개인정보는 절대 공유하지 마세요',
  '욕설이나 비방은 금지됩니다',
  '상업적 홍보는 제한됩니다',
  '전문적인 법률 상담은 전문가에게 문의하세요'
]

export default function LiveChatPage() {
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
                <Headphones className="w-8 h-8 mr-3 text-indigo-600" />
                실시간상담
              </h1>
              <p className="text-gray-600 mt-2">
                실시간으로 소통하며 함께 해결책을 찾아가는 따뜻한 공간입니다
              </p>
            </div>
            
            <Link
              href="/write?category=live-chat"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" />
              질문하기
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2">
            {/* 메인 실시간 채팅방 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-green-500" />
                💬 신용회복 종합상담방
              </h2>
              
              {/* 환경 변수 테스트 */}
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-yellow-800">🔍 디버그 정보</h4>
                <p className="text-sm text-yellow-700">
                  Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ 없음'}
                </p>
                <p className="text-sm text-yellow-700">
                  Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 있음' : '❌ 없음'}
                </p>
              </div>
              
              {/* 실시간 채팅 컴포넌트 */}
              <ChatRoom roomId={1} className="mb-6" />
            </section>

            {/* 다른 채팅방 목록 */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏠 다른 채팅방</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {liveChats.slice(1).map((chat) => (
                  <div
                    key={chat.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:border-indigo-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 hover:text-indigo-600 text-sm">
                        {chat.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {chat.status === 'active' ? (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 font-medium">LIVE</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-xs text-yellow-600 font-medium">예정</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {chat.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        {chat.category}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {chat.participants}명
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 최근 질문들 */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Send className="w-5 h-5 mr-2 text-blue-500" />
                  💡 최근 질문들
                </h2>
                <Link
                  href="/questions"
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  더보기 →
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h3 className="font-medium text-gray-900 mb-2 hover:text-indigo-600">
                      {q.question}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="text-green-700">💚 {q.author}</span>
                        <span>{q.answers}개 답변</span>
                      </div>
                      <span>{q.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 실시간상담 관련 광고 */}
            <div className="space-y-4">
              {categoryAds.liveChat.map((ad, index) => (
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
            
            {/* 실시간 현황 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                실시간 현황
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">온라인 사용자</span>
                  <span className="font-semibold text-green-600">89명</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">활성 채팅방</span>
                  <span className="font-semibold text-blue-600">3개</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">오늘 질문</span>
                  <span className="font-semibold text-purple-600">47개</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">오늘 답변</span>
                  <span className="font-semibold text-orange-600">128개</span>
                </div>
              </div>
            </div>

            {/* 채팅 가이드라인 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 채팅 가이드라인</h3>
              <ul className="space-y-2">
                {chatGuidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 응원 메시지 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                함께해요!
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                혼자 고민하지 마세요. 여기 있는 모든 분들이 
                당신의 든든한 동반자가 되어드릴게요.
              </p>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-indigo-700 font-medium text-sm">
                  💪 "함께하면 더 큰 힘이 됩니다!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 