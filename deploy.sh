#!/bin/bash
# 카페24 가상서버 배포 스크립트

echo "🚀 크레딧스토리 배포 시작..."

# 1. 기존 프로세스 종료
echo "🔄 기존 프로세스 종료..."
pm2 stop credit-story || true
pm2 delete credit-story || true

# 2. 최신 코드 업데이트 (git pull)
echo "📥 최신 코드 업데이트..."
git pull origin main

# 3. 의존성 설치
echo "📦 의존성 설치..."
npm install --production

# 4. 빌드
echo "🏗️ 프로덕션 빌드..."
npm run build

# 5. 환경변수 설정
echo "🔧 환경변수 설정..."
cat > .env.production << EOF
NEXT_PUBLIC_SUPABASE_URL=https://jwstrrxoyikjyafhaeyo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im
p3c3RycnhveWlranlhZmhhZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTIzMzMsImV4cCI6MjA2NzcyODMzM30.ZpfX0zp
5pJ_pstXjRkYNg85FoFEIP4qV3Js4nhTeFDU
NODE_ENV=production
EOF

# 6. PM2로 서버 시작
echo "🚀 서버 시작..."
pm2 start ecosystem.config.js

# 7. PM2 상태 확인
echo "✅ 배포 완료! PM2 상태:"
pm2 list

echo "🎉 배포가 완료되었습니다!"
echo "🌐 사이트 URL: http://your-domain.com" 