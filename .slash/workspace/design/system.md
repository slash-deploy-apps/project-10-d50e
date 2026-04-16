# Design System: PowerPlaza

## Brand & Philosophy

**Who is this human?**
B2B 구매 담당 엔지니어와 구매관리자. DC-DC/AC-DC 컨버터, EV 부품을 산업 제품에 탑재하기 위해 찾는 전문가. 스펙, 인증, 신뢰성이 최우선.

**What must they accomplish?**
- 적합한 전원 변환 제품을 빠르게 찾고 비교
- 시리즈/모델별 상세 스펙 확인
- 견적 문의 제출 (회원가입 없이)
- 관리자는 제품 CRUD, 문의 관리, 대시보드 확인

**What should this feel like?**
정밀한 엔지니어링 카탈로그. 신뢰감 있고 전문적이며 데이터 중심. 화려함보다는 정확함. 한국 산업용 기기의 깔끔하고 효율적인 미학.

## Craft Decisions

- **Direction:** Trust & Authority — 산업용 전원 공급 장치의 전문성과 신뢰성
- **Signature:** 스펙 테이블 + 인증 배지 벽(CE/UL/RoHS/CB). 제품 상세의 데이터 밀도가 곧 브랜드
- **Depth:** 미묘한 레이어링. 카드는 살짝 떠 있는 느낌(shadow-sm), 테이블은 평면, 입력 필드는 inset
- **Spacing:** 8px 그리드. 카테고리 카드 간격 24px, 섹션 간격 48px. 밀도 높은 스펙 테이블은 row 간격 4px
- **Typography:**
  - UI / Body: Geist Sans (기존 프로젝트 폰트 유지)
  - Accents / Data / Logo: Geist Mono (모델명, 스펙 값에 가독성 높은 모노폰트)
