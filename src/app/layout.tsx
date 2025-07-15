import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "크레딧스토리 - 신용회복 커뮤니티",
  description: "개인회생, 법인회생, 워크아웃, 신용카드, 대출 등 신용회복에 관한 정보를 나누는 커뮤니티",
  keywords: "개인회생, 법인회생, 워크아웃, 신용회복, 신용카드, 대출, 신용관리, 채무조정, 파산, 회생절차, 신용등급",
  authors: [{ name: "크레딧스토리" }],
  robots: "index, follow",
};

// Next.js 15.3.5 권장 방식: viewport 별도 export
export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-site-verification" content="E6q2gRe_we_DNfDqJYaN8JGz3duR2Rb_7FgLl502vdc" />
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
