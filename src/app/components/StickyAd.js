import { useStickyAd } from './useStickyAd';

export default function StickyAd() {
  const { stickyAd, loading, showStickyAd, hideStickyAd, handleAdClick } = useStickyAd();

  // 로딩 중이거나 광고가 없으면 표시하지 않음
  if (loading || !stickyAd || !showStickyAd) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {stickyAd.title}
            </p>
            <p className="text-xs text-blue-100 truncate">
              {stickyAd.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {stickyAd.link_url && (
            <button 
              onClick={() => handleAdClick(stickyAd.id, stickyAd.link_url)}
              className="bg-white text-blue-600 px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors touch-manipulation"
            >
              자세히 보기
            </button>
          )}
          <button
            onClick={hideStickyAd}
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
  );
} 