import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { verifyAdminAuth } from '../admin/auth/route'

// 광고 조회 (GET)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')
    const isAdmin = searchParams.get('admin') === 'true'

    let query = supabase
      .from('ads')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true })

    // 위치별 필터
    if (position) {
      query = query.eq('position', position)
    }

    // 날짜 필터 (현재 날짜가 광고 기간 내인지 확인)
    const today = new Date().toISOString().split('T')[0]
    query = query.or(`start_date.is.null,start_date.lte.${today}`)
      .or(`end_date.is.null,end_date.gte.${today}`)

    const { data: ads, error } = await query

    if (error) {
      console.error('Error fetching ads:', error)
      return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 })
    }

    // 광고 노출 횟수 증가 (조회할 때마다)
    if (!isAdmin && ads.length > 0) {
      const adIds = ads.map(ad => ad.id)
      await supabase
        .from('ads')
        .update({ 
          impressions: supabase.raw('impressions + 1') 
        })
        .in('id', adIds)
    }

    return NextResponse.json({ ads })

  } catch (error) {
    console.error('Error in GET /api/ads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 광고 생성 (POST) - 관리자만
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
      description, 
      url, 
      image_url, 
      position, 
      priority = 1,
      start_date,
      end_date
    } = body

    // 입력 검증
    if (!title || !position) {
      return NextResponse.json({ error: 'Title and position are required' }, { status: 400 })
    }

    const validPositions = ['header', 'sidebar', 'footer', 'content', 'sticky']
    if (!validPositions.includes(position)) {
      return NextResponse.json({ error: 'Invalid position' }, { status: 400 })
    }

    // 광고 생성
    const { data, error } = await supabaseAdmin
      .from('ads')
      .insert([{
        title,
        description,
        url,
        image_url,
        position,
        priority: parseInt(priority),
        start_date: start_date || null,
        end_date: end_date || null
      }])
      .select()

    if (error) {
      console.error('Error creating ad:', error)
      return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Ad created successfully',
      ad: data[0]
    }, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/ads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 