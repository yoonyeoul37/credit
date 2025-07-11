#!/bin/bash

echo "🚀 카페24 수동 배포 스크립트 시작..."

# 환경 변수 설정
export NODE_ENV=production
export NEXT_PUBLIC_SUPABASE_URL=https://jwstrrxoyikjyafhaeyo.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3c3RycnhveWlranlhZmhhZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTIzMzMsImV4cCI6MjA2NzcyODMzM30.ZpfX0zp5pJ_pstXjRkYNg85FoFEIP4qV3Js4nhTeFDU

# 로컬 빌드
echo "📦 로컬에서 프로젝트 빌드 중..."
npm ci --production=false
npm run build

# 배포할 파일들 준비
echo "📁 배포 파일 준비 중..."
mkdir -p ./deploy-files
cp -r .next ./deploy-files/
cp package.json ./deploy-files/
cp package-lock.json ./deploy-files/
cp -r public ./deploy-files/
cp next.config.ts ./deploy-files/

# 환경 변수 파일 생성
echo "🔧 환경 변수 파일 생성..."
cat > ./deploy-files/.env.local << 'EOF'
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SUPABASE_URL=https://jwstrrxoyikjyafhaeyo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3c3RycnhveWlranlhZmhhZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTIzMzMsImV4cCI6MjA2NzcyODMzM30.ZpfX0zp5pJ_pstXjRkYNg85FoFEIP4qV3Js4nhTeFDU
EOF

echo "✅ 배포 준비 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. ./deploy-files/ 폴더의 모든 파일을 카페24 서버로 업로드"
echo "2. 카페24 서버에서 다음 명령 실행:"
echo "   cd /home/your-username/credit-app"
echo "   npm ci --production"
echo "   npm start"
echo ""
echo "🔧 FTP 업로드 설정:"
echo "   호스트: 카페24 FTP 주소"
echo "   포트: 21 (FTP) 또는 22 (SFTP)"
echo "   경로: /home/your-username/credit-app/"
echo ""
echo "📱 또는 카페24 웹 파일 관리자 사용 가능" 