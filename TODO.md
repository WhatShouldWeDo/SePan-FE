# Democrasee — 프로젝트 Todo

> Claude가 이 파일을 읽고 업데이트합니다.
> 완료된 항목은 `[x]`로 표시합니다.

---

## 1. MVP 범위 (전체 스코프)

### 1-1. 프로젝트 셋업
- [ ] Vite + React + TypeScript 프로젝트 초기화
- [ ] pnpm 패키지 매니저 설정
- [ ] Tailwind CSS 설정
- [ ] shadcn/ui 설정 및 커스텀 테마 적용
- [ ] React Router v6 설정
- [ ] React Query v5 설정
- [ ] react-hook-form + zod 설정
- [ ] 기본 폴더 구조 생성

### 1-2. 인증 (Auth)
- [ ] AuthLayout 컴포넌트
- [ ] 로그인 페이지 UI
- [ ] 로그인 폼 검증 (react-hook-form + zod)
- [ ] 회원가입 Step 1: 기본 정보 (아이디, 비밀번호, 이름)
- [ ] 회원가입 Step 2: 휴대폰 인증
- [ ] 회원가입 Step 3: 승인코드 입력
- [ ] 회원가입 Step 4: 역할/지역/추가정보
- [ ] SignupStepper (진행률 표시)
- [ ] 인증 상태 관리 (useAuth 훅)
- [ ] ProtectedRoute 컴포넌트
- [ ] 로그인 성공 후 대시보드 리다이렉트

### 1-3. 공통 레이아웃 & 네비게이션
- [ ] RootLayout (사이드바 + 헤더 + 콘텐츠)
- [ ] Sidebar 컴포넌트 (GNB)
- [ ] Header 컴포넌트 (로고, 프로필/로그아웃)
- [ ] Breadcrumb 컴포넌트
- [ ] 모바일 반응형 (햄버거 메뉴)

### 1-4. 대시보드 홈
- [ ] DashboardPage 레이아웃
- [ ] ScheduleBanner (오늘의 일정)
- [ ] DdayBadge (선거일 D-day)
- [ ] RegionSummaryCard (지역분석 요약)
- [ ] PolicySummaryCard (정책개발 요약)
- [ ] QuickMenu (바로가기 링크)
- [ ] Empty State 처리

### 1-5. 지역분석
- [ ] RegionPage (메인 - 지역/지표 선택)
- [ ] RegionResultPage (결과)
- [ ] RegionSelector 컴포넌트
- [ ] IndicatorCategoryTabs (인구, 민원, 예산 등)
- [ ] CurrentStatusSection (현재값, 전년 대비, 전국 평균)
- [ ] TrendChart (Recharts 연도별 추이)
- [ ] AdjacentComparisonSection (인접 지역 비교 테이블 + 바 차트)
- [ ] AiInsightSection (목업)
- [ ] MapView 추상화 인터페이스 (목업)
- [ ] 상세 리포트 CTA (비활성 버튼)

### 1-6. 정책개발
- [ ] PolicyPage (탭 레이아웃)
- [ ] PolicyTabs 컴포넌트
- [ ] OverviewTab (개요 - 카테고리별 현황, CTA)
- [ ] HistoryTab (역대공약분석 - 필터, 리스트, 통계)
- [ ] ConfirmedTab (확정공약 - 리스트, CRUD)
- [ ] AiRecommendTab (AI 추천 - 목업)
- [ ] PolicyCard 컴포넌트
- [ ] PolicyFilters 컴포넌트
- [ ] PolicyFormPage (새 공약 작성/수정)
- [ ] PolicyForm (react-hook-form + zod)

### 1-7. 공통 UI 컴포넌트 (shadcn/ui 기반)
- [ ] Button
- [ ] Input
- [ ] Card
- [ ] Tabs
- [ ] Select
- [ ] Modal (Dialog)
- [ ] Skeleton
- [ ] Spinner
- [ ] Badge

---

## 2. 이번 스프린트: Phase 1 (프로젝트 셋업 & 인증)

> 목표: 프로젝트 기본 구조 완성 + 로그인/회원가입 플로우 구현

### 셋업
- [ ] Vite + React + TypeScript 프로젝트 생성
- [ ] pnpm 설정 확인
- [ ] Tailwind CSS 설치 및 설정
- [ ] shadcn/ui 초기화 및 테마 커스터마이징
- [ ] React Router v6 설치 및 router.tsx 작성
- [ ] React Query v5 설치 및 Provider 설정
- [ ] react-hook-form + zod 설치
- [ ] 폴더 구조 생성 (app, features, components, hooks, lib, types)
- [ ] API 클라이언트 기본 구조 (lib/api/client.ts)
- [ ] 유틸리티 함수 (lib/utils/cn.ts)

### 레이아웃
- [ ] AuthLayout 컴포넌트 (중앙 정렬 폼)
- [ ] RootLayout 컴포넌트 (사이드바 + 헤더)
- [ ] Sidebar 컴포넌트 (네비게이션 메뉴)
- [ ] Header 컴포넌트
- [ ] ProtectedRoute 컴포넌트

### 인증 기능
- [ ] LoginPage UI
- [ ] LoginForm 컴포넌트 (react-hook-form + zod)
- [ ] SignupPage UI
- [ ] SignupStepper 컴포넌트 (Step indicator)
- [ ] SignupStep1 (기본 정보)
- [ ] SignupStep2 (휴대폰 인증)
- [ ] SignupStep3 (승인코드)
- [ ] SignupStep4 (역할/지역)
- [ ] useAuth 훅 (로그인 상태 관리)
- [ ] 인증 관련 타입 정의 (features/auth/types.ts)

