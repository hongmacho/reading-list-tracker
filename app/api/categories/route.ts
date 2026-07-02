import { categoryRepository } from "@/src/repositories/category.repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const categories = await categoryRepository.findAll();
    return NextResponse.json({ success: true, data: categories });
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

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "카테고리 이름은 필수입니다." },
        { status: 400 }
      );
    }

    const category = await categoryRepository.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
