import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// 개별 게시글 조회
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // 게시글 조회 (조회수 증가 없이)
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('is_hidden', false)
      .single();
    
    if (error) {
      console.error('게시글 조회 오류:', error);
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    return NextResponse.json({ post });
    
  } catch (error) {
    console.error('게시글 조회 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 게시글 수정
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, password } = body;
    
    // 수정 권한 확인을 위한 게시글 조회
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('is_hidden', false)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    // 패스워드 확인 (실제 운영에서는 해싱된 패스워드 비교)
    if (existingPost.password !== password) {
      return NextResponse.json({ error: '패스워드가 일치하지 않습니다.' }, { status: 403 });
    }
    
    // 게시글 업데이트
    const { data: post, error } = await supabase
      .from('posts')
      .update({
        title,
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('게시글 수정 오류:', error);
      return NextResponse.json({ error: '게시글 수정에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ post });
    
  } catch (error) {
    console.error('게시글 수정 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 조회수 증가
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    
    // 게시글 조회 및 조회수 증가
    const { data: post, error } = await supabase
      .from('posts')
      .select('views')
      .eq('id', id)
      .eq('is_hidden', false)
      .single();
    
    if (error) {
      console.error('게시글 조회 오류:', error);
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    // 조회수 증가
    const { error: updateError } = await supabase
      .from('posts')
      .update({ views: post.views + 1 })
      .eq('id', id);
    
    if (updateError) {
      console.error('조회수 업데이트 오류:', updateError);
      return NextResponse.json({ error: '조회수 업데이트에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, views: post.views + 1 });
    
  } catch (error) {
    console.error('조회수 증가 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 게시글 삭제
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { password } = await request.json();
    
    // 수정 권한 확인을 위한 게시글 조회
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('is_hidden', false)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    // 패스워드 확인
    if (existingPost.password !== password) {
      return NextResponse.json({ error: '패스워드가 일치하지 않습니다.' }, { status: 403 });
    }
    
    // 논리적 삭제 (is_deleted = true)
    const { error } = await supabase
      .from('posts')
      .update({
        is_hidden: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('게시글 삭제 오류:', error);
      return NextResponse.json({ error: '게시글 삭제에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ message: '게시글이 삭제되었습니다.' });
    
  } catch (error) {
    console.error('게시글 삭제 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 