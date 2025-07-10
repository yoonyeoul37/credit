-- 크레딧스토리 데이터베이스 스키마
-- 이 파일을 Supabase SQL 에디터에서 실행하세요

-- 1. 게시글 테이블
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('credit', 'personal', 'corporate', 'workout', 'card', 'loan', 'news')),
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT false,
    images TEXT[], -- 이미지 URL 배열
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 댓글 테이블
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE, -- 대댓글용
    content TEXT NOT NULL,
    author VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 관리자 테이블
CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 광고 테이블
CREATE TABLE ads (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    url VARCHAR(500),
    image_url VARCHAR(500),
    position VARCHAR(50) NOT NULL CHECK (position IN ('header', 'sidebar', 'footer', 'content', 'sticky')),
    priority INTEGER DEFAULT 1,
    clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 방문자 통계 테이블
CREATE TABLE analytics (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    page_path VARCHAR(200) NOT NULL,
    visits INTEGER DEFAULT 0,
    unique_visits INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0.0,
    avg_session_duration INTEGER DEFAULT 0, -- 초 단위
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, page_path)
);

-- 6. 차단된 IP 테이블
CREATE TABLE blocked_ips (
    id BIGSERIAL PRIMARY KEY,
    ip_address INET NOT NULL UNIQUE,
    reason TEXT,
    blocked_by VARCHAR(50), -- 관리자 이름
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 신고 테이블
CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    reporter_ip INET,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_views ON posts(views DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_analytics_date ON analytics(date);
CREATE INDEX idx_analytics_page_path ON analytics(page_path);

-- 트리거 함수 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 기본 관리자 계정 생성 (비밀번호: admin2024!)
INSERT INTO admins (username, email, password_hash, role) VALUES 
('admin', 'admin@creditstory.com', '-1292019687', 'super_admin');

-- 기본 광고 데이터 생성
INSERT INTO ads (title, description, url, position, priority) VALUES
('신용회복 전문 상담센터', '24시간 무료 상담 | 성공률 95% | 맞춤 솔루션 제공', 'https://example.com/consultation', 'header', 1),
('개인회생 전문 법무법인', '개인회생 성공률 98% | 무료 상담 가능', 'https://example.com/personal-recovery', 'sidebar', 2),
('신용카드 현금화 서비스', '안전하고 빠른 현금화 서비스 | 당일 처리 가능', 'https://example.com/card-cash', 'content', 3),
('대출 상담 플랫폼', '저금리 대출 상담 | 신용점수 관계없이 상담 가능', 'https://example.com/loan', 'sticky', 4);

-- 샘플 게시글 생성
INSERT INTO posts (title, content, author, password_hash, category, views) VALUES
('개인회생 신청 후기 - 성공사례 공유', '안녕하세요. 개인회생을 성공적으로 마친 사람으로서 경험을 공유합니다. 총 부채 8천만원에서 2천만원으로 감액되었고, 현재 성실히 변제 중입니다. 포기하지 마시고 전문가와 상담해보세요.', '회생성공자', '123456789', 'personal', 1250),
('신용카드 연체 후 신용회복 과정', '신용카드 연체로 인해 신용점수가 많이 떨어졌었는데, 차근차근 관리해서 회복했습니다. 연체금 정리 방법과 신용점수 올리는 팁을 공유합니다.', '신용회복중', '987654321', 'credit', 890),
('법인회생 절차 및 필요서류 정리', '법인회생을 진행하면서 겪은 어려움과 필요한 서류들을 정리해봤습니다. 같은 상황에 있는 분들께 도움이 되길 바랍니다.', '법인대표', '555444333', 'corporate', 567),
('워크아웃 vs 개인회생 어떤 것이 유리할까?', '두 제도의 장단점을 비교분석해봤습니다. 개인의 상황에 따라 선택이 달라질 수 있으니 전문가와 상담이 필요합니다.', '재정전문가', '111222333', 'workout', 720),
('저금리 대출 받는 꿀팁 공유', '여러 금융기관을 비교해서 최적의 대출 조건을 찾는 방법을 알려드립니다. 신용점수별 대출 가능 금리도 함께 정리했어요.', '대출마스터', '777888999', 'loan', 445);

-- 샘플 댓글 생성
INSERT INTO comments (post_id, content, author, password_hash) VALUES
(1, '정말 유용한 정보네요! 저도 개인회생 준비 중인데 많은 도움이 됐습니다.', '준비중인사람', '123123123'),
(1, '변제 계획은 어떻게 세우셨나요? 구체적인 팁이 있다면 알려주세요.', '궁금한사람', '456456456'),
(2, '신용점수 회복에 얼마나 걸리셨나요?', '신용회복희망', '789789789'),
(3, '법인회생 기간이 얼마나 걸리는지 궁금합니다.', '법인운영자', '321321321'),
(4, '워크아웃 경험이 있으신가요? 실제 경험담이 듣고 싶습니다.', '고민중', '654654654');

-- Row Level Security (RLS) 정책 설정
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (모든 사용자가 읽을 수 있음)
CREATE POLICY "Public posts are viewable by everyone" ON posts
    FOR SELECT USING (NOT is_hidden);

CREATE POLICY "Public comments are viewable by everyone" ON comments
    FOR SELECT USING (NOT is_hidden);

CREATE POLICY "Public ads are viewable by everyone" ON ads
    FOR SELECT USING (is_active);

-- 익명 사용자 쓰기 정책 (게시글, 댓글)
CREATE POLICY "Anyone can insert posts" ON posts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert comments" ON comments
    FOR INSERT WITH CHECK (true);

-- 관리자 전체 권한 정책
CREATE POLICY "Admins can do everything" ON posts
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can do everything on comments" ON comments
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage ads" ON ads
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can view analytics" ON analytics
    FOR SELECT USING (auth.role() = 'service_role');

-- 완료 메시지
SELECT 'Database schema created successfully! 🎉' as message; 