- **Color Temperature:**
  - Primary accents: Deep Navy (#0F172A) — 산업용 신뢰성
  - CTA / Energy: Steel Blue (#0369A1) — 전기/회로 기판 느낌
  - Subdued elements: Slate (#334155) — 은은한 메탈릭
  - Success/Compliance: Emerald (#059669) — 효율/인증 통과
  - Warning/Power: Amber (#D97706) — 전력/에너지

## Color Palette (shadcn CSS variables)

*Light Theme:*

```css
:root {
  --background: 210 20% 98%;       /* #F8FAFC - cool white */
  --foreground: 222 47% 11%;       /* #0F172A - deep navy */
  --card: 0 0% 100%;              /* #FFFFFF */
  --card-foreground: 222 47% 11%;  /* #0F172A */
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
  --primary: 222 47% 11%;          /* #0F172A - navy */
  --primary-foreground: 210 40% 98%; /* #F0F9FF */
  --secondary: 215 19% 35%;       /* #334155 - slate */
  --secondary-foreground: 210 40% 98%;
  --muted: 210 40% 96%;           /* #EFF3F8 */
  --muted-foreground: 215 16% 47%; /* #64748B */
  --accent: 199 89% 33%;          /* #0369A1 - steel blue */
  --accent-foreground: 210 40% 98%;
  --destructive: 0 84% 60%;       /* #DC2626 */
  --destructive-foreground: 210 40% 98%;
  --border: 214 32% 91%;          /* #E2E8F0 */
  --input: 214 32% 91%;
  --ring: 199 89% 33%;            /* steel blue focus ring */
}
```

*Dark Theme:*

```css
.dark {
  --background: 222 47% 8%;       /* #0C1222 - deep navy bg */
  --foreground: 210 40% 98%;     /* #F0F9FF */
  --card: 222 47% 12%;           /* #1A2332 */
  --card-foreground: 210 40% 98%;
  --popover: 222 47% 12%;
  --popover-foreground: 210 40% 98%;
  --primary: 199 89% 48%;        /* #0EA5E9 - brighter steel blue */
  --primary-foreground: 222 47% 8%;
  --secondary: 215 19% 25%;
  --secondary-foreground: 210 40% 98%;
  --muted: 222 47% 16%;
  --muted-foreground: 215 16% 57%;
  --accent: 199 89% 48%;
  --accent-foreground: 222 47% 8%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --border: 215 19% 22%;
  --input: 215 19% 22%;
  --ring: 199 89% 48%;
}
```

## Shared Components

### Navbar (SiteHeader)
- **Layout:** Sticky top, full-width, backdrop-blur-sm
- **Style:** bg-background/80 border-b, h-16
- **Left:** PowerPlaza 로고 (텍스트 POWERPLAZA + 볼커파워)
- **Right:**
  - Nav Links: 제품 (드롭다운: DC-DC / AC-DC / EV부품), 견적문의
  - Language Switcher: KO | EN 토글
  - Theme Toggle: 다크모드 지원
  - Admin 링크 (작은 텍스트, 관리자용)
- **Mobile:** Hamburger → Sheet 사이드바

### Footer (SiteFooter)
- **Layout:** 4컬럼 그리드 (모바일은 스택)
- **Left:** 회사명, 주소, 연락처
- **Columns:** 제품 카테고리 링크 | 고객 지원 | 회사 소개
- **Bottom:** Copyright + 다국어 선택

### Language Switcher
- **Style:** Ghost button, KO | EN 텍스트, 활성 언어는 underline
- **Interaction:** 클릭 시 URL prefix 변경 (/ko → /en)

### Theme Toggle
- **Style:** Ghost button, Sun/Moon 아이콘 (Lucide)
- **Interaction:** Toggle light/dark, prefers-color-scheme 존중

## Page Specifications

### 1. Home / Landing Page (`/[locale]/`)

- **Layout:** Full-width hero → category cards → featured products → CTA
- **Aesthetic:** 전문적, 신뢰감. 큰 타이포그래피, 여백, 데이터 중심
- **Elements:**
  - **Hero Section:**
    - 배경: 그라데이션 (navy → steel blue, 억제된)
    - Headline: 신뢰성을 전원으로 (한국어) / Powering Reliability (영어)
    - Subheadline: 1993년부터 한국의 전력 변환 기술 선도
    - CTA: 제품 둘러보기 (primary) + 견적 문의 (secondary outline)
  - **Category Grid:** 3개 카드 (DC-DC / AC-DC / EV Component)
    - 각 카드: 이미지 + 이름 + 설명 + 제품 수 + 바로가기
    - Hover: 살짝 위로 lift + border-accent
  - **Featured Products:** 시리즈별 대표 모델 6-8개 카드
  - **Trust Section:** 인증마크(CE/UL/RoHS/CB), 연혁, 회사 소개 요약

### 2. Product List Page (`/[locale]/products/[categorySlug]`)

- **Layout:** Breadcrumb → Category header → Series cards → Product table
- **Elements:**
  - Category hero: 이름 + 설명 + 대표 이미지
  - Series cards: 2x3 그리드, 각 시리즈 카드 (이름, 설명, 제품 수, 바로가기)
  - 직접 product table 표시 옵션 (시리즈 선택 시)

### 3. Product Series Page (`/[locale]/products/[categorySlug]/[seriesSlug]`)

- **Layout:** Breadcrumb → Series header → Product table
- **Elements:**
  - Series header: 이름 + 설명 + 특징 배지 + 대표 이미지
  - Product table: 모델명, 입력전압, 출력전압, 출력전류, 출력타입, 가격, 인증, 데이터시트
  - Row 클릭 → 상세 페이지
  - 모바일: overflow-x-auto + 카드 뷰 토글

### 4. Product Detail Page (`/[locale]/products/[categorySlug]/[seriesSlug]/[productSlug]`)

- **Layout:** Breadcrumb → 2-column (image + specs) → Certifications → CTA
- **Elements:**
  - Left: 제품 이미지 (큰 사이즈, 데이터시트 다운로드 버튼 오버레이)
  - Right:
    - 모델명 (h1, font-mono)
    - 시리즈 정보 (링크)
    - 핵심 스펙 테이블: 입력전압, 출력전압, 출력전류, 출력타입
    - 가격 (큰 타이포, priceNote 표시)
  - Certification badges: CE / UL / RoHS / CB / EMC 등 SVG 배지
  - CTA: 견적 문의하기 (accent 버튼, /quote 페이지로 이동 + 제품 pre-select)

### 5. Quote Inquiry Page (`/[locale]/quote`)

- **Layout:** 2-column (product selector + customer info)
- **Elements:**
  - Left: 선택된 제품 목록
    - 제품 추가: 검색/드롭다운으로 제품 선택
    - 각 제품: 모델명, 수량 input(-/+/숫자), 삭제 버튼
  - Right: 고객 정보 폼
    - 이름, 회사명, 이메일, 연락처, 문의 내용(textarea)
    - 제출 버튼 (accent)
  - 성공 시: 확인 메시지 + 문의 번호

### 6. Admin Login (`/admin/login`)

- **Layout:** Centered card, dark bg
- **Card:** 이메일 + 비밀번호 필드, 로그인 버튼
- **Width:** max-w-sm
- **Visual:** Clean, minimal. Logo 상단.

### 7. Admin Dashboard (`/admin`)

- **Layout:** Sidebar + main content
- **Grid:** 4개 KPI 카드 (총 제품, 총 문의, 대기 문의, 금주 문의)
- **Cards:**
  - KPI: 큰 숫자 + 라벨 + 아이콘
  - 최근 문의: 테이블 5줄
  - 문의 상태별: 4개 상태 원형 차트
- **Interaction:** KPI 카드 hover lift

### 8. Admin Products (`/admin/products`)

- **Layout:** Search bar + filter + table + form dialog
- **Table:** 모델명, 시리즈, 카테고리, 가격, 상태, 액션
- **Form Dialog:** 모델명, 시리즈 셀렉트, 스펙 필드, 이미지 URL, 가격, 인증 체크박스, 데이터시트 URL
- **Actions:** Edit (dialog), Delete (confirm)

### 9. Admin Categories (`/admin/categories`)

- **Layout:** Category list + Series list per category
- **CRUD:** 카테고리/시리즈 추가/수정/삭제 폼 (이름 ko/en, 설명, 슬러그, 이미지, 정렬)

### 10. Admin Inquiries (`/admin/inquiries`)

- **Layout:** Status filter tabs + table + detail dialog
- **Table:** 문의번호, 고객명, 회사, 날짜, 상태 배지, 액션
- **Detail:** 전체 고객 정보 + 제품 목록(모델명/수량/메모) + 상태 변경 + 관리자 메모

### 11. Admin Settings (`/admin/settings`)

- **Layout:** Simple form
- **Fields:** 알림 이메일, 회사 정보(이름, 주소, 연락처)

## Interaction & State Patterns

- **Hover:** 카드/행 살짝 위로 (translate-y-[-1px]) + shadow 증가, 200ms ease-out
- **Focus:** ring-2 ring-accent (steel blue), outline-none
- **Loading:** Skeleton 컴포넌트 (shadcn), 테이블 행 skeleton
- **Empty/Error States:** Empty 컴포넌트 (아이콘 + 메시지 + CTA)
- **Table mobile:** overflow-x-auto wrapper, 최소 640px 너비 보장
- **Status badges:** pending=amber, reviewed=blue, replied=green, closed=gray

## Certification Badge System

인증 배지는 제품의 신뢰성 핵심 지표. 모든 제품 상세에 표시:
- CE: 전기 안전 (유럽)
- UL: 안전 인증 (미국)
- CB: IECEE 상호인정
- RoHS: 친환경
- EMC: 전자파 적합성
- TUV: 독일 안전 인증
각 배지: 24x24 SVG + 라벨, gray-400 디폴트, 획득 시 primary 컬러

## Anti-patterns (절대 피할 것)

1. 장난감 같은 Claymorphism / 둥근 3D 느낌
2. AI 보라/분홍 그라데이션
3. 스펙을 숨기는 과도한 여백 (데이터 밀도가 곧 가치)
4. 인증/신뢰 요소를 숨기는 디자인
5. 장난스러운 애니메이션