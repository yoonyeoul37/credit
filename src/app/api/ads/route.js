import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// 광고 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position'); // header, sidebar, content 등
    const isActive = searchParams.get('active') !== 'false'; // 기본값: true
    
    // 기본 쿼리 구성 (우선순위 순, 그 다음 최신순)
    let query = supabase
      .from('ads')
      .select('*')
      .eq('is_active', isActive)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    
    // 위치별 필터링
    if (position) {
      query = query.eq('position', position);
    }
    
    // 현재 날짜 기준 활성 광고만 조회
    const now = new Date().toISOString();
    query = query
      .lte('start_date', now)
      .gte('end_date', now);
    
    const { data: ads, error } = await query;
    
    if (error) {
      console.error('광고 조회 오류:', error);
      return NextResponse.json({ error: '광고를 불러오는데 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({
      ads: ads || [],
      count: ads?.length || 0
    });
    
  } catch (error) {
    console.error('광고 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 광고 생성 (관리자 전용)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, image_url, link_url, position, start_date, end_date, is_active } = body;
    
    // 유효성 검사
    if (!title || !description || !position) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }
    
    // 광고 생성
    const { data: ad, error } = await supabase
      .from('ads')
      .insert([
        {
          title,
          description,
          image_url,
          link_url,
          position,
          start_date: start_date || new Date().toISOString(),
          end_date: end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30일 후
          is_active: is_active !== false,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('광고 생성 오류:', error);
      return NextResponse.json({ error: '광고 생성에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ ad }, { status: 201 });
    
  } catch (error) {
    console.error('광고 생성 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 