import { NextResponse } from 'next/server'
import { supabase, generateHash, sanitizeHtml } from '@/lib/supabase'

// 댓글 작성 (POST)
export async function POST(request) {
  try {
    const body = await request.json()
    const { post_id, content, author, password, parent_id = null } = body

    // 입력 검증
    if (!post_id || !content || !author || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Comment too long' }, { status: 400 })
    }

    if (author.length > 50) {
      return NextResponse.json({ error: 'Author name too long' }, { status: 400 })
    }

    // 게시글 존재 확인
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', post_id)
      .eq('is_hidden', false)
      .single()

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 대댓글인 경우 부모 댓글 존재 확인
    if (parent_id) {
      const { data: parentComment, error: parentError } = await supabase
        .from('comments')
        .select('id')
        .eq('id', parent_id)
        .eq('post_id', post_id)
        .eq('is_hidden', false)
        .single()

      if (parentError || !parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 })
      }
    }

    // 비밀번호 해시
    const passwordHash = generateHash(password)

    // HTML 태그 제거
    const cleanContent = sanitizeHtml(content)
    const cleanAuthor = sanitizeHtml(author)

    // 댓글 저장
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        post_id: parseInt(post_id),
        parent_id: parent_id ? parseInt(parent_id) : null,
        content: cleanContent,
        author: cleanAuthor,
        password_hash: passwordHash
      }])
      .select()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Comment created successfully',
      comment: data[0]
    }, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 특정 게시글의 댓글 조회 (GET)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const post_id = searchParams.get('post_id')

    if (!post_id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // 댓글 조회
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post_id)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    // 댓글을 트리 구조로 변환
    const commentTree = buildCommentTree(comments)

    return NextResponse.json({
      comments: commentTree,
      count: comments.length
    })

  } catch (error) {
    console.error('Error in GET /api/comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 댓글 트리 구조 생성 함수
function buildCommentTree(comments) {
  const commentMap = new Map()
  const rootComments = []

  // 모든 댓글을 Map에 저장
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  // 트리 구조 구성
  comments.forEach(comment => {
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id)
      if (parent) {
        parent.replies.push(commentMap.get(comment.id))
      }
    } else {
      rootComments.push(commentMap.get(comment.id))
    }
  })

  return rootComments
} 