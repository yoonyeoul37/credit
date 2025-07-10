'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [showStickyAd, setShowStickyAd] = useState(true);
  
  // 광고 데이터 (실제로는 관리자 페이지에서 가져옴)
  const [premiumAd] = useState({
    isActive: true,
    title: '신용회복 전문 상담센터 - 프리미엄 광고',
    content: '24시간 무료 상담 | 성공률 95% | 맞춤 솔루션 제공'
  });
  
  const [listAd] = useState({
    isActive: true,
    title: '저금리 대출 비교 플랫폼 - AI 맞춤 대출 상품 추천',
    content: '핀테크 플랫폼 | AI 분석 | 최저금리 | 즉시 심사'
  });
  
  // 임시 데이터 (더 많은 데이터로 확장)
  const allPosts = [
    {
      id: 1,
      title: "개인회생 신청 후 신용 회복 과정 질문드립니다",
      category: "개인회생",
      author: "익명",
      createdAt: "2시간 전",
      commentCount: 12,
      views: 89
    },
    {
      id: 2,
      title: "신용카드 연체 상황에서 대출 가능한 곳이 있을까요?",
      category: "신용카드",
      author: "익명",
      createdAt: "4시간 전",
      commentCount: 8,
      views: 156
    },
    {
      id: 3,
      title: "워크아웃 진행 중인데 추가 대출이 필요합니다",
      category: "워크아웃",
      author: "익명",
      createdAt: "6시간 전",
      commentCount: 15,
      views: 203
    },
    {
      id: 4,
      title: "법인회생 절차 관련 경험담 공유합니다",
      category: "법인회생",
      author: "익명",
      createdAt: "8시간 전",
      commentCount: 5,
      views: 67
    },
    {
      id: 5,
      title: "신용등급 상승을 위한 실질적인 방법들",
      category: "신용이야기",
      author: "익명",
      createdAt: "10시간 전",
      commentCount: 23,
      views: 301
    },
    {
      id: 6,
      title: "개인회생 변제계획 승인 후기",
      category: "개인회생",
      author: "익명",
      createdAt: "12시간 전",
      commentCount: 7,
      views: 125
    },
    {
      id: 7,
      title: "신용카드 채무통합 경험담",
      category: "신용카드",
      author: "익명",
      createdAt: "14시간 전",
      commentCount: 19,
      views: 278
    },
    {
      id: 8,
      title: "대출 한도 상향 조정 방법",
      category: "대출",
      author: "익명",
      createdAt: "16시간 전",
      commentCount: 11,
      views: 189
    },
    {
      id: 9,
      title: "워크아웃 신청 전 준비사항",
      category: "워크아웃",
      author: "익명",
      createdAt: "18시간 전",
      commentCount: 14,
      views: 234
    },
    {
      id: 10,
      title: "법인회생 신청 후 직원 관리 방법",
      category: "법인회생",
      author: "익명",
      createdAt: "20시간 전",
      commentCount: 6,
      views: 98
    },
    {
      id: 11,
      title: "신용등급 7등급에서 3등급으로 올린 후기",
      category: "신용이야기",
      author: "익명",
      createdAt: "22시간 전",
      commentCount: 31,
      views: 456
    },
    {
      id: 12,
      title: "개인회생 중 신용카드 사용 가능한가요?",
      category: "개인회생",
      author: "익명",
      createdAt: "1일 전",
      commentCount: 9,
      views: 167
    },
    {
      id: 13,
      title: "저금리 대출 갈아타기 성공 사례",
      category: "대출",
      author: "익명",
      createdAt: "1일 전",
      commentCount: 16,
      views: 312
    },
    {
      id: 14,
      title: "신용카드 연체금 협상 팁",
      category: "신용카드",
      author: "익명",
      createdAt: "1일 전",
      commentCount: 22,
      views: 398
    },
    {
      id: 15,
      title: "워크아웃과 개인회생 차이점 정리",
      category: "워크아웃",
      author: "익명",
      createdAt: "1일 전",
      commentCount: 18,
      views: 267
    },
    {
      id: 16,
      title: "법인회생 절차 진행 중 주의사항",
      category: "법인회생",
      author: "익명",
      createdAt: "1일 전",
      commentCount: 4,
      views: 89
    },
    {
      id: 17,
      title: "신용회복위원회 채무조정 후기",
      category: "신용이야기",
      author: "익명",
      createdAt: "2일 전",
      commentCount: 25,
      views: 421
    },
    {
      id: 18,
      title: "개인회생 변제금 감액 방법",
      category: "개인회생",
      author: "익명",
      createdAt: "2일 전",
      commentCount: 13,
      views: 234
    },
    {
      id: 19,
      title: "카드대출 vs 신용대출 비교",
      category: "대출",
      author: "익명",
      createdAt: "2일 전",
      commentCount: 8,
      views: 178
    },
    {
      id: 20,
      title: "연체자도 발급 가능한 신용카드",
      category: "신용카드",
      author: "익명",
      createdAt: "2일 전",
      commentCount: 27,
      views: 512
    },
    {
      id: 21,
      title: "워크아웃 신청 자격 조건",
      category: "워크아웃",
      author: "익명",
      createdAt: "2일 전",
      commentCount: 12,
      views: 198
    },
    {
      id: 22,
      title: "법인회생 신청 비용 정리",
      category: "법인회생",
      author: "익명",
      createdAt: "3일 전",
      commentCount: 7,
      views: 134
    }
  ];

  // 페이징 계산
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = allPosts.slice(startIndex, endIndex);

  // 페이지네이션 범위 계산 (10페이지씩)
  const pageGroup = Math.ceil(currentPage / 10);
  const startPage = (pageGroup - 1) * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-pretendard font-light min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-gray-200 bg-white sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-xl font-normal text-black">
                  <Link href="/" className="hover:text-blue-600">크레딧스토리</Link>
                </h1>
                <p className="text-xs text-gray-500 -mt-1 text-right">Credit Story</p>
              </div>
              <nav className="hidden md:block">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <Link href="/" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">전체</Link>
                  <Link href="/credit" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">신용이야기</Link>
                  <Link href="/personal" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">개인회생</Link>
                  <Link href="/corporate" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">법인회생</Link>
                  <Link href="/workout" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">워크아웃</Link>
                  <Link href="/card" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">신용카드</Link>
                  <Link href="/loan" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">대출</Link>
                  <Link href="/news" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">뉴스정보</Link>
                  <Link href="/calculator" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">계산기</Link>
                </div>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {/* 글쓰기 버튼을 메인 영역으로 이동 */}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 페이지 제목 */}
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-black mb-2">전체 게시글</h2>
          <p className="text-sm text-gray-600">모든 카테고리의 최신 글을 확인하세요</p>
        </div>

        {/* 상단 배너 광고 - 조건부 렌더링 */}
        {premiumAd?.isActive && (
          <div className="mb-6 flex justify-center">
            <div className="w-[728px] h-[90px] bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-center text-sm text-blue-600 rounded-lg">
              <div className="text-center">
                <div className="text-lg mb-1">{premiumAd.title}</div>
                <div className="text-xs text-blue-500">{premiumAd.content}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* 글쓰기 버튼 */}
        <div className="flex justify-center mb-6">
          <div className="w-[728px] flex justify-end">
            <Link 
              href="/write" 
              className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs font-medium"
            >
              작성하기
            </Link>
          </div>
        </div>
        
        <div className="space-y-1">
          {currentPosts.map((post, index) => (
            <div key={post.id}>
              {/* 광고 배너 (6번째 글 뒤에 삽입) - 조건부 렌더링 */}
              {index === 5 && listAd?.isActive && (
                <div className="flex items-start py-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded -mx-2 px-2">
                  <div className="flex-shrink-0 w-8 text-right">
                    <span className="text-sm text-orange-400">#AD</span>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center space-x-2">
                      <a href="#" className="text-black hover:text-orange-600 text-sm leading-relaxed">
                        {listAd.title}
                      </a>
                      <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                        금융 광고
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                      {listAd.content.split(' | ').map((item, idx) => (
                        <span key={idx}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* 게시글 아이템 */}
              <div className="flex items-start py-2 hover:bg-gray-50 -mx-2 px-2">
                <div className="flex-shrink-0 w-8 text-right">
                  <span className="text-sm text-gray-500">{post.id}</span>
                </div>
                <div className="flex-1 ml-4">
                  <div className="flex items-center space-x-2">
                    <Link href={`/post/${post.id}`} className="text-black hover:text-blue-600 text-sm leading-relaxed">
                      {post.title}
                    </Link>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                    <span>{post.author}</span>
                    <span>{post.createdAt}</span>
                    <span>{post.commentCount} 댓글</span>
                    <span>{post.views} 조회</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            {/* 이전 10페이지 */}
            {startPage > 1 && (
              <button
                onClick={() => handlePageChange(startPage - 1)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded"
              >
                ← 이전
              </button>
            )}
            
            {/* 페이지 번호들 */}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            {/* 다음 10페이지 */}
            {endPage < totalPages && (
              <button
                onClick={() => handlePageChange(endPage + 1)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded"
              >
                다음 →
              </button>
            )}
          </div>
        </div>

        {/* 페이지 정보 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            전체 {allPosts.length}개 글 | {currentPage} / {totalPages} 페이지
          </p>
        </div>

        {/* 구글 애드센스 영역 */}
        <div className="mt-6">
          <div className="flex items-start py-2 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-300 rounded -mx-2 px-2">
            <div className="flex-shrink-0 w-8 text-right">
              <span className="text-sm text-gray-400">#AD</span>
            </div>
            <div className="flex-1 ml-4">
              <div className="flex items-center space-x-2">
                <a href="#" className="text-black hover:text-gray-600 text-sm leading-relaxed">
                  맞춤형 금융 상품 추천 - Google AI 기반 개인화 서비스
                </a>
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                  구글 광고
                </span>
              </div>
              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                <span>Google AdSense</span>
                <span>자동 최적화</span>
                <span>개인 맞춤</span>
                <span>안전한 서비스</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 mt-16 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                <h3 className="text-lg font-normal text-black">
                  <Link href="/" className="hover:text-blue-600">크레딧스토리</Link>
                </h3>
                <p className="text-xs text-gray-500 -mt-1">Credit Story</p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                신용회복과 금융 재건을 위한 정보 공유 커뮤니티입니다.<br/>
                개인회생, 법인회생, 워크아웃 등 다양한 경험을 나누며<br/>
                함께 성장해나가는 공간입니다.
              </p>
              <p className="text-xs text-gray-500">
                본 사이트의 정보는 참고용이며, 전문가와 상담을 권장합니다.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-black mb-4">커뮤니티</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/credit" className="hover:text-blue-600">신용이야기</Link></li>
                <li><Link href="/personal" className="hover:text-blue-600">개인회생</Link></li>
                <li><Link href="/corporate" className="hover:text-blue-600">법인회생</Link></li>
                <li><Link href="/workout" className="hover:text-blue-600">워크아웃</Link></li>
                <li><Link href="/card" className="hover:text-blue-600">신용카드</Link></li>
                <li><Link href="/loan" className="hover:text-blue-600">대출</Link></li>
                <li><Link href="/news" className="hover:text-blue-600">뉴스정보</Link></li>
                <li><Link href="/calculator" className="hover:text-blue-600">계산기</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-black mb-4">정보</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/ad" className="hover:text-blue-600">광고문의</Link></li>
                <li><Link href="/admin" className="hover:text-red-600 text-gray-500">관리자</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 크레딧스토리. 모든 권리 보유.
            </p>
          </div>
        </div>
      </footer>

      {/* 스티키 광고 */}
      {showStickyAd && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  신용회복 전문 상담센터 - 24시간 무료 상담
                </p>
                <p className="text-xs text-blue-100 truncate">
                  성공률 95% | 맞춤 솔루션 | 전국 지점 운영
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-white text-blue-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors">
                상담신청
              </button>
              <button
                onClick={() => setShowStickyAd(false)}
                className="text-blue-100 hover:text-white p-1 rounded transition-colors"
                aria-label="광고 닫기"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
