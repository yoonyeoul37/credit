import { NextResponse } from 'next/server'
import { supabaseAdmin, generateHash } from '@/lib/supabase'
import { cookies } from 'next/headers'

// 관리자 로그인 (POST)
export async function POST(request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // 입력 검증
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    // 관리자 확인
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single()

    if (error || !admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // 비밀번호 확인
    const passwordHash = generateHash(password)
    if (passwordHash !== admin.password_hash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // 마지막 로그인 시간 업데이트
    await supabaseAdmin
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id)

    // 세션 토큰 생성 (간단한 JWT 대신 세션 ID 사용)
    const sessionId = generateSessionId()
    const sessionData = {
      adminId: admin.id,
      username: admin.username,
      role: admin.role,
      loginTime: Date.now()
    }

    // 쿠키에 세션 저장 (실제 프로덕션에서는 Redis 등 사용 권장)
    const cookieStore = cookies()
    cookieStore.set('admin_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24시간
    })

    // 메모리에 세션 저장 (간단한 구현)
    global.adminSessions = global.adminSessions || new Map()
    global.adminSessions.set(sessionId, sessionData)

    return NextResponse.json({
      message: 'Login successful',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    })

  } catch (error) {
    console.error('Error in POST /api/admin/auth:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 관리자 로그아웃 (DELETE)
export async function DELETE(request) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get('admin_session')?.value

    if (sessionId) {
      // 세션 삭제
      global.adminSessions = global.adminSessions || new Map()
      global.adminSessions.delete(sessionId)

      // 쿠키 삭제
      cookieStore.delete('admin_session')
    }

    return NextResponse.json({ message: 'Logout successful' })

  } catch (error) {
    console.error('Error in DELETE /api/admin/auth:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 관리자 세션 확인 (GET)
export async function GET(request) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get('admin_session')?.value

    if (!sessionId) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    global.adminSessions = global.adminSessions || new Map()
    const sessionData = global.adminSessions.get(sessionId)

    if (!sessionData) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // 세션 만료 확인 (24시간)
    if (Date.now() - sessionData.loginTime > 24 * 60 * 60 * 1000) {
      global.adminSessions.delete(sessionId)
      cookieStore.delete('admin_session')
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    return NextResponse.json({
      admin: {
        id: sessionData.adminId,
        username: sessionData.username,
        role: sessionData.role
      }
    })

  } catch (error) {
    console.error('Error in GET /api/admin/auth:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 세션 ID 생성 함수
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36)
}

// 관리자 권한 확인 미들웨어 함수
export async function verifyAdminAuth(request) {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('admin_session')?.value

  if (!sessionId) {
    return null
  }

  global.adminSessions = global.adminSessions || new Map()
  const sessionData = global.adminSessions.get(sessionId)

  if (!sessionData || Date.now() - sessionData.loginTime > 24 * 60 * 60 * 1000) {
    return null
  }

  return sessionData
} 