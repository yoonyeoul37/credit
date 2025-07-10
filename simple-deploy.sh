#!/bin/bash

# 간단한 배포 스크립트 (문제 해결용)
echo "📦 Simple Deploy Script Starting..."

# 환경변수 설정
export NODE_ENV=production
export PORT=3000

# 빌드
echo "🏗️ Building application..."
npm run build

# 서버 시작 (PM2 없이)
echo "🚀 Starting server..."
nohup npm start > server.log 2>&1 &

echo "✅ Simple deployment completed!"
echo "📝 Check server.log for details" 