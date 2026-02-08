# Democrasee — 프로젝트 Todo

> Claude가 이 파일을 읽고 업데이트합니다.
> 완료된 항목은 `[x]`로 표시합니다.

---

## 1. MVP 범위 (전체 스코프)

### 1-1. 프로젝트 셋업
- [x] Vite + React + TypeScript 프로젝트 초기화
- [x] pnpm 패키지 매니저 설정
- [x] Tailwind CSS v4 설정
- [x] shadcn/ui 설정 및 커스텀 테마 적용
- [x] React Router v6 설정
- [x] React Query v5 설정
- [x] react-hook-form + zod 설정
- [x] 기본 폴더 구조 생성

### 1-2. 인증 (Auth)
- [x] AuthLayout 컴포넌트
- [x] 로그인 페이지 UI (placeholder)
- [x] 로그인 폼 검증 (react-hook-form + zod)
- [ ] 회원가입 Step 1: 기본 정보 (아이디, 비밀번호, 이름)
- [ ] 회원가입 Step 2: 휴대폰 인증
- [ ] 회원가입 Step 3: 승인코드 입력
- [ ] 회원가입 Step 4: 역할/지역/추가정보
- [ ] SignupStepper (진행률 표시)
- [x] 인증 상태 관리 (useAuth 훅) - 기본 구조
- [x] ProtectedRoute 컴포넌트
- [x] 로그인 성공 후 대시보드 리다이렉트

### 1-3. 공통 레이아웃 & 네비게이션
- [x] RootLayout (사이드바 + 헤더 + 콘텐츠)
- [x] Sidebar 컴포넌트 (GNB)
- [x] Header 컴포넌트 (로고, 프로필/로그아웃)
- [ ] Breadcrumb 컴포넌트
- [ ] 모바일 반응형 (햄버거 메뉴)

### 1-4. 대시보드 홈
- [x] DashboardPage 레이아웃 (placeholder)
- [ ] ScheduleBanner (오늘의 일정)
- [ ] DdayBadge (선거일 D-day)
- [ ] RegionSummaryCard (지역분석 요약)
- [ ] PolicySummaryCard (정책개발 요약)
- [ ] QuickMenu (바로가기 링크)
- [ ] Empty State 처리

### 1-5. 지역분석
- [x] RegionPage (메인 - placeholder)
- [x] RegionResultPage (결과 - placeholder)
- [ ] RegionSelector 컴포넌트
- [ ] IndicatorCategoryTabs (인구, 민원, 예산 등)
- [ ] CurrentStatusSection (현재값, 전년 대비, 전국 평균)
- [ ] TrendChart (Recharts 연도별 추이)
- [ ] AdjacentComparisonSection (인접 지역 비교 테이블 + 바 차트)
- [ ] AiInsightSection (목업)
- [ ] MapView 추상화 인터페이스 (목업)
- [ ] 상세 리포트 CTA (비활성 버튼)

### 1-6. 정책개발
- [x] PolicyPage (탭 레이아웃 - placeholder)
- [ ] PolicyTabs 컴포넌트
- [ ] OverviewTab (개요 - 카테고리별 현황, CTA)
- [ ] HistoryTab (역대공약분석 - 필터, 리스트, 통계)
- [ ] ConfirmedTab (확정공약 - 리스트, CRUD)
- [ ] AiRecommendTab (AI 추천 - 목업)
- [ ] PolicyCard 컴포넌트
- [ ] PolicyFilters 컴포넌트
- [x] PolicyFormPage (새 공약 작성/수정 - placeholder)
- [ ] PolicyForm (react-hook-form + zod)

### 1-7. 공통 UI 컴포넌트 (shadcn/ui 기반)
- [x] Button
- [x] Input
- [x] Card
- [ ] Tabs
- [ ] Select
- [ ] Modal (Dialog)
- [ ] Skeleton
- [x] Spinner
- [ ] Badge

---

## 2. 이번 스프린트: Phase 1 (프로젝트 셋업 & 인증)

> 목표: 프로젝트 기본 구조 완성 + 로그인/회원가입 플로우 구현

### 셋업
- [x] Vite + React + TypeScript 프로젝트 생성
- [x] pnpm 설정 확인
- [x] Tailwind CSS v4 설치 및 설정 (@tailwindcss/vite)
- [x] shadcn/ui 초기화 및 테마 커스터마이징
- [x] React Router v6 설치 및 router.tsx 작성
- [x] React Query v5 설치 및 Provider 설정
- [x] react-hook-form + zod 설치
- [x] 폴더 구조 생성 (app, features, components, hooks, lib, types)
- [x] API 클라이언트 기본 구조 (lib/api/client.ts)
- [x] 유틸리티 함수 (lib/utils.ts - shadcn 자동 생성)

### 레이아웃
- [x] AuthLayout 컴포넌트 (중앙 정렬 폼)
- [x] RootLayout 컴포넌트 (사이드바 + 헤더)
- [x] Sidebar 컴포넌트 (네비게이션 메뉴)
- [x] Header 컴포넌트
- [x] ProtectedRoute 컴포넌트

