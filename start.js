// 간단한 서버 시작 스크립트
const { spawn } = require('child_process');

console.log('🚀 크레딧스토리 서버 시작...');

// Next.js 서버를 포트 3000에서 시작
const server = spawn('npx', ['next', 'start', '-p', '3000'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: '3000'
  }
});

server.on('error', (error) => {
  console.error('❌ 서버 시작 실패:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`서버가 종료되었습니다. 종료 코드: ${code}`);
  process.exit(code);
});

// 종료 시그널 처리
process.on('SIGINT', () => {
  console.log('\n🛑 서버를 종료합니다...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 서버를 종료합니다...');
  server.kill('SIGTERM');
}); 