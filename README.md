# 📚 BookMark - 책 읽기 추적 & 핵심 정리

독서 여정을 기록하고 핵심 인용을 정리하는 개인 도서 관리 웹앱입니다. 읽은 책, 진도, 인용문, 개인 의견을 한곳에서 통합 관리하세요.

## 🎯 주요 기능

### 필수 기능 (Must-Have)
- ✅ **책 추가 & 관리** - 제목, 저자, ISBN, 카테고리 정보 입력
- ✅ **읽는 진도 추적** - 현재 페이지/진도율 기록 및 시각화
- ✅ **핵심 인용 저장** - 책당 최대 5개 인용문 저장
- ✅ **개인 의견 메모** - 각 인용에 개인 해석 작성
- ✅ **별점 평가** - 1-5 별점으로 책 평가
- ✅ **태그 분류** - 주제별 태그로 책 분류
- ✅ **대시보드** - 월별 독서량 및 통계 한눈에 보기
- ✅ **데이터 내보내기** - CSV 형식으로 모든 데이터 다운로드
- ✅ **빈 상태 처리** - 친화적 가이드 메시지

## 🛠️ 기술 스택

| 범주 | 기술 |
|------|------|
| **프레임워크** | Next.js 16 |
| **언어** | TypeScript 6.0 |
| **스타일링** | Tailwind CSS v4 |
| **데이터베이스** | SQLite + better-sqlite3 |
| **ORM** | Drizzle ORM 0.45 |
| **상태 관리** | React Hooks |
| **UI 컴포넌트** | shadcn/ui (CSS 기반) |
| **아이콘** | Lucide React |

## 📋 설치 및 실행

### 필수 요구사항
- Node.js 18.0+
- npm 또는 yarn

### 설치 방법

