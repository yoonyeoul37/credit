'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileNavigation from '../components/MobileNavigation';
import { useRouter, useSearchParams } from 'next/navigation';

export default function WritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showStickyAd, setShowStickyAd] = useState(true);
  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    title: '',
    content: '',
    category: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  // URL 파라미터에서 카테고리 자동 설정
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFormData(prev => ({
        ...prev,
        category: categoryParam
      }));
    }
  }, [searchParams]);

  const categories = [
    { id: 'credit', name: '신용이야기' },
    { id: 'personal', name: '개인회생' },
    { id: 'corporate', name: '법인회생' },
    { id: 'workout', name: '워크아웃' },
    { id: 'card', name: '신용카드' },
    { id: 'loan', name: '대출' }
  ];

  // 현재 카테고리 이름 가져오기
  const getCurrentCategoryName = () => {
    const category = categories.find(cat => cat.id === formData.category);
    return category ? category.name : '';
  };

  // 카테고리가 URL에서 지정되었는지 확인
  const isAutoCategory = searchParams.get('category') !== null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
      return;
    }

    const newImages = [];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 파일은 5MB 이하만 업로드할 수 있습니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push({
          id: Date.now() + Math.random(),
          file: file,
          preview: event.target.result
        });
        
        if (newImages.length === files.length) {
          setImageFiles(prev => [...prev, ...newImages]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setImageFiles(prev => prev.filter(img => img.id !== imageId));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    
    if (!formData.password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    
    if (formData.password.length < 4) {
      alert('비밀번호는 4자리 이상 입력해주세요.');
      return;
    }
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    
    if (!formData.category) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 환경에 따른 분기 처리
      const isProduction = true; // 실제 웹사이트에서 게시글 저장
      
      // 해당 카테고리 페이지로 이동
      const categoryRoutes = {
        'credit': '/credit',
        'personal': '/personal',
        'corporate': '/corporate',
        'workout': '/workout',
        'card': '/card',
        'loan': '/loan'
      };
      
      if (isProduction) {
        // 프로덕션: 실제 API 호출
        console.log('🌐 프로덕션 모드: 실제 API 호출 중...');
        
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            author: formData.nickname,
            password: formData.password,
            category: formData.category,
            images: formData.images.map(img => img.preview)
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert('글이 성공적으로 등록되었습니다!');
          router.push(categoryRoutes[formData.category] || '/');
        } else {
          throw new Error(result.error || '글 등록에 실패했습니다.');
        }
      } else {
        // 개발환경: 더미 모드 (현재 사용)
        console.log('🚧 임시 모드: 글쓰기 시뮬레이션:', {
          title: formData.title,
          content: formData.content,
          author: formData.nickname,
          category: formData.category
        });
        
        // 성공 시뮬레이션 (1초 대기)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('✅ 글이 성공적으로 등록되었습니다!\n(임시 모드: API 수정 중)');
        
        router.push(categoryRoutes[formData.category] || '/');
      }
      
    } catch (error) {
      console.error('Error submitting post:', error);
      alert(error.message || '글 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-pretendard font-light min-h-screen bg-white">
      {/* 모바일 네비게이션 */}
      <MobileNavigation currentPage="/write" />
      
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
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">글쓰기</button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-4 md:py-6">
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-normal text-black mb-2">글쓰기</h2>
          <p className="text-sm text-gray-600">익명으로 글을 작성할 수 있습니다. 수정/삭제 시 비밀번호가 필요합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* 작성자 정보 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-medium text-black mb-3 md:mb-4">작성자 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="w-full p-4 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-gray-900 bg-white"
                  placeholder="사용하실 닉네임을 입력하세요"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-4 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-gray-900 bg-white"
                  placeholder="수정/삭제 시 사용할 비밀번호"
                  maxLength={20}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              비밀번호는 4자리 이상 입력해주세요. 글 수정/삭제 시 필요합니다.
            </p>
          </div>

          {/* 글 정보 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-medium text-black mb-3 md:mb-4">글 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                {isAutoCategory ? (
                  <div className="w-full p-4 md:p-3 border border-gray-300 rounded-lg bg-gray-50 text-base text-gray-700">
                    {getCurrentCategoryName()}
                  </div>
                ) : (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-4 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-gray-900 bg-white appearance-none"
                  >
                    <option value="">카테고리를 선택하세요</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-4 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-gray-900 bg-white"
                  placeholder="제목을 입력하세요"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full p-4 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical text-base text-gray-900 bg-white min-h-[200px]"
                  placeholder="내용을 입력하세요..."
                />
              </div>
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-medium text-black mb-3 md:mb-4">이미지 첨부</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 파일 (최대 5개, 각 5MB 이하)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full p-4 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {imageFiles.map(image => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 touch-manipulation"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-3">📌 작성 시 주의사항</h4>
            <ul className="text-xs md:text-sm text-yellow-700 space-y-2">
              <li>• 개인정보(실명, 전화번호, 주소 등)를 포함하지 마세요.</li>
              <li>• 특정 업체나 개인에 대한 비방, 욕설은 삭제될 수 있습니다.</li>
              <li>• 도박, 대출업체 홍보 등은 금지됩니다.</li>
              <li>• 저작권을 침해하는 이미지나 내용은 업로드하지 마세요.</li>
              <li>• 건전한 정보 공유를 위해 노력해주세요.</li>
            </ul>
          </div>

          {/* 제출 버튼 */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full md:w-auto px-6 py-4 md:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-base font-medium touch-manipulation"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-6 py-4 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium touch-manipulation"
            >
              {isSubmitting ? '등록 중...' : '글 등록'}
            </button>
          </div>
        </form>
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
                  글쓰기 도우미 서비스 - 전문적인 글 작성 지원
                </p>
                <p className="text-xs text-blue-100 truncate">
                  맞춤법 검사 | 글 구성 | 전문가 리뷰
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-white text-blue-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors">
                도우미 신청
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