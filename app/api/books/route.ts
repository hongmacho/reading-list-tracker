import { bookRepository } from "@/src/repositories/book.repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = Number(searchParams.get("limit")) || 50;
    const offset = Number(searchParams.get("offset")) || 0;

    let books;
    if (status) {
      books = await bookRepository.findByStatus(
        status as "not_started" | "reading" | "completed"
      );
    } else {
      books = await bookRepository.findAll(limit, offset);
    }

    return NextResponse.json({ success: true, data: books });
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

    // Validate required fields
    if (!body.title || !body.author) {
      return NextResponse.json(
        { success: false, error: "제목과 저자는 필수입니다." },
        { status: 400 }
      );
    }

    const book = await bookRepository.create(body);
    return NextResponse.json({ success: true, data: book }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
