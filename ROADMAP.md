# ROADMAP: BookMark 개발 계획

## 프로젝트 총괄

| 항목 | 내용 |
|------|------|
| **프로젝트명** | BookMark - 책 읽기 추적 & 핵심 정리 |
| **기술 스택** | Next.js 16.2 · Tailwind v4 · shadcn/ui 2.9 · Drizzle 0.31 · better-sqlite3 |
| **총 스프린트** | 6개 (Sprint 0~5) |
| **예상 기간** | 6~8주 |
| **출시 기준** | Sprint 5 완료 후 모든 MUST-HAVE 기능 검증 완료 |

---

## Sprint 0: 프로젝트 셋업 (1주)

**목표**: Next.js 16.2 + shadcn/ui + Drizzle + SQLite 통합 개발 환경 구축

### 세부 작업

#### 0-1. Next.js 16 프로젝트 초기화
```bash
npx create-next-app@latest reading-list-tracker --yes
```
**완료 기준**:
- [ ] 프로젝트 디렉토리 생성 완료
- [ ] TypeScript 기본 설정 완료
- [ ] App Router 구조 확인
- [ ] Import alias `@/*` 동작 확인

#### 0-2. Tailwind CSS v4 설정
**요구사항**:
- Tailwind v4 (@tailwindcss/postcss) 설치
- Zero-configuration 모드 활용 (no tailwind.config.js 필요)
- CSS 파일에 `@import 'tailwindcss';` 한 줄만 추가
- 자동 template path scanning 확인

**완료 기준**:
- [ ] `npm install -D tailwindcss @tailwindcss/postcss` 완료
- [ ] `app/globals.css`에 `@import 'tailwindcss';` 추가
- [ ] 스타일링 동작 확인 (테스트 컴포넌트)

#### 0-3. shadcn/ui 초기화
```bash
npx shadcn@latest init -t next -d
```
**완료 기준**:
- [ ] shadcn CLI 설정 완료
- [ ] 컴포넌트 디렉토리 구조 확인 (`components/ui/`)
- [ ] Button, Input, Card, Dialog 등 기본 컴포넌트 추가

#### 0-4. Drizzle + better-sqlite3 설정
```bash
npm install drizzle-orm better-sqlite3 -D drizzle-kit @types/better-sqlite3
```

**파일 생성**:
- `src/db/schema.ts` - 데이터베이스 스키마 정의 (예: books 테이블)
- `drizzle.config.ts` - Drizzle 설정
- `src/db/index.ts` - 데이터베이스 인스턴스 생성

**설정 예시** (drizzle.config.ts):
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: './sqlite.db',
  },
});
```

**완료 기준**:
- [ ] `sqlite.db` 파일 생성 확인
- [ ] `npx drizzle-kit push` 실행 성공
- [ ] 데이터베이스 연결 테스트 완료

#### 0-5. ESLint 설정 (Next.js 16 변경사항)

**중요**: Next.js 16에서는 `next lint` 명령이 제거되었습니다.  
직접 `eslint.config.mjs` 작성 필요.

**파일**: `eslint.config.mjs`
```javascript
import nextPlugin from '@next/eslint-plugin-next';
import typescriptEslint from 'typescript-eslint';

export default [
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': typescriptEslint.plugin,
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
```

**완료 기준**:
- [ ] `eslint.config.mjs` 파일 생성
- [ ] `npx eslint .` 실행 성공 (에러 없음)
- [ ] 타입 체크 자동화 (CI/CD 연동 시)

#### 0-6. 기본 레이아웃 & 네비게이션

**컴포넌트 생성**:
- `app/layout.tsx` - 루트 레이아웃 (ThemeProvider 포함)
- `components/Navbar.tsx` - 상단 네비게이션
- `components/Sidebar.tsx` - 좌측 메뉴

**완료 기준**:
- [ ] 레이아웃 구조 확인
- [ ] 네비게이션 렌더링 확인
- [ ] 페이지 라우팅 테스트 (예: `/dashboard`, `/library`)

---

## Sprint 1: 데이터베이스 & Repository 레이어 (1.5주)

**목표**: SQLite 스키마 정의 및 데이터 접근 계층(Repository) 구현

### 1-1. 데이터베이스 스키마 설계 & 마이그레이션

**파일**: `src/db/schema.ts`

```typescript
import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey(),
  name: text('name').unique().notNull(),
  icon: text('icon'),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
});

