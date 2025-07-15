import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// 댓글 목록 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!postId) {
      return NextResponse.json({ error: '게시글 ID가 필요합니다.' }, { status: 400 });
    }
    
    // 댓글 조회 (대댓글 포함)
    const query = supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true });
    
    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data: comments, error, count } = await query.range(from, to);
    
    if (error) {
      console.error('댓글 조회 오류:', error);
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
    console.error('댓글 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 댓글 생성
export async function POST(request) {
  try {
    const body = await request.json();
    const { post_id, content, author, password, parent_id } = body;
    
    // 유효성 검사
    if (!post_id || !content || !author) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }
    
    // 게시글 존재 확인
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', post_id)
      .eq('is_hidden', false)
      .single();
    
    if (postError || !post) {
      return NextResponse.json({ error: '존재하지 않는 게시글입니다.' }, { status: 404 });
    }
    
    // 대댓글인 경우 부모 댓글 확인
    if (parent_id) {
      const { data: parentComment, error: parentError } = await supabase
        .from('comments')
        .select('id')
        .eq('id', parent_id)
        .eq('is_hidden', false)
        .single();
      
      if (parentError || !parentComment) {
        return NextResponse.json({ error: '존재하지 않는 부모 댓글입니다.' }, { status: 404 });
      }
    }
    
    // 댓글 생성
    const { data: comment, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id,
          content,
          author,
          password: password, // 실제 운영에서는 해싱 필요
          parent_id: parent_id || null,
          is_hidden: false,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('댓글 생성 오류:', error);
      return NextResponse.json({ error: '댓글 생성에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ comment }, { status: 201 });
    
  } catch (error) {
    console.error('댓글 생성 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 