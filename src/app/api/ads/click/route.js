import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// 광고 클릭 추적
export async function POST(request) {
  try {
    const body = await request.json();
    const { ad_id, page_url } = body;
    
    // 유효성 검사
    if (!ad_id) {
      return NextResponse.json({ error: '광고 ID가 필요합니다.' }, { status: 400 });
    }
    
    // 클라이언트 정보 수집
    const user_ip = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   request.ip || 
                   'unknown';
    const user_agent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    
    // 클릭 추적 데이터 저장
    const { data: clickData, error } = await supabase
      .from('ad_clicks')
      .insert([
        {
          ad_id: parseInt(ad_id),
          user_ip: user_ip.split(',')[0].trim(), // 프록시를 통한 경우 첫 번째 IP만 사용
          user_agent,
          referrer,
          page_url: page_url || referrer,
          clicked_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('클릭 추적 저장 오류:', error);
      return NextResponse.json({ error: '클릭 추적 저장에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      click_id: clickData.id,
      message: '클릭이 기록되었습니다.'
    });
    
  } catch (error) {
    console.error('클릭 추적 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 클릭 통계 조회 (관리자용)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ad_id = searchParams.get('ad_id');
    const days = parseInt(searchParams.get('days') || '7');
    
    let query = supabase
      .from('ad_clicks')
      .select('*');
    
    // 특정 광고의 클릭만 조회
    if (ad_id) {
      query = query.eq('ad_id', parseInt(ad_id));
    }
    
    // 기간 제한
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    query = query.gte('clicked_at', startDate.toISOString());
    
    const { data: clicks, error } = await query.order('clicked_at', { ascending: false });
    
    if (error) {
      console.error('클릭 통계 조회 오류:', error);
      return NextResponse.json({ error: '클릭 통계를 불러오는데 실패했습니다.' }, { status: 500 });
    }
    
    // 통계 계산
    const totalClicks = clicks.length;
    const uniqueIPs = new Set(clicks.map(click => click.user_ip)).size;
    const dailyStats = {};
    
    clicks.forEach(click => {
      const date = new Date(click.clicked_at).toISOString().split('T')[0];
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });
    
    return NextResponse.json({
      total_clicks: totalClicks,
      unique_visitors: uniqueIPs,
      daily_stats: dailyStats,
      recent_clicks: clicks.slice(0, 10) // 최근 10개 클릭
    });
    
  } catch (error) {
    console.error('클릭 통계 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 