### 인증 기능
- [x] LoginPage UI (placeholder)
- [x] LoginForm 컴포넌트 (react-hook-form + zod)
- [x] SignupPage UI (placeholder)
- [ ] SignupStepper 컴포넌트 (Step indicator)
- [ ] SignupStep1 (기본 정보)
- [ ] SignupStep2 (휴대폰 인증)
- [ ] SignupStep3 (승인코드)
- [ ] SignupStep4 (역할/지역)
- [x] useAuth 훅 (로그인 상태 관리) - 기본 구조
- [ ] 인증 관련 타입 정의 (features/auth/types.ts)

### 라우팅 연결
- [x] /login → LoginPage
- [x] /signup → SignupPage
- [x] / → DashboardPage (placeholder)
- [x] 404 → NotFoundPage

---

## 3. 일별 할 일

### Day 1: 프로젝트 초기화 & 기본 설정 ✅
- [x] Vite + React + TypeScript 프로젝트 생성
- [x] Tailwind CSS v4 설치 (@tailwindcss/vite)
- [x] vite.config.ts에 Tailwind 플러그인 설정
- [x] src/index.css에 Tailwind import
- [x] shadcn/ui 초기화 (`pnpm dlx shadcn@latest init`)
- [x] 기본 테마 색상 설정 (shadcn 자동 생성)
- [x] 폴더 구조 생성 (app, features, components, hooks, lib, types)
- [x] TypeScript path alias 설정 (@/)

### Day 2: 라우팅 & 레이아웃 ✅
- [x] react-router-dom 설치
- [x] router.tsx 작성 (전체 라우트 구조)
- [x] main.tsx에 RouterProvider + QueryClientProvider 연결
- [x] AuthLayout 컴포넌트 구현
- [x] RootLayout 컴포넌트 구현
- [x] Sidebar 컴포넌트 구현
- [x] Header 컴포넌트 구현
- [x] NotFoundPage 구현
- [x] 모든 페이지 placeholder 구현

### Day 3: 공통 UI & 유틸리티
- [x] shadcn/ui 컴포넌트 추가 (Button, Input, Card)
- [x] lib/utils.ts (clsx + tailwind-merge) - shadcn 자동 생성
- [x] React Query 설치 및 Provider 설정
- [x] react-hook-form + zod 설치
- [x] lib/api/client.ts 기본 구조
- [x] types/common.ts, types/api.ts 기본 타입

### Day 4: 로그인 구현 ✅
- [x] LoginForm 컴포넌트
- [x] 로그인 스키마 (zod)
- [x] 로그인 폼 UI (아이디, 비밀번호, 버튼)
- [x] 에러 메시지 표시
- [x] 로딩 상태 (버튼 스피너)
- [x] Mock 로그인 처리 개선

### Day 5: 회원가입 Step 1-2
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
| 2026-02-09 | UI 컴포넌트: shadcn/ui 도입 확정 |
| 2026-02-09 | Tailwind v4 + @tailwindcss/vite 사용 |

---

## 미해결 질문

- [ ] 인증 방식: JWT vs 세션? (백엔드 협의 필요)
- [ ] 지도 라이브러리: 네이버 지도 vs 카카오 맵 vs Mapbox? (Phase 3에서 결정)
- [ ] 승인코드 발급 프로세스: 관리자 대시보드 필요 여부?

---

## 이번 턴에서 완료한 작업

### Day 3-4 (2026-02-09)
- [x] lib/api/client.ts - fetch 기반 API 클라이언트 (토큰 자동 첨부, ApiClientError)
- [x] components/ui/spinner.tsx - 로딩 스피너 컴포넌트
- [x] components/ui/label.tsx - shadcn/ui Label 추가
- [x] features/auth/schemas/loginSchema.ts - zod 로그인 폼 검증
- [x] features/auth/api/authApi.ts - Mock 인증 API (test/test1234)
- [x] features/auth/components/LoginForm.tsx - 로그인 폼 (에러 표시, 로딩 스피너)
- [x] features/auth/hooks/useAuth.ts - User 타입 통일, error 상태, 개선된 login 함수
- [x] app/routes/LoginPage.tsx - LoginForm 통합
- [x] types/api.ts - ApiResponse 타입 개선 (success/error 구분)
- [x] TypeScript 타입 체크 통과
- [x] 개발 서버 정상 작동 확인

### 이전 작업
- [x] Vite + React + TypeScript 프로젝트 초기화
- [x] Tailwind CSS v4 + @tailwindcss/vite 설정
- [x] shadcn/ui 초기화 (Button, Input, Card 추가)
- [x] React Router v6, React Query v5, react-hook-form, zod 설치
- [x] 폴더 구조 생성 (app, features, components, hooks, lib, types)
- [x] router.tsx 작성 (전체 라우트 구조)
- [x] 레이아웃 컴포넌트 (AuthLayout, RootLayout, ProtectedRoute)
- [x] 공통 컴포넌트 (Sidebar, Header)
- [x] 모든 페이지 placeholder 구현
- [x] useAuth 훅 기본 구조
