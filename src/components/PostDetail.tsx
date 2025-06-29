'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Heart, MessageCircle, Eye, Clock, User, Send, 
  ThumbsUp, Reply, MoreVertical, Flag, Share2 
} from 'lucide-react'

interface Comment {
  id: number
  content: string
  user_nickname: string
  created_at: string
  likes_count: number
  replies: Comment[]
  is_liked?: boolean
}

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
  tags: string[]
  is_liked?: boolean
}

interface PostDetailProps {
  postId: string
  category: string
  className?: string
}

const PostDetail = ({ postId, category, className = '' }: PostDetailProps) => {
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [userNickname, setUserNickname] = useState('')
  
  const router = useRouter()

  // 익명 닉네임 생성
  useEffect(() => {
    const generateNickname = () => {
      const adjectives = ['따뜻한', '희망찬', '용기있는', '지혜로운', '친근한', '성실한']
      const nouns = ['시작', '여행', '도전', '성장', '변화', '꿈']
      const numbers = Math.floor(Math.random() * 900) + 100
      return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${numbers}`
    }
    setUserNickname(generateNickname())
  }, [])

  // 데모 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      // 임시 게시글 데이터
      const demoPost: Post = {
        id: parseInt(postId),
        title: "신용점수 200점 올린 후기 공유합니다",
        content: `안녕하세요. 6개월 전 신용점수가 400점대였던 절망적인 상황에서 드디어 600점대까지 올렸습니다. 

같은 상황에 계신 분들께 도움이 되길 바라며 제 경험을 공유드립니다.

**1. 연체 기록 정리**
가장 먼저 한 일은 모든 연체 기록을 정리하는 것이었습니다. 작은 금액이라도 연체된 것들을 모두 찾아서 납부했어요.

**2. 자동이체 설정**
실수로 연체하는 일이 없도록 모든 고정비를 자동이체로 설정했습니다. 

**3. 신용카드 사용 패턴 개선**
- 사용한 즉시 바로 결제
- 한도의 30% 이내로만 사용
- 무분별한 현금서비스 금지

**4. 꾸준한 모니터링**
매월 신용점수를 확인하며 변화를 추적했습니다.

처음엔 변화가 없어서 포기하고 싶었지만, 3개월 차부터 조금씩 오르기 시작했어요. 

여러분도 포기하지 마시고 꾸준히 하시면 분명 좋은 결과가 있을 거예요! 💪`,
        user_nickname: "희망찬시작123",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes_count: 24,
        comments_count: 8,
        views_count: 156,
        category,
        tags: ['신용점수', '신용회복', '성공사례', '팁'],
        is_liked: false
      }

      const demoComments: Comment[] = [
        {
          id: 1,
          content: "정말 대단하세요! 구체적인 방법까지 알려주셔서 감사합니다. 저도 따라해보겠습니다.",
          user_nickname: "새출발하자",
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          likes_count: 5,
          replies: [
            {
              id: 11,
              content: "네, 꾸준히 하시면 분명 좋은 결과 있을 거예요! 화이팅!",
              user_nickname: "희망찬시작123",
              created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
              likes_count: 2,
              replies: []
            }
          ]
        },
        {
          id: 2,
          content: "한도의 30% 이내 사용이 정말 중요한 것 같아요. 저는 몰라서 계속 90% 가까이 사용했거든요 ㅠㅠ",
          user_nickname: "반성중",
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          likes_count: 3,
          replies: []
        },
        {
          id: 3,
          content: "혹시 어떤 앱으로 신용점수 확인하셨나요? 추천 부탁드려요!",
          user_nickname: "궁금한사람",
          created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          likes_count: 1,
          replies: []
        }
      ]

      setTimeout(() => {
        setPost(demoPost)
        setComments(demoComments)
        setLoading(false)
      }, 500)
    }

    loadData()
  }, [postId, category])

  const getCategoryInfo = (cat: string) => {
    const categories: { [key: string]: { name: string; color: string; icon: string } } = {
      'credit-story': { name: '신용이야기', color: 'blue', icon: '💳' },
      'personal-recovery': { name: '개인회생', color: 'green', icon: '🔄' },
      'corporate-recovery': { name: '법인회생', color: 'purple', icon: '🏢' },
      'loan-story': { name: '대출이야기', color: 'orange', icon: '💰' },
      'success-story': { name: '성공사례', color: 'emerald', icon: '⭐' }
    }
    return categories[cat] || categories['credit-story']
  }

  const categoryInfo = getCategoryInfo(category)

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
  }

  const handleLike = () => {
    if (!post) return
    setPost({
      ...post,
      is_liked: !post.is_liked,
      likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
    })
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) return

    const newComment: Comment = {
      id: Date.now(),
      content: commentContent.trim(),
      user_nickname: userNickname,
      created_at: new Date().toISOString(),
      likes_count: 0,
      replies: []
    }

    setComments([...comments, newComment])
    setCommentContent('')
    
    if (post) {
      setPost({ ...post, comments_count: post.comments_count + 1 })
    }
  }

  const handleReplySubmit = (parentId: number) => {
    if (!replyContent.trim()) return

    const newReply: Comment = {
      id: Date.now(),
      content: replyContent.trim(),
      user_nickname: userNickname,
      created_at: new Date().toISOString(),
      likes_count: 0,
      replies: []
    }

    setComments(comments.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, newReply] }
        : comment
    ))
    
    setReplyContent('')
    setReplyingTo(null)
    
    if (post) {
      setPost({ ...post, comments_count: post.comments_count + 1 })
    }
  }

  if (loading) {
    return (
      <div className={`max-w-4xl mx-auto ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">게시글을 찾을 수 없습니다.</p>
        <Link href={`/${category}`} className="text-blue-600 hover:underline mt-2 inline-block">
          목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* 네비게이션 */}
      <div className="mb-6">
        <Link
          href={`/${category}`}
          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {categoryInfo.name}로 돌아가기
        </Link>
      </div>

      {/* 게시글 */}
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* 게시글 헤더 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg">{categoryInfo.icon}</span>
            <span className={`text-sm font-medium text-${categoryInfo.color}-700 bg-${categoryInfo.color}-100 px-2 py-1 rounded-full`}>
              {categoryInfo.name}
            </span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
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
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments_count}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 내용 */}
        <div className="p-6">
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </div>
          
          {/* 태그 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={`bg-${categoryInfo.color}-50 text-${categoryInfo.color}-700 px-3 py-1 rounded-full text-sm hover:bg-${categoryInfo.color}-100 cursor-pointer transition-colors`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 게시글 액션 */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  post.is_liked 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                <span>{post.likes_count}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>공유</span>
              </button>
            </div>
            
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>

      {/* 댓글 섹션 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            댓글 {post.comments_count}개
          </h3>
        </div>

        {/* 댓글 작성 */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">💚 {userNickname}</span>
            </div>
            <div className="flex space-x-3">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="따뜻한 댓글을 남겨주세요..."
                rows={3}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!commentContent.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* 댓글 목록 */}
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <div key={comment.id} className="p-6">
              {/* 댓글 */}
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-green-700">💚 {comment.user_nickname}</span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-800 mb-3 whitespace-pre-wrap">{comment.content}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{comment.likes_count}</span>
                    </button>
                    <button 
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Reply className="w-3 h-3" />
                      <span>답글</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 답글 입력 */}
              {replyingTo === comment.id && (
                <div className="mt-4 ml-6 pl-4 border-l-2 border-gray-200">
                  <form onSubmit={(e) => { e.preventDefault(); handleReplySubmit(comment.id); }} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">💚 {userNickname}</span>
                    </div>
                    <div className="flex space-x-2">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답글을 작성해주세요..."
                        rows={2}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        maxLength={300}
                      />
                      <button
                        type="submit"
                        disabled={!replyContent.trim()}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        답글
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 답글 목록 */}
              {comment.replies.length > 0 && (
                <div className="mt-4 ml-6 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="pl-4 border-l-2 border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-green-700 text-sm">💚 {reply.user_nickname}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(reply.created_at)}</span>
                      </div>
                      <p className="text-gray-800 text-sm mb-2 whitespace-pre-wrap">{reply.content}</p>
                      <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{reply.likes_count}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>아직 댓글이 없어요</p>
            <p className="text-sm mt-1">첫 번째 댓글을 남겨주세요! ✨</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetail 