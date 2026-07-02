import Link from "next/link";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            📚 BookMark
          </Link>

          <div className="flex gap-6">
            <Link
              href="/dashboard"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              대시보드
            </Link>
            <Link
              href="/library"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              서재
            </Link>
            <Link
              href="/statistics"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              통계
            </Link>
            <Link
              href="/settings"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              설정
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
