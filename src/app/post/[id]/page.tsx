'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error('게시글을 찾을 수 없습니다.');
        }

        const data = await response.json();
        setPost(data.post);
      } catch (error: any) {
        console.error('게시글 조회 오류:', error);
        setError(error.message || '게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [resolvedParams.id]);

  // 시간 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 카테고리 이름 매핑
  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'credit': '신용이야기',
      'personal': '개인회생',
      'corporate': '법인회생',
      'workout': '워크아웃',
      'card': '신용카드',
      'loan': '대출'
    };
    return categoryMap[category] || category;
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
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">전체</Link>
                <Link href="/credit" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">신용이야기</Link>
                <Link href="/personal" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">개인회생</Link>
                <Link href="/corporate" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">법인회생</Link>
                <Link href="/workout" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">워크아웃</Link>
                <Link href="/card" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">신용카드</Link>
                <Link href="/loan" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">대출</Link>
                <Link href="/news" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">뉴스정보</Link>
                <Link href="/calculator" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">계산기</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/write" 
                className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                ✏️ 글쓰기
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 로딩 상태 */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">게시글을 불러오는 중...</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-red-500 mb-4">{error}</div>
            <Link 
              href="/" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        )}

        {/* 게시글 내용 */}
        {post && (
          <article className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="mb-3">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {getCategoryName(post.category)}
                </span>
              </div>
              <h1 className="text-2xl font-medium text-black mb-3">
                {post.title}
              </h1>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="font-medium text-gray-700">{post.author}</span>
                <div className="flex items-center space-x-3">
                  <span>{formatDate(post.created_at)}</span>
                  <span>조회 {post.views}</span>
                  <span>좋아요 {post.likes}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* 이미지가 있다면 표시 */}
            {post.images && post.images.length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.images.map((image: string, index: number) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`게시글 이미지 ${index + 1}`}
                      className="w-full h-auto rounded-lg border"
                    />
                  ))}
                </div>
              </div>
            )}
          </article>
        )}

        <div className="text-center">
          <Link 
            href="/" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
} 