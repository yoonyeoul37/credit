import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminAuth } from '../auth/route'

// 관리자용 댓글 목록 조회 (GET)
export async function GET(request) {
  try {
    // 관리자 권한 확인
    const adminAuth = await verifyAdminAuth(request)
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const hidden = searchParams.get('hidden')
    const postId = searchParams.get('postId')
    
    let query = supabaseAdmin
      .from('comments')
      .select('*, posts(title)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    // 특정 게시글의 댓글만 조회
    if (postId) {
      query = query.eq('post_id', parseInt(postId))
    }

    // 숨김 상태 필터
    if (hidden === 'true') {
      query = query.eq('is_hidden', true)
    } else if (hidden === 'false') {
      query = query.eq('is_hidden', false)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching admin comments:', error)
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    // 신고 수 추가 (임시로 0)
    const commentsWithStats = data.map(comment => ({
      ...comment,
      reports: 0, // TODO: 신고 테이블과 연결 필요
      postTitle: comment.posts?.title || '삭제된 게시글'
    }))

    return NextResponse.json({
      comments: commentsWithStats,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    })

  } catch (error) {
    console.error('Error in GET /api/admin/comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 댓글 숨김/표시 처리 (PATCH)
export async function PATCH(request) {
  try {
    // 관리자 권한 확인
    const adminAuth = await verifyAdminAuth(request)
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { commentIds, action } = body // action: 'hide', 'show', 'delete'

    if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
      return NextResponse.json({ error: 'Comment IDs are required' }, { status: 400 })
    }

    let updateData = {}
    
    switch (action) {
      case 'hide':
        updateData = { is_hidden: true }
        break
      case 'show':
        updateData = { is_hidden: false }
        break
      case 'delete':
        // 실제 삭제
        const { error: deleteError } = await supabaseAdmin
          .from('comments')
          .delete()
          .in('id', commentIds)

        if (deleteError) {
          console.error('Error deleting comments:', deleteError)
          return NextResponse.json({ error: 'Failed to delete comments' }, { status: 500 })
        }

        return NextResponse.json({ message: `${commentIds.length} comments deleted successfully` })
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('comments')
      .update(updateData)
      .in('id', commentIds)
      .select()

    if (error) {
      console.error('Error updating comments:', error)
      return NextResponse.json({ error: 'Failed to update comments' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `${commentIds.length} comments ${action}d successfully`,
      comments: data
    })

  } catch (error) {
    console.error('Error in PATCH /api/admin/comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 