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

// 게시글 비밀번호 확인 (수정용)
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { password, action } = body;
    
    // 비밀번호 확인용 요청인지 체크
    if (action !== 'verify') {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }
    
    // 게시글 조회 및 비밀번호 확인
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
    
    // 패스워드 확인
    if (post.password_hash !== password) {
      return NextResponse.json({ error: '패스워드가 일치하지 않습니다.' }, { status: 403 });
    }
    
    // 비밀번호가 맞으면 게시글 데이터 반환
    return NextResponse.json({ post, verified: true });
    
  } catch (error) {
    console.error('게시글 비밀번호 확인 API 오류:', error);
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
    if (existingPost.password_hash !== password) {
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
    
    console.log('🗑️ 게시글 삭제 요청:', { id, password: '***' });
    
    // 수정 권한 확인을 위한 게시글 조회
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('is_hidden', false)
      .single();
    
    if (fetchError) {
      console.error('❌ 게시글 조회 실패:', fetchError);
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    console.log('✅ 기존 게시글 조회 성공');
    console.log('📋 게시글 필드:', Object.keys(existingPost));
    console.log('🔍 비밀번호 필드 확인:', {
      has_password: !!existingPost.password,
      has_password_hash: !!existingPost.password_hash,
      password_value: existingPost.password ? '***' : 'undefined',
      password_hash_value: existingPost.password_hash ? '***' : 'undefined'
    });
    
    // 패스워드 확인 (password_hash 먼저 시도, 없으면 password 사용)
    let passwordMatch = false;
    if (existingPost.password_hash) {
      passwordMatch = existingPost.password_hash === password;
      console.log('🔐 password_hash 필드로 비교:', passwordMatch);
    } else if (existingPost.password) {
      passwordMatch = existingPost.password === password;
      console.log('🔐 password 필드로 비교:', passwordMatch);
    }
    
    if (!passwordMatch) {
      console.log('❌ 비밀번호 불일치');
      return NextResponse.json({ error: '패스워드가 일치하지 않습니다.' }, { status: 403 });
    }
    
    console.log('✅ 비밀번호 확인 성공');
    
    // 논리적 삭제 (is_hidden = true)
    console.log('🗑️ 게시글 삭제 처리 중...');
    const { error } = await supabase
      .from('posts')
      .update({
        is_hidden: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('❌ 게시글 삭제 처리 실패:', error);
      return NextResponse.json({ error: '게시글 삭제에 실패했습니다.' }, { status: 500 });
    }
    
    console.log('✅ 게시글 삭제 성공');
    return NextResponse.json({ message: '게시글이 삭제되었습니다.' });
    
  } catch (error) {
    console.error('❌ 게시글 삭제 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 