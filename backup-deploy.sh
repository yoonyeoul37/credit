#!/bin/bash

# 간단한 백업 배포 스크립트
echo "🚀 크레딧스토리 간단 배포 시작..."

# 1. 기존 프로세스 종료 (있다면)
echo "🔄 기존 프로세스 종료..."
pkill -f "next start" || echo "실행 중인 Next.js 서버가 없습니다."

# 2. 최신 코드 업데이트
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

# 6. 서버 시작 (백그라운드)
echo "🚀 서버 시작..."
nohup npm start > server.log 2>&1 &

# 7. PID 저장
echo $! > server.pid

echo "✅ 배포가 완료되었습니다!"
echo "📝 로그: tail -f server.log"
echo "🛑 서버 종료: kill \$(cat server.pid)" 