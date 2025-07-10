import { NextResponse } from 'next/server'
import { supabase, generateHash, sanitizeHtml } from '@/lib/supabase'

// 게시글 목록 조회 (GET)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'created_at'
    
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('is_hidden', false)
      .order(sort, { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    // 카테고리 필터
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // 검색 기능
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,author.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    return NextResponse.json({
      posts: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    })

  } catch (error) {
    console.error('Error in GET /api/posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 게시글 작성 (POST)
export async function POST(request) {
  try {
    const body = await request.json()
    const { title, content, author, password, category, images = [] } = body

    // 입력 검증
    if (!title || !content || !author || !password || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (title.length > 200) {
      return NextResponse.json({ error: 'Title too long' }, { status: 400 })
    }

    if (author.length > 50) {
      return NextResponse.json({ error: 'Author name too long' }, { status: 400 })
    }

    // 비밀번호 해시
    const passwordHash = generateHash(password)

    // HTML 태그 제거 (보안)
    const cleanTitle = sanitizeHtml(title)
    const cleanContent = sanitizeHtml(content)
    const cleanAuthor = sanitizeHtml(author)

    // 게시글 저장
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        title: cleanTitle,
        content: cleanContent,
        author: cleanAuthor,
        password_hash: passwordHash,
        category,
        images: images.slice(0, 5) // 최대 5개 이미지
      }])
      .select()

    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Post created successfully',
      post: data[0]
    }, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 