#!/bin/bash

echo "=== 완전한 문제 해결 스크립트 ==="

echo "1. 모든 PM2 프로세스 정리..."
pm2 stop all
pm2 delete all
pm2 kill

echo ""
echo "2. 실제 프로젝트 위치 찾기..."
find /home -name "credit" -type d 2>/dev/null
find /var -name "credit" -type d 2>/dev/null
find /root -name "credit" -type d 2>/dev/null

echo ""
echo "3. 실행 중인 Node.js 프로세스 확인..."
ps aux | grep node

echo ""
echo "4. Nginx 설정 확인..."
cat /etc/nginx/sites-available/default | grep -A 10 -B 10 "proxy_pass"

echo ""
echo "5. 포트 사용 현황 확인..."
netstat -tlnp | grep -E ":(3000|8080|8000|3001)"

echo ""
echo "6. 홈 디렉토리에서 credit 찾기..."
ls -la /home/
ls -la /root/

echo ""
echo "7. 현재 디렉토리 프로젝트 파일 확인..."
ls -la package.json 2>/dev/null || echo "package.json not found"
ls -la .env.local 2>/dev/null || echo ".env.local not found"

echo ""
echo "8. 직접 포트 3000으로 Next.js 실행 시도..."
if [ -f "package.json" ]; then
    echo "package.json 발견! 직접 실행..."
    PORT=3000 npm run start &
    sleep 5
    echo "포트 3000 확인..."
    netstat -tlnp | grep :3000
    curl -I http://localhost:3000
else
    echo "package.json을 찾을 수 없습니다."
fi

echo ""
echo "9. 다른 포트에서 실행 시도..."
PORT=8080 npm run start &
sleep 3
netstat -tlnp | grep :8080

echo ""
echo "10. 최종 상태 확인..."
ps aux | grep node
netstat -tlnp | grep -E ":(3000|8080)"

echo ""
echo "=== 문제 진단 완료 ==="
echo "위 결과를 바탕으로 다음 단계를 결정하겠습니다." 