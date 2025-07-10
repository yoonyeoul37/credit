#!/bin/bash
# Docker 없이 직접 배포하는 카페24 배포 스크립트

echo "🚀 크레딧스토리 직접 배포 시작..."

# 기존 프로세스 종료
echo "🔄 기존 프로세스 종료..."
pkill -f "next" 2>/dev/null || echo "실행 중인 서버가 없습니다."
pkill -f "node" 2>/dev/null || echo "실행 중인 Node.js가 없습니다."

# 최신 코드 업데이트
echo "📥 최신 코드 업데이트..."
git pull origin main

# 의존성 설치
echo "📦 의존성 설치..."
npm ci --production=false

# 빌드
echo "🏗️ 애플리케이션 빌드..."
npm run build

# 환경 변수 강제 설정
echo "🔧 환경 변수 설정..."
export NODE_ENV=production
export PORT=3000
export HOSTNAME=0.0.0.0

# Supabase 환경 변수
export NEXT_PUBLIC_SUPABASE_URL=https://jwstrrxoyikjyafhaeyo.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3c3RycnhveWlranlhZmhhZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTIzMzMsImV4cCI6MjA2NzcyODMzM30.ZpfX0zp5pJ_pstXjRkYNg85FoFEIP4qV3Js4nhTeFDU

echo "✅ 환경 변수 설정 완료:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"
echo "   HOSTNAME: $HOSTNAME"

# 서버 시작 (백그라운드)
echo "🚀 서버 시작..."
nohup npm start > /tmp/creditstory.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > /tmp/creditstory.pid

# 서버 시작 확인
sleep 3
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "✅ 서버가 성공적으로 시작되었습니다!"
    echo "📋 PID: $SERVER_PID"
    echo "📝 로그: tail -f /tmp/creditstory.log"
    echo "🛑 종료: kill \$(cat /tmp/creditstory.pid)"
else
    echo "❌ 서버 시작에 실패했습니다."
    echo "📋 로그 확인:"
    tail -20 /tmp/creditstory.log
    exit 1
fi

echo "🎉 배포 완료!"
echo "🌐 접속 URL: http://localhost:3000" 