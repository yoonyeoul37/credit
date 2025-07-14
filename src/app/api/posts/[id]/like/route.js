import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

// 좋아요 토글
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    
    // 게시글 존재 확인
    const { data: post, error } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', id)
      .eq('is_hidden', false)
      .single();
    
    if (error) {
      console.error('게시글 조회 오류:', error);
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    // 좋아요 수 증가
    const newLikes = post.likes + 1;
    
    const { error: updateError } = await supabase
      .from('posts')
      .update({ likes: newLikes })
      .eq('id', id);
    
    if (updateError) {
      console.error('좋아요 업데이트 오류:', updateError);
      return NextResponse.json({ error: '좋아요 처리에 실패했습니다.' }, { status: 500 });
    }
    
    return NextResponse.json({ likes: newLikes });
    
  } catch (error) {
    console.error('좋아요 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 