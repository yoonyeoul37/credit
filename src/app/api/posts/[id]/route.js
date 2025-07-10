import { NextResponse } from 'next/server'
import { supabase, generateHash, sanitizeHtml } from '@/lib/supabase'

// 개별 게시글 조회 (GET)
export async function GET(request, { params }) {
  try {
    const { id } = params

    // 게시글 조회 및 조회수 증가
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('is_hidden', false)
      .single()

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 조회수 증가
    const { error: updateError } = await supabase
      .from('posts')
      .update({ views: post.views + 1 })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating views:', updateError)
    }

    // 댓글 조회
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true })

    if (commentsError) {
      console.error('Error fetching comments:', commentsError)
    }

    // 댓글을 트리 구조로 변환 (대댓글 처리)
    const commentTree = buildCommentTree(comments || [])

    return NextResponse.json({
      post: { ...post, views: post.views + 1 },
      comments: commentTree,
      commentCount: comments?.length || 0
    })

  } catch (error) {
    console.error('Error in GET /api/posts/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 게시글 수정 (PUT)
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, content, password, images = [] } = body

    // 입력 검증
    if (!title || !content || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 기존 게시글 확인
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('password_hash')
      .eq('id', id)
      .single()

    if (fetchError || !existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 비밀번호 확인
    const passwordHash = generateHash(password)
    if (passwordHash !== existingPost.password_hash) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // HTML 태그 제거
    const cleanTitle = sanitizeHtml(title)
    const cleanContent = sanitizeHtml(content)

    // 게시글 수정
    const { data, error } = await supabase
      .from('posts')
      .update({
        title: cleanTitle,
        content: cleanContent,
        images: images.slice(0, 5)
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating post:', error)
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Post updated successfully',
      post: data[0]
    })

  } catch (error) {
    console.error('Error in PUT /api/posts/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 게시글 삭제 (DELETE)
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { password } = body

    // 입력 검증
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // 기존 게시글 확인
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('password_hash')
      .eq('id', id)
      .single()

    if (fetchError || !existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 비밀번호 확인
    const passwordHash = generateHash(password)
    if (passwordHash !== existingPost.password_hash) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // 게시글 삭제 (실제로는 숨김 처리)
    const { error } = await supabase
      .from('posts')
      .update({ is_hidden: true })
      .eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Post deleted successfully'
    })

  } catch (error) {
    console.error('Error in DELETE /api/posts/[id]:', error)
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