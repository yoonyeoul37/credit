#!/bin/bash

echo "=== 포트 미스매치 문제 해결 스크립트 ==="

echo "1. 현재 package.json 확인..."
cat package.json

echo ""
echo "2. 현재 PM2 상태 확인..."
pm2 list

echo ""
echo "3. creditstory 앱 중지..."
pm2 stop creditstory

echo ""
echo "4. creditstory 앱 삭제..."
pm2 delete creditstory

echo ""
echo "5. PORT=3000으로 앱 다시 시작..."
PORT=3000 pm2 start npm --name "creditstory" -- start

echo ""
echo "6. PM2 설정 저장..."
pm2 save

echo ""
echo "7. 3초 대기 후 상태 확인..."
sleep 3
pm2 list

echo ""
echo "8. 포트 3000 리스닝 확인..."
netstat -tlnp | grep :3000

echo ""
echo "9. localhost:3000 테스트..."
curl -I http://localhost:3000

echo ""
echo "10. Nginx 재시작..."
systemctl restart nginx

echo ""
echo "11. 최종 테스트..."
sleep 2
curl -I http://localhost:3000

echo ""
echo "=== 포트 문제 해결 완료! ==="
echo "이제 브라우저에서 creditstory.kr을 확인해보세요!"
echo "PM2 모니터링: pm2 monit" 