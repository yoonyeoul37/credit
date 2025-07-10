import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminAuth } from '../auth/route'

// 관리자 대시보드 데이터 조회 (GET)
export async function GET(request) {
  try {
    // 관리자 권한 확인
    const adminAuth = await verifyAdminAuth(request)
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 통계 데이터 병렬 조회
    const [
      postsResult,
      commentsResult,
      todayPostsResult,
      todayCommentsResult,
      recentPostsResult,
      recentCommentsResult,
      categoryStatsResult,
      reportsResult
    ] = await Promise.all([
      // 총 게시글 수
      supabaseAdmin
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false),
      
      // 총 댓글 수
      supabaseAdmin
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false),
      
      // 오늘 게시글 수
      supabaseAdmin
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date().toISOString().split('T')[0])
        .eq('is_hidden', false),
      
      // 오늘 댓글 수
      supabaseAdmin
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date().toISOString().split('T')[0])
        .eq('is_hidden', false),
      
      // 최근 게시글 5개
      supabaseAdmin
        .from('posts')
        .select('id, title, author, category, created_at, views')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // 최근 댓글 5개
      supabaseAdmin
        .from('comments')
        .select('id, content, author, post_id, created_at, posts(title)')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // 카테고리별 게시글 수
      supabaseAdmin
        .from('posts')
        .select('category', { count: 'exact' })
        .eq('is_hidden', false),
      
      // 대기 중인 신고
      supabaseAdmin
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
    ])

    // 카테고리별 통계 계산
    const categoryStats = {}
    const categories = ['credit', 'personal', 'corporate', 'workout', 'card', 'loan', 'news']
    
    for (const category of categories) {
      const { count } = await supabaseAdmin
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('category', category)
        .eq('is_hidden', false)
      
      categoryStats[category] = count || 0
    }

    // 일주일간 게시글 추이
    const weeklyStats = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const { count } = await supabaseAdmin
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dateStr)
        .lt('created_at', new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .eq('is_hidden', false)
      
      weeklyStats.push({
        date: dateStr,
        posts: count || 0
      })
    }

    return NextResponse.json({
      stats: {
        totalPosts: postsResult.count || 0,
        totalComments: commentsResult.count || 0,
        todayPosts: todayPostsResult.count || 0,
        todayComments: todayCommentsResult.count || 0,
        pendingReports: reportsResult.count || 0
      },
      recentPosts: recentPostsResult.data || [],
      recentComments: recentCommentsResult.data || [],
      categoryStats,
      weeklyStats
    })

  } catch (error) {
    console.error('Error in GET /api/admin/dashboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 게시글/댓글 관리 (POST)
export async function POST(request) {
  try {
    // 관리자 권한 확인
    const adminAuth = await verifyAdminAuth(request)
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, type, id, reason } = body

    // 입력 검증
    if (!action || !type || !id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['hide', 'show', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (!['post', 'comment'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const table = type === 'post' ? 'posts' : 'comments'
    let updateData = {}

    switch (action) {
      case 'hide':
        updateData = { is_hidden: true }
        break
      case 'show':
        updateData = { is_hidden: false }
        break
      case 'delete':
        // 실제 삭제 대신 완전 숨김 처리
        updateData = { is_hidden: true }
        break
    }

    const { error } = await supabaseAdmin
      .from(table)
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error(`Error ${action}ing ${type}:`, error)
      return NextResponse.json({ error: `Failed to ${action} ${type}` }, { status: 500 })
    }

    // 관리 로그 기록 (선택사항)
    await supabaseAdmin
      .from('admin_logs')
      .insert([{
        admin_id: adminAuth.adminId,
        action: `${action}_${type}`,
        target_id: id,
        reason: reason || null,
        created_at: new Date().toISOString()
      }])
      .select()

    return NextResponse.json({
      message: `${type} ${action}d successfully`
    })

  } catch (error) {
    console.error('Error in POST /api/admin/dashboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 