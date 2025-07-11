Write-Host "🔍 카페24 서버 연결 테스트 시작..." -ForegroundColor Green
Write-Host ""

# 카페24 서버 정보 입력 안내
Write-Host "📋 카페24 서버 정보를 입력해주세요:" -ForegroundColor Yellow
Write-Host ""

$host_address = Read-Host "호스트 주소 (예: your-domain.co.kr)"
$port = Read-Host "포트 번호 (기본값: 22)"
$username = Read-Host "사용자명"
$password = Read-Host "비밀번호" -AsSecureString

# 기본 포트 설정
if ([string]::IsNullOrWhiteSpace($port)) {
    $port = "22"
}

# 비밀번호를 일반 텍스트로 변환
$password_plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host ""
Write-Host "🔄 연결 테스트 중..." -ForegroundColor Yellow
Write-Host "호스트: $host_address" -ForegroundColor Gray
Write-Host "포트: $port" -ForegroundColor Gray
Write-Host "사용자: $username" -ForegroundColor Gray
Write-Host ""

# SSH 연결 테스트 (Windows용)
try {
    # PowerShell에서 SSH 연결 시도
    $ssh_command = "ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -p $port $username@$host_address 'echo 연결 성공; whoami; pwd; node --version; npm --version'"
    
    Write-Host "실행 명령:" -ForegroundColor Cyan
    Write-Host $ssh_command -ForegroundColor Gray
    Write-Host ""
    
    # 사용자에게 수동 테스트 안내
    Write-Host "📝 수동 테스트 방법:" -ForegroundColor Yellow
    Write-Host "1. PowerShell 또는 CMD에서 다음 명령 실행:" -ForegroundColor White
    Write-Host "   ssh -p $port $username@$host_address" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. 또는 PuTTY, WinSCP 등으로 연결 테스트" -ForegroundColor White
    Write-Host ""
    
    Write-Host "✅ 연결 성공 시 나타나야 할 정보:" -ForegroundColor Green
    Write-Host "- Linux 쉘 프롬프트 ($, # 등)" -ForegroundColor Gray
    Write-Host "- whoami 명령으로 사용자명 확인" -ForegroundColor Gray
    Write-Host "- node --version 명령으로 Node.js 버전 확인" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "❌ 연결 실패 시 나타나는 에러:" -ForegroundColor Red
    Write-Host "- Connection refused" -ForegroundColor Gray
    Write-Host "- Permission denied" -ForegroundColor Gray
    Write-Host "- Timeout" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "🔧 문제 해결 방법:" -ForegroundColor Cyan
    Write-Host "1. 카페24 관리자 페이지에서 SSH 활성화 확인" -ForegroundColor White
    Write-Host "2. 호스트 주소, 포트, 계정 정보 재확인" -ForegroundColor White
    Write-Host "3. 카페24 고객센터 문의" -ForegroundColor White
    
} catch {
    Write-Host "❌ 연결 테스트 실패: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📞 카페24 고객센터: 1588-0543" -ForegroundColor Magenta
Write-Host "🌐 카페24 관리자 페이지: https://manage.cafe24.com/" -ForegroundColor Magenta 