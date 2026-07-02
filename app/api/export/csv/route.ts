import { bookRepository } from "@/src/repositories/book.repository";
import { quoteRepository } from "@/src/repositories/quote.repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const books = await bookRepository.findAll(1000, 0);
    const headers = [
      "ID",
      "제목",
      "저자",
      "ISBN",
      "카테고리",
      "상태",
      "진도",
      "총 페이지",
      "별점",
      "완료일",
      "생성일",
    ];

    const rows = [];
    for (const book of books) {
      const quoteCount = await quoteRepository.countByBookId(book.id);
      rows.push([
        book.id,
        book.title || "",
        book.author || "",
        book.isbn || "",
        book.categoryId || "",
        book.status || "",
        book.currentPage || 0,
        book.totalPages || "",
        book.rating || "",
        book.completedDate
          ? new Date(book.completedDate).toISOString()
          : "",
        new Date(book.createdAt).toISOString(),
      ]);
    }

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="books-' +
          new Date().toISOString().split("T")[0] +
          '.csv"',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
