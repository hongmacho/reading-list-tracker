import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookMark - 책 읽기 추적 & 핵심 정리",
  description: "읽은 책, 핵심 인용, 개인 의견을 한곳에서 정리하세요",
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
