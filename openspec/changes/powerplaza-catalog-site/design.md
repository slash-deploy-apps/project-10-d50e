# Design: PowerPlaza Product Catalog Site

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Next.js 15 App Router                      │
│  ├── (public)    - 고객용 페이지             │
│  │   ├── /[locale]/ - 메인                   │
│  │   ├── /[locale]/products - 제품 목록       │
│  │   ├── /[locale]/products/[slug] - 상세     │
│  │   └── /[locale]/quote - 견적 문의          │
│  └── (admin)     - 관리자 패널               │
│      ├── /admin/login                        │
│      ├── /admin/dashboard                    │
│      ├── /admin/products                     │
│      ├── /admin/categories                   │
│      ├── /admin/inquiries                    │
│      └── /admin/settings                     │
├─────────────────────────────────────────────┤
│  tRPC API Layer                              │
│  ├── product router                          │
│  ├── category router                         │
│  ├── inquiry router                          │
│  └── admin router                            │
├─────────────────────────────────────────────┤
│  Drizzle ORM + SQLite/Turso                  │
└─────────────────────────────────────────────┘
```

## Data Model

### categories

| Column        | Type                | Description         |
| ------------- | ------------------- | ------------------- |
| id            | text (cuid)         | PK                  |
| name          | text                | 카테고리명 (한국어) |
| nameEn        | text                | 카테고리명 (영어)   |
| slug          | text (unique)       | URL용 슬러그        |
| description   | text                | 설명 (한국어)       |
| descriptionEn | text                | 설명 (영어)         |
| imageUrl      | text                | 카테고리 이미지 URL |
| sortOrder     | integer             | 정렬 순서           |
| createdAt     | integer (timestamp) | 생성일              |
| updatedAt     | integer (timestamp) | 수정일              |

### productSeries

| Column        | Type                 | Description          |
| ------------- | -------------------- | -------------------- |
| id            | text (cuid)          | PK                   |
| categoryId    | text (FK→categories) | 소속 카테고리        |
| name          | text                 | 시리즈명             |
| slug          | text (unique)        | URL용 슬러그         |
| description   | text                 | 시리즈 설명 (한국어) |
| descriptionEn | text                 | 시리즈 설명 (영어)   |
| features      | text (JSON)          | 특징 목록            |
| featuresEn    | text (JSON)          | 특징 목록 (영어)     |
| imageUrl      | text                 | 대표 이미지          |
| sortOrder     | integer              | 정렬 순서            |
| createdAt     | integer (timestamp)  |                      |
| updatedAt     | integer (timestamp)  |                      |

### products

| Column         | Type                    | Description                            |
| -------------- | ----------------------- | -------------------------------------- |
| id             | text (cuid)             | PK                                     |
| seriesId       | text (FK→productSeries) | 소속 시리즈                            |
| modelName      | text                    | 모델명 (예: SPS20-48-5)                |
| slug           | text (unique)           | URL용 슬러그                           |
| imageUrl       | text                    | 제품 이미지 URL                        |
| inputVoltage   | text                    | 입력 전압                              |
| outputVoltage  | text                    | 출력 전압                              |
| outputCurrent  | text                    | 출력 전류                              |
| outputType     | text                    | single/dual/triple/other               |
| price          | integer                 | 가격 (원)                              |
| priceNote      | text                    | 가격 비고 (일반/조건/문의)             |
| datasheetUrl   | text                    | 데이터시트 PDF URL                     |
| certifications | text (JSON)             | 인증마크 배열 ["ce","rohs","cb","emc"] |
| status         | text                    | active/inactive                        |
| specs          | text (JSON)             | 추가 스펙 정보 (key-value)             |
| specsEn        | text (JSON)             | 추가 스펙 정보 (영어)                  |
| createdAt      | integer (timestamp)     |                                        |
| updatedAt      | integer (timestamp)     |                                        |

### quoteInquiries

| Column       | Type                | Description                     |
| ------------ | ------------------- | ------------------------------- |
| id           | text (cuid)         | PK                              |
| customerName | text                | 고객명                          |
| companyName  | text                | 회사명                          |
| email        | text                | 이메일                          |
| phone        | text                | 연락처                          |
| message      | text                | 문의 내용                       |
| status       | text                | pending/reviewed/replied/closed |
| adminNote    | text                | 관리자 메모                     |
| createdAt    | integer (timestamp) |                                 |
| updatedAt    | integer (timestamp) |                                 |

### quoteInquiryItems

| Column    | Type                     | Description |
| --------- | ------------------------ | ----------- |
| id        | text (cuid)              | PK          |
| inquiryId | text (FK→quoteInquiries) | 소속 문의   |
| productId | text (FK→products)       | 제품        |
| quantity  | integer                  | 수량        |
| note      | text                     | 제품별 메모 |

### adminSettings

| Column | Type | Description |
| ------ | ---- | ----------- |
| key    | text | PK, 설정키  |
| value  | text | 설정값      |

## i18n Strategy

- `next-intl` 라이브러리 사용
- URL prefix 방식: `/ko/...`, `/en/...`
- 기본 언어: 한국어 (`ko`)
- 제품 데이터는 DB에 한국어/영어 필드 분리 저장
- UI 텍스트는 JSON 메시지 파일로 관리 (`messages/ko.json`, `messages/en.json`)

## API Contracts (tRPC)

### Public Routers

- `category.list()` → 전체 카테고리 + 시리즈 목록
- `product.list({ categorySlug?, seriesSlug?, page, limit })` → 제품 목록 (페이지네이션)
- `product.getBySlug({ slug })` → 제품 상세
- `product.search({ query })` → 제품 검색
- `inquiry.create({ customerName, companyName, email, phone, message, items[] })` → 견적 문의 제출

### Admin Routers (protectedProcedure)

- `admin.dashboard()` → 대시보드 통계
- `admin.product.list/create/update/delete` → 제품 CRUD
- `admin.category.list/create/update/delete` → 카테고리 CRUD
- `admin.series.list/create/update/delete` → 시리즈 CRUD
- `admin.inquiry.list/get/updateStatus/addNote` → 문의 관리
- `admin.settings.get/set` → 설정 관리 (알림 이메일 등)

## Component Structure

### Public Pages

- `MainHero` - 메인 배너 (파워플라자 소개)
- `CategoryGrid` - 3대 카테고리 카드
- `ProductCard` - 제품 카드 (이미지, 모델명, 가격)
- `ProductTable` - 시리즈별 제품 테이블 뷰
- `ProductDetail` - 제품 상세 (이미지, 스펙 테이블, 인증마크)
- `QuoteForm` - 견적 문의 폼 (제품 선택 + 고객 정보)
- `LanguageSwitcher` - 한/영 전환 버튼
- `SiteHeader` - 상단 네비게이션
- `SiteFooter` - 하단 회사 정보

### Admin Pages

- `AdminSidebar` - 사이드 네비게이션
- `DashboardStats` - 대시보드 통계 카드
- `ProductForm` - 제품 추가/수정 폼
- `CategoryForm` - 카테고리 추가/수정 폼
- `InquiryList` - 문의 목록 테이블
- `InquiryDetail` - 문의 상세

## Email Notification

- 견적 문의 접수 시 관리자 이메일로 알림 발송
- `Resend` 또는 기본 SMTP 사용
- adminSettings 테이블에서 알림 이메일 주소 관리

## Error Handling

- tRPC 에러는 TRPCError로 통일
- 폼 유효성 검증: zod 스키마
- 404: 존재하지 않는 제품/카테고리
- 401: 어드민 미인증 접근

## Seed Data

파워프라자 사이트에서 수집한 제품 데이터를 seed 스크립트로 일괄 등록:

- 카테고리 3개: DC-DC Converter, AC-DC Converter, EV Component
- DC-DC 시리즈 21개, AC-DC 시리즈 8개, EV 부품 5개
- 각 시리즈별 대표 제품 2~5개 (최소 100개 이상 목표)
- 이미지는 powerplaza.net의 기존 URL 사용
