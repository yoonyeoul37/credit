-- 1. posts 테이블에 is_deleted 컬럼 추가 (존재하지 않는 경우)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- 2. comments 테이블에 is_deleted 컬럼 추가 (존재하지 않는 경우)
ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- 3. reports 테이블 생성
CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment')),
    target_id BIGINT NOT NULL,
    reporter_ip VARCHAR(45),
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'advertising', 'other')),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- 5. 트리거 함수 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 트리거 생성
DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;
CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON reports
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. RLS (Row Level Security) 활성화
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 8. 기존 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Anyone can create reports" ON reports;
DROP POLICY IF EXISTS "Anyone can view reports" ON reports;

-- 9. 정책 생성 (익명 사용자도 신고 생성 가능)
CREATE POLICY "Anyone can create reports" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view reports" ON reports FOR SELECT USING (true);

-- 10. 샘플 데이터 확인 (선택사항)
SELECT 'posts table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'posts' AND table_schema = 'public';

SELECT 'reports table created:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reports' AND table_schema = 'public'; 