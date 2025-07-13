import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// 관리자 댓글 목록 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const postId = searchParams.get('postId');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    
    // 기본 쿼리 구성 (게시글 제목과 함께 조회)
    let query = supabase
      .from('comments')
      .select(`
        *,
        posts(id, title, category)
      `)
      .order('created_at', { ascending: false });
    
    // 삭제된 댓글 포함 여부
    if (!includeDeleted) {
      query = query.eq('is_deleted', false);
    }
    
    // 특정 게시글 댓글만 조회
    if (postId) {
      query = query.eq('post_id', postId);
    }
    
    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data: comments, error, count } = await query.range(from, to);
    
    if (error) {
      console.error('관리자 댓글 조회 오류:', error);
      return NextResponse.json({ error: '댓글을 불러오는데 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({
      comments: comments || [],
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
    
  } catch (error) {
    console.error('관리자 댓글 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 관리자 댓글 강제 삭제
export async function DELETE(request) {
  try {
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '삭제할 댓글 ID가 필요합니다.' }, { status: 400 });
    }
    
    // 댓글 완전 삭제
    const { error } = await supabase
      .from('comments')
      .delete()
      .in('id', ids);
    
    if (error) {
      console.error('관리자 댓글 삭제 오류:', error);
      return NextResponse.json({ error: '댓글 삭제에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: `${ids.length}개의 댓글이 삭제되었습니다.`,
      deletedCount: ids.length
    });
    
  } catch (error) {
    console.error('관리자 댓글 삭제 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 관리자 댓글 처리 (복구/삭제/숨기기)
export async function PUT(request) {
  try {
    const { ids, action } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '처리할 댓글 ID가 필요합니다.' }, { status: 400 });
    }
    
    let updateData = {};
    
    if (action === 'restore') {
      // 댓글 복구
      updateData = {
        is_deleted: false,
        is_hidden: false,
        deleted_at: null,
        updated_at: new Date().toISOString()
      };
    } else if (action === 'delete') {
      // 댓글 논리 삭제
      updateData = {
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } else if (action === 'hide') {
      // 댓글 숨기기 (부적절한 댓글)
      updateData = {
        is_hidden: true,
        updated_at: new Date().toISOString()
      };
    } else if (action === 'show') {
      // 댓글 보이기
      updateData = {
        is_hidden: false,
        updated_at: new Date().toISOString()
      };
    } else {
      return NextResponse.json({ error: '잘못된 액션입니다.' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('comments')
      .update(updateData)
      .in('id', ids);
    
    if (error) {
      console.error('관리자 댓글 처리 오류:', error);
      return NextResponse.json({ error: '댓글 처리에 실패했습니다.' }, { status: 500 });
    }
    
    const actionText = {
      restore: '복구',
      delete: '삭제',
      hide: '숨김',
      show: '공개'
    }[action];
    
    return NextResponse.json({ 
      message: `${ids.length}개의 댓글이 ${actionText} 처리되었습니다.`,
      processedCount: ids.length
    });
    
  } catch (error) {
    console.error('관리자 댓글 처리 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 