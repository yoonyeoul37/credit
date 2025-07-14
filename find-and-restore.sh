#!/bin/bash

echo "=== 프로젝트 찾기 및 복구 스크립트 ==="

echo "1. 전체 시스템에서 credit 프로젝트 찾기..."
find / -name "package.json" -path "*/credit/*" 2>/dev/null
find / -name "*.config.js" -path "*credit*" 2>/dev/null
find / -name "node_modules" -path "*credit*" -type d 2>/dev/null

echo ""
echo "2. 홈 디렉토리에서 상세 검색..."
find /home -name "*.json" 2>/dev/null | grep -i credit
find /root -name "*.json" 2>/dev/null | grep -i credit

echo ""
echo "3. Git 저장소 찾기..."
find / -name ".git" -type d 2>/dev/null | head -10

echo ""
echo "4. 기존 프로젝트가 없으면 GitHub에서 클론..."
if [ ! -d "/var/www/credit" ]; then
    echo "프로젝트 디렉토리 생성..."
    mkdir -p /var/www
    cd /var/www
    
    echo "GitHub에서 클론 시도..."
    git clone https://github.com/your-username/credit.git 2>/dev/null || echo "클론 실패 - 수동으로 업로드 필요"
    
    if [ ! -d "credit" ]; then
        echo "현재 디렉토리에서 프로젝트 복사..."
        cp -r /root/* /var/www/credit/ 2>/dev/null || echo "복사 실패"
    fi
fi

echo ""
echo "5. /var/www/credit에서 프로젝트 설정..."
cd /var/www/credit
ls -la

echo ""
echo "6. 환경변수 파일 확인/생성..."
if [ ! -f ".env.local" ]; then
    echo "환경변수 파일이 없습니다. 생성 중..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EOF
fi

echo ""
echo "7. 의존성 설치..."
npm install

echo ""
echo "8. 프로젝트 빌드..."
npm run build

echo ""
echo "9. PM2로 포트 3000에서 실행..."
pm2 stop all 2>/dev/null
pm2 delete all 2>/dev/null
PORT=3000 pm2 start npm --name "creditstory" -- start
pm2 save

echo ""
echo "10. 최종 확인..."
sleep 3
pm2 status
netstat -tlnp | grep :3000
curl -I http://localhost:3000

echo ""
echo "=== 복구 완료 ==="
echo "브라우저에서 creditstory.kr 확인하세요!" 