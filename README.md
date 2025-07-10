# 크레딧스토리 (Credit Story)

개인 및 기업 신용회복을 위한 커뮤니티 웹사이트입니다.

## 기능

- 🏠 **홈페이지**: 최신 소식 및 주요 게시물
- 👤 **개인회복**: 개인 신용회복 정보 및 후기
- 🏢 **기업회복**: 기업 신용회복 정보 및 사례
- 🏋️ **워크아웃**: 신용회복 운동 프로그램
- 💳 **신용카드**: 신용카드 정보 및 추천
- 💰 **대출**: 대출 정보 및 상담
- 🔢 **계산기**: 각종 금융 계산기
- 📝 **게시판**: 커뮤니티 게시판
- 📰 **광고**: 관련 광고 및 정보

## 기술 스택

- **프론트엔드**: Next.js 15.3.5, React, TypeScript
- **스타일링**: Tailwind CSS
- **백엔드**: Next.js API Routes
- **데이터베이스**: Supabase (PostgreSQL)
- **배포**: 카페24 가상서버

## 개발 환경 설정

### 1. 프로젝트 클론
```bash
git clone https://github.com/your-username/credit-story.git
cd credit-story
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. 데이터베이스 스키마 설정
`database/schema.sql` 파일을 Supabase SQL Editor에서 실행

### 5. 개발 서버 실행
```bash
npm run dev
```

## 배포 (카페24 가상서버)

### 사전 준비사항
1. **Node.js 설치**: Node.js 18+ 버전
2. **PM2 설치**: 프로세스 관리자
   ```bash
   npm install -g pm2
   ```
3. **Git 설치**: 코드 업데이트용

### 배포 방법

#### 1. 자동 배포 (권장)
```bash
chmod +x deploy.sh
./deploy.sh
```

#### 2. 수동 배포
```bash
# 1. 최신 코드 업데이트
git pull origin main

# 2. 의존성 설치
npm install --production

# 3. 빌드
npm run build

# 4. 환경변수 설정
# .env.production 파일 생성 후 환경변수 입력

# 5. PM2로 서버 시작
pm2 start ecosystem.config.js

# 6. PM2 상태 확인
pm2 list
```

### 주요 설정 파일
- `ecosystem.config.js`: PM2 설정
- `server.js`: 프로덕션 서버
- `deploy.sh`: 배포 스크립트

### 서버 관리 명령어
```bash
# 서버 시작
pm2 start ecosystem.config.js

# 서버 중지
pm2 stop credit-story

# 서버 재시작
pm2 restart credit-story

# 서버 상태 확인
pm2 list

# 로그 확인
pm2 logs credit-story
```

## 프로젝트 구조

```
credit-story/
├── src/
│   ├── app/
│   │   ├── api/           # API 라우트
│   │   ├── components/    # 재사용 컴포넌트
│   │   └── pages/         # 페이지 컴포넌트
├── database/
│   └── schema.sql         # 데이터베이스 스키마
├── ecosystem.config.js    # PM2 설정
├── server.js              # 프로덕션 서버
└── deploy.sh             # 배포 스크립트
```

## 라이선스

MIT License
