#!/bin/bash
# 카페24 가상서버 배포 스크립트

echo "🚀 크레딧스토리 배포 시작..."

# 1. 기존 프로세스 종료
echo "🔄 기존 프로세스 종료..."
pkill -f "next start" 2>/dev/null || echo "실행 중인 Next.js 서버가 없습니다."
pkill -f "node.*start" 2>/dev/null || echo "실행 중인 Node.js 서버가 없습니다."

# 2. 최신 코드 업데이트 (git pull)
echo "📥 최신 코드 업데이트..."
git pull origin main

# 3. 의존성 설치
echo "📦 의존성 설치..."
npm install

# 4. 빌드
echo "🏗️ 프로덕션 빌드..."
npm run build

# 5. 환경변수 설정
echo "🔧 환경변수 설정..."
export NODE_ENV=production
export PORT=3000
export NEXT_PUBLIC_SUPABASE_URL=https://jwstrrxoyikjyafhaeyo.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im
p3c3RycnhveWlranlhZmhhZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTIzMzMsImV4cCI6MjA2NzcyODMzM30.ZpfX0zp
5pJ_pstXjRkYNg85FoFEIP4qV3Js4nhTeFDU

# 6. 서버 시작 (PM2 없이)
echo "🚀 서버 시작..."
nohup npm start > /tmp/nextjs.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > /tmp/nextjs.pid

# 7. 서버 상태 확인
echo "✅ 배포 완료!"
echo "📋 서버 PID: $SERVER_PID"
echo "📝 로그 확인: tail -f /tmp/nextjs.log"
echo "🛑 서버 종료: kill \$(cat /tmp/nextjs.pid)"
sleep 2
echo "📊 서버 상태:"
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "✅ 서버가 정상적으로 실행 중입니다."
else
    echo "❌ 서버 시작에 실패했습니다. 로그를 확인하세요."
    tail -10 /tmp/nextjs.log
fi

echo "🎉 배포가 완료되었습니다!"
echo "🌐 사이트 URL: http://your-domain.com" 