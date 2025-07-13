import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// 관리자 게시글 목록 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    
    // 기본 쿼리 구성
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    // 삭제된 게시글 포함 여부
    if (!includeDeleted) {
      query = query.eq('is_deleted', false);
    }
    
    // 카테고리 필터링
    if (category) {
      query = query.eq('category', category);
    }
    
    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data: posts, error, count } = await query.range(from, to);
    
    if (error) {
      console.error('관리자 게시글 조회 오류:', error);
      return NextResponse.json({ error: '게시글을 불러오는데 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({
      posts: posts || [],
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
    
  } catch (error) {
    console.error('관리자 게시글 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 관리자 게시글 강제 삭제
export async function DELETE(request) {
  try {
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '삭제할 게시글 ID가 필요합니다.' }, { status: 400 });
    }
    
    // 게시글 완전 삭제
    const { error } = await supabase
      .from('posts')
      .delete()
      .in('id', ids);
    
    if (error) {
      console.error('관리자 게시글 삭제 오류:', error);
      return NextResponse.json({ error: '게시글 삭제에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: `${ids.length}개의 게시글이 삭제되었습니다.`,
      deletedCount: ids.length
    });
    
  } catch (error) {
    console.error('관리자 게시글 삭제 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 관리자 게시글 복구
export async function PUT(request) {
  try {
    const { ids, action } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '처리할 게시글 ID가 필요합니다.' }, { status: 400 });
    }
    
    let updateData = {};
    
    if (action === 'restore') {
      // 게시글 복구
      updateData = {
        is_deleted: false,
        deleted_at: null,
        updated_at: new Date().toISOString()
      };
    } else if (action === 'delete') {
      // 게시글 논리 삭제
      updateData = {
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } else {
      return NextResponse.json({ error: '잘못된 액션입니다.' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('posts')
      .update(updateData)
      .in('id', ids);
    
    if (error) {
      console.error('관리자 게시글 처리 오류:', error);
      return NextResponse.json({ error: '게시글 처리에 실패했습니다.' }, { status: 500 });
    }
    
    const actionText = action === 'restore' ? '복구' : '삭제';
    return NextResponse.json({ 
      message: `${ids.length}개의 게시글이 ${actionText}되었습니다.`,
      processedCount: ids.length
    });
    
  } catch (error) {
    console.error('관리자 게시글 처리 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 