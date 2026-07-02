"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await fetch("/api/export/csv");
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reading-list-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("내보내기 실패. 다시 시도해주세요.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container-main max-w-4xl mx-auto">
      <h1 className="mb-8">⚙️ 설정</h1>

      <div className="space-y-6">
        <div className="card">
          <h2 className="mb-4">📊 데이터 관리</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            모든 책과 인용을 CSV 형식으로 내보낼 수 있습니다.
          </p>
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="btn-primary"
          >
            {exporting ? "내보내는 중..." : "📥 CSV로 내보내기"}
          </button>
        </div>

        <div className="card">
          <h2 className="mb-4">📚 카테고리</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <span>📖 소설</span>
              <span className="text-xs text-gray-500">(기본)</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <span>📚 비소설</span>
              <span className="text-xs text-gray-500">(기본)</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <span>💻 개발/IT</span>
              <span className="text-xs text-gray-500">(기본)</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <span>🚀 자기계발</span>
              <span className="text-xs text-gray-500">(기본)</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <span>💼 비즈니스</span>
              <span className="text-xs text-gray-500">(기본)</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <span>🏛️ 역사/인문</span>
              <span className="text-xs text-gray-500">(기본)</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <span>🔬 과학</span>
              <span className="text-xs text-gray-500">(기본)</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <span>📕 기타</span>
              <span className="text-xs text-gray-500">(기본)</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4">정보</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>BookMark v1.0.0</p>
            <p>책 읽기 추적 & 핵심 정리 웹앱</p>
          </div>
        </div>
      </div>
    </div>
  );
}
