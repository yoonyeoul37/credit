'use client'

import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'

interface AdProps {
  position: 'header' | 'sidebar' | 'content' | 'footer' | 'adsense'
  title: string
  image?: string
  description?: string
  link: string
  size?: 'small' | 'medium' | 'large'
  closeable?: boolean
  adType?: 'adsense' | 'regular'
}

const Advertisement = ({ 
  position, 
  title, 
  image, 
  description, 
  link, 
  size = 'medium',
  closeable = false,
  adType = 'regular'
}: AdProps) => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleClick = () => {
    if (adType !== 'adsense') {
      window.open(link, '_blank')
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-32'
      case 'large':
        return 'h-40'
      default:
        return 'h-32'
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'header':
        return 'w-full max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200'
      case 'sidebar':
        return 'w-full bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200'
      case 'content':
        return 'w-full max-w-2xl mx-auto bg-gray-50 rounded-xl border border-gray-200'
      case 'footer':
        return 'w-full max-w-4xl mx-auto bg-gray-100 border-t border-gray-200'
      case 'adsense':
        return 'w-full bg-gray-50 rounded-xl border border-gray-200 border-dashed'
      default:
        return 'w-full bg-white rounded-lg border border-gray-200'
    }
  }

  // 애드센스용 더미 광고
  if (adType === 'adsense') {
    return (
      <div className={`relative ${getPositionClasses()} ${getSizeClasses()}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-xs mb-1">Google AdSense</div>
            <div className="text-sm font-medium">{title}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${getPositionClasses()} ${getSizeClasses()}`}>
      {/* 광고 표시 라벨 */}
      <div className={`absolute text-gray-400 bg-gray-100 rounded-full font-medium ${
        size === 'small' 
          ? 'top-3 left-3 text-xs px-2 py-1' 
          : 'top-3 left-3 text-xs px-2 py-1'
      }`}>
        광고
      </div>

      {/* 닫기 버튼 */}
      {closeable && (
        <button
          onClick={() => setIsVisible(false)}
          className={`absolute bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10 ${
            size === 'small' 
              ? 'top-3 right-3 w-6 h-6' 
              : 'top-3 right-3 w-6 h-6'
          }`}
        >
          <X className={`text-gray-500 ${
            size === 'small' ? 'w-3 h-3' : 'w-3 h-3'
          }`} />
        </button>
      )}

      {/* 광고 콘텐츠 */}
      <div 
        className={`w-full h-full cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-4 ${
          size === 'small' ? 'p-6' : 'p-5'
        }`}
        onClick={handleClick}
      >
        {/* 이미지가 있는 경우 */}
        {image && (
          <div className={`flex-shrink-0 bg-gray-200 rounded-xl overflow-hidden ${
            size === 'small' ? 'w-16 h-16' : 'w-14 h-14'
          }`}>
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 텍스트 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {size === 'small' ? (
            // Small 사이즈: 한 줄로 제목과 설명을 나란히 배치
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 text-sm flex-shrink-0">
                {title}
              </h3>
              {description && (
                <p className="text-xs text-gray-600 truncate flex-1">
                  {description}
                </p>
              )}
              <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
            </div>
          ) : (
            // Medium/Large 사이즈: 기존 방식
            <>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 flex items-center">
                <span className="truncate">{title}</span>
                <ExternalLink className="w-3 h-3 ml-2 text-gray-400 flex-shrink-0" />
              </h3>
              {description && (
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                  {description}
                </p>
              )}
            </>
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