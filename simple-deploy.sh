#!/bin/bash
# 간단한 카페24 배포 스크립트 (Docker 없이)

echo "🚀 크레딧스토리 간단 배포 시작..."

# 환경 변수 강제 설정
export NODE_ENV=production
export PORT=3000
export HOSTNAME=0.0.0.0

echo "✅ 환경 변수 설정완료:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"
echo "   HOSTNAME: $HOSTNAME"

# 기존 프로세스 종료
echo "🔄 기존 프로세스 종료..."
pkill -f "next" 2>/dev/null || echo "실행 중인 서버가 없습니다."

# 서버 시작
echo "🚀 서버 시작..."
exec npm start 