export const books = sqliteTable('books', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author'),
  isbn: text('isbn').unique(),
  categoryId: integer('category_id').references(() => categories.id),
  coverImageUrl: text('cover_image_url'),
  status: text('status', { enum: ['not_started', 'reading', 'completed'] }).default('not_started'),
  currentPage: integer('current_page').default(0),
  totalPages: integer('total_pages'),
  rating: integer('rating'), // 1-5
  completedDate: integer('completed_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .$onUpdate(() => new Date()),
});

export const quotes = sqliteTable('quotes', {
  id: integer('id').primaryKey(),
  bookId: integer('book_id').references(() => books.id).notNull(),
  text: text('text').notNull(),
  pageNumber: integer('page_number'),
  tags: text('tags'), // comma-separated
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
});

export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey(),
  quoteId: integer('quote_id').references(() => quotes.id).notNull(),
  content: text('content').notNull(), // markdown
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .$onUpdate(() => new Date()),
});

export const bookTags = sqliteTable('book_tags', {
  id: integer('id').primaryKey(),
  bookId: integer('book_id').references(() => books.id).notNull(),
  tag: text('tag').notNull(), // 주제, 추천 등
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
});

export const readingHistory = sqliteTable('reading_history', {
  id: integer('id').primaryKey(),
  bookId: integer('book_id').references(() => books.id).notNull(),
  pageBefore: integer('page_before'),
  pageAfter: integer('page_after').notNull(),
  recordedAt: integer('recorded_at', { mode: 'timestamp' })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
});
```

**기술 주의사항**:
- **Integer Timestamp 패턴**: SQLite는 기본 타임스탐프를 정수로 저장 (milliseconds 기반)
- **sql<number> 캐스팅**: 쿼리에서 숫자 연산 시 `sql<number>` 사용
- **$onUpdate 콜백**: 자동 updated_at 갱신 구현

**완료 기준**:
- [ ] 모든 테이블 생성 스크립트 작성 완료
- [ ] `npx drizzle-kit push` 실행 성공
- [ ] 테이블 구조 DB 브라우저로 확인 (DBeaver 등)

### 1-2. 데이터베이스 인스턴스 초기화

**파일**: `src/db/index.ts`

```typescript
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

const sqlite = new Database(path.join(process.cwd(), 'sqlite.db'));
// WAL 모드 활성화 (성능 개선)
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
export type BetterSQLiteDatabase = typeof db; // 제네릭 타입 내보내기

export default db;
```

**완료 기준**:
- [ ] 데이터베이스 연결 테스트
- [ ] 기본 쿼리 실행 확인 (예: SELECT COUNT(*) FROM books)

### 1-3. Repository 패턴 구현 (Data Access Layer)

**파일 구조**:
```
src/
  repositories/
    base.repository.ts       # 기본 CRUD 인터페이스
    book.repository.ts       # 책 관련 쿼리
    quote.repository.ts      # 인용 관련 쿼리
    category.repository.ts   # 카테고리 관련 쿼리
```

**예시**: `src/repositories/book.repository.ts`

```typescript
import { db } from '@/db';
import { books, bookTags, quotes } from '@/db/schema';
import { eq, like, and } from 'drizzle-orm';

export interface CreateBookInput {
  title: string;
  author?: string;
  isbn?: string;
  categoryId?: number;
  totalPages?: number;
}

