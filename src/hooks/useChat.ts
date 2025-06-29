'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, ChatRoom, ChatMessage, ChatParticipant } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

// 🎯 로컬 데모 모드 (네트워크 문제 해결 시까지)
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || false

// 익명 사용자 관리
const generateUserHash = (): string => {
  // 실제로는 IP 기반 해시를 생성해야 하지만, 임시로 랜덤 해시 사용
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2)
  return `hash_${timestamp}_${random}`
}

const generateNickname = (): string => {
  const adjectives = [
    '희망찬', '용기있는', '새로운', '따뜻한', '밝은', '강한', '지혜로운', '친근한',
    '성실한', '열정적인', '긍정적인', '신중한', '배려깊은', '창의적인', '활기찬'
  ]
  const nouns = [
    '시작', '출발', '내일', '꿈', '도전', '변화', '성장', '희망', '미래', '기회',
    '새싹', '여행', '모험', '도약', '발걸음', '날개', '별', '햇살', '바람', '물결'
  ]
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 999) + 1
  
  return `${adj}${noun}${num}`
}

// 🎭 로컬 데모 데이터
const demoRoom: ChatRoom = {
  id: 1,
  title: '💬 신용회복 종합상담방',
  description: '신용회복에 관한 모든 궁금증을 함께 해결하는 메인 채팅방입니다. (데모 모드)',
  category: '종합상담',
  max_participants: 100,
  is_active: true,
  created_by_hash: 'system',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  current_participants: 3
}

const demoMessages: ChatMessage[] = [
  {
    id: 1,
    room_id: 1,
    user_ip_hash: 'system',
    user_nickname: 'System',
    message: '💬 신용회복 종합상담방에 오신 것을 환영합니다!',
    message_type: 'system',
    is_deleted: false,
    created_at: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: 2,
    room_id: 1,
    user_ip_hash: 'demo_user_1',
    user_nickname: '희망찬시작',
    message: '안녕하세요! 신용점수 관련해서 질문이 있어서 왔어요.',
    message_type: 'text',
    is_deleted: false,
    created_at: new Date(Date.now() - 240000).toISOString()
  },
  {
    id: 3,
    room_id: 1,
    user_ip_hash: 'demo_user_2',
    user_nickname: '따뜻한응원',
    message: '저도 비슷한 고민이 있었는데, 함께 정보 나눠요!',
    message_type: 'text',
    is_deleted: false,
    created_at: new Date(Date.now() - 180000).toISOString()
  }
]

const demoParticipants: ChatParticipant[] = [
  {
    id: 1,
    room_id: 1,
    user_ip_hash: 'demo_user_1',
    user_nickname: '희망찬시작',
    last_seen: new Date().toISOString(),
    is_online: true,
    joined_at: new Date(Date.now() - 600000).toISOString()
  },
  {
    id: 2,
    room_id: 1,
    user_ip_hash: 'demo_user_2',
    user_nickname: '따뜻한응원',
    last_seen: new Date().toISOString(),
    is_online: true,
    joined_at: new Date(Date.now() - 400000).toISOString()
  }
]

