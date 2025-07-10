'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdPage() {
  const [showStickyAd, setShowStickyAd] = useState(true);

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
              <a href="/write" className="text-sm text-gray-700 hover:text-blue-600">글쓰기</a>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 페이지 제목 */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-medium text-black mb-4">광고문의</h2>
          <p className="text-gray-600">크레딧스토리와 함께 더 많은 고객에게 다가가세요</p>
        </div>

        {/* 인사글 */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-medium text-black mb-4">안녕하세요!</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            크레딧스토리는 신용회복과 금융 재건을 위한 정보를 공유하는 커뮤니티입니다.<br/>
            개인회생, 법인회생, 워크아웃 등 다양한 금융 정보를 찾는 고객들이 방문하고 있습니다.
          </p>
          <p className="text-gray-700 leading-relaxed">
            효과적인 광고를 통해 귀하의 서비스를 필요로 하는 고객들에게 직접 다가갈 수 있습니다.<br/>
            다양한 광고 상품으로 최적의 마케팅 효과를 경험해보세요.
          </p>
        </div>

        {/* 광고 상품 안내 */}
        <div className="mb-8">
          <h3 className="text-2xl font-medium text-black mb-6 text-center">광고 상품 안내</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* 프리미엄 광고 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-full h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-sm font-medium">프리미엄 광고</span>
                </div>
                <h4 className="text-lg font-medium text-black">프리미엄 상단 광고</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• 페이지 상단 최고 노출 위치</li>
                <li>• 728x90 배너 크기</li>
                <li>• 모든 페이지 노출</li>
                <li>• 최고 클릭률 보장</li>
              </ul>
              <div className="text-center">
                <span className="text-blue-600 font-medium">가격 상담</span>
              </div>
            </div>

            {/* 리스트 광고 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-full h-20 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-sm font-medium">리스트 광고</span>
                </div>
                <h4 className="text-lg font-medium text-black">리스트 형태 광고</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• 게시물 목록 사이 자연스러운 노출</li>
                <li>• 높은 관심도와 클릭률</li>
                <li>• 모든 카테고리 페이지 노출</li>
                <li>• 컨텐츠와 조화로운 디자인</li>
              </ul>
              <div className="text-center">
                <span className="text-orange-600 font-medium">가격 상담</span>
              </div>
            </div>

            {/* 스티키 광고 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-full h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-sm font-medium">스티키 광고</span>
                </div>
                <h4 className="text-lg font-medium text-black">하단 고정 광고</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• 화면 하단 고정 노출</li>
                <li>• 스크롤과 관계없이 항상 노출</li>
                <li>• 높은 브랜드 인지도 효과</li>
                <li>• 모바일 최적화 디자인</li>
              </ul>
              <div className="text-center">
                <span className="text-purple-600 font-medium">가격 상담</span>
              </div>
            </div>
          </div>
        </div>

        {/* 문의 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-black mb-4">광고 문의 및 상담</h3>
          <p className="text-gray-700 mb-6">
            귀하의 비즈니스에 맞는 최적의 광고 상품을 제안드립니다.<br/>
            전화 상담을 통해 자세한 내용과 맞춤 견적을 받아보세요.
          </p>
          
          <div className="bg-white rounded-lg p-6 inline-block">
            <div className="text-center">
              <h4 className="text-lg font-medium text-black mb-2">연락처</h4>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-blue-600">1533-8237</p>
                <p className="text-gray-600">케이넥스엠</p>
                <p className="text-sm text-gray-500">평일 09:00 ~ 18:00 (주말, 공휴일 휴무)</p>
              </div>
            </div>
          </div>
        </div>

        {/* 추가 안내사항 */}
        <div className="mt-8 text-center">
          <h4 className="text-lg font-medium text-black mb-4">광고 진행 절차</h4>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">1</div>
              <p className="text-sm text-gray-700">전화 상담</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">2</div>
              <p className="text-sm text-gray-700">견적 제안</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">3</div>
              <p className="text-sm text-gray-700">계약 및 제작</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">4</div>
              <p className="text-sm text-gray-700">광고 게재</p>
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
                  광고 문의 환영 - 효과적인 마케팅 파트너
                </p>
                <p className="text-xs text-blue-100 truncate">
                  전문 상담 | 맞춤 제안 | 1533-8237
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a href="tel:1533-8237" className="bg-white text-blue-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors">
                전화문의
              </a>
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