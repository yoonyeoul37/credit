-- 데이터베이스 스키마 업데이트
-- 실행 순서: 이 파일을 Supabase SQL 에디터에서 실행하세요

-- 1. 광고 테이블에 우선순위 컬럼 추가
ALTER TABLE ads ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- 2. 광고 클릭 추적 테이블 생성
CREATE TABLE IF NOT EXISTS ad_clicks (
    id BIGSERIAL PRIMARY KEY,
    ad_id BIGINT REFERENCES ads(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    user_ip VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    page_url VARCHAR(500)
);

-- 3. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_ads_priority ON ads(priority DESC);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_ad_id ON ad_clicks(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_clicked_at ON ad_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_date ON ad_clicks(DATE(clicked_at));

-- 4. 기존 광고들의 우선순위를 0으로 설정
UPDATE ads SET priority = 0 WHERE priority IS NULL;

-- 완료 메시지
SELECT 'Database schema updated successfully!' AS message; 