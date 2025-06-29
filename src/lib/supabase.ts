import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 데이터베이스 타입 정의
export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  order_num: number
  is_active: boolean
  created_at: string
}

export interface Post {
  id: number
  category_id: number
  title: string
  content: string
  author_nickname: string
  author_ip_hash: string
  tags: string[]
  view_count: number
  like_count: number
  comment_count: number
  is_hot: boolean
  is_notice: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
  // 관계 데이터
  category?: Category
  comments?: Comment[]
}

export interface Comment {
  id: number
  post_id: number
  parent_id: number | null
  content: string
  author_nickname: string
  author_ip_hash: string
  like_count: number
  is_deleted: boolean
  created_at: string
  updated_at: string
  // 관계 데이터
  post?: Post
  replies?: Comment[]
} 