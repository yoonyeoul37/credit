'use client'

import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'

interface AdProps {
  position: 'header' | 'sidebar' | 'content' | 'footer'
  title: string
  image?: string
  description?: string
  link: string
  size?: 'small' | 'medium' | 'large'
  closeable?: boolean
}

const Advertisement = ({ 
  position, 
  title, 
  image, 
  description, 
  link, 
  size = 'medium',
  closeable = false 
}: AdProps) => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleClick = () => {
    window.open(link, '_blank')
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-20'
      case 'large':
        return 'h-40'
      default:
        return 'h-28'
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'header':
        return 'w-full bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200'
      case 'sidebar':
        return 'w-full bg-white rounded-2xl shadow-sm border border-gray-100'
      case 'content':
        return 'w-full bg-gray-50 rounded-xl border border-gray-200'
      case 'footer':
        return 'w-full bg-gray-100 border-t border-gray-200'
      default:
        return 'w-full bg-white rounded-lg border border-gray-200'
    }
  }

  return (
    <div className={`relative ${getPositionClasses()} ${getSizeClasses()}`}>
      {/* 광고 표시 */}
      <div className="absolute top-2 left-2 text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
        광고
      </div>

      {/* 닫기 버튼 */}
      {closeable && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
        >
          <X className="w-3 h-3 text-gray-400" />
        </button>
      )}

      {/* 광고 콘텐츠 */}
      <div 
        className="w-full h-full p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center space-x-4"
        onClick={handleClick}
      >
        {/* 이미지가 있는 경우 */}
        {image && (
          <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 텍스트 콘텐츠 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate flex items-center">
            {title}
            <ExternalLink className="w-3 h-3 ml-1 text-gray-400" />
          </h3>
          {description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Advertisement

// 샘플 광고 데이터
export const sampleAds = {
  header: {
    title: '신용회복 전문 법무사 - 무료 상담',
    description: '개인회생, 파산 전문 법무사가 도와드립니다.',
    link: 'https://example.com/law-office',
    image: '/api/placeholder/64/64'
  },
  sidebar: {
    title: '2금융권 대출 비교 서비스',
    description: '안전하고 투명한 대출 상품을 한 번에 비교해보세요.',
    link: 'https://example.com/loan-compare',
    image: '/api/placeholder/64/64'
  },
  content: {
    title: '신용점수 무료 조회 서비스',
    description: '3개 신용평가사 점수를 한 번에 확인하세요.',
    link: 'https://example.com/credit-check',
    image: '/api/placeholder/64/64'
  },
  footer: {
    title: '부채 정리 전문 상담센터',
    description: '1:1 맞춤 상담으로 부채 문제를 해결하세요.',
    link: 'https://example.com/debt-consulting',
    image: '/api/placeholder/64/64'
  }
} 