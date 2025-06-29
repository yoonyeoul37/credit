'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Eye, Clock, User } from 'lucide-react'

interface Post {
  id: number
  title: string
  content: string
  user_nickname: string
  created_at: string
  updated_at: string
  likes_count: number
  comments_count: number
  views_count: number
  category: string
}

interface PostListProps {
  category: string
  className?: string
}

const PostList = ({ category, className = '' }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  // 임시 데모 데이터
  useEffect(() => {
    const demoPosts: Post[] = [
      {
        id: 1,
        title: "신용점수 200점 올린 후기 공유합니다",
        content: "6개월 동안 꾸준히 관리해서 드디어 목표 점수에 도달했어요...",
        user_nickname: "희망찬시작123",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes_count: 24,
        comments_count: 8,
        views_count: 156,
        category
      },
      {
        id: 2,
        title: "신용카드 발급 거절당했는데 어떻게 해야 할까요?",
        content: "계속 거절당해서 속상해요. 어떤 순서로 접근하면 좋을까요?",
        user_nickname: "새출발하자",
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
        updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        likes_count: 12,
        comments_count: 15,
        views_count: 89,
        category
      },
      {
        id: 3,
        title: "체크카드로만 1년 살아보니 느낀 점",
        content: "신용카드 정리하고 체크카드로만 생활한 경험담입니다.",
        user_nickname: "절약왕",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 18,
        comments_count: 6,
        views_count: 203,
        category
      },
      {
        id: 4,
        title: "개인회생 신청 전 꼭 알아둘 것들",
        content: "제가 직접 경험한 개인회생 과정에서 중요했던 포인트들 정리했어요.",
        user_nickname: "재기의마음",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 31,
        comments_count: 12,
        views_count: 287,
        category
      },
      {
        id: 5,
        title: "대출 연체 기록 있어도 포기하지 마세요",
        content: "저도 연체 기록이 있었지만 차근차근 해결해나가고 있어요. 같이 힘내요!",
        user_nickname: "포기하지않아",
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 45,
        comments_count: 23,
        views_count: 341,
        category
      }
    ]

    setTimeout(() => {
      setPosts(demoPosts)
      setLoading(false)
    }, 500)
  }, [category])

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) {
      return `${minutes}분 전`
    } else if (hours < 24) {
      return `${hours}시간 전`
    } else {
      return `${days}일 전`
    }
  }

  const getCategoryName = (cat: string) => {
    const categories: { [key: string]: string } = {
      'credit-story': '신용이야기',
      'personal-recovery': '개인회생',
      'corporate-recovery': '법인회생',
      'loan-story': '대출이야기',
      'success-story': '성공사례'
    }
    return categories[cat] || '게시판'
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 게시판 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{getCategoryName(category)}</h2>
          <p className="text-gray-600 mt-1">경험과 정보를 나누어 함께 성장해요 💪</p>
        </div>
        <Link
          href={`/${category}/write`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          글쓰기
        </Link>
      </div>

      {/* 게시글 목록 */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-500 mb-4">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">아직 게시글이 없어요</p>
            <p className="text-sm mt-1">첫 번째 이야기를 들려주세요! ✨</p>
          </div>
          <Link
            href={`/${category}/write`}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            첫 글 작성하기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${category}/${post.id}`}
              className="block bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-6 group"
            >
              {/* 제목 */}
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-2 line-clamp-2">
                {post.title}
              </h3>
              
              {/* 내용 미리보기 */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.content}
              </p>
              
              {/* 메타 정보 */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span className="font-medium text-green-700">💚 {post.user_nickname}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(post.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments_count}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* 페이지네이션 (추후 구현) */}
      <div className="flex justify-center pt-8">
        <div className="text-gray-500 text-sm">
          더 많은 게시글이 곧 추가될 예정입니다 📝
        </div>
      </div>
    </div>
  )
}

export default PostList 