export interface UpdateBookInput extends Partial<CreateBookInput> {
  status?: 'not_started' | 'reading' | 'completed';
  currentPage?: number;
  rating?: number;
}

export class BookRepository {
  async create(input: CreateBookInput) {
    const result = await db.insert(books).values(input).returning();
    return result[0];
  }

  async findById(id: number) {
    const result = await db.select().from(books).where(eq(books.id, id));
    return result[0] || null;
  }

  async findAll(limit = 50, offset = 0) {
    return await db
      .select()
      .from(books)
      .limit(limit)
      .offset(offset)
      .orderBy(books.createdAt);
  }

  async findByStatus(status: 'not_started' | 'reading' | 'completed') {
    return await db.select().from(books).where(eq(books.status, status));
  }

  async search(query: string) {
    return await db
      .select()
      .from(books)
      .where(
        or(
          like(books.title, `%${query}%`),
          like(books.author, `%${query}%`)
        )
      );
  }

  async update(id: number, input: UpdateBookInput) {
    const result = await db
      .update(books)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(books.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    await db.delete(books).where(eq(books.id, id));
  }

  async getStats(year?: number, month?: number): Promise<{ total: number; completed: number; reading: number }> {
    const result = await db
      .select({
        total: sql<number>`COUNT(*)`,
        completed: sql<number>`COUNT(CASE WHEN status = 'completed' THEN 1 END)`,
        reading: sql<number>`COUNT(CASE WHEN status = 'reading' THEN 1 END)`,
      })
      .from(books);
    
    return result[0];
  }
}

export const bookRepository = new BookRepository();
```

**기술 주의사항**:
- **sql<number> 캐스팅**: COUNT, SUM 등 숫자 반환 쿼리에 사용
- **BetterSQLite3Database<typeof schema> 제네릭**: db 인스턴스 타입 안전성
- **또는 (or) 연산**: 검색 쿼리에서 여러 조건 조합

**완료 기준**:
- [ ] BookRepository 모든 메서드 구현
- [ ] QuoteRepository, CategoryRepository 구현
- [ ] 기본 쿼리 테스트 (단위 테스트)

### 1-4. API 라우트 스켈레톤

**파일 구조**:
```
app/api/
  books/
    route.ts              # GET /api/books, POST /api/books
    [id]/
      route.ts            # GET/PUT/DELETE /api/books/[id]
  quotes/
    route.ts
    [id]/route.ts
  categories/
    route.ts
```

**예시**: `app/api/books/route.ts`

```typescript
import { bookRepository } from '@/repositories/book.repository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    let books;
    if (status) {
      books = await bookRepository.findByStatus(status);
    } else {
      books = await bookRepository.findAll();
    }
    
