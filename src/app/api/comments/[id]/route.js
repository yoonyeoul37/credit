import { NextResponse } from 'next/server'
import { supabase, generateHash, sanitizeHtml } from '@/lib/supabase'

// 댓글 수정 (PUT)
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { content, password } = body

    // 입력 검증
    if (!content || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Comment too long' }, { status: 400 })
    }

    // 기존 댓글 확인
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('password_hash')
      .eq('id', id)
      .eq('is_hidden', false)
      .single()

    if (fetchError || !existingComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // 비밀번호 확인
    const passwordHash = generateHash(password)
    if (passwordHash !== existingComment.password_hash) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // HTML 태그 제거
    const cleanContent = sanitizeHtml(content)

    // 댓글 수정
    const { data, error } = await supabase
      .from('comments')
      .update({
        content: cleanContent
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating comment:', error)
      return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Comment updated successfully',
      comment: data[0]
    })

  } catch (error) {
    console.error('Error in PUT /api/comments/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 댓글 삭제 (DELETE)
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { password } = body

    // 입력 검증
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // 기존 댓글 확인
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('password_hash')
      .eq('id', id)
      .eq('is_hidden', false)
      .single()

    if (fetchError || !existingComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // 비밀번호 확인
    const passwordHash = generateHash(password)
    if (passwordHash !== existingComment.password_hash) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // 댓글 삭제 (실제로는 숨김 처리)
    const { error } = await supabase
      .from('comments')
      .update({ is_hidden: true })
      .eq('id', id)

    if (error) {
      console.error('Error deleting comment:', error)
      return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Comment deleted successfully'
    })

  } catch (error) {
    console.error('Error in DELETE /api/comments/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 