"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author?: string;
  status: string;
  rating?: number;
  currentPage: number;
  totalPages?: number;
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter) params.append("status", statusFilter);
      if (categoryFilter) params.append("category", categoryFilter);

      const queryString = params.toString();
      const url = queryString ? `/api/books?${queryString}` : "/api/books";

      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setBooks(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const getProgress = (current: number, total?: number) => {
    if (!total) return 0;
    return Math.round((current / total) * 100);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      not_started: "미시작",
      reading: "읽는 중",
      completed: "완료",
    };
    return labels[status] || status;
  };

  return (
    <div className="container-main max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1>📚 나의 서재</h1>
        <Link href="/books/add" className="btn-primary">
          책 추가
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="card mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">검색</label>
          <input
            type="text"
            placeholder="제목 또는 저자를 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">읽기 상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="">모든 상태</option>
              <option value="not_started">미시작</option>
              <option value="reading">읽는 중</option>
              <option value="completed">완료</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">카테고리</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="">모든 카테고리</option>
              <option value="1">소설</option>
              <option value="2">비소설</option>
              <option value="3">개발/IT</option>
              <option value="4">자기계발</option>
              <option value="5">비즈니스</option>
              <option value="6">역사/인문</option>
              <option value="7">과학</option>
              <option value="8">기타</option>
            </select>
          </div>
        </div>

        {(searchQuery || statusFilter || categoryFilter) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("");
              setCategoryFilter("");
            }}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            필터 초기화
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">도서 목록을 불러오는 중...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="card text-center py-12">
          {searchQuery || statusFilter || categoryFilter ? (
            <>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                검색 결과가 없습니다.
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                다른 키워드로 시도해보세요.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                아직 추가한 책이 없어요.
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                지금 바로 책을 추가하고 독서 여정을 시작하세요!
              </p>
            </>
          )}
          <Link href="/books/add" className="btn-primary">
            {searchQuery || statusFilter || categoryFilter ? "돌아가기" : "책 추가하기"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <div className="card h-full cursor-pointer hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {book.author}
                </p>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">진도</span>
                    <span className="text-sm font-medium">
                      {getProgress(book.currentPage, book.totalPages)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${getProgress(book.currentPage, book.totalPages)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                    {getStatusLabel(book.status)}
                  </span>
                  {book.rating && (
                    <span className="text-sm">
                      {"⭐".repeat(book.rating)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
