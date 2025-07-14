'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileNavigation from './components/MobileNavigation';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [showStickyAd, setShowStickyAd] = useState(true);
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
    isActive: false,
    title: '',
    content: ''
  });
  
  const [listAd, setListAd] = useState({
    isActive: false,
    title: '',
    content: ''
  });
  
  // 광고 데이터 가져오기
  useEffect(() => {
    const fetchAds = async () => {
      const isProduction = process.env.NODE_ENV === 'production';
      
      if (isProduction) {
        // 프로덕션: 실제 광고 API 호출
        try {
          const response = await fetch('/api/ads?position=header');
          const data = await response.json();
          
          if (data.ads && data.ads.length > 0) {
            setPremiumAd({
              isActive: true,
              title: data.ads[0].title,
              content: data.ads[0].description
            });
          }
          
          const listResponse = await fetch('/api/ads?position=sidebar');
          const listData = await listResponse.json();
          
          if (listData.ads && listData.ads.length > 0) {
            setListAd({
              isActive: true,
              title: listData.ads[0].title,
              content: listData.ads[0].description
            });
          }
        } catch (error) {
          console.error('광고 데이터 가져오기 실패:', error);
        }
      } else {
        // 개발환경: 더미 광고 데이터
        setPremiumAd({
          isActive: true,
          title: '신용회복 전문 상담센터 - 프리미엄 광고',
          content: '24시간 무료 상담 | 성공률 95% | 맞춤 솔루션 제공'
        });
        
        setListAd({
          isActive: true,
          title: '저금리 대출 비교 플랫폼 - AI 맞춤 대출 상품 추천',
          content: '핀테크 플랫폼 | AI 분석 | 최저금리 | 즉시 심사'
        });
      }
    };
    
    fetchAds();
  }, []);
  
  // API에서 게시글 데이터 가져오기 (Supabase 미설정 시 더미 데이터 사용)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // 환경에 따른 분기 처리
        const isProduction = true; // 실제 API 사용하도록 변경
        
        if (isProduction) {
          // 프로덕션: 실제 API 호출 시도
          console.log('🌐 프로덕션 모드: 실제 API 호출 중...');
          
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
              commentCount: post.commentCount || 0, // 실제 댓글 수 사용
              views: post.views,
              likes: post.likes || 0 // 실제 좋아요 수 사용
            };
          });

          setPosts(formattedPosts);
          setError(null);
          setLoading(false);
          return;
        } else {
          // 개발환경: 더미 데이터 사용
          console.log('🚧 개발 모드: 더미 데이터 사용');
          
          const dummyPosts = [
            {
              id: 1,
              title: "개인회생 신청 후 신용 회복 과정 질문드립니다",
              category: "개인회생",
              author: "회생성공자",
              createdAt: "2시간 전",
              commentCount: 12,
              views: 89
            },
            {
              id: 2,
              title: "신용카드 연체 상황에서 대출 가능한 곳이 있을까요?",
              category: "신용카드",
              author: "신용회복중",
              createdAt: "4시간 전",
              commentCount: 8,
              views: 156
            },
            {
              id: 3,
              title: "워크아웃 진행 중인데 추가 대출이 필요합니다",
              category: "워크아웃",
              author: "재정전문가",
              createdAt: "6시간 전",
              commentCount: 15,
              views: 203
            },
            {
              id: 4,
              title: "법인회생 절차 관련 경험담 공유합니다",
              category: "법인회생",
              author: "법인대표",
              createdAt: "8시간 전",
              commentCount: 5,
              views: 67
            },
            {
              id: 5,
              title: "신용등급 상승을 위한 실질적인 방법들",
              category: "신용이야기",
              author: "대출마스터",
              createdAt: "10시간 전",
              commentCount: 23,
              views: 301
            }
          ];
          
          setPosts(dummyPosts);
          setError(null);
          setLoading(false);
          return;
        }

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
        // 혹시 오류 발생 시 더미 데이터 사용
        console.log('🚧 오류 발생: 더미 데이터로 대체');
        const fallbackPosts = [
          {
            id: 1,
            title: "개인회생 신청 후기 - 성공사례 공유",
            category: "개인회생",
            author: "회생성공자",
            createdAt: "2시간 전",
            commentCount: 12,
            views: 89
          }
        ];
        setPosts(fallbackPosts);
        setError(null);
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

  return (
    <div className="font-pretendard font-light min-h-screen bg-white">
      {/* 모바일 네비게이션 */}
      <MobileNavigation currentPage="/" />
      
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
            <div className="w-full max-w-[728px] min-h-[90px] bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-center text-sm text-blue-600 rounded-lg p-4">
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
                <div className="flex items-start py-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded -mx-2 px-3">
                  <div className="flex-shrink-0 w-8 md:w-8 text-right">
                    <span className="text-xs md:text-sm text-orange-400">#AD</span>
                  </div>
                  <div className="flex-1 ml-3 md:ml-4">
                    <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                      <a href="#" className="text-black hover:text-orange-600 text-sm md:text-base leading-relaxed">
                        {listAd.title}
                      </a>
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
            {!loading && !error && (
              <>전체 {posts.length}개 글 | {currentPage} / {totalPages || 1} 페이지</>
            )}
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
      {showStickyAd && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg z-50">
          <div className="max-w-4xl mx-auto px-3 md:px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  신용회복 전문 상담센터 - 24시간 무료 상담
                </p>
                <p className="text-xs text-blue-100 truncate">
                  성공률 95% | 맞춤 솔루션 | 전국 지점 운영
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button className="bg-white text-blue-600 px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors touch-manipulation">
                상담신청
              </button>
              <button
                onClick={() => setShowStickyAd(false)}
                className="text-blue-100 hover:text-white p-2 rounded-lg transition-colors touch-manipulation"
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
