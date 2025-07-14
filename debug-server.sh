#!/bin/bash

echo "=== 서버 디버깅 스크립트 ==="
echo "1. PM2 상태 확인..."
pm2 status

echo ""
echo "2. PM2 로그 확인 (최근 20줄)..."
pm2 logs creditstory --lines 20

echo ""
echo "3. 포트 3000 리스닝 확인..."
netstat -tlnp | grep :3000

echo ""
echo "4. localhost:3000 연결 테스트..."
curl -I http://localhost:3000

echo ""
echo "5. Nginx 상태 확인..."
systemctl status nginx

echo ""
echo "6. Nginx 에러 로그 확인..."
tail -20 /var/log/nginx/error.log

echo ""
echo "7. 프로젝트 디렉토리 확인..."
ls -la /var/www/credit/

echo ""
echo "8. 환경변수 파일 확인..."
ls -la /var/www/credit/.env.local

echo ""
echo "=== 디버깅 완료 ===" 