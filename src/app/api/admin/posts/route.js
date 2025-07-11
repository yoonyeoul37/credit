import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminAuth } from '../auth/route'

// 관리자용 게시글 목록 조회 (GET)
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
    const category = searchParams.get('category')
    const hidden = searchParams.get('hidden')
    
    let query = supabaseAdmin
      .from('posts')
      .select('*, comments(count)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    // 카테고리 필터
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // 숨김 상태 필터
    if (hidden === 'true') {
      query = query.eq('is_hidden', true)
    } else if (hidden === 'false') {
      query = query.eq('is_hidden', false)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching admin posts:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    // 댓글 수와 신고 수 추가
    const postsWithStats = data.map(post => ({
      ...post,
      commentCount: post.comments?.[0]?.count || 0,
      reports: 0 // TODO: 신고 테이블과 연결 필요
    }))

    return NextResponse.json({
      posts: postsWithStats,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    })

  } catch (error) {
    console.error('Error in GET /api/admin/posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 게시글 숨김/표시 처리 (PATCH)
export async function PATCH(request) {
  try {
    // 관리자 권한 확인
    const adminAuth = await verifyAdminAuth(request)
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { postIds, action } = body // action: 'hide', 'show', 'delete'

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json({ error: 'Post IDs are required' }, { status: 400 })
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
          .from('posts')
          .delete()
          .in('id', postIds)

        if (deleteError) {
          console.error('Error deleting posts:', deleteError)
          return NextResponse.json({ error: 'Failed to delete posts' }, { status: 500 })
        }

        return NextResponse.json({ message: `${postIds.length} posts deleted successfully` })
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update(updateData)
      .in('id', postIds)
      .select()

    if (error) {
      console.error('Error updating posts:', error)
      return NextResponse.json({ error: 'Failed to update posts' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `${postIds.length} posts ${action}d successfully`,
      posts: data
    })

  } catch (error) {
    console.error('Error in PATCH /api/admin/posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 