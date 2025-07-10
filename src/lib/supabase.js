import { createClient } from '@supabase/supabase-js'

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here'

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // 익명 사용자는 세션 유지하지 않음
    autoRefreshToken: false
  }
})

// 관리자용 클라이언트 (서비스 역할 키 사용)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-here',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// 데이터베이스 테이블 이름 상수
export const TABLES = {
  POSTS: 'posts',
  COMMENTS: 'comments', 
  ADMINS: 'admins',
  ADS: 'ads',
  ANALYTICS: 'analytics'
}

// 카테고리 상수
export const CATEGORIES = {
  CREDIT: 'credit',
  PERSONAL: 'personal',
  CORPORATE: 'corporate',
  WORKOUT: 'workout',
  CARD: 'card',
  LOAN: 'loan',
  NEWS: 'news'
}

// 유틸리티 함수들
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const sanitizeHtml = (html) => {
  // 간단한 HTML 태그 제거 (실제 프로덕션에서는 DOMPurify 사용 권장)
  return html.replace(/<[^>]*>/g, '')
}

export const generateHash = (password) => {
  // 간단한 해시 함수 (실제 프로덕션에서는 bcrypt 사용 권장)
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString()
} 