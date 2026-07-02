"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    categoryId: "1",
    totalPages: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId ? Number(formData.categoryId) : null,
          totalPages: formData.totalPages ? Number(formData.totalPages) : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "책 추가 실패");
      }

      router.push(`/books/${result.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main max-w-2xl mx-auto">
      <h1 className="mb-8">📖 책 추가</h1>

      {error && (
        <div className="card border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 mb-6">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">제목 *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="책의 제목을 입력하세요"
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">저자 *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="저자 이름을 입력하세요"
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">ISBN</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="ISBN-13 (선택)"
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">카테고리</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="input-field w-full"
          >
            <option value="">카테고리 선택</option>
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

        <div>
          <label className="block text-sm font-medium mb-2">
            총 페이지 수
          </label>
          <input
            type="number"
            name="totalPages"
            value={formData.totalPages}
            onChange={handleChange}
            placeholder="페이지 수 (선택)"
            min="0"
            className="input-field w-full"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary flex-1"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