    return NextResponse.json({ success: true, data: books });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const book = await bookRepository.create(body);
    return NextResponse.json({ success: true, data: book }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
```

**완료 기준**:
- [ ] 모든 API 엔드포인트 스켈레톤 생성
- [ ] API 테스트 (Postman/curl) 성공

---

## Sprint 2: 핵심 기능 - 책 추가, 진도 추적, 인용 저장 (1.5주)

**목표**: PRD MUST-HAVE 기능 1-3 구현 (책 추가 & 관리, 읽는 진도 추적, 핵심 인용 저장)

### 2-1. 책 추가/편집 페이지 구현

**화면**: `/add` (책 추가), `/books/[id]/edit` (편집)

**기능**:
- ISBN 입력 시 자동 책 정보 조회 (OpenLibrary API 연동 고려, v1.1에서 수동 입력으로 시작)
- 제목, 저자, ISBN, 카테고리, 총 페이지 입력 필드
- 표지 이미지 업로드 (로컬 저장 또는 URL)
- 저장/취소 버튼

**컴포넌트**:
- `components/BookForm.tsx` - 책 정보 입력 폼
- `app/books/add/page.tsx` - 책 추가 페이지
- `app/books/[id]/edit/page.tsx` - 책 편집 페이지

**완료 기준**:
- [ ] 책 추가 페이지 렌더링
- [ ] 폼 유효성 검사 (필수 필드: 제목, 저자)
- [ ] 데이터베이스 저장 성공
- [ ] 편집 페이지에서 기존 데이터 로드
- [ ] UI 테스트: 모바일/데스크톱 반응형 확인

### 2-2. 서재/책 목록 페이지 구현

**화면**: `/library` (메인 서재 페이지)

**기능**:
- 모든 책 목록 표시 (카드형 또는 리스트형)
- 검색 (제목/저자)
- 필터 (완료/진행중, 카테고리)
- 정렬 (최신순/별점순)
- 책 선택 시 상세 페이지로 이동

**컴포넌트**:
- `components/BookCard.tsx` - 책 카드
- `components/BookFilter.tsx` - 필터 컴포넌트
- `components/BookSearch.tsx` - 검색창
- `app/library/page.tsx` - 서재 페이지

**완료 기준**:
- [ ] 책 목록 렌더링
- [ ] 검색 기능 동작
- [ ] 필터링 기능 동작
- [ ] 정렬 기능 동작
- [ ] 페이지네이션 (있으면 가산점)

### 2-3. 책 상세 페이지 & 진도 추적

**화면**: `/books/[id]`

**기능**:
- 책 기본 정보 표시 (표지, 제목, 저자, 별점, 상태)
- 진도% 시각화 (진행 바)
- 진도 업데이트 (현재 페이지 입력)
- 읽기 완료 버튼
- 인용 섹션 (다음 스프린트에서 구현)

**컴포넌트**:
- `components/BookDetail.tsx` - 책 상세 정보
- `components/ProgressBar.tsx` - 진도 표시 막대
- `components/ReadingProgress.tsx` - 진도 입력 폼
- `app/books/[id]/page.tsx` - 책 상세 페이지

**완료 기준**:
- [ ] 책 상세 정보 표시
- [ ] 진도 업데이트 기능 동작
- [ ] 완료 표시 기능 동작
- [ ] 읽기 기록 저장 확인

### 2-4. 인용 저장 기능

**화면**: `/books/[id]` (책 상세 페이지 내 섹션)

**기능**:
- "+ 인용 추가" 버튼
- 인용 텍스트 입력
- 페이지 번호 입력 (선택)
- 태그 추가 (선택)
- 인용 목록 표시 (최대 5개 제한)
- 인용 삭제 버튼

**컴포넌트**:
- `components/QuoteForm.tsx` - 인용 입력 폼
- `components/QuoteList.tsx` - 인용 목록
- `components/QuoteCard.tsx` - 인용 카드

**완료 기준**:
- [ ] 인용 추가 기능 동작
- [ ] 5개 도달 시 버튼 비활성화 + 안내 메시지
- [ ] 인용 삭제 기능 동작
- [ ] 인용 데이터 저장 확인

---

## Sprint 3: 메모, 태그 분류, 별점 기능 (1.5주)

**목표**: PRD MUST-HAVE 기능 4-6 구현 (개인 의견 메모, 태그 분류 & 검색, 별점)

### 3-1. 개인 의견 메모 기능

**화면**: `/books/[id]` (인용 카드에 메모 섹션)

**기능**:
- 각 인용별 메모 추가/수정/삭제
- 마크다운 지원 (굵게, 기울임, 링크)
- 메모 저장 시 타임스탐프 기록

**컴포넌트**:
- `components/NoteEditor.tsx` - 메모 에디터 (마크다운)
- `components/NoteDisplay.tsx` - 메모 렌더링

**완료 기준**:
- [ ] 메모 입력 & 저장 동작
- [ ] 마크다운 기본 포맷 지원 (굵게, 기울임, 코드)
- [ ] 메모 수정/삭제 기능

### 3-2. 통합 검색 (제목, 저자, 인용)

**화면**: `/library` (검색창 개선)

**기능**:
- 통합 검색창 (제목/저자/인용 전문 검색)
- SQLite FTS(Full-Text Search) 인덱싱 활용
- 검색 결과 하이라이트

**Repository 확장**:
```typescript
async searchFull(query: string) {
  return await db
    .select()
    .from(books)
    .leftJoin(quotes, eq(books.id, quotes.bookId))
    .where(
      or(
        like(books.title, `%${query}%`),
        like(books.author, `%${query}%`),
        like(quotes.text, `%${query}%`)
      )
    )
    .groupBy(books.id);
}
```

**완료 기준**:
- [ ] 통합 검색 쿼리 구현
- [ ] 검색 응답 시간 < 200ms
- [ ] 검색 결과 페이지 구현

### 3-3. 태그 기반 분류

**화면**: `/library` (필터 컴포넌트)

**기능**:
- 책별 태그 추가/제거 (주제, 추천, 꼭 읽기 등)
- 태그별 필터링
- 태그 자동 제안 (기존 태그 리스트)

**컴포넌트**:
- `components/TagInput.tsx` - 태그 입력 & 자동완성
- `components/TagFilter.tsx` - 태그 필터
- `components/TagBadge.tsx` - 태그 배지

**Repository 확장**:
```typescript
async findByTag(tag: string) {
  return await db
    .select()
    .from(books)
    .innerJoin(bookTags, eq(books.id, bookTags.bookId))
    .where(eq(bookTags.tag, tag));
}

async getAllTags() {
  return await db
    .selectDistinct({ tag: bookTags.tag })
    .from(bookTags)
    .orderBy(bookTags.tag);
}
```

**완료 기준**:
- [ ] 태그 추가/삭제 기능
- [ ] 태그 필터링 동작
- [ ] 자동 제안 기능

### 3-4. 별점 기능

**화면**: `/books/[id]` (책 상세 페이지)

**기능**:
- 1-5 별점 입력 (클릭/드래그)
- 별점 시각화 (⭐⭐⭐)
- 별점별 통계 (v2에서 추가)

**컴포넌트**:
- `components/RatingInput.tsx` - 별점 입력 컴포넌트

**완료 기준**:
- [ ] 별점 입력 & 저장
- [ ] 별점 표시 UI

---

## Sprint 4: 대시보드, 데이터 내보내기, 빈 상태, 카테고리 (1.5주)

**목표**: PRD MUST-HAVE 기능 7-10 구현 (대시보드, CSV 내보내기, 빈 상태, 카테고리)

### 4-1. 월별 독서량 대시보드

**화면**: `/dashboard` (메인 대시보드)

**기능**:
- 이달 읽은 권수
- 진행 중인 책 (최근 3개)
- 별점 분포 (원형 차트)
- 최근 완독한 책

**컴포넌트**:
- `components/DashboardStats.tsx` - 통계 카드
- `components/ReadingChart.tsx` - 월별 막대 차트 (Recharts)
- `components/RatingDistribution.tsx` - 별점 분포 원형 차트
- `app/dashboard/page.tsx` - 대시보드 페이지

**Repository 확장**:
```typescript
async getMonthlyStats(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return await db
    .select({
      count: sql<number>`COUNT(*)`,
      avgRating: sql<number>`AVG(rating)`,
    })
    .from(books)
    .where(
      and(
        gte(books.completedDate, startDate),
        lte(books.completedDate, endDate)
      )
    );
}

async getRatingDistribution() {
  return await db
    .select({
      rating: books.rating,
      count: sql<number>`COUNT(*)`,
    })
    .from(books)
    .groupBy(books.rating);
}
```

**완료 기준**:
- [ ] 대시보드 페이지 렌더링
- [ ] 통계 데이터 계산 정확성 확인
- [ ] 차트 시각화 (Recharts)
- [ ] 모바일 반응형 확인

### 4-2. CSV 내보내기

**화면**: `/settings` (설정 페이지)

**기능**:
- 모든 책 + 인용 + 메모 내보내기
- 기간별 필터링 (선택)
- JSON 형식 옵션

**구현**:
```typescript
// app/api/export/csv/route.ts
export async function GET(req: NextRequest) {
  const books = await bookRepository.findAll();
  const csv = convertToCSV(books);
  
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="books.csv"',
    },
  });
}

