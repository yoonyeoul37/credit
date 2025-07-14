import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 관리자 신고 목록 조회
export async function GET(request) {
  try {
    console.log('관리자 신고 목록 조회 시작');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: reports, error } = await query;

    if (error) {
      console.error('신고 목록 조회 오류:', error);
      return NextResponse.json({ error: '신고 목록 조회에 실패했습니다.' }, { status: 500 });
    }

    // 전체 개수 조회
    let countQuery = supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });

    if (status && status !== 'all') {
      countQuery = countQuery.eq('status', status);
    }

    const { count } = await countQuery;

    console.log(`신고 목록 조회 성공: ${reports.length}개`);
    
    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('관리자 신고 목록 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 신고 상태 업데이트
export async function PUT(request) {
  try {
    console.log('신고 상태 업데이트 시작');
    
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }

    if (!['pending', 'resolved', 'dismissed'].includes(status)) {
      return NextResponse.json({ error: '잘못된 상태값입니다.' }, { status: 400 });
    }

    // 신고 정보 조회
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (reportError || !report) {
      console.error('신고 조회 오류:', reportError);
      return NextResponse.json({ error: '신고를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 신고 해결 시 해당 게시글/댓글 삭제
    if (status === 'resolved') {
      console.log('신고 해결 처리 - 삭제 시작:', report);
      
      if (report.target_type === 'post') {
        // 게시글 삭제
        const { error: deleteError } = await supabase
          .from('posts')
          .delete()
          .eq('id', report.target_id);
        
        if (deleteError) {
          console.error('게시글 삭제 오류:', deleteError);
          return NextResponse.json({ error: '게시글 삭제에 실패했습니다.' }, { status: 500 });
        }
        
        console.log('게시글 삭제 완료:', report.target_id);
      } else if (report.target_type === 'comment') {
        // 댓글 삭제
        const { error: deleteError } = await supabase
          .from('comments')
          .delete()
          .eq('id', report.target_id);
        
        if (deleteError) {
          console.error('댓글 삭제 오류:', deleteError);
          return NextResponse.json({ error: '댓글 삭제에 실패했습니다.' }, { status: 500 });
        }
        
        console.log('댓글 삭제 완료:', report.target_id);
      }
    }

    // 신고 상태 업데이트
    const { data, error } = await supabase
      .from('reports')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('신고 상태 업데이트 오류:', error);
      return NextResponse.json({ error: '신고 상태 업데이트에 실패했습니다.' }, { status: 500 });
    }

    console.log('신고 상태 업데이트 성공:', data);
    
    const message = status === 'resolved' 
      ? '신고가 해결되었으며 해당 콘텐츠가 삭제되었습니다.'
      : status === 'dismissed'
      ? '신고가 기각되었습니다.'
      : '신고 상태가 업데이트되었습니다.';

    return NextResponse.json({ 
      message,
      data 
    });

  } catch (error) {
    console.error('신고 상태 업데이트 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 신고 삭제 (일괄 삭제)
export async function DELETE(request) {
  try {
    console.log('신고 삭제 시작');
    
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '삭제할 신고 ID가 필요합니다.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('reports')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('신고 삭제 오류:', error);
      return NextResponse.json({ error: '신고 삭제에 실패했습니다.' }, { status: 500 });
    }

    console.log(`신고 삭제 성공: ${ids.length}개`);
    return NextResponse.json({ message: '신고가 삭제되었습니다.' });

  } catch (error) {
    console.error('신고 삭제 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 