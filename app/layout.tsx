import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
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
        <Navigation />
        <main className="pt-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
