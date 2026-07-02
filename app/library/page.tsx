"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        const result = await response.json();
        if (result.success) {
          setBooks(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">도서 목록을 불러오는 중...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            아직 추가한 책이 없어요.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            지금 바로 책을 추가하고 독서 여정을 시작하세요!
          </p>
          <Link href="/books/add" className="btn-primary">
            책 추가하기
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
