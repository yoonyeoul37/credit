import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// 뉴스 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const important = searchParams.get('important') === 'true';
    const isActive = searchParams.get('active') !== 'false'; // 기본값: true
    
    // 기본 쿼리 구성
    let query = supabase
      .from('news')
      .select('*')
      .eq('is_active', isActive)
      .order('published_at', { ascending: false });
    
    // 카테고리 필터링
    if (category) {
      query = query.eq('category', category);
    }
    
    // 중요 뉴스만 조회
    if (important) {
      query = query.eq('is_important', true);
    }
    
    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    const { data: news, error, count } = await query;
    
    if (error) {
      console.error('뉴스 조회 오류:', error);
      return NextResponse.json({ error: '뉴스를 불러오는데 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({
      news: news || [],
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
    
  } catch (error) {
    console.error('뉴스 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 뉴스 생성 (관리자 전용)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, summary, content, source, url, category, is_important, published_at } = body;
    
    // 유효성 검사
    if (!title || !summary || !source) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }
    
    // 뉴스 생성
    const { data: newsItem, error } = await supabase
      .from('news')
      .insert([
        {
          title,
          summary,
          content,
          source,
          url,
          category: category || '일반',
          is_important: is_important || false,
          is_active: true,
          published_at: published_at || new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('뉴스 생성 오류:', error);
      return NextResponse.json({ error: '뉴스 생성에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ news: newsItem }, { status: 201 });
    
  } catch (error) {
    console.error('뉴스 생성 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 