#!/bin/bash

echo "=== 502 Bad Gateway 문제 해결 스크립트 ==="

echo "1. PM2 로그 확인 중..."
pm2 logs creditstory --lines 30

echo ""
echo "2. 프로젝트 디렉토리로 이동..."
cd /var/www/credit

echo ""
echo "3. 환경변수 파일 확인..."
ls -la .env.local

echo ""
echo "4. PM2 앱 재시작..."
pm2 restart creditstory

echo ""
echo "5. 3초 대기 후 상태 확인..."
sleep 3
pm2 status

echo ""
echo "6. 포트 3000 리스닝 재확인..."
netstat -tlnp | grep :3000

echo ""
echo "7. localhost:3000 재테스트..."
curl -I http://localhost:3000

echo ""
echo "8. 만약 여전히 문제가 있으면 빌드 재실행..."
echo "npm run build 실행 중..."
npm run build

echo ""
echo "9. PM2 다시 재시작..."
pm2 restart creditstory

echo ""
echo "10. 최종 상태 확인..."
sleep 3
pm2 status
netstat -tlnp | grep :3000

echo ""
echo "=== 문제 해결 완료 ==="
echo "이제 브라우저에서 creditstory.kr을 확인해보세요!" 