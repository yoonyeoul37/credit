'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface MobileNavigationProps {
  currentPage?: string
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentPage = '' }) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: '홈', href: '/', icon: '🏠' },
    { name: '신용이야기', href: '/credit', icon: '💳' },
    { name: '개인회생', href: '/personal', icon: '👤' },
    { name: '법인회생', href: '/corporate', icon: '🏢' },
    { name: '워크아웃', href: '/workout', icon: '🏋️' },
    { name: '신용카드', href: '/card', icon: '💎' },
    { name: '대출', href: '/loan', icon: '💰' },
    { name: '뉴스정보', href: '/news', icon: '📰' },
    { name: '계산기', href: '/calculator', icon: '🔢' },
    { name: '광고문의', href: '/ad', icon: '📢' },
  ]

  const toggleMenu = () => {
    console.log('햄버거 메뉴 클릭됨:', !isOpen); // 디버그용 로그
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    toggleMenu();
  }

  return (
    <>
      {/* 모바일 헤더 */}
      <div className="md:hidden bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            크레딧스토리
          </Link>
          <button
            onClick={toggleMenu}
            onTouchStart={handleTouchStart}
            className="p-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:bg-gray-100 touch-manipulation select-none"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              minWidth: '44px',
              minHeight: '44px'
            }}
            aria-label="메뉴 열기"
            type="button"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 mt-1 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 mt-1 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={closeMenu}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div 
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pt-20">
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-lg font-medium transition-colors touch-manipulation ${
                      currentPage === item.href
                        ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href="/write"
                    onClick={closeMenu}
                    className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span>✍️</span>
                    <span>글쓰기</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 모바일용 패딩 (고정 헤더 때문에) */}
      <div className="md:hidden h-16"></div>
    </>
  )
}

export default MobileNavigation 