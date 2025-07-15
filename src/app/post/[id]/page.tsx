'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReportModal from '../../components/ReportModal';
import MobileNav from '../../components/MobileNav';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState<'edit' | 'delete' | null>(null);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState({
    content: '',
    author: '',
    password: ''
  });
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentData, setEditCommentData] = useState({
    content: '',
    password: ''
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const viewCountIncremented = useRef(false); // 조회수 증가 중복 방지
  const [isLiking, setIsLiking] = useState(false); // 좋아요 처리 중 상태
  const [hasLiked, setHasLiked] = useState(false); // 좋아요 여부 상태
  const [showStickyAd, setShowStickyAd] = useState(true); // 스티키 광고 표시 상태

  // 신고 모달 상태
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    type: 'post' | 'comment';
    id: string;
  } | null>(null);

  // 광고 데이터 상태
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

  // 광고 클릭 핸들러
  const handleAdClick = async (adId: number, adUrl?: string) => {
    if (adId && adUrl) {
      try {
        // 광고 클릭 추적
        await fetch(`/api/ads/${adId}/click`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_agent: navigator.userAgent,
            referrer: window.location.href,
            timestamp: new Date().toISOString()
          })
        });

        // 광고 링크로 이동
        window.open(adUrl, '_blank');
      } catch (error) {
        console.error('광고 클릭 추적 실패:', error);
        // 추적 실패해도 링크는 열기
        window.open(adUrl, '_blank');
      }
    }
  };

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
        
        // 이미 좋아요를 눌렀는지 확인
        const likedPosts = sessionStorage.getItem('likedPosts');
        const likedPostsArray = likedPosts ? JSON.parse(likedPosts) : [];
        setHasLiked(likedPostsArray.includes(resolvedParams.id));
        
        // 조회수 증가 (한 번만 실행되도록 보장)
        if (!viewCountIncremented.current) {
          const viewedPosts = sessionStorage.getItem('viewedPosts');
          const viewedPostsArray = viewedPosts ? JSON.parse(viewedPosts) : [];
          
          if (!viewedPostsArray.includes(resolvedParams.id)) {
            viewCountIncremented.current = true; // 즉시 플래그 설정
            
            // 조회수 증가 API 호출
            fetch(`/api/posts/${resolvedParams.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
            }).then(response => {
              if (response.ok) {
                // 세션 스토리지에 추가
                viewedPostsArray.push(resolvedParams.id);
                sessionStorage.setItem('viewedPosts', JSON.stringify(viewedPostsArray));
                
                // 게시글 조회수 업데이트
                setPost(prevPost => {
                  if (prevPost) {
                    return { ...prevPost, views: prevPost.views + 1 };
                  }
                  return prevPost;
                });
              }
            }).catch(error => {
              console.error('조회수 증가 오류:', error);
              viewCountIncremented.current = false; // 실패 시 플래그 초기화
            });
          }
        }
        
        // 게시글 로드 후 댓글도 로드
        fetchComments();
      } catch (error: any) {
        console.error('게시글 조회 오류:', error);
        setError(error.message || '게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [resolvedParams.id]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDropdown && !target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    try {
      setCommentLoading(true);
      const response = await fetch(`/api/comments?postId=${resolvedParams.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('댓글 로딩 오류:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  // 새 댓글 작성
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    
    if (!newComment.author.trim()) {
      alert('작성자명을 입력해주세요.');
      return;
    }
    
    if (!newComment.password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    setIsCommentSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: resolvedParams.id,
          content: newComment.content,
          author: newComment.author,
          password: newComment.password
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setNewComment({ content: '', author: '', password: '' });
        fetchComments(); // 댓글 목록 새로고침
        alert('댓글이 등록되었습니다.');
      } else {
        throw new Error(result.error || '댓글 등록에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('댓글 등록 오류:', error);
      alert(error.message || '댓글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  // 댓글 수정
  const handleCommentEdit = async (commentId: string) => {
    if (!editCommentData.content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    
    if (!editCommentData.password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editCommentData.content,
          password: editCommentData.password
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setEditingComment(null);
        setEditCommentData({ content: '', password: '' });
        fetchComments(); // 댓글 목록 새로고침
        alert('댓글이 수정되었습니다.');
      } else {
        throw new Error(result.error || '댓글 수정에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('댓글 수정 오류:', error);
      alert(error.message || '댓글 수정 중 오류가 발생했습니다.');
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId: string) => {
    const password = prompt('댓글 삭제를 위해 비밀번호를 입력해주세요:');
    
    if (!password) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (response.ok) {
        fetchComments(); // 댓글 목록 새로고침
        alert('댓글이 삭제되었습니다.');
      } else {
        throw new Error(result.error || '댓글 삭제에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('댓글 삭제 오류:', error);
      alert(error.message || '댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 수정/삭제 버튼 클릭 처리
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPasswordAction('edit');
    setShowPasswordModal(true);
    setShowDropdown(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPasswordAction('delete');
    setShowPasswordModal(true);
    setShowDropdown(false);
  };

  // 신고 기능 처리
  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('게시글 신고 버튼 클릭됨');
    setShowDropdown(false);
    setReportTarget({ type: 'post', id: resolvedParams.id });
    setShowReportModal(true);
  };

  // 댓글 신고 처리
  const handleCommentReportClick = (commentId: string) => {
    console.log('댓글 신고 버튼 클릭됨, commentId:', commentId);
    setReportTarget({ type: 'comment', id: commentId });
    setShowReportModal(true);
  };

  // 신고 제출 처리
  const handleReportSubmit = async (data: { reason: string; description: string }) => {
    console.log('신고 제출 시작:', { reportTarget, data });
    if (!reportTarget) return;

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_type: reportTarget.type,
          target_id: reportTarget.id,
          reason: data.reason,
          description: data.description
        }),
      });

      const result = await response.json();
      console.log('신고 API 응답:', result);

      if (response.ok) {
        alert('신고가 접수되었습니다.');
        setShowReportModal(false);
        setReportTarget(null);
      } else if (response.status === 409) {
        // 중복 신고의 경우 에러가 아닌 알림으로 처리
        alert('이미 신고한 내용입니다.');
        setShowReportModal(false);
        setReportTarget(null);
      } else {
        throw new Error(result.error || '신고 접수에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('신고 제출 오류:', error);
      alert('신고 처리 중 오류가 발생했습니다.');
    }
  };

  // 좋아요 처리
  const handleLike = async () => {
    if (isLiking || hasLiked) return; // 중복 클릭 방지 및 이미 좋아요 누른 경우 방지
    
    setIsLiking(true);
    
    try {
      const response = await fetch(`/api/posts/${resolvedParams.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPost(prevPost => {
          if (prevPost) {
            return { ...prevPost, likes: data.likes };
          }
          return prevPost;
        });
        
        // 좋아요 상태 업데이트 및 세션 스토리지에 저장
        setHasLiked(true);
        const likedPosts = sessionStorage.getItem('likedPosts');
        const likedPostsArray = likedPosts ? JSON.parse(likedPosts) : [];
        likedPostsArray.push(resolvedParams.id);
        sessionStorage.setItem('likedPosts', JSON.stringify(likedPostsArray));
      }
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
    } finally {
      setIsLiking(false);
    }
  };

  // 비밀번호 확인 및 액션 실행
  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      if (passwordAction === 'edit') {
        // 수정: 글쓰기 페이지로 이동 (기존 데이터와 함께)
        const editUrl = `/write?edit=${resolvedParams.id}&password=${encodeURIComponent(password)}`;
        router.push(editUrl);
      } else if (passwordAction === 'delete') {
        // 삭제: API 호출
        const response = await fetch(`/api/posts/${resolvedParams.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        });

        const result = await response.json();

        if (response.ok) {
          alert('게시글이 삭제되었습니다.');
          router.push('/');
        } else {
          throw new Error(result.error || '삭제에 실패했습니다.');
        }
      }
    } catch (error: any) {
      console.error('처리 오류:', error);
      alert(error.message || '처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
      setShowPasswordModal(false);
      setPassword('');
      setPasswordAction(null);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordAction(null);
  };

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
      {/* 모바일 네비게이션 */}
      <MobileNav currentPage="/post" />
      
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
        {/* 상단 프리미엄 광고 */}
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

            {/* 좋아요 버튼 */}
            <div className="mt-6 py-4 border-y border-gray-100">
              <div className="flex items-center justify-center">
                <button
                  onClick={handleLike}
                  disabled={isLiking || hasLiked}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-200 ${
                    hasLiked
                      ? 'bg-blue-50 border border-blue-200 cursor-not-allowed'
                      : isLiking 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-105 active:scale-95 cursor-pointer'
                  }`}
                >
                  <span className={`text-lg transition-colors ${
                    hasLiked
                      ? 'text-blue-500'
                      : isLiking 
                        ? 'text-gray-400' 
                        : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    {hasLiked ? '👍' : '🤍'}
                  </span>
                  <span className={`font-medium transition-colors ${
                    hasLiked
                      ? 'text-blue-600'
                      : isLiking 
                        ? 'text-gray-400' 
                        : 'text-gray-700 hover:text-blue-700'
                  }`}>
                    {isLiking 
                      ? '처리 중...' 
                      : hasLiked 
                        ? `좋아요 완료 ${post.likes}`
                        : `좋아요 ${post.likes}`
                    }
                  </span>
                </button>
              </div>
            </div>

            {/* 수정/삭제 버튼 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="relative dropdown-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(!showDropdown);
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-600 text-lg font-bold leading-none">⋯</span>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={handleEditClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          삭제
                        </button>
                        <button
                          onClick={handleReportClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          신고
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        )}

        {/* 리스트 광고 */}
        {post && listAd?.isActive && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
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
          </div>
        )}

        {/* 댓글 섹션 */}
        {post && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-black mb-4">
              댓글 ({comments.length})
            </h3>

            {/* 댓글 목록 */}
            <div className="space-y-4 mb-6">
              {commentLoading ? (
                <div className="text-center py-4 text-gray-500">댓글을 불러오는 중...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    {editingComment === comment.id ? (
                      /* 댓글 수정 모드 */
                      <div className="space-y-3">
                        <textarea
                          value={editCommentData.content}
                          onChange={(e) => setEditCommentData(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white resize-none"
                          rows={3}
                          placeholder="댓글을 입력하세요..."
                        />
                        <div className="flex items-center space-x-3">
                          <input
                            type="password"
                            value={editCommentData.password}
                            onChange={(e) => setEditCommentData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                            placeholder="비밀번호"
                          />
                          <button
                            onClick={() => handleCommentEdit(comment.id)}
                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          >
                            수정완료
                          </button>
                          <button
                            onClick={() => {
                              setEditingComment(null);
                              setEditCommentData({ content: '', password: '' });
                            }}
                            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* 댓글 표시 모드 */
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-700">{comment.author}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingComment(comment.id);
                                setEditCommentData({ content: comment.content, password: '' });
                              }}
                              className="text-xs text-gray-500 hover:text-blue-600"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleCommentDelete(comment.id)}
                              className="text-xs text-gray-500 hover:text-red-600"
                            >
                              삭제
                            </button>
                            <button
                              onClick={() => handleCommentReportClick(comment.id)}
                              className="text-xs text-gray-500 hover:text-red-600"
                            >
                              신고
                            </button>
                          </div>
                        </div>
                        <div className="text-gray-800 whitespace-pre-wrap">
                          {comment.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* 댓글 작성 폼 */}
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  댓글 작성
                </label>
                <textarea
                  value={newComment.content}
                  onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white resize-none"
                  rows={4}
                  placeholder="댓글을 입력하세요..."
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newComment.author}
                    onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="작성자명"
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="password"
                    value={newComment.password}
                    onChange={(e) => setNewComment(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="비밀번호 (수정/삭제시 필요)"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCommentSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isCommentSubmitting ? '등록 중...' : '댓글 등록'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 구글 애드센스 광고 */}
        {post && (
          <div className="mb-6">
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

      {/* 비밀번호 입력 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-black mb-4">
              {passwordAction === 'edit' ? '게시글 수정' : '게시글 삭제'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {passwordAction === 'edit' 
                ? '게시글을 수정하려면 비밀번호를 입력해주세요.' 
                : '게시글을 삭제하려면 비밀번호를 입력해주세요.'}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="비밀번호를 입력하세요"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                disabled={isProcessing}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handlePasswordSubmit}
                disabled={isProcessing}
                className={`px-4 py-2 text-white rounded transition-colors disabled:opacity-50 ${
                  passwordAction === 'edit' 
                    ? 'bg-yellow-600 hover:bg-yellow-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isProcessing ? '처리 중...' : (passwordAction === 'edit' ? '수정하기' : '삭제하기')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 신고 모달 */}
      {showReportModal && reportTarget && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onReportSubmit={handleReportSubmit}
          targetType={reportTarget.type}
          targetId={reportTarget.id}
        />
      )}

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