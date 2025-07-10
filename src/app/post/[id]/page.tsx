'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showStickyAd, setShowStickyAd] = useState(true);
  const [post, setPost] = useState(null);
  
  // 광고 데이터 (실제로는 관리자 페이지에서 가져옴)
  const [premiumAd, setPremiumAd] = useState({
    isActive: true,
    title: '신용회복 전문 상담센터 - 프리미엄 광고',
    content: '24시간 무료 상담 | 성공률 95% | 맞춤 솔루션 제공'
  });
  
  const [listAd, setListAd] = useState({
    isActive: true,
    title: '저금리 대출 비교 플랫폼',
    content: 'AI 맞춤 대출 상품 추천 | 즉시 심사'
  });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    nickname: '',
    password: '',
    content: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState(''); // 'post' or 'comment'
  const [reportTargetId, setReportTargetId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [commentPasswordModal, setCommentPasswordModal] = useState(false);
  const [commentPasswordInput, setCommentPasswordInput] = useState('');
  const [commentAction, setCommentAction] = useState('');
  const [commentActionId, setCommentActionId] = useState(null);

  // 샘플 데이터 (실제로는 API에서 가져옴)
  const samplePosts = {
    1: {
      id: 1,
      title: '개인회생 신청 후 3년간의 경험담',
      content: `안녕하세요. 개인회생을 신청한 지 3년이 지나서 경험을 공유하려고 합니다.

처음에는 정말 막막했는데, 지금 돌이켜보니 개인회생이 제게는 새로운 시작이었습니다.

**신청 과정:**
1. 변호사 상담 (비용: 300만원)
2. 서류 준비 (약 1개월)
3. 법원 접수 및 개시결정 (약 2개월)
4. 변제계획 승인 (약 3개월)

**현재 상황:**
- 월 변제금: 80만원 (5년간)
- 변제율: 25%
- 남은 기간: 2년

정말 힘들었지만, 이제는 안정적인 생활을 하고 있습니다. 
질문 있으시면 답변 드리겠습니다.`,
      nickname: '희망이',
      category: 'personal',
      categoryName: '개인회생',
      createdAt: '2024-01-15 14:30',
      views: 1234,
      likes: 15,
      images: []
    },
    2: {
      id: 2,
      title: '법인회생 절차 중 궁금한 점들',
      content: `법인회생 절차를 진행하면서 겪었던 어려움들을 공유하고 싶습니다.

특히 직원들과의 소통이 가장 어려웠던 부분이었습니다...`,
      nickname: '사장님',
      category: 'corporate',
      categoryName: '법인회생',
      createdAt: '2024-01-14 10:15',
      views: 856,
      likes: 8,
      images: []
    }
  };

  const sampleComments = [
    {
      id: 1,
      postId: 1,
      nickname: '응원합니다',
      content: '좋은 정보 감사합니다. 저도 개인회생 준비 중인데 많은 도움이 되었습니다.',
      createdAt: '2024-01-15 15:20'
    },
    {
      id: 2,
      postId: 1,
      nickname: '질문있어요',
      content: '변호사 선임은 필수인가요? 본인신청도 가능한지 궁금합니다.',
      createdAt: '2024-01-15 16:45'
    }
  ];

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져옴
    const postId = parseInt(params.id);
    const postData = samplePosts[postId];
    
    if (postData) {
      setPost(postData);
      setComments(sampleComments.filter(comment => comment.postId === postId));
      setLikesCount(postData.likes);
      
      // 실제로는 사용자의 좋아요 상태를 서버에서 가져옴
      // 현재는 로컬 스토리지에서 확인
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      setIsLiked(likedPosts.includes(postId));
    }
    
    setIsLoading(false);
  }, [params.id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    
    if (!newComment.content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    // 고유한 ID 생성 (기존 댓글 ID 중 최대값 + 1)
    const maxId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) : 0;
    const comment = {
      id: maxId + 1,
      postId: parseInt(params.id),
      nickname: newComment.nickname,
      content: newComment.content,
      password: newComment.password, // 비밀번호도 저장 (실제로는 해시화해야 함)
      createdAt: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setComments([...comments, comment]);
    setNewComment({ nickname: '', password: '', content: '' });
    alert('댓글이 등록되었습니다.');
  };

  const handlePasswordAction = (action) => {
    setPasswordAction(action);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = () => {
    if (!passwordInput.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    // 실제로는 서버에서 비밀번호 확인
    if (passwordAction === 'edit') {
      router.push(`/post/${params.id}/edit`);
    } else if (passwordAction === 'delete') {
      if (confirm('정말로 삭제하시겠습니까?')) {
        alert('게시물이 삭제되었습니다.');
        router.push('/');
      }
    }

    setShowPasswordModal(false);
    setPasswordInput('');
  };

  const handleReportClick = (type, targetId) => {
    setReportType(type);
    setReportTargetId(targetId);
    setShowReportModal(true);
  };

  const handleReportSubmit = () => {
    if (!reportReason.trim()) {
      alert('신고 사유를 선택해주세요.');
      return;
    }

    // 실제로는 서버에 신고 데이터 전송
    const reportData = {
      type: reportType,
      targetId: reportTargetId,
      reason: reportReason,
      reporter: '익명', // 실제로는 로그인한 사용자 정보
      createdAt: new Date().toISOString().split('T')[0]
    };

    console.log('신고 데이터:', reportData);
    alert('신고가 접수되었습니다. 관리자가 검토 후 조치하겠습니다.');
    
    setShowReportModal(false);
    setReportReason('');
    setReportType('');
    setReportTargetId(null);
  };

  const handleLikeToggle = () => {
    const postId = parseInt(params.id);
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    
    if (isLiked) {
      // 좋아요 취소
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
      const updatedLikedPosts = likedPosts.filter(id => id !== postId);
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
    } else {
      // 좋아요 추가
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
      const updatedLikedPosts = [...likedPosts, postId];
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
    }
    
    // 실제로는 서버에 좋아요 상태 전송
    console.log('좋아요 상태:', { postId, isLiked: !isLiked, likesCount: isLiked ? likesCount - 1 : likesCount + 1 });
  };

  const handleCommentPasswordAction = (action, commentId) => {
    setCommentAction(action);
    setCommentActionId(commentId);
    setCommentPasswordModal(true);
  };

  const handleCommentPasswordSubmit = () => {
    if (!commentPasswordInput.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    // 실제로는 서버에서 비밀번호 확인
    // 여기서는 임시로 모든 비밀번호를 허용
    if (commentAction === 'edit') {
      const comment = comments.find(c => c.id === commentActionId);
      if (comment) {
        setEditingCommentId(commentActionId);
        setEditingCommentContent(comment.content);
      }
    } else if (commentAction === 'delete') {
      if (confirm('정말로 댓글을 삭제하시겠습니까?')) {
        setComments(comments.filter(c => c.id !== commentActionId));
        alert('댓글이 삭제되었습니다.');
      }
    }

    setCommentPasswordModal(false);
    setCommentPasswordInput('');
    setCommentAction('');
    setCommentActionId(null);
  };

  const handleCommentEdit = (commentId) => {
    if (!editingCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, content: editingCommentContent }
        : comment
    ));
    
    setEditingCommentId(null);
    setEditingCommentContent('');
    alert('댓글이 수정되었습니다.');
  };

  const handleCommentEditCancel = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  if (isLoading) {
    return (
      <div className="font-pretendard font-light min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="font-pretendard font-light min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-700 mb-4">게시물을 찾을 수 없습니다</h2>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-pretendard font-light min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-gray-200 bg-white sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-xl font-normal text-black">
                  <a href="/" className="hover:text-blue-600">크레딧스토리</a>
                </h1>
                <p className="text-xs text-gray-500 -mt-1 text-right">Credit Story</p>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">전체</a>
                <a href="/credit" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">신용이야기</a>
                <a href="/personal" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">개인회생</a>
                <a href="/corporate" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">법인회생</a>
                <a href="/workout" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">워크아웃</a>
                <a href="/card" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">신용카드</a>
                <a href="/loan" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">대출</a>
                <a href="/news" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">뉴스정보</a>
                <a href="/calculator" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">계산기</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/write" 
                className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                ✏️ 글쓰기
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 프리미엄 광고 - 조건부 렌더링 */}
        {premiumAd?.isActive && (
          <div className="mb-8 flex justify-center">
            <div className="w-[728px] h-[90px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm rounded-lg">
              <div className="text-center">
                <div className="text-lg mb-1">{premiumAd.title}</div>
                <div className="text-xs text-blue-100">{premiumAd.content}</div>
              </div>
            </div>
          </div>
        )}

        {/* 게시물 상세 */}
        <article className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          {/* 게시물 헤더 */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {post.categoryName}
                </span>
                <span className="text-sm text-gray-500">#{post.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePasswordAction('edit')}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  수정
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => handlePasswordAction('delete')}
                  className="text-sm text-gray-600 hover:text-red-600"
                >
                  삭제
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => handleReportClick('post', post.id)}
                  className="text-sm text-gray-600 hover:text-red-600"
                >
                  신고
                </button>
              </div>
            </div>
            <h1 className="text-2xl font-medium text-black mb-3">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">{post.nickname}</span>
                <span>{post.createdAt}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>조회 {post.views.toLocaleString()}</span>
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                    isLiked 
                      ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-amber-600'
                  }`}
                >
                  <span className={`text-sm ${isLiked ? 'text-amber-500' : 'text-gray-400'}`}>
                    {isLiked ? '🧡' : '🤍'}
                  </span>
                  <span className="text-sm">{likesCount}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 게시물 내용 */}
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* 이미지 */}
          {post.images && post.images.length > 0 && (
            <div className="mt-6 space-y-4">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`첨부 이미지 ${index + 1}`}
                  className="max-w-full h-auto rounded border"
                />
              ))}
            </div>
          )}

          {/* 추천 버튼 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-amber-600'
                }`}
              >
                <span className={`text-lg ${isLiked ? 'text-amber-500' : 'text-gray-400'}`}>
                  {isLiked ? '🧡' : '🤍'}
                </span>
                <span className="text-sm font-medium">
                  {isLiked ? '추천 완료' : '추천하기'}
                </span>
                <span className="text-sm">({likesCount})</span>
              </button>
            </div>
          </div>
        </article>

        {/* 리스트 광고 (작게) - 조건부 렌더링 */}
        {listAd?.isActive && (
          <div className="mb-6 flex justify-center">
            <div className="w-full max-w-md py-0.5 px-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded text-center leading-tight">
              <div className="text-xs text-orange-400">#AD</div>
              <div className="text-xs text-black">{listAd.title}</div>
              <div className="text-xs text-gray-500">{listAd.content}</div>
            </div>
          </div>
        )}

        {/* 댓글 섹션 */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-4">
            댓글 <span className="text-blue-600">({comments.length})</span>
          </h3>

          {/* 댓글 목록 */}
          <div className="space-y-4 mb-6">
            {comments.map(comment => (
              <div key={comment.id} className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{comment.nickname}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{comment.createdAt}</span>
                    <button
                      onClick={() => handleCommentPasswordAction('edit', comment.id)}
                      className="text-xs text-gray-500 hover:text-blue-600"
                    >
                      수정
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => handleCommentPasswordAction('delete', comment.id)}
                      className="text-xs text-gray-500 hover:text-red-600"
                    >
                      삭제
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => handleReportClick('comment', comment.id)}
                      className="text-xs text-gray-500 hover:text-red-600"
                    >
                      신고
                    </button>
                  </div>
                </div>
                {editingCommentId === comment.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => handleCommentEdit(comment.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        수정 완료
                      </button>
                      <button
                        onClick={handleCommentEditCancel}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-800 leading-relaxed">{comment.content}</p>
                )}
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-8">첫 댓글을 남겨보세요!</p>
            )}
          </div>

          {/* 댓글 작성 */}
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                <input
                  type="text"
                  value={newComment.nickname}
                  onChange={(e) => setNewComment({...newComment, nickname: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="닉네임을 입력하세요"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                <input
                  type="password"
                  value={newComment.password}
                  onChange={(e) => setNewComment({...newComment, password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="댓글 수정/삭제용"
                  maxLength={20}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">댓글 내용</label>
              <textarea
                value={newComment.content}
                onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                placeholder="댓글을 입력하세요..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                댓글 등록
              </button>
            </div>
          </form>
        </section>

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

        {/* 목록으로 돌아가기 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      </main>

      {/* 비밀번호 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-black mb-4">
              {passwordAction === 'edit' ? '게시물 수정' : '게시물 삭제'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              작성 시 입력한 비밀번호를 입력해주세요.
            </p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="비밀번호 입력"
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordInput('');
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 신고 모달 */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-black mb-4">
              {reportType === 'post' ? '게시물 신고' : '댓글 신고'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              신고 사유를 선택해주세요. 허위 신고 시 제재를 받을 수 있습니다.
            </p>
            <div className="space-y-3 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reportReason"
                  value="스팸/광고"
                  checked={reportReason === '스팸/광고'}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">스팸/광고</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reportReason"
                  value="욕설/비방"
                  checked={reportReason === '욕설/비방'}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">욕설/비방</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reportReason"
                  value="부적절한 내용"
                  checked={reportReason === '부적절한 내용'}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">부적절한 내용</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reportReason"
                  value="저작권 침해"
                  checked={reportReason === '저작권 침해'}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">저작권 침해</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reportReason"
                  value="기타"
                  checked={reportReason === '기타'}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">기타</span>
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                  setReportType('');
                  setReportTargetId(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                신고하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="border-t border-gray-200 mt-16 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                <h3 className="text-lg font-normal text-black">
                  <a href="/" className="hover:text-blue-600">크레딧스토리</a>
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
                  관련 게시물 추천 서비스 - AI 맞춤 정보 제공
                </p>
                <p className="text-xs text-blue-100 truncate">
                  무료 추천 | 관련 정보 | 전문가 답변
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-white text-blue-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors">
                추천받기
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

      {/* 댓글 비밀번호 확인 모달 */}
      {commentPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-black mb-4">댓글 비밀번호 확인</h3>
            <p className="text-sm text-gray-600 mb-4">
              {commentAction === 'edit' ? '댓글을 수정하려면' : '댓글을 삭제하려면'} 비밀번호를 입력해주세요.
            </p>
            <input
              type="password"
              value={commentPasswordInput}
              onChange={(e) => setCommentPasswordInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="댓글 작성 시 입력한 비밀번호"
              onKeyPress={(e) => e.key === 'Enter' && handleCommentPasswordSubmit()}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setCommentPasswordModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                onClick={handleCommentPasswordSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 