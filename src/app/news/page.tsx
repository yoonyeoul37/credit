'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileNav from '../components/MobileNav';

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [showStickyAd, setShowStickyAd] = useState(true);
  
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 뉴스 목록 가져오기
  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('🌐 뉴스 API 호출 시도...');
        
        const response = await fetch('/api/news');
        const data = await response.json();
        
        if (response.ok) {
          console.log('✅ 뉴스 데이터 로드 성공:', data.news?.length || 0, '개');
          
          // 데이터 포맷 변환 (기존 UI에 맞게)
          const formattedNews = (data.news || []).map(item => ({
            id: item.id,
            title: item.title,
            summary: item.summary,
            source: item.source,
            url: item.url || '#',
            publishedAt: new Date(item.published_at).toLocaleDateString(),
            category: item.category,
            isImportant: item.is_important
          }));
          
          setNewsItems(formattedNews);
        } else {
          throw new Error(data.error || '뉴스를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('❌ 뉴스 로딩 실패:', error);
        
        // 오류 시 빈 배열로 설정
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
  // 페이징 계산
  const totalPages = Math.ceil(newsItems.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const displayedNews = newsItems.slice(startIndex, endIndex);

  // 페이지네이션 범위 계산 (10페이지씩)
  const pageGroup = Math.ceil(currentPage / 10);
  const startPage = (pageGroup - 1) * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryColors: { [key: string]: string } = {
    "정책": "bg-red-100 text-red-800",
    "금융": "bg-blue-100 text-blue-800", 
    "법률": "bg-green-100 text-green-800",
    "일반": "bg-gray-100 text-gray-800"
  };

  return (
    <div className="font-pretendard font-light min-h-screen bg-white">
      {/* 모바일 네비게이션 */}
      <MobileNav currentPage="/news" />
      
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
                  <Link href="/news" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">뉴스정보</Link>
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
        {/* 카테고리 제목 */}
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-black mb-2">뉴스정보</h2>
          <p className="text-sm text-gray-600">최신 금융·신용 관련 뉴스와 정책 정보</p>
        </div>

        {/* 프리미엄 광고 영역 (현재 비활성화) */}



        {/* 뉴스 목록 */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-8">뉴스 데이터를 불러오는 중입니다...</p>
          ) : newsItems.length === 0 ? (
            <p className="text-center py-8">뉴스 데이터가 없습니다.</p>
          ) : (
            displayedNews.map((news, index) => (
              <div key={news.id}>
                {/* 리스트 광고 영역 (현재 비활성화) */}
                
                {/* 뉴스 카드 */}
                <article className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[news.category]}`}>
                          {news.category}
                        </span>
                        {news.isImportant && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                            중요
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{news.publishedAt}</span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-black mb-2 leading-tight">
                        <a 
                          href={news.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors"
                        >
                          {news.title}
                        </a>
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {news.summary}
                      </p>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="font-medium">{news.source}</span>
                        <span>•</span>
                        <a 
                          href={news.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600"
                        >
                          원문보기 →
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <span className="text-xs text-gray-400">#{news.id}</span>
                    </div>
                  </div>
                </article>
              </div>
            ))
          )}
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
            전체 {newsItems.length}개 뉴스 | {currentPage} / {totalPages} 페이지
          </p>
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
                <li><a href="/credit" className="hover:text-blue-600">신용이야기</a></li>
                <li><a href="/personal" className="hover:text-blue-600">개인회생</a></li>
                <li><a href="/corporate" className="hover:text-blue-600">법인회생</a></li>
                <li><a href="/workout" className="hover:text-blue-600">워크아웃</a></li>
                <li><a href="/card" className="hover:text-blue-600">신용카드</a></li>
                <li><a href="/loan" className="hover:text-blue-600">대출</a></li>
                <li><a href="/news" className="hover:text-blue-600">뉴스정보</a></li>
                <li><a href="/calculator" className="hover:text-blue-600">계산기</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-black mb-4">정보</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/ad" className="hover:text-blue-600">광고문의</a></li>
                <li><a href="/admin" className="hover:text-red-600 text-gray-500">관리자</a></li>
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
                  최신 금융 뉴스 알림 서비스 - 실시간 정보 제공
                </p>
                <p className="text-xs text-blue-100 truncate">
                  무료 구독 | 맞춤 뉴스 | 전문 분석
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-white text-blue-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors">
                구독신청
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