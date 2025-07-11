import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { verifyAdminAuth } from '../admin/auth/route'

// 뉴스 목록 조회 (GET) - posts 테이블의 category='news' 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const search = searchParams.get('search')
    
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('category', 'news')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    // 검색 기능
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,author.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching news:', error)
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
    }

    // 뉴스 형태로 데이터 변환
    const newsData = data.map(post => ({
      id: post.id,
      title: post.title,
      summary: post.content, // content를 summary로 변환
      source: post.author,   // author를 source로 변환
      url: '#', // 기본값
      publishedAt: post.created_at,
      category: '뉴스',
      isImportant: false,
      isActive: !post.is_hidden
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
    console.error('Error in GET /api/news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 뉴스 생성 (POST) - 관리자만
export async function POST(request) {
  try {
    // 관리자 권한 확인
    const adminAuth = await verifyAdminAuth(request)
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      summary, 
      source, 
      url
    } = body

    // 입력 검증
    if (!title || !summary || !source) {
      return NextResponse.json({ error: 'Title, summary, and source are required' }, { status: 400 })
    }

    // 뉴스 생성 (posts 테이블에 category='news'로 저장)
    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert([{
        title,
        content: summary, // summary를 content로 저장
        author: source,   // source를 author로 저장
        password_hash: 'news-admin-hash', // 뉴스는 관리자가 생성하므로 고정 해시
        category: 'news'
      }])
      .select()

    if (error) {
      console.error('Error creating news:', error)
      return NextResponse.json({ error: 'Failed to create news' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'News created successfully',
      news: data[0]
    }, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 