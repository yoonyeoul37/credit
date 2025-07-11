Write-Host "🚀 카페24 수동 배포 스크립트 시작..." -ForegroundColor Green

# 환경 변수 설정
$env:NODE_ENV = "production"
$env:NEXT_PUBLIC_SUPABASE_URL = "https://jwstrrxoyikjyafhaeyo.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3c3RycnhveWlranlhZmhhZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTIzMzMsImV4cCI6MjA2NzcyODMzM30.ZpfX0zp5pJ_pstXjRkYNg85FoFEIP4qV3Js4nhTeFDU"

# 로컬 빌드
Write-Host "📦 로컬에서 프로젝트 빌드 중..." -ForegroundColor Yellow
npm ci --production=false
npm run build

# 배포할 파일들 준비
Write-Host "📁 배포 파일 준비 중..." -ForegroundColor Yellow
if (Test-Path "./deploy-files") {
    Remove-Item "./deploy-files" -Recurse -Force
}
New-Item -ItemType Directory -Path "./deploy-files" -Force

# 파일 복사
Copy-Item ".next" -Destination "./deploy-files/.next" -Recurse
Copy-Item "package.json" -Destination "./deploy-files/"
Copy-Item "package-lock.json" -Destination "./deploy-files/"
Copy-Item "public" -Destination "./deploy-files/public" -Recurse
Copy-Item "next.config.ts" -Destination "./deploy-files/"

# 환경 변수 파일 생성
Write-Host "🔧 환경 변수 파일 생성..." -ForegroundColor Yellow
@"
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SUPABASE_URL=https://jwstrrxoyikjyafhaeyo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3c3RycnhveWlranlhZmhhZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTIzMzMsImV4cCI6MjA2NzcyODMzM30.ZpfX0zp5pJ_pstXjRkYNg85FoFEIP4qV3Js4nhTeFDU
"@ | Out-File -FilePath "./deploy-files/.env.local" -Encoding UTF8

Write-Host "✅ 배포 준비 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 다음 단계:" -ForegroundColor Cyan
Write-Host "1. ./deploy-files/ 폴더의 모든 파일을 카페24 서버로 업로드" -ForegroundColor White
Write-Host "2. 카페24 서버에서 다음 명령 실행:" -ForegroundColor White
Write-Host "   cd /home/your-username/credit-app" -ForegroundColor Gray
Write-Host "   npm ci --production" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 FTP 업로드 설정:" -ForegroundColor Cyan
Write-Host "   호스트: 카페24 FTP 주소" -ForegroundColor White
Write-Host "   포트: 21 (FTP) 또는 22 (SFTP)" -ForegroundColor White
Write-Host "   경로: /home/your-username/credit-app/" -ForegroundColor White
Write-Host ""
Write-Host "📱 또는 카페24 웹 파일 관리자 사용 가능" -ForegroundColor Yellow
Write-Host ""
Write-Host "📂 배포 파일 위치: $(Get-Location)\deploy-files" -ForegroundColor Magenta 