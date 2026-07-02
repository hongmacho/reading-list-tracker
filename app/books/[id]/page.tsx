"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Book {
  id: number;
  title: string;
  author?: string;
  status: string;
  rating?: number;
  currentPage: number;
  totalPages?: number;
  completedDate?: string;
}

interface Quote {
  id: number;
  bookId: number;
  text: string;
  pageNumber?: number;
  tags?: string;
  createdAt: string;
}

export default function BookDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [params, setParams] = useState<{ id: string } | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuote, setNewQuote] = useState("");
  const [quotePage, setQuotePage] = useState("");
  const [currentPageInput, setCurrentPageInput] = useState("");

  useEffect(() => {
    (async () => {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    })();
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;

    const fetchData = async () => {
      try {
        const [bookRes, quotesRes] = await Promise.all([
          fetch(`/api/books/${params.id}`),
          fetch(`/api/quotes?bookId=${params.id}`),
        ]);

        const bookData = await bookRes.json();
        const quotesData = await quotesRes.json();

        if (bookData.success) {
          setBook(bookData.data);
          setCurrentPageInput(bookData.data.currentPage.toString());
        }
        if (quotesData.success) {
          setQuotes(quotesData.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const handleUpdateProgress = async () => {
    if (!book || !params) return;

    try {
      const response = await fetch(`/api/books/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPage: Number(currentPageInput),
          status:
            Number(currentPageInput) >= (book.totalPages || 0)
              ? "completed"
              : "reading",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setBook(result.data);
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const handleAddQuote = async () => {
    if (!newQuote || !book) return;

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          text: newQuote,
          pageNumber: quotePage ? Number(quotePage) : null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setQuotes([...quotes, result.data]);
        setNewQuote("");
        setQuotePage("");
      }
    } catch (error) {
      console.error("Failed to add quote:", error);
    }
  };

  if (loading) {
    return (
      <div className="container-main text-center py-12">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container-main text-center py-12">
        <p className="text-gray-500">책을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const progress = book.totalPages
    ? Math.round((book.currentPage / book.totalPages) * 100)
    : 0;

  return (
    <div className="container-main max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-6 text-blue-600 hover:text-blue-700 dark:text-blue-400"
      >
        ← 돌아가기
      </button>

      <div className="card mb-6">
        <div className="mb-4">
          <h1 className="mb-2">{book.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {book.author}
          </p>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">진도</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                value={currentPageInput}
                onChange={(e) => setCurrentPageInput(e.target.value)}
                min="0"
                placeholder="현재 페이지"
                className="input-field flex-1"
              />
              <button
                onClick={handleUpdateProgress}
                className="btn-primary whitespace-nowrap"
              >
                진도 업데이트
              </button>
            </div>
          </div>

          {book.rating && (
            <div className="mb-4">
              <p className="text-lg">{"⭐".repeat(book.rating)}</p>
            </div>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400">
            상태: {book.status === "reading" ? "읽는 중" : "완료"}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4">핵심 인용 ({quotes.length}/5)</h2>

        {quotes.length < 5 && (
          <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <textarea
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              placeholder="인용문을 입력하세요"
              className="input-field w-full h-24 mb-3"
            />
            <input
              type="number"
              value={quotePage}
              onChange={(e) => setQuotePage(e.target.value)}
              placeholder="페이지 번호 (선택)"
              className="input-field w-full mb-3"
              min="0"
            />
            <button
              onClick={handleAddQuote}
              disabled={!newQuote || quotes.length >= 5}
              className="btn-primary w-full"
            >
              + 인용 추가
            </button>
          </div>
        )}

        {quotes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            아직 인용을 저장하지 않았어요.
          </p>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10"
              >
                <p className="italic mb-2">"{quote.text}"</p>
                {quote.pageNumber && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    - 페이지 {quote.pageNumber}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
