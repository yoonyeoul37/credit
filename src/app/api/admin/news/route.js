import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminAuth } from '../auth/route'

// 관리자용 뉴스 목록 조회 (GET) - posts 테이블의 category='news' 조회
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
    
    let query = supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('category', 'news')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    // 숨김 상태 필터
    if (hidden === 'true') {
      query = query.eq('is_hidden', true)
    } else if (hidden === 'false') {
      query = query.eq('is_hidden', false)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching admin news:', error)
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
    }

    // 뉴스 형태로 데이터 변환
    const newsData = data.map(post => ({
      id: post.id,
      title: post.title,
      summary: post.content,
      source: post.author,
      url: '#',
      publishedAt: post.created_at,
      category: '뉴스',
      isImportant: false,
      isActive: !post.is_hidden,
      createdAt: post.created_at
    }))

    return NextResponse.json({
      news: newsData || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error in GET /api/admin/news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 뉴스 활성화/비활성화 처리 (PATCH)
export async function PATCH(request) {
  try {
    // 관리자 권한 확인
    const adminAuth = await verifyAdminAuth(request)
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { newsIds, action } = body // action: 'activate', 'deactivate', 'delete'

    if (!newsIds || !Array.isArray(newsIds) || newsIds.length === 0) {
      return NextResponse.json({ error: 'News IDs are required' }, { status: 400 })
    }

    let updateData = {}
    
    switch (action) {
      case 'activate':
        updateData = { is_hidden: false }
        break
      case 'deactivate':
        updateData = { is_hidden: true }
        break
      case 'delete':
        // 실제 삭제
        const { error: deleteError } = await supabaseAdmin
          .from('posts')
          .delete()
          .in('id', newsIds)

        if (deleteError) {
          console.error('Error deleting news:', deleteError)
          return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 })
        }

        return NextResponse.json({ message: `${newsIds.length} news items deleted successfully` })
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update(updateData)
      .in('id', newsIds)
      .select()

    if (error) {
      console.error('Error updating news:', error)
      return NextResponse.json({ error: 'Failed to update news' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `${newsIds.length} news items ${action}d successfully`,
      news: data
    })

  } catch (error) {
    console.error('Error in PATCH /api/admin/news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 