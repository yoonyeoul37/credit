import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// 관리자 뉴스 목록 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    // 기본 쿼리 구성
    let query = supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false });
    
    // 비활성 뉴스 포함 여부
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    // 카테고리 필터링
    if (category) {
      query = query.eq('category', category);
    }
    
    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data: news, error, count } = await query.range(from, to);
    
    if (error) {
      console.error('관리자 뉴스 조회 오류:', error);
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
    console.error('관리자 뉴스 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 관리자 뉴스 생성
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
      console.error('관리자 뉴스 생성 오류:', error);
      return NextResponse.json({ error: '뉴스 생성에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ news: newsItem }, { status: 201 });
    
  } catch (error) {
    console.error('관리자 뉴스 생성 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 관리자 뉴스 수정
export async function PUT(request) {
  try {
    const body = await request.json();
    const { ids, action, ...updateFields } = body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '처리할 뉴스 ID가 필요합니다.' }, { status: 400 });
    }
    
    let updateData = {};
    
    if (action === 'activate') {
      // 뉴스 활성화
      updateData = {
        is_active: true,
        updated_at: new Date().toISOString()
      };
    } else if (action === 'deactivate') {
      // 뉴스 비활성화
      updateData = {
        is_active: false,
        updated_at: new Date().toISOString()
      };
    } else if (action === 'setImportant') {
      // 중요 뉴스 설정
      updateData = {
        is_important: true,
        updated_at: new Date().toISOString()
      };
    } else if (action === 'unsetImportant') {
      // 중요 뉴스 해제
      updateData = {
        is_important: false,
        updated_at: new Date().toISOString()
      };
    } else if (action === 'update') {
      // 뉴스 내용 수정
      updateData = {
        ...updateFields,
        updated_at: new Date().toISOString()
      };
    } else {
      return NextResponse.json({ error: '잘못된 액션입니다.' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('news')
      .update(updateData)
      .in('id', ids);
    
    if (error) {
      console.error('관리자 뉴스 수정 오류:', error);
      return NextResponse.json({ error: '뉴스 수정에 실패했습니다.' }, { status: 500 });
    }
    
    const actionText = {
      activate: '활성화',
      deactivate: '비활성화',
      setImportant: '중요 설정',
      unsetImportant: '중요 해제',
      update: '수정'
    }[action];
    
    return NextResponse.json({ 
      message: `${ids.length}개의 뉴스가 ${actionText} 처리되었습니다.`,
      processedCount: ids.length
    });
    
  } catch (error) {
    console.error('관리자 뉴스 수정 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 관리자 뉴스 삭제
export async function DELETE(request) {
  try {
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '삭제할 뉴스 ID가 필요합니다.' }, { status: 400 });
    }
    
    // 뉴스 완전 삭제
    const { error } = await supabase
      .from('news')
      .delete()
      .in('id', ids);
    
    if (error) {
      console.error('관리자 뉴스 삭제 오류:', error);
      return NextResponse.json({ error: '뉴스 삭제에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: `${ids.length}개의 뉴스가 삭제되었습니다.`,
      deletedCount: ids.length
    });
    
  } catch (error) {
    console.error('관리자 뉴스 삭제 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 