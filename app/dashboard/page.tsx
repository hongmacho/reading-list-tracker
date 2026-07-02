import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container-main max-w-6xl mx-auto">
      <h1 className="mb-8">📚 대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            이달 읽은 권수
          </div>
          <div className="text-3xl font-bold">0권</div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            읽고 있는 책
          </div>
          <div className="text-3xl font-bold">0권</div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            전체 읽은 책
          </div>
          <div className="text-3xl font-bold">0권</div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            평균 별점
          </div>
          <div className="text-3xl font-bold">0/5</div>
        </div>
      </div>

      <div className="card text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          아직 추가한 책이 없어요.
        </p>
        <Link href="/books/add" className="btn-primary inline-block">
          책 추가하기
        </Link>
      </div>
    </div>
  );
}
