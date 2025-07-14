import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// 관리자 광고 목록 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // 모든 광고 조회 (관리자는 비활성화된 것도 볼 수 있음)
    const query = supabase
      .from('ads')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    
    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data: ads, error, count } = await query.range(from, to);
    
    if (error) {
      console.error('관리자 광고 조회 오류:', error);
      return NextResponse.json({ error: '광고를 불러오는데 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({
      ads: ads || [],
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
    
  } catch (error) {
    console.error('관리자 광고 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 관리자 광고 생성
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, image_url, link_url, position, priority, start_date, end_date, is_active } = body;
    
    // 유효성 검사
    if (!title || !description || !position) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }
    
    // 광고 생성 (실제 테이블 구조에 맞춤)
    const insertData = {
      title,
      description,
      position,
      start_date: start_date || new Date().toISOString(),
      end_date: end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: is_active !== false
    };

    // 선택적 컬럼들 (실제 테이블 구조 기준)
    if (image_url) {
      insertData.image_url = image_url;
    }
    if (link_url) {
      insertData.url = link_url; // link_url이 아니라 url 컬럼
    }
    if (priority !== undefined) {
      insertData.priority = priority || 1;
    }

    const { data: ad, error } = await supabase
      .from('ads')
      .insert([insertData])
      .select()
      .single();
    
    if (error) {
      console.error('관리자 광고 생성 오류:', error);
      return NextResponse.json({ error: '광고 생성에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ ad }, { status: 201 });
    
  } catch (error) {
    console.error('관리자 광고 생성 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 관리자 광고 수정
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, description, image_url, link_url, position, priority, start_date, end_date, is_active } = body;
    
    if (!id) {
      return NextResponse.json({ error: '광고 ID가 필요합니다.' }, { status: 400 });
    }
    
    // 광고 수정
    const { data: ad, error } = await supabase
      .from('ads')
      .update({
        title,
        description,
        image_url,
        link_url,
        position,
        priority,
        start_date,
        end_date,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('관리자 광고 수정 오류:', error);
      return NextResponse.json({ error: '광고 수정에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ ad });
    
  } catch (error) {
    console.error('관리자 광고 수정 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 관리자 광고 삭제 (단일 또는 일괄)
export async function DELETE(request) {
  try {
    const { id, ids } = await request.json();
    
    // 단일 삭제 또는 일괄 삭제 지원
    const deleteIds = ids || (id ? [id] : []);
    
    if (!deleteIds || deleteIds.length === 0) {
      return NextResponse.json({ error: '삭제할 광고 ID가 필요합니다.' }, { status: 400 });
    }
    
    // 광고 삭제
    const { error } = await supabase
      .from('ads')
      .delete()
      .in('id', deleteIds);
    
    if (error) {
      console.error('관리자 광고 삭제 오류:', error);
      return NextResponse.json({ error: '광고 삭제에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: `${deleteIds.length}개의 광고가 삭제되었습니다.`,
      deletedCount: deleteIds.length
    });
    
  } catch (error) {
    console.error('관리자 광고 삭제 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 