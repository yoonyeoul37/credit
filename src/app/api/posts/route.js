import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// 게시글 목록 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'created_at';
    
    // 기본 쿼리 구성 (댓글 수 포함)
    let query = supabase
      .from('posts')
      .select(`
        *,
        comments:comments!inner(count)
      `)
      .eq('is_hidden', false)
      .order(sort, { ascending: false });
    
    // 카테고리 필터링
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    const { data: posts, error, count } = await query;
    
    if (error) {
      console.error('게시글 조회 오류:', error);
      return NextResponse.json({ error: '게시글을 불러오는데 실패했습니다.' }, { status: 500 });
    }

    // 각 게시글에 대해 댓글 수 계산
    const postsWithCommentCount = await Promise.all(
      (posts || []).map(async (post) => {
        const { count: commentCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id)
          .eq('is_hidden', false);
        
        return {
          ...post,
          commentCount: commentCount || 0
        };
      })
    );

    return NextResponse.json({
      posts: postsWithCommentCount || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: count > page * limit
      }
    });
    
  } catch (error) {
    console.error('게시글 조회 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 게시글 생성
export async function POST(request) {
  try {
    // Supabase 연결 테스트
    console.log('🔍 Supabase 연결 테스트...');
    const { data: testData, error: testError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase 연결 실패:', testError);
      return NextResponse.json({ 
        error: '데이터베이스 연결에 실패했습니다.', 
        details: testError.message 
      }, { status: 500 });
    }
    
    console.log('✅ Supabase 연결 성공');
    
    // 테이블 구조 확인
    console.log('📋 posts 테이블 구조 확인 중...');
    const { data: tableStructure, error: structureError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);
    
    if (structureError) {
      console.error('❌ 테이블 구조 확인 실패:', structureError);
    } else {
      console.log('📋 posts 테이블 첫 번째 행:', tableStructure[0]);
      if (tableStructure[0]) {
        console.log('📋 사용 가능한 컬럼:', Object.keys(tableStructure[0]));
      }
    }
    
    const body = await request.json();
    const { title, content, author, password, category, images } = body;
    
    console.log('📝 게시글 작성 요청 데이터:', { title, content, author, password: '***', category, images: images ? images.length : 0 });
    
    // 유효성 검사
    if (!title || !content || !author || !category) {
      console.error('❌ 필수 항목 누락:', { title: !!title, content: !!content, author: !!author, category: !!category });
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }
    
    // 비밀번호 검사
    if (!password) {
      console.error('❌ 비밀번호 누락');
      return NextResponse.json({ error: '비밀번호가 누락되었습니다.' }, { status: 400 });
    }
    
    // 카테고리 유효성 검사
    const validCategories = ['credit', 'personal', 'corporate', 'workout', 'card', 'loan', 'news'];
    if (!validCategories.includes(category)) {
      console.error('❌ 유효하지 않은 카테고리:', category);
      return NextResponse.json({ error: '유효하지 않은 카테고리입니다.' }, { status: 400 });
    }
    
    // 게시글 생성
    const insertData = {
      title,
      content,
      author,
      password_hash: password, // 실제 테이블에서 사용하는 필드
      category,
      images: images || [],
      views: 0,
      likes: 0,
      is_hidden: false,
      created_at: new Date().toISOString()
    };
    
    console.log('📝 DB 삽입 데이터:', { ...insertData, password_hash: '***' });
    
    let { data: post, error } = await supabase
      .from('posts')
      .insert([insertData])
      .select()
      .single();
    
    // password_hash 필드가 실패하면 password 필드로 다시 시도
    if (error && error.code === '42703') {
      console.log('🔄 password_hash 필드 실패, password 필드로 재시도...');
      
      const insertDataWithPassword = {
        ...insertData,
        password: password
      };
      delete insertDataWithPassword.password_hash;
      
      const retryResult = await supabase
        .from('posts')
        .insert([insertDataWithPassword])
        .select()
        .single();
      
      post = retryResult.data;
      error = retryResult.error;
    }
    
    if (error) {
      console.error('❌ 게시글 생성 오류 (상세):', error);
      console.error('❌ 에러 코드:', error.code);
      console.error('❌ 에러 메시지:', error.message);
      console.error('❌ 에러 세부사항:', error.details);
      return NextResponse.json({ 
        error: '게시글 생성에 실패했습니다.', 
        details: error.message,
        code: error.code 
      }, { status: 500 });
    }
    
    return NextResponse.json({ post }, { status: 201 });
    
  } catch (error) {
    console.error('게시글 생성 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 