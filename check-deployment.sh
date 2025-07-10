#!/bin/bash
# 배포 후 서버 상태 확인 스크립트

echo "🔍 크레딧스토리 배포 상태 확인..."

# 1. 서버 프로세스 확인
echo "📊 서버 프로세스 상태:"
if pgrep -f "next start" > /dev/null; then
    echo "✅ Next.js 서버가 실행 중입니다."
    echo "📋 PID: $(pgrep -f "next start")"
else
    echo "❌ Next.js 서버가 실행되지 않고 있습니다."
fi

# 2. 포트 확인
echo "🔌 포트 상태 확인:"
if netstat -an | grep ":3000" > /dev/null; then
    echo "✅ 포트 3000이 열려 있습니다."
else
    echo "❌ 포트 3000이 열려 있지 않습니다."
fi

# 3. 로컬 접속 테스트
echo "🌐 로컬 접속 테스트:"
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 로컬 접속 성공"
else
    echo "❌ 로컬 접속 실패"
fi

# 4. 서버 정보 출력
echo "📝 서버 정보:"
echo "   - 로컬 URL: http://localhost:3000"
echo "   - 외부 IP: $(curl -s ifconfig.me 2>/dev/null || echo "확인 불가")"
echo "   - 현재 시간: $(date)"

# 5. 로그 확인
echo "📋 최근 로그 (마지막 10줄):"
if [ -f /tmp/nextjs.log ]; then
    tail -10 /tmp/nextjs.log
else
    echo "로그 파일이 없습니다."
fi

echo "🎉 상태 확인 완료!" 