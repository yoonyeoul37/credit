import { useState, useEffect } from 'react';

export const useStickyAd = () => {
  const [stickyAd, setStickyAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStickyAd, setShowStickyAd] = useState(false);

  useEffect(() => {
    const fetchStickyAd = async () => {
      try {
        const response = await fetch('/api/ads?position=footer&active=true');
        const data = await response.json();
        
        if (response.ok && data.ads && data.ads.length > 0) {
          // 가장 우선순위가 높은 광고 선택
          setStickyAd(data.ads[0]);
          setShowStickyAd(true);
        } else {
          setStickyAd(null);
          setShowStickyAd(false);
        }
      } catch (error) {
        console.error('스티키 광고 로딩 실패:', error);
        setStickyAd(null);
        setShowStickyAd(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStickyAd();
  }, []);

  const hideStickyAd = () => {
    setShowStickyAd(false);
  };

  const handleAdClick = async (adId, adUrl) => {
    if (adId && adUrl) {
      try {
        // 광고 클릭 추적
        await fetch('/api/ads/click', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ad_id: adId,
            page_url: window.location.href
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

  return {
    stickyAd,
    loading,
    showStickyAd,
    hideStickyAd,
    handleAdClick
  };
}; 