export const useChat = (roomId: number) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [participants, setParticipants] = useState<ChatParticipant[]>([])
  const [room, setRoom] = useState<ChatRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userHash] = useState(() => generateUserHash())
  const [userNickname] = useState(() => generateNickname())
  const [isConnected, setIsConnected] = useState(false)

  // 🎭 데모 모드 함수들
  const loadRoomDemo = useCallback(async () => {
    console.log('🎭 데모 모드: 채팅방 로드')
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setRoom(demoRoom)
        console.log('✅ 데모 채팅방 로드 완료')
        resolve()
      }, 500)
    })
  }, [])

  const loadMessagesDemo = useCallback(async () => {
    console.log('🎭 데모 모드: 메시지 로드')
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setMessages([...demoMessages])
        console.log('✅ 데모 메시지 로드 완료')
        resolve()
      }, 300)
    })
  }, [])

  const loadParticipantsDemo = useCallback(async () => {
    console.log('🎭 데모 모드: 참여자 로드')
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setParticipants([...demoParticipants])
        console.log('✅ 데모 참여자 로드 완료')
        resolve()
      }, 200)
    })
  }, [])

  const sendMessageDemo = useCallback(async (message: string) => {
    if (!message.trim() || !isConnected) return

    console.log('🎭 데모 모드: 메시지 전송 -', message)
    
    const newMessage: ChatMessage = {
      id: Date.now(),
      room_id: roomId,
      user_ip_hash: userHash,
      user_nickname: userNickname,
      message: message.trim(),
      message_type: 'text',
      is_deleted: false,
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, newMessage])
    
    // 🤖 자동 응답 시뮬레이션
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: Date.now() + 1,
        room_id: roomId,
        user_ip_hash: 'auto_bot',
        user_nickname: '도움이',
        message: '좋은 질문이네요! 함께 고민해봐요. 💪',
        message_type: 'text',
        is_deleted: false,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, autoReply])
    }, 2000)
  }, [roomId, userHash, userNickname, isConnected])

  const joinRoomDemo = useCallback(async () => {
    console.log('🎭 데모 모드: 채팅방 참여')
    
    const joinMessage: ChatMessage = {
      id: Date.now(),
      room_id: roomId,
      user_ip_hash: 'system',
      user_nickname: 'System',
      message: `${userNickname}님이 입장했습니다.`,
      message_type: 'system',
      is_deleted: false,
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, joinMessage])
    setIsConnected(true)
    
    // 참여자 목록에 추가
    const newParticipant: ChatParticipant = {
      id: Date.now(),
      room_id: roomId,
      user_ip_hash: userHash,
      user_nickname: userNickname,
      last_seen: new Date().toISOString(),
      is_online: true,
      joined_at: new Date().toISOString()
    }
    
    setParticipants(prev => [...prev, newParticipant])
  }, [roomId, userHash, userNickname])

  const leaveRoomDemo = useCallback(async () => {
    console.log('🎭 데모 모드: 채팅방 퇴장')
    
    const leaveMessage: ChatMessage = {
      id: Date.now(),
      room_id: roomId,
      user_ip_hash: 'system',
      user_nickname: 'System',
      message: `${userNickname}님이 퇴장했습니다.`,
      message_type: 'system',
      is_deleted: false,
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, leaveMessage])
    setIsConnected(false)
    
    // 참여자 목록에서 제거
    setParticipants(prev => prev.filter(p => p.user_ip_hash !== userHash))
  }, [roomId, userHash, userNickname])

  // 실제 Supabase 함수들 (나중에 네트워크 해결되면 사용)
  const loadRoom = useCallback(async () => {
    try {
      console.log('🔍 채팅방 로드 시도, roomId:', roomId)
      console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('🔍 Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      console.log('🔍 Supabase 응답 - data:', data)
      console.log('🔍 Supabase 응답 - error:', error)

      if (error) throw error
      setRoom(data)
      console.log('✅ 채팅방 로드 성공:', data)
    } catch (err) {
      console.error('❌ 채팅방 로드 실패:', err)
      throw err
    }
  }, [roomId])

  const loadMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error('메시지 로드 실패:', err)
      throw err
    }
  }, [roomId])

  const loadParticipants = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_participants')
        .select('*')
        .eq('room_id', roomId)
        .eq('is_online', true)

      if (error) throw error
      setParticipants(data || [])
    } catch (err) {
      console.error('참여자 로드 실패:', err)
      throw err
    }
  }, [roomId])

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !isConnected) return

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          user_ip_hash: userHash,
          user_nickname: userNickname,
          message: message.trim(),
          message_type: 'text'
        })

      if (error) throw error

      await supabase
        .from('chat_participants')
        .update({ last_seen: new Date().toISOString() })
        .eq('room_id', roomId)
        .eq('user_ip_hash', userHash)

    } catch (err) {
      console.error('메시지 전송 실패:', err)
      setError('메시지를 전송할 수 없습니다.')
    }
  }, [roomId, userHash, userNickname, isConnected])

  const joinRoom = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('chat_participants')
        .upsert({
          room_id: roomId,
          user_ip_hash: userHash,
          user_nickname: userNickname,
          last_seen: new Date().toISOString(),
          is_online: true
        })

      if (error) throw error
      setIsConnected(true)
    } catch (err) {
      console.error('채팅방 참여 실패:', err)
      throw err
    }
  }, [roomId, userHash, userNickname])

  const leaveRoom = useCallback(async () => {
    try {
      await supabase
        .from('chat_participants')
        .update({ 
          is_online: false,
          last_seen: new Date().toISOString()
        })
        .eq('room_id', roomId)
        .eq('user_ip_hash', userHash)
      
      setIsConnected(false)
    } catch (err) {
      console.error('채팅방 퇴장 실패:', err)
    }
  }, [roomId, userHash, userNickname])

  // 초기 설정
  useEffect(() => {
    const setupChat = async () => {
      try {
        console.log('🚀 채팅 설정 시작... (데모 모드:', DEMO_MODE, ')')
        
        if (DEMO_MODE) {
          // 🎭 데모 모드
          await Promise.all([
            loadRoomDemo(),
            loadMessagesDemo(), 
            loadParticipantsDemo()
          ])
        } else {
          // 🌐 실제 Supabase 모드
          await Promise.all([
            loadRoom(),
            loadMessages(),
            loadParticipants()
          ])
        }
        
        setLoading(false)
        console.log('✅ 채팅 설정 완료!')
      } catch (err) {
        console.error('❌ 채팅 설정 실패:', err)
        setError('채팅을 불러올 수 없습니다.')
        setLoading(false)
      }
    }

    setupChat()
  }, [roomId, loadRoomDemo, loadMessagesDemo, loadParticipantsDemo, loadRoom, loadMessages, loadParticipants])

  return {
    // 상태
    messages,
    participants,
    room,
    loading,
    error,
    isConnected,
    userNickname,
    
    // 액션 (데모 모드에 따라 분기)
    sendMessage: DEMO_MODE ? sendMessageDemo : sendMessage,
    joinRoom: DEMO_MODE ? joinRoomDemo : joinRoom,
    leaveRoom: DEMO_MODE ? leaveRoomDemo : leaveRoom,
    
    // 정보
    participantCount: participants.length
  }
} 