function convertToCSV(books: Book[]): string {
  const headers = ['ID', 'Title', 'Author', 'ISBN', 'Status', 'Rating', 'Completed Date'];
  const rows = books.map(b => [
    b.id,
    b.title,
    b.author,
    b.isbn,
    b.status,
    b.rating,
    b.completedDate?.toISOString(),
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}
```

**완료 기준**:
- [ ] CSV 파일 생성 & 다운로드 확인
- [ ] 데이터 무결성 확인 (모든 책, 인용 포함)

### 4-3. 빈 상태 & 에러 처리

**화면**: 모든 페이지

**구현**:
- 책이 없을 때 친화적 메시지 + "책 추가" CTA
- 검색 결과 없음 메시지
- 인용이 없을 때 메시지
- 데이터 로드 실패 시 재시도 버튼

**컴포넌트**:
- `components/EmptyState.tsx` - 빈 상태 컴포넌트
- `components/ErrorBoundary.tsx` - 에러 처리

**완료 기준**:
- [ ] 모든 빈 상태 화면 디자인
- [ ] 에러 메시지 한국어화
- [ ] 재시도 기능 구현

### 4-4. 도서 카테고리 관리

**화면**: `/settings` (설정 페이지)

**기능**:
- 사전 정의된 8개 카테고리 표시
- 사용자 정의 카테고리 추가/삭제
- 기본 카테고리 잠금

**기본 카테고리 초기화** (seed data):
```typescript
// scripts/seed.ts
async function seedCategories() {
  const categories = [
    { name: '소설', icon: '📖', isDefault: true },
    { name: '비소설', icon: '📚', isDefault: true },
    { name: '개발/IT', icon: '💻', isDefault: true },
    { name: '자기계발', icon: '🚀', isDefault: true },
    { name: '비즈니스', icon: '💼', isDefault: true },
    { name: '역사/인문', icon: '🏛️', isDefault: true },
    { name: '과학', icon: '🔬', isDefault: true },
    { name: '기타', icon: '📕', isDefault: true },
  ];
  
  for (const cat of categories) {
    await categoryRepository.create(cat);
  }
}
```

**완료 기준**:
- [ ] 8개 기본 카테고리 생성
- [ ] 카테고리 추가/삭제 기능
- [ ] 책 추가/편집 시 카테고리 선택 가능

---

## Sprint 5: 통계 대시보드 고도화 & 폴리시 마무리 (1주)

**목표**: 통계 기능 고도화, 전체 폴리시 구현, v1.0 릴리스 준비

### 5-1. 고급 통계 페이지

**화면**: `/statistics`

**기능**:
- 월별 완독 권수 (막대 차트)
- 장르별 분포 (원형 차트)
- 평균 별점 (게이지)
- 총 인용 개수
- 읽기 속도 분석 (page/day)

**완료 기준**:
- [ ] 모든 통계 차트 렌더링
- [ ] 데이터 계산 정확성 테스트

### 5-2. 읽기 기록 페이지 (선택사항)

**화면**: `/books/[id]/history`

**기능**:
- 진도 변경 이력 (날짜별)
- 읽기 속도 계산
- 예상 완료 날짜

**완료 기준**:
- [ ] 읽기 기록 렌더링
- [ ] 읽기 속도 계산

### 5-3. 통합 테스트 & 성능 최적화

- 모든 API 엔드포인트 통합 테스트
- 성능 테스트 (책 1000권 기준 응답 시간)
- 번들 크기 측정 (목표 < 1MB)

**완료 기준**:
- [ ] 통합 테스트 커버리지 80% 이상
- [ ] 번들 크기 < 1MB
- [ ] 성능 지표 통과 (LCP < 2.5s, CLS < 0.1)

### 5-4. 사용자 경험 폴리시

**구현**:
- 다크 모드 지원 (next-themes)
- 폼 자동 저장 (로컬 스토리지 백업)
- 키보드 단축키 (Ctrl+K 검색, Ctrl+N 책 추가)
- 접근성 (WCAG 2.1 AA)

**완료 기준**:
- [ ] 다크 모드 구현 & 테스트
- [ ] 키보드 네비게이션 동작
- [ ] 색상 대비 확인 (WebAIM)

### 5-5. 배포 준비

- README.md 작성
- 환경 변수 (.env.example)
- GitHub Pages 또는 Vercel 배포
- 버전 태깅 (v1.0)

**완료 기준**:
- [ ] README.md 완성
- [ ] .env.example 작성
- [ ] 배포 테스트 완료
- [ ] 모든 MUST-HAVE 기능 검증 완료

---

## 기술 주의사항

### 1. Next.js 16 await params
Next.js 16에서 동적 라우트의 params는 Promise입니다.
```typescript
// ✅ 올바른 사용
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>{id}</div>;
}
```

### 2. Drizzle Integer Timestamp 패턴
SQLite에 타임스탐프를 정수(milliseconds)로 저장합니다.
```typescript
createdAt: integer('created_at', { mode: 'timestamp' })
  .default(sql`(cast(unixepoch() * 1000 as integer))`)
  .notNull(),
```

### 3. BetterSQLite3Database<typeof schema> 제네릭
데이터베이스 타입 안전성 확보:
```typescript
export const db = drizzle(sqlite, { schema });
export type DbType = typeof db;
```

### 4. sql<number> 캐스팅
COUNT, SUM 등 숫자 반환 쿼리:
```typescript
const result = await db
  .select({ count: sql<number>`COUNT(*)` })
  .from(books);
```

### 5. Tailwind v4 Zero-Configuration
Tailwind v4는 설정 파일이 필요하지 않습니다. CSS 파일에만 `@import 'tailwindcss';` 추가.

### 6. shadcn/ui 컴포넌트 추가
필요한 컴포넌트를 CLI로 추가:
```bash
npx shadcn-ui@latest add button input card dialog
```

---

## 성공 기준 체크리스트

### 개발 완료 기준
- [ ] Sprint 0~5 모든 작업 완료
- [ ] 모든 MUST-HAVE 기능 구현
- [ ] 80% 이상 테스트 커버리지
- [ ] 코드 리뷰 완료 (0 Critical/High 이슈)

### 품질 기준
- [ ] 번들 크기 < 1MB
- [ ] LCP < 2.5s, CLS < 0.1
- [ ] 모바일 + 데스크톱 반응형 확인
- [ ] 한국어 UI 텍스트 검수 완료

### 배포 준비
- [ ] README.md 완성
- [ ] .env.example 작성
- [ ] CI/CD 파이프라인 (GitHub Actions 등)
- [ ] 버전 태깅 (v1.0)

---

## 리스크 및 완화 전략

| 리스크 | 영향도 | 완화 전략 |
|--------|--------|---------|
| SQLite 성능 (책 5000권 이상) | 중간 | 인덱싱 최적화, FTS 사용 |
| 검색 응답 시간 지연 | 중간 | 쿼리 최적화, 캐싱 추가 |
| 모바일 UI 반응성 | 중간 | 조기 모바일 테스트, Lighthouse 모니터링 |
| 타임존 처리 | 낮음 | UTC 기준 저장, 로컬 변환 |

---

## 참고 자료

- [Next.js 16 마이그레이션 가이드](https://nextjs.org/)
- [Drizzle ORM SQLite 문서](https://orm.drizzle.team/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui 문서](https://ui.shadcn.com/)
