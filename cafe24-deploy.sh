#!/bin/bash
# 카페24 가상서버 전용 Docker 없는 완전 안전 배포 스크립트

echo "🚀 카페24 Docker 없는 안전 배포 시작..."
echo "======================================"

# 1. 환경 확인
echo "📋 환경 확인..."
echo "현재 디렉토리: $(pwd)"
echo "Node.js 버전: $(node --version 2>/dev/null || echo '설치 안됨')"
echo "npm 버전: $(npm --version 2>/dev/null || echo '설치 안됨')"

# 2. Docker 관련 파일 강제 제거 (혹시 모르니)
echo "🗑️ Docker 관련 파일 강제 제거..."
rm -f Dockerfile
rm -f .dockerignore  
rm -f docker-compose*.yml
rm -f docker-compose*.yaml
echo "✅ Docker 파일 제거 완료"

# 3. 기존 프로세스 완전 정리
echo "🔄 기존 프로세스 완전 정리..."
pkill -f "next" 2>/dev/null || echo "Next.js 프로세스 없음"
pkill -f "node.*start" 2>/dev/null || echo "Node.js start 프로세스 없음"
pkill -f "npm.*start" 2>/dev/null || echo "npm start 프로세스 없음"
pm2 kill 2>/dev/null || echo "PM2 프로세스 없음"
sleep 2

# 4. 최신 코드 업데이트
echo "📥 최신 코드 업데이트..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Git pull 실패"
    exit 1
fi

# 5. 의존성 완전 재설치
echo "📦 의존성 완전 재설치..."
rm -rf node_modules package-lock.json
npm cache clean --force 2>/dev/null || true
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install 실패"
    exit 1
fi

# 6. Next.js 빌드
echo "🏗️ Next.js 프로덕션 빌드..."
rm -rf .next
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 빌드 실패"
    exit 1
fi

# 7. 환경변수 강제 설정
echo "🔧 환경변수 강제 설정..."
export NODE_ENV=production
export PORT=3000
export HOSTNAME=0.0.0.0

# Supabase 환경 변수
export NEXT_PUBLIC_SUPABASE_URL=https://jwstrrxoyikjyafhaeyo.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3c3RycnhveWlranlhZmhhZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTIzMzMsImV4cCI6MjA2NzcyODMzM30.ZpfX0zp5pJ_pstXjRkYNg85FoFEIP4qV3Js4nhTeFDU

echo "✅ 환경변수 설정 완료:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"
echo "   HOSTNAME: $HOSTNAME"

# 8. 포트 확인
echo "🔌 포트 3000 사용 여부 확인..."
if netstat -an | grep ":3000" > /dev/null 2>&1; then
    echo "⚠️ 포트 3000이 이미 사용 중입니다. 기존 프로세스를 종료합니다."
    fuser -k 3000/tcp 2>/dev/null || true
    sleep 2
fi

# 9. 서버 시작 (완전 Docker 없음)
echo "🚀 순수 Node.js 서버 시작..."
nohup npm start > /tmp/creditstory.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > /tmp/creditstory.pid

echo "📋 서버 정보:"
echo "   PID: $SERVER_PID"
echo "   로그: /tmp/creditstory.log"
echo "   PID 파일: /tmp/creditstory.pid"

# 10. 서버 시작 확인
echo "⏳ 서버 시작 대기 중..."
sleep 8

if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "✅ 서버가 성공적으로 시작되었습니다!"
    
    # 포트 확인
    if netstat -an | grep ":3000" > /dev/null 2>&1; then
        echo "✅ 포트 3000이 열려 있습니다."
    else
        echo "⚠️ 포트 3000이 열려 있지 않습니다."
    fi
    
    # 로컬 접속 테스트
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 로컬 접속 테스트 성공"
    else
        echo "⚠️ 로컬 접속 테스트 실패"
    fi
    
else
    echo "❌ 서버 시작에 실패했습니다."
    echo "📋 로그 확인:"
    tail -20 /tmp/creditstory.log
    exit 1
fi

echo ""
echo "🎉 카페24 Docker 없는 안전 배포 완료!"
echo "======================================"
echo "📝 관리 명령어:"
echo "   로그 확인: tail -f /tmp/creditstory.log"
echo "   서버 종료: kill \$(cat /tmp/creditstory.pid)"
echo "   프로세스 확인: ps -p \$(cat /tmp/creditstory.pid)"
echo "🌐 접속 URL: http://localhost:3000" 