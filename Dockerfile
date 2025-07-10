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

# 포트 3000 열기
EXPOSE 3000

# 환경변수 설정
ENV NODE_ENV=production
ENV PORT=3000

# 서버 시작
CMD ["npm", "start"] 