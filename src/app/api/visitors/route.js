import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { promises as fs } from 'fs';
import path from 'path';

// 로컬 파일 기반 방문자 데이터 저장 (Supabase 대체)
const saveVisitorToFile = async (visitorData) => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'visitors.json');
    
    // 디렉토리가 없으면 생성
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (err) {
      // 디렉토리가 이미 존재하는 경우 무시
    }
    
    // 기존 데이터 읽기
    let visitors = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      visitors = JSON.parse(fileContent);
    } catch (err) {
      // 파일이 없거나 파싱 오류인 경우 빈 배열로 시작
      visitors = [];
    }
    
    // 새 방문자 데이터 추가
    const newVisitor = {
      ...visitorData,
      id: Date.now() + Math.random(),
      visited_at: new Date().toISOString()
    };
    
    visitors.push(newVisitor);
    
    // 파일에 저장 (최근 1000개 항목만 유지)
    const recentVisitors = visitors.slice(-1000);
    await fs.writeFile(filePath, JSON.stringify(recentVisitors, null, 2));
    
    return newVisitor;
  } catch (error) {
    console.error('파일 저장 오류:', error);
    throw error;
  }
};

// 방문자 추적
export async function POST(request) {
  try {
    console.log('🔍 방문자 추적 API 시작');
    
    const body = await request.json();
    const { page_url, session_id } = body;
    console.log('📝 요청 데이터:', { page_url, session_id });
    
    // 클라이언트 정보 수집
    const ip_address = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      request.ip || 
                      '127.0.0.1';
    const user_agent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    
    console.log('🌐 클라이언트 정보:', { ip_address, user_agent: user_agent?.substring(0, 50) });
    
    // 방문자 데이터 준비
    const visitorData = {
      ip_address: ip_address.split(',')[0].trim(),
      user_agent,
      page_url,
      referrer,
      session_id,
      is_unique_daily: true, // 일시적으로 모든 방문을 고유 방문으로 처리
    };
    
    console.log('💾 저장할 데이터:', visitorData);
    
    // Supabase 사용 시도, 실패하면 로컬 파일 사용
    if (supabase) {
      try {
        const { data: visitor, error } = await supabase
          .from('visitors')
          .insert([visitorData])
          .select()
          .single();
        
        if (!error) {
          console.log('✅ Supabase 방문자 추적 저장 성공:', visitor.id);
          return NextResponse.json({ 
            success: true,
            visitor_id: visitor.id,
            is_unique_daily: visitorData.is_unique_daily,
            storage: 'supabase'
          });
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase 실패, 로컬 파일로 대체:', supabaseError.message);
      }
    }
    
    // 로컬 파일 저장
    const savedVisitor = await saveVisitorToFile(visitorData);
    console.log('✅ 로컬 파일 방문자 추적 저장 성공:', savedVisitor.id);
    
    return NextResponse.json({ 
      success: true,
      visitor_id: savedVisitor.id,
      is_unique_daily: savedVisitor.is_unique_daily,
      storage: 'local'
    });
    
  } catch (error) {
    console.error('❌ 방문자 추적 API 오류:', error);
    return NextResponse.json({ 
      error: '서버 오류가 발생했습니다.',
      details: error.message 
    }, { status: 500 });
  }
}

// 로컬 파일에서 방문자 데이터 읽기
const getVisitorsFromFile = async () => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'visitors.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (err) {
    console.log('📄 방문자 파일이 없거나 비어있음, 빈 배열 반환');
    return [];
  }
};

// 방문자 통계 조회 (관리자용)
export async function GET(request) {
  try {
    console.log('📊 방문자 통계 조회 시작');
    
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    let visits = [];
    
    // Supabase 시도, 실패하면 로컬 파일 사용
    if (supabase) {
      try {
        const { data: supabaseVisits, error } = await supabase
          .from('visitors')
          .select('*')
          .gte('visited_at', startDate.toISOString())
          .order('visited_at', { ascending: false });
        
        if (!error && supabaseVisits) {
          visits = supabaseVisits;
          console.log('✅ Supabase에서 방문자 데이터 로드:', visits.length);
        } else {
          throw new Error('Supabase 조회 실패');
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase 실패, 로컬 파일 사용:', supabaseError.message);
        visits = await getVisitorsFromFile();
        console.log('📄 로컬 파일에서 방문자 데이터 로드:', visits.length);
      }
    } else {
      visits = await getVisitorsFromFile();
      console.log('📄 로컬 파일에서 방문자 데이터 로드:', visits.length);
    }
    
    // 기간 필터링 (로컬 파일의 경우)
    visits = visits.filter(visit => {
      const visitDate = new Date(visit.visited_at);
      return visitDate >= startDate;
    });
    
    // 통계 계산
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const todayVisits = visits.filter(v => v.visited_at.startsWith(today));
    const yesterdayVisits = visits.filter(v => v.visited_at.startsWith(yesterday));
    
    const todayUnique = visits.filter(v => v.visited_at.startsWith(today) && v.is_unique_daily).length;
    const yesterdayUnique = visits.filter(v => v.visited_at.startsWith(yesterday) && v.is_unique_daily).length;
    
    // 페이지별 방문 통계
    const pageStats = {};
    visits.forEach(visit => {
      const page = visit.page_url || 'unknown';
      pageStats[page] = (pageStats[page] || 0) + 1;
    });
    
    // 일별 통계
    const dailyStats = {};
    visits.forEach(visit => {
      const date = visit.visited_at.split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { total: 0, unique: 0 };
      }
      dailyStats[date].total++;
      if (visit.is_unique_daily) {
        dailyStats[date].unique++;
      }
    });
    
    const result = {
      today: {
        total: todayVisits.length,
        unique: todayUnique
      },
      yesterday: {
        total: yesterdayVisits.length,
        unique: yesterdayUnique
      },
      total_visits: visits.length,
      page_stats: pageStats,
      daily_stats: dailyStats,
      recent_visits: visits.slice(0, 20)
    };
    
    console.log('📈 통계 결과:', {
      today: result.today,
      yesterday: result.yesterday,
      total: result.total_visits
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ 방문자 통계 API 오류:', error);
         return NextResponse.json({ 
       error: '서버 오류가 발생했습니다.',
       details: error.message 
     }, { status: 500 });
   }
} 