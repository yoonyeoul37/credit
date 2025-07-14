'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';
import MobileNavigation from '../components/MobileNavigation';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('ads');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedAds, setSelectedAds] = useState<number[]>([]);
  const [selectedNews, setSelectedNews] = useState<number[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [adForm, setAdForm] = useState({
    type: 'premium',
    title: '',
    content: '',
    url: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    isActive: true
  });
  const [newsForm, setNewsForm] = useState({
    title: '',
    summary: '',
    source: '',
    url: '',
    publishedAt: '',
    category: '정책',
    isImportant: false,
    isActive: true
  });

  // 샘플 데이터
  const [ads, setAds] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [reports, setReports] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 관리자 데이터 가져오기
  useEffect(() => {
    const fetchAdminData = async () => {
      const isProduction = true; // 항상 실제 API 호출하도록 수정
      
      if (isProduction) {
        // 프로덕션: 실제 API 호출
        try {
          const [adsResponse, postsResponse, commentsResponse, reportsResponse, newsResponse] = await Promise.all([
            fetch('/api/admin/ads'),
            fetch('/api/admin/posts'),
            fetch('/api/admin/comments'),
            fetch('/api/admin/reports'),
            fetch('/api/admin/news')
          ]);
          
          if (adsResponse.ok) {
            const adsData = await adsResponse.json();
            setAds(adsData.ads || []);
          }
          
          if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            setPosts(postsData.posts || []);
          }
          
          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            setComments(commentsData.comments || []);
          }
          
          if (reportsResponse.ok) {
            const reportsData = await reportsResponse.json();
            setReports(reportsData.reports || []);
          }
          
          if (newsResponse.ok) {
            const newsData = await newsResponse.json();
            setNewsItems(newsData.news || []);
          }
        } catch (error) {
          console.error('관리자 데이터 로딩 실패:', error);
        }
      } else {
        // 개발환경: 샘플 데이터
        setAds([
          {
            id: 1,
            type: 'premium',
            title: '신용회복 전문 상담센터',
            content: '24시간 무료 상담 | 성공률 95% | 맞춤 솔루션 제공',
            url: '#',
            imageUrl: '',
            startDate: '2024-01-15',
            endDate: '2024-12-31',
            isActive: true,
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            type: 'list',
            title: '저금리 대출 비교 플랫폼',
            content: 'AI 맞춤 대출 상품 추천 | 즉시 심사',
            url: '#',
            imageUrl: '',
            startDate: '2024-01-14',
            endDate: '2024-06-30',
            isActive: true,
            createdAt: '2024-01-14'
          }
        ]);

        setPosts([
          {
            id: 1,
            title: '개인회생 신청 후 3년간의 경험담',
            author: '희망이',
            category: '개인회생',
            createdAt: '2024-01-15',
            views: 1234,
            reports: 2
          },
          {
            id: 2,
            title: '법인회생 절차 중 궁금한 점들',
            author: '사장님',
            category: '법인회생',
            createdAt: '2024-01-14',
            views: 856,
            reports: 0
          }
        ]);

        setComments([
          {
            id: 1,
            postId: 1,
            author: '응원합니다',
            content: '좋은 정보 감사합니다.',
            createdAt: '2024-01-15',
            reports: 1
          },
          {
            id: 2,
            postId: 1,
            author: '질문있어요',
            content: '변호사 선임은 필수인가요?',
            createdAt: '2024-01-15',
            reports: 0
          }
        ]);

        setReports([
          {
            id: 1,
            type: 'post',
            targetId: 1,
            reason: '스팸/광고',
            reporter: '신고자1',
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            type: 'comment',
            targetId: 1,
            reason: '부적절한 언어',
            reporter: '신고자2',
            createdAt: '2024-01-15'
          }
        ]);

        setNewsItems([
          {
            id: 1,
            title: '2024년 신용회복 정책 변경 사항',
            summary: '금융위원회에서 발표한 신용회복 지원 정책의 주요 변경 사항을 안내드립니다.',
            source: '금융위원회',
            url: '#',
            publishedAt: '2024-01-15',
            category: '정책',
            isImportant: true,
            isActive: true
          },
          {
            id: 2,
            title: '개인회생 신청 절차 간소화',
            summary: '개인회생 신청 절차가 간소화되어 더욱 쉽게 신청할 수 있게 되었습니다.',
            source: '법원행정처',
            url: '#',
            publishedAt: '2024-01-14',
            category: '정책',
            isImportant: false,
            isActive: true
          }
        ]);
      }
      
      setLoading(false);
    };
    
    fetchAdminData();
  }, []);

  const handleAdSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newAd = {
      id: ads.length + 1,
      ...adForm,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAds([...ads, newAd]);
    setAdForm({ 
      type: 'premium', 
      title: '', 
      content: '', 
      url: '', 
      imageUrl: '', 
      startDate: '', 
      endDate: '', 
      isActive: true 
    });
    setShowModal(false);
    alert('광고가 등록되었습니다.');
  };

  const handleDeleteAd = (id: number) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      setAds(ads.filter(ad => ad.id !== id));
      alert('광고가 삭제되었습니다.');
    }
  };

  const handleDeletePost = async (id: number) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      try {
        const response = await fetch('/api/admin/posts', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: [id] }),
        });

        if (response.ok) {
          setPosts(posts.filter(post => post.id !== id));
          alert('게시물이 삭제되었습니다.');
        } else {
          const error = await response.json();
          alert(`게시물 삭제에 실패했습니다: ${error.error}`);
        }
      } catch (error) {
        console.error('게시물 삭제 오류:', error);
        alert('게시물 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDeleteComment = (id: number) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      setComments(comments.filter(comment => comment.id !== id));
      alert('댓글이 삭제되었습니다.');
    }
  };

  const handleDeleteReport = (id: number) => {
    if (confirm('신고를 처리하시겠습니까?')) {
      setReports(reports.filter(report => report.id !== id));
      alert('신고가 처리되었습니다.');
    }
  };

  const handleNewsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newNews = {
      id: newsItems.length + 1,
      ...newsForm,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setNewsItems([...newsItems, newNews]);
    setNewsForm({
      title: '',
      summary: '',
      source: '',
      url: '',
      publishedAt: '',
      category: '정책',
      isImportant: false,
      isActive: true
    });
    setShowModal(false);
    alert('뉴스가 등록되었습니다.');
  };

  const handleDeleteNews = (id: number) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      setNewsItems(newsItems.filter(news => news.id !== id));
      alert('뉴스가 삭제되었습니다.');
    }
  };

  const openModal = (type: string) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일을 읽어서 임시 URL 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdForm({...adForm, imageUrl: e.target?.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('imageFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleAdSelect = (adId: number) => {
    setSelectedAds(prev => 
      prev.includes(adId) 
        ? prev.filter(id => id !== adId)
        : [...prev, adId]
    );
  };

  const handleSelectAllAds = (checked: boolean) => {
    if (checked) {
      setSelectedAds(ads.map(ad => ad.id));
    } else {
      setSelectedAds([]);
    }
  };

  const handleBulkDeleteAds = () => {
    if (selectedAds.length === 0) {
      alert('삭제할 광고를 선택해주세요.');
      return;
    }
    
    if (confirm(`선택한 ${selectedAds.length}개의 광고를 삭제하시겠습니까?`)) {
      setAds(ads.filter(ad => !selectedAds.includes(ad.id)));
      setSelectedAds([]);
      alert('선택한 광고들이 삭제되었습니다.');
    }
  };

  const handleNewsSelect = (newsId: number) => {
    setSelectedNews(prev => 
      prev.includes(newsId) 
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    );
  };

  const handleSelectAllNews = (checked: boolean) => {
    if (checked) {
      setSelectedNews(newsItems.map(news => news.id));
    } else {
      setSelectedNews([]);
    }
  };

  const handleBulkDeleteNews = () => {
    if (selectedNews.length === 0) {
      alert('삭제할 뉴스를 선택해주세요.');
      return;
    }
    
    if (confirm(`선택한 ${selectedNews.length}개의 뉴스를 삭제하시겠습니까?`)) {
      setNewsItems(newsItems.filter(news => !selectedNews.includes(news.id)));
      setSelectedNews([]);
      alert('선택한 뉴스들이 삭제되었습니다.');
    }
  };

  // 게시물 선택 관련 핸들러들
  const handlePostSelect = (postId: number) => {
    console.log('게시물 선택:', postId);
    console.log('현재 선택된 게시물들:', selectedPosts);
    setSelectedPosts(prev => {
      const newSelection = prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId];
      console.log('새로운 선택:', newSelection);
      return newSelection;
    });
  };

  const handleSelectAllPosts = (checked: boolean) => {
    console.log('전체 선택:', checked);
    console.log('전체 게시물 수:', posts.length);
    if (checked) {
      const allIds = posts.map(post => post.id);
      console.log('모든 ID:', allIds);
      setSelectedPosts(allIds);
    } else {
      setSelectedPosts([]);
    }
  };

  const handleBulkDeletePosts = async () => {
    if (selectedPosts.length === 0) {
      alert('삭제할 게시물을 선택해주세요.');
      return;
    }

    if (confirm(`선택한 ${selectedPosts.length}개의 게시물을 삭제하시겠습니까?`)) {
      try {
        const response = await fetch('/api/admin/posts', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: selectedPosts }),
        });

        if (response.ok) {
          // 로컬 상태에서도 제거
          setPosts(prevPosts => prevPosts.filter(post => !selectedPosts.includes(post.id)));
          setSelectedPosts([]);
          alert(`${selectedPosts.length}개의 게시물이 삭제되었습니다.`);
        } else {
          const error = await response.json();
          alert(`게시물 삭제에 실패했습니다: ${error.error}`);
        }
      } catch (error) {
        console.error('게시물 삭제 오류:', error);
        alert('게시물 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="font-pretendard font-light min-h-screen bg-white">
      {/* 모바일 네비게이션 */}
      <MobileNavigation currentPage="/admin" />
      
      {/* 일반 헤더 */}
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
              <a href="/write" className="text-sm text-gray-700 hover:text-blue-600">글쓰기</a>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">ADMIN</span>
            </div>
          </div>
        </div>
      </header>

      {/* 관리자 서브 헤더 */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-medium text-gray-900">관리자 페이지</h2>
              <span className="text-sm text-gray-500">사이트 관리 및 설정</span>
            </div>
            <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700">
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('ads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                광고 관리
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                게시물 관리
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'comments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                댓글 관리
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                신고 관리
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'news'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                뉴스 관리
              </button>
            </nav>
          </div>

          {/* 광고 관리 */}
          {activeTab === 'ads' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">광고 관리</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBulkDeleteAds}
                    disabled={selectedAds.length === 0}
                    className={`px-4 py-2 rounded ${
                      selectedAds.length === 0 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    일괄 삭제 {selectedAds.length > 0 && `(${selectedAds.length})`}
                  </button>
                  <button
                    onClick={() => openModal('add')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    광고 추가
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <div 
                            onClick={() => handleSelectAllAds(!(selectedAds.length === ads.length && ads.length > 0))}
                            className="w-5 h-5 border-2 border-black cursor-pointer flex items-center justify-center bg-white"
                            style={{
                              backgroundColor: selectedAds.length === ads.length && ads.length > 0 ? '#000' : 'white',
                              color: selectedAds.length === ads.length && ads.length > 0 ? 'white' : 'black'
                            }}
                          >
                            {selectedAds.length === ads.length && ads.length > 0 && <span>✓</span>}
                          </div>
                          <span className="text-gray-700 font-medium whitespace-nowrap">전체선택</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        타입
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        제목
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        내용
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        이미지
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        게재 기간
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ads.map((ad) => (
                      <tr key={ad.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div 
                              onClick={() => handleAdSelect(ad.id)}
                              className="w-5 h-5 border-2 border-black cursor-pointer flex items-center justify-center bg-white"
                              style={{
                                backgroundColor: selectedAds.includes(ad.id) ? '#000' : 'white',
                                color: selectedAds.includes(ad.id) ? 'white' : 'black'
                              }}
                            >
                              {selectedAds.includes(ad.id) && <span>✓</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            ad.type === 'premium' ? 'bg-blue-100 text-blue-800' :
                            ad.type === 'list' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {ad.type === 'premium' ? '프리미엄' : 
                             ad.type === 'list' ? '리스트' : '스티키'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ad.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {ad.content}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ad.imageUrl ? (
                            <img 
                              src={ad.imageUrl} 
                              alt="광고 이미지" 
                              className="w-16 h-10 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">이미지 없음</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          <div>시작: {ad.startDate}</div>
                          <div>종료: {ad.endDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            ad.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {ad.isActive ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">수정</button>
                          <button
                            onClick={() => handleDeleteAd(ad.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 게시물 관리 */}
          {activeTab === 'posts' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">게시물 관리</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBulkDeletePosts}
                    disabled={selectedPosts.length === 0}
                    className={`px-4 py-2 rounded ${
                      selectedPosts.length === 0 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    일괄 삭제 {selectedPosts.length > 0 && `(${selectedPosts.length})`}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <div 
                            onClick={() => handleSelectAllPosts(!(selectedPosts.length === posts.length && posts.length > 0))}
                            className="w-5 h-5 border-2 border-black cursor-pointer flex items-center justify-center bg-white"
                            style={{
                              backgroundColor: selectedPosts.length === posts.length && posts.length > 0 ? '#000' : 'white',
                              color: selectedPosts.length === posts.length && posts.length > 0 ? 'white' : 'black'
                            }}
                          >
                            {selectedPosts.length === posts.length && posts.length > 0 && <span>✓</span>}
                          </div>
                          <span className="text-gray-700 font-medium whitespace-nowrap">전체선택</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        제목
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        작성자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        카테고리
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        조회수
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        신고
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        등록일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div 
                              onClick={() => handlePostSelect(post.id)}
                              className="w-5 h-5 border-2 border-black cursor-pointer flex items-center justify-center bg-white"
                              style={{
                                backgroundColor: selectedPosts.includes(post.id) ? '#000' : 'white',
                                color: selectedPosts.includes(post.id) ? 'white' : 'black'
                              }}
                            >
                              {selectedPosts.includes(post.id) && <span>✓</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {post.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.views ? post.views.toLocaleString() : '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            (post.reports || 0) > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {post.reports || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.created_at ? new Date(post.created_at).toLocaleDateString() : post.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">보기</button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 댓글 관리 */}
          {activeTab === 'comments' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">댓글 관리</h2>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  일괄 삭제
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-5 h-5 border-2 border-black cursor-pointer flex items-center justify-center bg-white"
                          >
                            <span>✓</span>
                          </div>
                          <span className="text-gray-700 font-medium whitespace-nowrap">전체선택</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        내용
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        작성자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        게시물
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        신고
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        등록일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comments.map((comment) => (
                      <tr key={comment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div 
                              className="w-5 h-5 border-2 border-black cursor-pointer flex items-center justify-center bg-white"
                            >
                              <span>✓</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {comment.content}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {comment.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          #{comment.postId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            comment.reports > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {comment.reports}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {comment.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">보기</button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 신고 관리 */}
          {activeTab === 'reports' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">신고 관리</h2>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  모두 처리
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        타입
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        신고 사유
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        신고자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        신고일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                      <tr key={report.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            report.type === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {report.type === 'post' ? '게시물' : '댓글'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.reporter}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">보기</button>
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            처리
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 뉴스 관리 */}
          {activeTab === 'news' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">뉴스 관리</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBulkDeleteNews}
                    disabled={selectedNews.length === 0}
                    className={`px-4 py-2 rounded ${
                      selectedNews.length === 0 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    일괄 삭제 {selectedNews.length > 0 && `(${selectedNews.length})`}
                  </button>
                  <button
                    onClick={() => openModal('addNews')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    뉴스 추가
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <div 
                            onClick={() => handleSelectAllNews(!(selectedNews.length === newsItems.length && newsItems.length > 0))}
                            className="w-5 h-5 border-2 border-black cursor-pointer flex items-center justify-center bg-white"
                            style={{
                              backgroundColor: selectedNews.length === newsItems.length && newsItems.length > 0 ? '#000' : 'white',
                              color: selectedNews.length === newsItems.length && newsItems.length > 0 ? 'white' : 'black'
                            }}
                          >
                            {selectedNews.length === newsItems.length && newsItems.length > 0 && <span>✓</span>}
                          </div>
                          <span className="text-gray-700 font-medium whitespace-nowrap">전체선택</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        제목
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        출처
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        카테고리
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        중요
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        발행일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {newsItems.map((news) => (
                      <tr key={news.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div 
                              onClick={() => handleNewsSelect(news.id)}
                              className="w-5 h-5 border-2 border-black cursor-pointer flex items-center justify-center bg-white"
                              style={{
                                backgroundColor: selectedNews.includes(news.id) ? '#000' : 'white',
                                color: selectedNews.includes(news.id) ? 'white' : 'black'
                              }}
                            >
                              {selectedNews.includes(news.id) && <span>✓</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {news.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {news.source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            news.category === '정책' ? 'bg-red-100 text-red-800' :
                            news.category === '신용' ? 'bg-blue-100 text-blue-800' :
                            news.category === '금리' ? 'bg-green-100 text-green-800' :
                            news.category === '카드' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {news.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            news.isImportant ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {news.isImportant ? '중요' : '일반'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            news.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {news.isActive ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {news.publishedAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <a
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            보기
                          </a>
                          <button className="text-blue-600 hover:text-blue-900">수정</button>
                          <button
                            onClick={() => handleDeleteNews(news.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

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

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {modalType === 'addNews' ? '뉴스 추가' : '광고 추가'}
            </h3>
            
            {modalType === 'addNews' ? (
              <form onSubmit={handleNewsSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    요약
                  </label>
                  <textarea
                    value={newsForm.summary}
                    onChange={(e) => setNewsForm({...newsForm, summary: e.target.value})}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    출처
                  </label>
                  <input
                    type="text"
                    value={newsForm.source}
                    onChange={(e) => setNewsForm({...newsForm, source: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    링크 URL
                  </label>
                  <input
                    type="url"
                    value={newsForm.url}
                    onChange={(e) => setNewsForm({...newsForm, url: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    발행일
                  </label>
                  <input
                    type="date"
                    value={newsForm.publishedAt}
                    onChange={(e) => setNewsForm({...newsForm, publishedAt: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  >
                    <option value="정책">정책</option>
                    <option value="신용">신용</option>
                    <option value="금리">금리</option>
                    <option value="카드">카드</option>
                    <option value="대출">대출</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newsForm.isImportant}
                      onChange={(e) => setNewsForm({...newsForm, isImportant: e.target.checked})}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">중요 뉴스</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newsForm.isActive}
                      onChange={(e) => setNewsForm({...newsForm, isActive: e.target.checked})}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    등록
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAdSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  광고 타입
                </label>
                <select
                  value={adForm.type}
                  onChange={(e) => setAdForm({...adForm, type: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="premium">프리미엄 광고</option>
                  <option value="list">리스트 광고</option>
                  <option value="sticky">스티키 광고</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={adForm.title}
                  onChange={(e) => setAdForm({...adForm, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용
                </label>
                <textarea
                  value={adForm.content}
                  onChange={(e) => setAdForm({...adForm, content: e.target.value})}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  required
                />
              </div>
                              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    링크 URL
                  </label>
                  <input
                    type="url"
                    value={adForm.url}
                    onChange={(e) => setAdForm({...adForm, url: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 URL
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={adForm.imageUrl}
                      onChange={(e) => setAdForm({...adForm, imageUrl: e.target.value})}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 whitespace-nowrap"
                    >
                      파일 선택
                    </button>
                  </div>
                  <input
                    id="imageFileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {adForm.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={adForm.imageUrl}
                        alt="미리보기"
                        className="w-32 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      게재 시작일
                    </label>
                    <input
                      type="date"
                      value={adForm.startDate}
                      onChange={(e) => setAdForm({...adForm, startDate: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      게재 종료일
                    </label>
                    <input
                      type="date"
                      value={adForm.endDate}
                      onChange={(e) => setAdForm({...adForm, endDate: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={adForm.isActive}
                    onChange={(e) => setAdForm({...adForm, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">활성화</label>
                </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  등록
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 