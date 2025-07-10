import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "크레딧스토리 - 신용회복 커뮤니티",
  description: "개인회생, 법인회생, 워크아웃, 신용카드, 대출 등 신용회복에 관한 정보를 나누는 커뮤니티",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-pretendard antialiased"
        style={{ fontFamily: '"Pretendard Variable", -apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontWeight: 300 }}
      >
        {children}
      </body>
    </html>
  );
}
