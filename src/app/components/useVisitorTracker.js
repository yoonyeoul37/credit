import { useEffect } from 'react';

// 세션 ID 생성 함수
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// 세션 ID 가져오기/저장하기
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = sessionStorage.getItem('visitor_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('visitor_session_id', sessionId);
  }
  return sessionId;
};

export const useVisitorTracker = (pagePath = null) => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const sessionId = getSessionId();
        const pageUrl = pagePath || window.location.pathname;
        
        // 방문자 추적 API 호출
        const response = await fetch('/api/visitors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_url: pageUrl,
            session_id: sessionId
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('방문자 추적 완료:', data);
        } else {
          console.error('방문자 추적 실패:', response.status);
        }
      } catch (error) {
        console.error('방문자 추적 오류:', error);
      }
    };
    
    // 페이지 로드 시 추적 (1초 지연으로 다른 초기화 완료 후 실행)
    const timer = setTimeout(trackVisitor, 1000);
    
    return () => clearTimeout(timer);
  }, [pagePath]);
}; 