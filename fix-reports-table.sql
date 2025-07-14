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

-- 5. RLS 정책 설정 (기존 정책이 있으면 삭제 후 재생성)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (존재하는 경우)
DROP POLICY IF EXISTS "Anyone can create reports" ON reports;
DROP POLICY IF EXISTS "Anyone can view reports" ON reports;

-- 새 정책 생성
CREATE POLICY "Anyone can create reports" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Anyone can update reports" ON reports FOR UPDATE USING (true); 