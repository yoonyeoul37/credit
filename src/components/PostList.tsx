'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Eye, Clock, User } from 'lucide-react'
import SearchBar, { SearchFilters } from './SearchBar'

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
  tags?: string[]
  images?: string[]
}

interface PostListProps {
  category: string
  className?: string
  showSearch?: boolean
}

const PostList = ({ category, className = '', showSearch = true }: PostListProps) => {
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'latest',
    timeRange: 'all',
    hasImages: null
  })

  // 임시 데모 데이터
  useEffect(() => {
    const demoPosts: Post[] = [
      {
        id: 1,
        title: "신용점수 200점 올린 후기 공유합니다",
        content: "6개월 동안 꾸준히 관리해서 드디어 목표 점수에 도달했어요. 정말 힘들었지만 포기하지 않고 노력한 결과입니다.",
        user_nickname: "희망찬시작123",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes_count: 24,
        comments_count: 8,
        views_count: 156,
        category,
        tags: ['신용점수', '신용회복', '성공사례'],
        images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop']
      },
      {
        id: 2,
        title: "신용카드 발급 거절당했는데 어떻게 해야 할까요?",
        content: "계속 거절당해서 속상해요. 어떤 순서로 접근하면 좋을까요? 신용점수가 낮아서 그런 것 같아요.",
        user_nickname: "새출발하자",
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
        updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        likes_count: 12,
        comments_count: 15,
        views_count: 89,
        category,
        tags: ['신용카드', '발급거절', '질문'],
        images: []
      },
      {
        id: 3,
        title: "체크카드로만 1년 살아보니 느낀 점",
        content: "신용카드 정리하고 체크카드로만 생활한 경험담입니다. 의외로 불편하지 않았어요.",
        user_nickname: "절약왕",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 18,
        comments_count: 6,
        views_count: 203,
        category,
        tags: ['체크카드', '생활팁', '경험담'],
        images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=300&fit=crop']
      },
      {
        id: 4,
        title: "개인회생 신청 전 꼭 알아둘 것들",
        content: "제가 직접 경험한 개인회생 과정에서 중요했던 포인트들 정리했어요. 같은 상황에 계신 분들께 도움이 되길 바랍니다.",
        user_nickname: "재기의마음",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 31,
        comments_count: 12,
        views_count: 287,
        category,
        tags: ['개인회생', '법적절차', '팁'],
        images: []
      },
      {
        id: 5,
        title: "대출 연체 기록 있어도 포기하지 마세요",
        content: "저도 연체 기록이 있었지만 차근차근 해결해나가고 있어요. 같이 힘내요! 방법은 분명히 있습니다.",
        user_nickname: "포기하지않아",
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 45,
        comments_count: 23,
        views_count: 341,
        category,
        tags: ['연체기록', '신용회복', '격려'],
        images: ['https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=500&h=300&fit=crop']
      },
      {
        id: 6,
        title: "신용관리 초보자를 위한 완벽 가이드",
        content: "신용관리가 처음이신 분들을 위해 기초부터 차근차근 설명드립니다. PDF 자료도 첨부했어요.",
        user_nickname: "신용전문가",
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4일 전
        updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 67,
        comments_count: 34,
        views_count: 512,
        category,
        tags: ['신용관리', '초보자', '가이드'],
        images: ['https://images.unsplash.com/photo-1554224154-26032fbed8bd?w=500&h=300&fit=crop', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=300&fit=crop']
      },
      {
        id: 7,
        title: "법원 대출중단 신청 후기",
        content: "급한 상황에서 법원에 대출중단을 신청했던 경험을 공유합니다.",
        user_nickname: "급할때도침착하게",
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8일 전
        updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 23,
        comments_count: 7,
        views_count: 178,
        category,
        tags: ['법원신청', '대출중단', '경험담'],
        images: []
      },
      {
        id: 8,
        title: "1금융권 복귀 성공 후기 (feat. 신용점수 관리법)",
        content: "3년 만에 드디어 1금융권에서 대출 승인받았습니다! 그동안의 과정을 상세히 공유합니다.",
        user_nickname: "드디어성공",
        created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35일 전
        updated_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 89,
        comments_count: 45,
        views_count: 723,
        category,
        tags: ['1금융권', '대출성공', '신용점수'],
        images: ['https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&h=300&fit=crop']
      }
    ]

    setTimeout(() => {
      setAllPosts(demoPosts)
      setLoading(false)
    }, 500)
  }, [category])

  // 검색 및 필터링 로직
  const filteredPosts = useMemo(() => {
    let result = [...allPosts]

    // 텍스트 검색 (제목, 내용, 닉네임, 태그)
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase()
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.user_nickname.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }

    // 기간 필터
    if (searchFilters.timeRange !== 'all') {
      const now = new Date()
      const filterTime = {
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000
      }[searchFilters.timeRange]

      if (filterTime) {
        result = result.filter(post => 
          now.getTime() - new Date(post.created_at).getTime() <= filterTime
        )
      }
    }

    // 이미지 필터
    if (searchFilters.hasImages !== null) {
      result = result.filter(post => {
        const hasImages = post.images && post.images.length > 0
        return searchFilters.hasImages ? hasImages : !hasImages
      })
    }

    // 정렬
    result.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'popular':
          return b.likes_count - a.likes_count
        case 'views':
          return b.views_count - a.views_count
        case 'comments':
          return b.comments_count - a.comments_count
        case 'latest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return result
  }, [allPosts, searchFilters])

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters)
  }

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
          href={`/write?category=${category}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          글쓰기
        </Link>
      </div>

      {/* 검색바 */}
      {showSearch && (
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch}
            placeholder={`${getCategoryName(category)}에서 검색...`}
          />
        </div>
      )}

      {/* 검색 결과 요약 */}
      {searchFilters.query && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            '<span className="font-semibold">{searchFilters.query}</span>' 검색 결과: 
            <span className="font-semibold ml-1">{filteredPosts.length}개</span>의 게시글
          </p>
        </div>
      )}

      {/* 게시글 목록 */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-500 mb-4">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            {searchFilters.query ? (
              <>
                <p className="text-lg font-medium">검색 결과가 없어요</p>
                <p className="text-sm mt-1">다른 키워드로 검색해보세요 🔍</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">아직 게시글이 없어요</p>
                <p className="text-sm mt-1">첫 번째 이야기를 들려주세요! ✨</p>
              </>
            )}
          </div>
          {!searchFilters.query && (
            <Link
              href={`/write?category=${category}`}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              첫 글 작성하기
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
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
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {post.content}
              </p>

              {/* 태그 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
              
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
                  {post.images && post.images.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-600">📷</span>
                      <span className="text-blue-600 text-xs">{post.images.length}</span>
                    </div>
                  )}
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