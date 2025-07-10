FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# Next.js 빌드
RUN npm run build

# 환경변수 설정 (기본값 포함)
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 포트 3000 열기
EXPOSE 3000

# 포트 검증 및 서버 시작을 위한 스크립트
RUN echo '#!/bin/sh\n\
# 포트 환경 변수 검증\n\
if [ -z "$PORT" ] || [ "$PORT" = "" ]; then\n\
  echo "PORT 환경 변수가 설정되지 않았습니다. 기본값 3000을 사용합니다."\n\
  export PORT=3000\n\
fi\n\
echo "서버를 포트 $PORT 에서 시작합니다..."\n\
exec npm start' > /app/start.sh && chmod +x /app/start.sh

# 서버 시작
CMD ["/app/start.sh"] 