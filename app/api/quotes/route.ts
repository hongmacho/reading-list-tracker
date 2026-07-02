import { quoteRepository } from "@/src/repositories/quote.repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");
    const limit = Number(searchParams.get("limit")) || 100;
    const offset = Number(searchParams.get("offset")) || 0;

    if (bookId) {
      const quotes = await quoteRepository.findByBookId(Number(bookId));
      return NextResponse.json({ success: true, data: quotes });
    }

    const quotes = await quoteRepository.findAll(limit, offset);
    return NextResponse.json({ success: true, data: quotes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.bookId || !body.text) {
      return NextResponse.json(
        { success: false, error: "책 ID와 인용문은 필수입니다." },
        { status: 400 }
      );
    }

    const quote = await quoteRepository.create(body);
    return NextResponse.json({ success: true, data: quote }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
