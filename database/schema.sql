-- Credit Community Database Schema
-- Supabase에서 실행할 SQL 스크립트

-- 1. 게시글 테이블 (posts)
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- 실제 운영에서는 해싱 필요
    category VARCHAR(50) NOT NULL CHECK (category IN ('credit', 'personal', 'corporate', 'workout', 'card', 'loan', 'news')),
    images JSONB DEFAULT '[]'::jsonb, -- 이미지 URL 배열
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 댓글 테이블 (comments)
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE, -- 대댓글용
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- 실제 운영에서는 해싱 필요
    is_deleted BOOLEAN DEFAULT false,
    is_hidden BOOLEAN DEFAULT false, -- 관리자가 숨길 수 있음
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 광고 테이블 (ads)
CREATE TABLE ads (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    link_url VARCHAR(500),
    position VARCHAR(50) NOT NULL CHECK (position IN ('header', 'sidebar', 'content', 'footer')),
    priority INTEGER DEFAULT 0, -- 우선순위 (높은 숫자가 우선)
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 뉴스 테이블 (news)
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT,
    source VARCHAR(100) NOT NULL,
    url VARCHAR(500),
    category VARCHAR(50) DEFAULT '일반' CHECK (category IN ('정책', '금융', '법률', '일반')),
    is_important BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 신고 테이블 (reports)
CREATE TABLE reports (
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

-- 6. 광고 클릭 추적 테이블 (ad_clicks)
CREATE TABLE ad_clicks (
    id BIGSERIAL PRIMARY KEY,
    ad_id BIGINT REFERENCES ads(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    user_ip VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    page_url VARCHAR(500)
);

-- 인덱스 생성
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_is_deleted ON posts(is_deleted);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_comments_is_deleted ON comments(is_deleted);
CREATE INDEX idx_comments_is_hidden ON comments(is_hidden);

CREATE INDEX idx_ads_position ON ads(position);
CREATE INDEX idx_ads_active_dates ON ads(is_active, start_date, end_date);
CREATE INDEX idx_ads_priority ON ads(priority DESC);

CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_is_active ON news(is_active);
CREATE INDEX idx_news_is_important ON news(is_important);

CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_status ON reports(status);

CREATE INDEX idx_ad_clicks_ad_id ON ad_clicks(ad_id);
CREATE INDEX idx_ad_clicks_clicked_at ON ad_clicks(clicked_at);
CREATE INDEX idx_ad_clicks_date ON ad_clicks(DATE(clicked_at));

-- 트리거 함수 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON ads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입
INSERT INTO posts (title, content, author, password, category) VALUES
('개인회생 신청 후기', '개인회생 신청 과정을 공유합니다.', '익명', 'password123', 'personal'),
('신용카드 현명한 사용법', '신용카드를 현명하게 사용하는 방법을 알려드립니다.', '익명', 'password123', 'card'),
('대출 금리 비교 꿀팁', '대출 금리를 비교하는 방법을 설명합니다.', '익명', 'password123', 'loan');

INSERT INTO ads (title, description, position, start_date, end_date) VALUES
('신용회복 상담센터', '24시간 무료 상담 서비스', 'header', NOW(), NOW() + INTERVAL '30 days'),
('대출 비교 플랫폼', '최저금리 대출 상품 비교', 'sidebar', NOW(), NOW() + INTERVAL '30 days');

INSERT INTO news (title, summary, source, published_at, category) VALUES
('신용회복 지원제도 개선', '정부에서 신용회복 지원제도를 개선한다고 발표했습니다.', '금융위원회', NOW(), '정책'),
('개인회생 신청 절차 간소화', '개인회생 신청 절차가 간소화됩니다.', '법원행정처', NOW(), '법률');

-- RLS (Row Level Security) 활성화 (선택사항)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 기본 정책 (모든 사용자가 읽기 가능)
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (is_deleted = false);
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (is_deleted = false AND is_hidden = false);
CREATE POLICY "Anyone can view active ads" ON ads FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active news" ON news FOR SELECT USING (is_active = true);

-- 삽입 정책 (익명 사용자도 게시글/댓글 작성 가능)
CREATE POLICY "Anyone can create posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create reports" ON reports FOR INSERT WITH CHECK (true); 