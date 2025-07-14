import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 신고 목록 조회 (관리자용)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status') || 'all';
    
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('reports')
      .select(`
        *,
        post:posts(id, title, author),
        comment:comments(id, content, author)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data: reports, error } = await query;
    
    if (error) {
      console.error('신고 목록 조회 오류:', error);
      return NextResponse.json({ error: '신고 목록 조회에 실패했습니다.' }, { status: 500 });
    }
    
    // 전체 카운트 조회
    let countQuery = supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });
    
    if (status !== 'all') {
      countQuery = countQuery.eq('status', status);
    }
    
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error('신고 카운트 조회 오류:', countError);
    }
    
    return NextResponse.json({
      reports: reports || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
    
  } catch (error) {
    console.error('신고 목록 조회 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 신고 생성
export async function POST(request) {
  try {
    console.log('신고 생성 API 호출됨');
    
    const body = await request.json();
    console.log('요청 데이터:', body);
    
    const { target_type, target_id, reason, description } = body;
    
    // 유효성 검사
    if (!target_type || !target_id || !reason) {
      console.log('유효성 검사 실패:', { target_type, target_id, reason });
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }
    
    if (!['post', 'comment'].includes(target_type)) {
      console.log('잘못된 신고 대상:', target_type);
      return NextResponse.json({ error: '잘못된 신고 대상입니다.' }, { status: 400 });
    }
    
    const validReasons = ['spam', 'inappropriate', 'advertising', 'other'];
    if (!validReasons.includes(reason)) {
      console.log('잘못된 신고 사유:', reason);
      return NextResponse.json({ error: '잘못된 신고 사유입니다.' }, { status: 400 });
    }
    
    // 신고 대상 존재 확인
    if (target_type === 'post') {
      console.log('게시글 존재 확인:', target_id);
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('id')
        .eq('id', target_id)
        .single();
      
      if (postError) {
        console.error('게시글 조회 오류:', postError);
        return NextResponse.json({ error: '존재하지 않는 게시글입니다.' }, { status: 404 });
      }
      
      if (!post) {
        console.log('게시글이 존재하지 않음:', target_id);
        return NextResponse.json({ error: '존재하지 않는 게시글입니다.' }, { status: 404 });
      }
      
      console.log('게시글 존재 확인됨:', post);
    } else if (target_type === 'comment') {
      console.log('댓글 존재 확인:', target_id);
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .select('id')
        .eq('id', target_id)
        .single();
      
      if (commentError) {
        console.error('댓글 조회 오류:', commentError);
        return NextResponse.json({ error: '존재하지 않는 댓글입니다.' }, { status: 404 });
      }
      
      if (!comment) {
        console.log('댓글이 존재하지 않음:', target_id);
        return NextResponse.json({ error: '존재하지 않는 댓글입니다.' }, { status: 404 });
      }
      
      console.log('댓글 존재 확인됨:', comment);
    }
    
    // IP 주소 가져오기
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const reporter_ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    
    console.log('IP 주소:', reporter_ip);
    
    // 중복 신고 확인 (같은 IP에서 같은 대상에 대한 신고)
    console.log('중복 신고 확인 시작');
    const { data: existingReport, error: existingError } = await supabase
      .from('reports')
      .select('id')
      .eq('target_type', target_type)
      .eq('target_id', target_id)
      .eq('reporter_ip', reporter_ip)
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') {
      console.error('중복 신고 확인 오류:', existingError);
      return NextResponse.json({ error: '신고 처리 중 오류가 발생했습니다.' }, { status: 500 });
    }
    
    if (existingReport) {
      console.log('중복 신고 발견:', existingReport);
      return NextResponse.json({ error: '이미 신고한 내용입니다.' }, { status: 409 });
    }
    
    console.log('중복 신고 없음, 신고 생성 시작');
    
    // 신고 생성
    const reportData = {
      target_type,
      target_id,
      reporter_ip,
      reason,
      description: description || null,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    console.log('신고 데이터:', reportData);
    
    const { data: report, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single();
    
    if (error) {
      console.error('신고 생성 오류:', error);
      return NextResponse.json({ error: '신고 처리에 실패했습니다.' }, { status: 500 });
    }
    
    console.log('신고 생성 성공:', report);
    
    return NextResponse.json({ 
      message: '신고가 접수되었습니다. 관리자가 검토 후 처리하겠습니다.',
      report
    }, { status: 201 });
    
  } catch (error) {
    console.error('신고 생성 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 신고 상태 업데이트 (관리자용)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { ids, status } = body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '처리할 신고 ID가 필요합니다.' }, { status: 400 });
    }
    
    if (!['pending', 'resolved', 'dismissed'].includes(status)) {
      return NextResponse.json({ error: '잘못된 상태입니다.' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('reports')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .in('id', ids);
    
    if (error) {
      console.error('신고 상태 업데이트 오류:', error);
      return NextResponse.json({ error: '신고 상태 업데이트에 실패했습니다.' }, { status: 500 });
    }
    
    const statusText = {
      pending: '대기',
      resolved: '해결',
      dismissed: '기각'
    }[status];
    
    return NextResponse.json({ 
      message: `${ids.length}개의 신고가 ${statusText} 상태로 변경되었습니다.`,
      processedCount: ids.length
    });
    
  } catch (error) {
    console.error('신고 상태 업데이트 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 