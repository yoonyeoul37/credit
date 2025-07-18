'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileNav from '../components/MobileNav';
import StickyAd from '../components/StickyAd';

export default function PersonalPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  
  // 개인회생 관련 글들 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      const isProduction = true; // 실제 API 사용
      
      if (isProduction) {
        // 프로덕션: 실제 API 호출
        try {
          const response = await fetch('/api/posts?category=personal');
          const data = await response.json();
          
          if (response.ok) {
            setPosts(data.posts || []);
            setTotalPosts(data.pagination?.total || 0);
          } else {
            throw new Error('게시글을 불러오는데 실패했습니다.');
          }
        } catch (error) {
          console.error('게시글 로딩 실패:', error);
          setPosts([]);
        }
      }
      setLoading(false);
    };
    
    fetchPosts();
  }, []);
  
  // 페이징 계산 (API에서 받은 전체 게시글 수 사용)
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const personalPosts = posts.slice(startIndex, endIndex);

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
      <MobileNav currentPage="/personal" />
      
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
                  <Link href="/personal" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">개인회생</Link>
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
        {/* 카테고리 제목 */}
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-black mb-2">개인회생</h2>
          <p className="text-sm text-gray-600">개인회생 절차와 경험을 나누는 공간입니다</p>
        </div>

        {/* 프리미엄 광고 - 조건부 렌더링 */}
        {/* 스티키 광고 컴포넌트로 대체 */}
        
        {/* 글쓰기 버튼 */}
        <div className="flex justify-center mb-6">
          <div className="w-[728px] flex justify-end">
            <Link 
              href="/write?category=personal" 
              className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs font-medium"
            >
              작성하기
            </Link>
          </div>
        </div>
        
        {/* 게시글 목록 */}
        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-gray-400 text-5xl mb-4">🏠</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">아직 개인회생 게시글이 없습니다</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              첫 번째 개인회생 경험담을 작성해보세요!<br />
              여러분의 회생 과정을 다른 분들과 공유해주세요.
            </p>
            <Link 
              href="/write?category=personal" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              글쓰기 시작하기
            </Link>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="space-y-1">
            {personalPosts.map((post, index) => (
              <div key={post.id}>
                {/* 리스트 광고 (6번째 글 뒤에 삽입) - 조건부 렌더링 */}
                {/* 리스트 광고는 더 이상 사용되지 않으므로 제거 */}
                
                {/* 게시글 아이템 */}
                <div className="flex items-start py-2 hover:bg-gray-50 -mx-2 px-2">
                  <div className="flex-shrink-0 w-8 text-right">
                    <span className="text-sm text-gray-500">{(currentPage - 1) * postsPerPage + index + 1}</span>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center space-x-2">
                      <a href={`/post/${post.id}`} className="text-black hover:text-blue-600 text-sm leading-relaxed">
                        {post.title}
                      </a>
                      <span className="text-xs text-gray-500 bg-blue-100 px-2 py-0.5 rounded">
                        개인회생
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
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
        {totalPages > 1 && (
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
        )}

        {/* 페이지 정보 */}
        {totalPages > 1 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              전체 {totalPosts}개 글 | {currentPage} / {totalPages} 페이지
            </p>
          </div>
        )}
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
      <StickyAd />
    </div>
  );
} 