const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 기본 라우트
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>카페24 서버 테스트</title>
    </head>
    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
      <h1>🚀 카페24 서버 테스트 성공!</h1>
      <p>Node.js 서버가 정상 작동중입니다.</p>
      <p>포트: ${port}</p>
      <p>시간: ${new Date().toLocaleString()}</p>
    </body>
    </html>
  `);
});

// 상태 확인 라우트
app.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    port: port,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform
  });
});

// 서버 시작
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 서버가 포트 ${port}에서 시작되었습니다.`);
  console.log(`📅 시작 시간: ${new Date().toLocaleString()}`);
  console.log(`🌐 접속 주소: http://localhost:${port}`);
});

// 에러 처리
process.on('uncaughtException', (error) => {
  console.error('❌ 서버 에러:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 처리되지 않은 Promise 거부:', reason);
  process.exit(1);
}); 