### 라우팅 연결
- [ ] /login → LoginPage
- [ ] /signup → SignupPage
- [ ] / → DashboardPage (placeholder)
- [ ] 404 → NotFoundPage

---

## 3. 일별 할 일

### Day 1: 프로젝트 초기화 & 기본 설정
- [ ] `pnpm create vite@latest democrasee --template react-ts`
- [ ] Tailwind CSS 설치 (`pnpm add -D tailwindcss postcss autoprefixer`)
- [ ] tailwind.config.js 설정
- [ ] globals.css에 Tailwind directives 추가
- [ ] shadcn/ui 초기화 (`pnpm dlx shadcn-ui@latest init`)
- [ ] 커스텀 테마 색상/폰트 설정
- [ ] 폴더 구조 생성 (빈 폴더 + index.ts)
- [ ] ESLint/Prettier 설정 확인

### Day 2: 라우팅 & 레이아웃
- [ ] react-router-dom 설치
- [ ] router.tsx 작성 (전체 라우트 구조)
- [ ] App.tsx에 RouterProvider 연결
- [ ] AuthLayout 컴포넌트 구현
- [ ] RootLayout 컴포넌트 구현 (기본 구조)
- [ ] Sidebar 컴포넌트 구현
- [ ] Header 컴포넌트 구현
- [ ] NotFoundPage 구현

### Day 3: 공통 UI & 유틸리티
- [ ] shadcn/ui 컴포넌트 추가 (Button, Input, Card)
- [ ] lib/utils/cn.ts (clsx + tailwind-merge)
- [ ] React Query 설치 및 Provider 설정
- [ ] react-hook-form + zod 설치
- [ ] lib/api/client.ts 기본 구조
- [ ] types/common.ts, types/api.ts 기본 타입

### Day 4: 로그인 구현
- [ ] LoginPage 레이아웃
- [ ] LoginForm 컴포넌트
- [ ] 로그인 스키마 (zod)
- [ ] 로그인 폼 UI (아이디, 비밀번호, 버튼)
- [ ] 에러 메시지 표시
- [ ] 로딩 상태 (버튼 스피너)
- [ ] useAuth 훅 기본 구조
- [ ] Mock 로그인 처리 (API 연동 전)

### Day 5: 회원가입 Step 1-2
- [ ] SignupPage 레이아웃
- [ ] SignupStepper 컴포넌트 (1/4, 2/4... 표시)
- [ ] SignupStep1 (기본 정보 폼)
- [ ] Step1 스키마 (zod: 아이디, 비밀번호, 비밀번호 확인, 이름)
- [ ] SignupStep2 (휴대폰 인증 폼)
- [ ] Step2 스키마 (zod: 휴대폰 번호, 인증번호)
- [ ] Step 간 상태 유지 (useState or useReducer)

### Day 6: 회원가입 Step 3-4 & 완료
- [ ] SignupStep3 (승인코드 입력)
- [ ] Step3 스키마 (zod)
- [ ] SignupStep4 (역할/지역 선택)
- [ ] Step4 스키마 (zod)
- [ ] 역할 선택 UI (후보자, 사무장, 회계책임자, 사무원)
- [ ] 지역 선택 UI (시도 → 시군구 → 행정동 cascading)
- [ ] 가입 완료 → 환영 메시지 → 대시보드 리다이렉트
- [ ] ProtectedRoute 구현

### Day 7: 통합 테스트 & 정리
- [ ] 전체 플로우 테스트 (로그인 → 대시보드)
- [ ] 전체 플로우 테스트 (회원가입 Step 1~4 → 대시보드)
- [ ] 인증 상태 유지 확인 (새로고침)
- [ ] 반응형 확인 (데스크톱/태블릿/모바일)
- [ ] 코드 정리 및 리팩토링
- [ ] Phase 1 완료 커밋

---

## 결정 사항 & 메모

| 날짜 | 내용 |
|------|------|
| 2026-02-08 | 스타일: Tailwind CSS 확정 |
| 2026-02-08 | 상태관리: useState > React Query > Zustand 우선순위 |
| 2026-02-08 | 소셜 로그인 미도입 확정 |
| 2026-02-09 | 패키지 매니저: pnpm 확정 |
| 2026-02-09 | 차트: Recharts 확정 |
| 2026-02-09 | 폼 검증: react-hook-form + zod 확정 |
| 2026-02-09 | UI 컴포넌트: shadcn/ui 도입 확정 (완전 커스터마이즈 가능) |

---

## 미해결 질문

- [ ] 인증 방식: JWT vs 세션? (백엔드 협의 필요)
- [ ] 지도 라이브러리: 네이버 지도 vs 카카오 맵 vs Mapbox? (Phase 3에서 결정)
- [ ] 승인코드 발급 프로세스: 관리자 대시보드 필요 여부?

---

## 이번 턴에서 완료한 작업

- [x] 디렉토리 구조 및 라우팅 설계 Plan 작성
- [x] 기술 스택 확정 (pnpm, Recharts, react-hook-form+zod, shadcn/ui)
- [x] TODO.md 구조 개편 (MVP 범위 / 스프린트 / 일별 할 일)
