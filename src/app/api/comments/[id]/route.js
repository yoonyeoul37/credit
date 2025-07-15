import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// 개별 댓글 조회
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const { data: comment, error } = await supabase
      .from('comments')
      .select('*')
      .eq('id', id)
      .eq('is_hidden', false)
      .single();
    
    if (error) {
      console.error('댓글 조회 오류:', error);
      return NextResponse.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    return NextResponse.json({ comment });
    
  } catch (error) {
    console.error('댓글 조회 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 댓글 수정
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, password } = body;
    
    // 기존 댓글 조회 (패스워드 확인용)
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('password')
      .eq('id', id)
      .eq('is_hidden', false)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    // 패스워드 확인 (실제 운영에서는 해싱된 패스워드 비교)
    if (existingComment.password !== password) {
      return NextResponse.json({ error: '패스워드가 일치하지 않습니다.' }, { status: 403 });
    }
    
    // 댓글 업데이트
    const { data: comment, error } = await supabase
      .from('comments')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('댓글 수정 오류:', error);
      return NextResponse.json({ error: '댓글 수정에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ comment });
    
  } catch (error) {
    console.error('댓글 수정 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 댓글 삭제
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { password } = await request.json();
    
    // 기존 댓글 조회 (패스워드 확인용)
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('password')
      .eq('id', id)
      .eq('is_hidden', false)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    // 패스워드 확인
    if (existingComment.password !== password) {
      return NextResponse.json({ error: '패스워드가 일치하지 않습니다.' }, { status: 403 });
    }
    
    // 논리적 삭제 (is_deleted = true)
    const { error } = await supabase
      .from('comments')
      .update({
        is_hidden: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('댓글 삭제 오류:', error);
      return NextResponse.json({ error: '댓글 삭제에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ message: '댓글이 삭제되었습니다.' });
    
  } catch (error) {
    console.error('댓글 삭제 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 