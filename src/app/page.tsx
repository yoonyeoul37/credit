'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileNav from './components/MobileNav';
import StickyAd from './components/StickyAd';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 시간 포맷 함수
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return date.toLocaleDateString();
  };
  
  // 광고 데이터 (실제로는 관리자 페이지에서 가져옴)
  const [premiumAd, setPremiumAd] = useState({
    id: null,
    isActive: false,
    title: '',
    content: '',
    link_url: ''
  });
  
  const [listAd, setListAd] = useState({
    id: null,
    isActive: false,
    title: '',
    content: '',
    link_url: ''
  });
  
  // 광고 데이터 가져오기
  useEffect(() => {
    const fetchAds = async () => {
      // 실제 광고 API 호출 (개발/프로덕션 모두)
        try {
          const response = await fetch('/api/ads?position=header');
          const data = await response.json();
          
          if (data.ads && data.ads.length > 0) {
          // 가중치 기반 랜덤 선택
          const selectedAd = getWeightedRandomAd(data.ads);
            setPremiumAd({
            id: selectedAd.id,
              isActive: true,
            title: selectedAd.title,
            content: selectedAd.description,
            link_url: selectedAd.url || ''
            });
          }
          
          const listResponse = await fetch('/api/ads?position=sidebar');
          const listData = await listResponse.json();
          
          if (listData.ads && listData.ads.length > 0) {
          // 가중치 기반 랜덤 선택
          const selectedListAd = getWeightedRandomAd(listData.ads);
            setListAd({
            id: selectedListAd.id,
              isActive: true,
            title: selectedListAd.title,
            content: selectedListAd.description,
            link_url: selectedListAd.url || ''
            });
          }
        } catch (error) {
          console.error('광고 데이터 가져오기 실패:', error);
        setPremiumAd({ id: null, isActive: false, title: '', content: '', link_url: '' });
        setListAd({ id: null, isActive: false, title: '', content: '', link_url: '' });
      }
    };

    // 가중치 기반 랜덤 광고 선택 함수
    const getWeightedRandomAd = (ads) => {
      if (ads.length === 1) return ads[0];
      
      // 우선순위를 가중치로 사용 (최소 가중치 1)
      const totalWeight = ads.reduce((sum, ad) => sum + Math.max(ad.priority || 1, 1), 0);
      let random = Math.random() * totalWeight;
      
      for (let ad of ads) {
        const weight = Math.max(ad.priority || 1, 1);
        random -= weight;
        if (random <= 0) return ad;
      }
      
      // fallback: 첫 번째 광고 반환
      return ads[0];
    };
    
    fetchAds();
  }, []);
  
  // API에서 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // 실제 API 호출
        console.log('🌐 실제 API 호출 중...');
        
          const response = await fetch(`/api/posts?page=${currentPage}&limit=${postsPerPage}&sort=created_at`);
          
          if (!response.ok) {
            throw new Error('게시글을 불러오는데 실패했습니다.');
          }

          const data = await response.json();
          
          // 데이터 포맷 변환 (기존 UI에 맞게)
          const formattedPosts = data.posts.map(post => {
            const categoryMap = {
              'credit': '신용이야기',
              'personal': '개인회생', 
              'corporate': '법인회생',
              'workout': '워크아웃',
              'card': '신용카드',
              'loan': '대출',
              'news': '뉴스정보'
            };

            const timeAgo = getTimeAgo(post.created_at);

            return {
              id: post.id,
              title: post.title,
              category: categoryMap[post.category] || post.category,
              author: post.author,
              createdAt: timeAgo,
              commentCount: post.commentCount || 0, // 실제 댓글 수 사용
              views: post.views,
              likes: post.likes || 0 // 실제 좋아요 수 사용
            };
          });

          setPosts(formattedPosts);
          setError(null);

        /* 
        // 실제 API 호출 (Supabase 설정 후 활성화)
        const response = await fetch(`/api/posts?page=${currentPage}&limit=${postsPerPage}&sort=created_at`);
        
        if (!response.ok) {
          throw new Error('게시글을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        
        // 데이터 포맷 변환 (기존 UI에 맞게)
        const formattedPosts = data.posts.map(post => {
          const categoryMap = {
            'credit': '신용이야기',
            'personal': '개인회생', 
            'corporate': '법인회생',
            'workout': '워크아웃',
            'card': '신용카드',
            'loan': '대출',
            'news': '뉴스정보'
          };

          const timeAgo = getTimeAgo(post.created_at);

          return {
            id: post.id,
            title: post.title,
            category: categoryMap[post.category] || post.category,
            author: post.author,
            createdAt: timeAgo,
            commentCount: 0, // 댓글 수는 별도 계산 필요
            views: post.views
          };
        });

        setPosts(formattedPosts);
        */
      } catch (err) {
        // 오류 발생 시 빈 배열로 설정
        console.error('❌ 게시글 로딩 실패:', err);
        setPosts([]);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, postsPerPage]);



  // 페이징 계산 (API에서 페이징 처리되므로 간소화)
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts;

  // 페이지네이션 범위 계산 (10페이지씩)
  const pageGroup = Math.ceil(currentPage / 10);
  const startPage = (pageGroup - 1) * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 광고 클릭 추적 함수
  const handleAdClick = async (adId: number, adUrl?: string) => {
    try {
      // 클릭 추적 API 호출
      await fetch('/api/ads/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ad_id: adId,
          page_url: window.location.href
        }),
      });
      
      // 광고 URL이 있으면 새 탭에서 열기
      if (adUrl) {
        window.open(adUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('광고 클릭 추적 실패:', error);
      // 추적이 실패해도 광고 링크는 열어줌
      if (adUrl) {
        window.open(adUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="font-pretendard font-light min-h-screen bg-white">
      {/* 모바일 네비게이션 */}
      <MobileNav currentPage="/" />
      
      {/* 헤더 */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-lg md:text-xl font-normal text-black">
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
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-normal text-black mb-2">전체 게시글</h2>
          <p className="text-sm text-gray-600">모든 카테고리의 최신 글을 확인하세요</p>
        </div>

        {/* 상단 배너 광고 - 조건부 렌더링 */}
        {premiumAd?.isActive && (
          <div className="mb-4 md:mb-6 flex justify-center">
            <div 
              className="w-full max-w-[728px] min-h-[90px] bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-center text-sm text-blue-600 rounded-lg p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
              onClick={() => handleAdClick(premiumAd.id, premiumAd.link_url)}
            >
              <div className="text-center">
                <div className="text-base md:text-lg mb-1">{premiumAd.title}</div>
                <div className="text-xs md:text-sm text-blue-500">{premiumAd.content}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* 글쓰기 버튼 */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="w-full max-w-[728px] flex justify-end">
            <Link 
              href="/write" 
              className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs font-medium"
            >
              작성하기
            </Link>
          </div>
        </div>
        
        {/* 로딩 상태 */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">게시글을 불러오는 중...</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="flex justify-center py-8">
            <div className="text-red-500">{error}</div>
          </div>
        )}

        {/* 게시글 목록 */}
        {!loading && !error && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-gray-400 text-5xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">아직 게시글이 없습니다</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              첫 번째 게시글을 작성해보세요!<br />
              여러분의 신용 회복 이야기를 공유해주세요.
            </p>
            <Link 
              href="/write" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              글쓰기 시작하기
            </Link>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="space-y-1">
            {currentPosts.map((post, index) => (
            <div key={post.id}>
              {/* 광고 배너 (6번째 글 뒤에 삽입) - 조건부 렌더링 */}
              {index === 5 && listAd?.isActive && (
                <div 
                  className="flex items-start py-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded -mx-2 px-3 cursor-pointer hover:bg-gradient-to-r hover:from-orange-100 hover:to-amber-100 transition-all duration-200"
                  onClick={() => handleAdClick(listAd.id, listAd.link_url)}
                >
                  <div className="flex-shrink-0 w-8 md:w-8 text-right">
                    <span className="text-xs md:text-sm text-orange-400">#AD</span>
                  </div>
                  <div className="flex-1 ml-3 md:ml-4">
                    <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                      <span className="text-black hover:text-orange-600 text-sm md:text-base leading-relaxed">
                        {listAd.title}
                      </span>
                      <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded self-start">
                        금융 광고
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                      {listAd.content.split(' | ').map((item, idx) => (
                        <span key={idx}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* 게시글 아이템 */}
              <div className="flex items-start py-3 hover:bg-gray-50 -mx-2 px-3 touch-manipulation">
                <div className="flex-shrink-0 w-8 md:w-8 text-right">
                  <span className="text-xs md:text-sm text-gray-500">{(currentPage - 1) * postsPerPage + index + 1}</span>
                </div>
                <div className="flex-1 ml-3 md:ml-4">
                  <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                    <Link href={`/post/${post.id}`} className="text-black hover:text-blue-600 text-sm md:text-base leading-relaxed">
                      {post.title}
                    </Link>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded self-start">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                    <span>{post.author}</span>
                    <span>{post.createdAt}</span>
                    <span>{post.commentCount} 댓글</span>
                    <span>{post.views} 조회</span>
                    <span>{post.likes} 좋아요</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* 페이지네이션 */}
        <div className="mt-6 md:mt-8 flex justify-center">
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* 이전 10페이지 */}
            {startPage > 1 && (
              <button
                onClick={() => handlePageChange(startPage - 1)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg touch-manipulation"
              >
                ← 이전
              </button>
            )}
            
            {/* 페이지 번호들 */}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm rounded-lg touch-manipulation ${
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
                className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg touch-manipulation"
              >
                다음 →
              </button>
            )}
          </div>
        </div>

        {/* 페이지 정보 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            전체 {posts.length}개 글 | {currentPage} / {totalPages} 페이지
          </p>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 mt-12 md:mt-16 py-8 md:py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                <h3 className="text-lg font-normal text-black">
                  <Link href="/" className="hover:text-blue-600">크레딧스토리</Link>
                </h3>
                <p className="text-xs text-gray-500 -mt-1">Credit Story</p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                신용회복과 금융 재건을 위한 정보 공유 커뮤니티입니다.<br className="hidden md:block"/>
                개인회생, 법인회생, 워크아웃 등 다양한 경험을 나누며<br className="hidden md:block"/>
                함께 성장해나가는 공간입니다.
              </p>
              <p className="text-xs text-gray-500">
                본 사이트의 정보는 참고용이며, 전문가와 상담을 권장합니다.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-black mb-4">커뮤니티</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/credit" className="hover:text-blue-600 py-1 block">신용이야기</Link></li>
                <li><Link href="/personal" className="hover:text-blue-600 py-1 block">개인회생</Link></li>
                <li><Link href="/corporate" className="hover:text-blue-600 py-1 block">법인회생</Link></li>
                <li><Link href="/workout" className="hover:text-blue-600 py-1 block">워크아웃</Link></li>
                <li><Link href="/card" className="hover:text-blue-600 py-1 block">신용카드</Link></li>
                <li><Link href="/loan" className="hover:text-blue-600 py-1 block">대출</Link></li>
                <li><Link href="/news" className="hover:text-blue-600 py-1 block">뉴스정보</Link></li>
                <li><Link href="/calculator" className="hover:text-blue-600 py-1 block">계산기</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-black mb-4">정보</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/ad" className="hover:text-blue-600 py-1 block">광고문의</Link></li>
                <li><Link href="/admin" className="hover:text-red-600 text-gray-500 py-1 block">관리자</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 크레딧스토리. 모든 권리 보유.
            </p>
          </div>
        </div>
      </footer>

      {/* 스티키 광고 */}
      <StickyAd />
    </div>
  );
}