```bash
# 1. 저장소 클론
git clone https://github.com/hongmacho/reading-list-tracker.git
cd reading-list-tracker

# 2. 의존성 설치
npm install

# 3. 데이터베이스 초기화 (첫 실행시)
npx drizzle-kit push

# 4. 개발 서버 시작
npm run dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📖 사용 방법

### 1️⃣ 책 추가하기
- 대시보드 또는 서재에서 "책 추가" 버튼 클릭
- 제목, 저자, ISBN(선택), 카테고리 입력
- 저장하면 서재에 추가됨

### 2️⃣ 읽기 진도 추가하기
- 책 상세 페이지에서 "현재 페이지" 입력
- "진도 업데이트" 버튼 클릭
- 진도율이 자동으로 계산됨

### 3️⃣ 인용 저장하기
- 책 상세 페이지의 "인용 추가" 섹션에서 인용문 입력
- 페이지 번호 입력 (선택)
- "인용 추가" 버튼으로 저장 (최대 5개)

### 4️⃣ 데이터 내보내기
- 설정 페이지에서 "CSV로 내보내기" 클릭
- 모든 책 정보가 CSV 형식으로 다운로드됨

## 🗂️ 프로젝트 구조

```
reading-list-tracker/
├── app/                              # Next.js 앱 라우터
│   ├── api/                         # API 라우트
│   │   ├── books/                   # 책 API
│   │   ├── quotes/                  # 인용 API
│   │   ├── categories/              # 카테고리 API
│   │   └── export/                  # 데이터 내보내기
│   ├── dashboard/                   # 대시보드 페이지
│   ├── library/                     # 서재/책 목록 페이지
│   ├── books/                       # 책 관련 페이지
│   │   ├── add/                     # 책 추가 페이지
│   │   └── [id]/                    # 책 상세 페이지
│   ├── settings/                    # 설정 페이지
│   ├── statistics/                  # 통계 페이지
│   ├── layout.tsx                   # 루트 레이아웃
│   ├── page.tsx                     # 홈 페이지
│   └── globals.css                  # 전역 스타일
├── src/
│   ├── db/                          # 데이터베이스
│   │   ├── schema.ts                # Drizzle 스키마
│   │   └── index.ts                 # DB 인스턴스
│   ├── repositories/                # 데이터 접근 계층
│   │   ├── book.repository.ts       # 책 리포지토리
│   │   ├── quote.repository.ts      # 인용 리포지토리
│   │   ├── category.repository.ts   # 카테고리 리포지토리
│   │   └── note.repository.ts       # 메모 리포지토리
│   └── scripts/                     # 초기화 스크립트
├── components/
│   └── Navigation.tsx               # 네비게이션 컴포넌트
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
└── drizzle.config.ts
```

## 🗄️ 데이터베이스 스키마

### books 테이블
```sql
- id: 고유 ID
- title: 책 제목 (필수)
- author: 저자
- isbn: ISBN-13
- categoryId: 카테고리 (FK)
- status: 상태 (not_started, reading, completed)
- currentPage: 현재 페이지
- totalPages: 총 페이지
- rating: 별점 (1-5)
- coverImageUrl: 표지 이미지
- completedDate: 완료 날짜
- createdAt: 생성일
- updatedAt: 수정일
```

### quotes 테이블
```sql
- id: 고유 ID
- bookId: 책 ID (FK)
- text: 인용문 (필수)
- pageNumber: 페이지 번호
- tags: 태그 (쉼표로 구분)
- createdAt: 생성일
```

### notes 테이블
```sql
- id: 고유 ID
- quoteId: 인용 ID (FK)
- content: 메모 내용 (마크다운)
- createdAt: 생성일
- updatedAt: 수정일
```

### categories 테이블
```sql
기본 카테고리 8개:
1. 소설 (📖)
2. 비소설 (📚)
3. 개발/IT (💻)
4. 자기계발 (🚀)
5. 비즈니스 (💼)
6. 역사/인문 (🏛️)
7. 과학 (🔬)
8. 기타 (📕)
```

## 🎨 화면 구성

| 화면 | URL | 기능 |
|------|-----|------|
| 대시보드 | `/dashboard` | 독서 통계 및 현황 |
| 서재/책 목록 | `/library` | 모든 책 조회 및 검색 |
| 책 추가 | `/books/add` | 새 책 정보 입력 |
| 책 상세 | `/books/[id]` | 진도 추적, 인용 관리 |
| 통계 | `/statistics` | 상세 분석 (예정) |
| 설정 | `/settings` | 카테고리 관리, 데이터 내보내기 |

## 🧪 개발 커맨드

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start

# TypeScript 타입 체크
npm run type-check

# ESLint 린트
npm run lint

# 데이터베이스 마이그레이션 생성
npm run db:generate

# 데이터베이스 변경사항 반영
npm run db:push

# Drizzle Studio (DB 브라우저)
npm run db:studio
```

## 📊 성능 목표

- ✅ 번들 크기: < 1MB (Core)
- ✅ LCP (Largest Contentful Paint): < 2.5s
- ✅ CLS (Cumulative Layout Shift): < 0.1
- ✅ 검색 응답 시간: < 200ms (SQLite FTS 최적화)

## 🔐 보안

- 로컬 SQLite 데이터베이스 (클라우드 불필요)
- 모든 사용자 입력 유효성 검사
- TypeScript 타입 안전성
- CSRF 보호 (Next.js 기본)

## 🌐 브라우저 지원

- Chrome/Edge 최신 버전
- Safari 최신 버전
- Firefox 최신 버전
- 모바일 (iOS Safari, Chrome Mobile)

## 📱 반응형 디자인

- **모바일** (320px ~): 단일 칼럼, 터치 최적화
- **태블릿** (768px ~): 투 칼럼 레이아웃
- **데스크톱** (1024px ~): 풀 3-4 칼럼 그리드

## 🗺️ 향후 계획 (v1.1~v2.0)

### v1.1 (1개월 후)
- 복습 큐 & 알림
- 읽기 기록 상세 분석
- 다크 모드 지원

### v2.0 (3개월 후)
- AI 기반 자동 요약
- 친구 추천 (통계 기반)
- 공개 독서 프로필
- 인용 SNS 공유

## 📄 라이센스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 👨‍💻 개발자

BookMark는 개인 독서 프로젝트로 시작되었습니다.

---

**📧 문의 및 피드백**: GitHub Issues를 통해 버그 리포트, 기능 제안을 받습니다.

**🎉 Happy Reading!** 📚✨
