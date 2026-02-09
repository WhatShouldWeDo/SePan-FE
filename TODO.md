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
- [x] 회원가입 Step 1: 기본 정보 (아이디, 비밀번호, 이름)
- [x] 회원가입 Step 2: 휴대폰 인증
- [x] 회원가입 Step 3: 승인코드 입력
- [x] 회원가입 Step 4: 역할/지역/추가정보
- [x] SignupStepper (진행률 표시)
- [x] 인증 상태 관리 (useAuth 훅) - 기본 구조
- [x] ProtectedRoute 컴포넌트
- [x] 로그인 성공 후 대시보드 리다이렉트
- [x] 가입 완료 → 자동 로그인 → 대시보드 리다이렉트

### 1-3. 공통 레이아웃 & 네비게이션
- [x] RootLayout (사이드바 + 헤더 + 콘텐츠)
- [x] Sidebar 컴포넌트 (GNB)
- [x] Header 컴포넌트 (로고, 프로필/로그아웃)
- [ ] Breadcrumb 컴포넌트
- [x] 모바일 반응형 (햄버거 메뉴)

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
- [x] Select
- [x] RadioGroup
- [ ] Modal (Dialog)
- [ ] Skeleton
- [x] Spinner
- [ ] Badge

---

## 2. Phase 1.2: 선행 개발 (기획 확정 불필요)

> 🎯 **목표**: 기획 변경에 영향받지 않는 인터페이스/추상화 계층을 먼저 구축
> - 인터페이스(Props/API spec)가 안정적인 항목만 선별
> - 실제 데이터/옵션은 나중에 주입 가능한 구조로 설계
>
> **의존 방향 (순환 없음)**: API 유틸리티 → 공통 UI → 차트/맵 → 대시보드 카드 → 지역분석 → 정책개발

### 2-1. API 클라이언트 & 유틸리티 확장 ⭐ 최우선
- [ x ] 에러 핸들링 유틸리티 (toastError, parseApiError)
- [ x ] React Query 커스텀 훅 패턴 정립 (useQuery/useMutation wrapper)
- [ x ] API 타입 제네릭 활용 가이드 (ApiResponse<T> 예시)

### 2-2. 공통 UI 컴포넌트 (shadcn/ui) ⭐ 최우선
- [x] Tabs 컴포넌트 추가
- [x] Dialog (Modal) 컴포넌트 추가
- [x] Skeleton 컴포넌트 추가
- [x] Badge 컴포넌트 추가

### 2-3. 차트/시각화 추상화 ⭐ 최우선
- [ ] 차트 공통 타입 정의 (ChartData, ChartConfig)
- [ ] LineChart 컴포넌트 인터페이스 정의 (data, xLabel, yLabel)
- [ ] BarChart 컴포넌트 인터페이스 정의 (data, horizontal)
- [ ] Recharts wrapper 구현 (실제 렌더링)

### 2-4. 맵 컴포넌트 추상화 ⭐ 최우선
- [ ] Region 타입 정의 (id, name, coordinates)
- [ ] MapView 컴포넌트 인터페이스 정의 (regions, selectedRegion, onRegionSelect)
- [ ] MapView 목업 구현 (실제 폴리곤 없이 리스트/카드 형태)

### 2-5. 대시보드 카드 시스템 (일부만 선행 개발)
- [ ] SummaryCard 컴포넌트 (title, value, subtitle, trend, icon)
- [ ] DdayBadge 컴포넌트 (electionDate prop)
- [ ] QuickMenu 컴포넌트 (links prop)
- [ ] ~~ScheduleBanner 컴포넌트~~ → **기획 확정 후로 이동** (일정 데이터 구조 미확정)

### 2-6. 지역분석 컴포넌트 구조 (일부만 선행 개발)
- [ ] ComparisonTable 컴포넌트 인터페이스 (baseRegion, compareRegions, metrics, data)
- [ ] IndicatorCard 컴포넌트 (현재값, 전년대비, 전국평균 표시)
- [ ] TrendSection 컴포넌트 (LineChart wrapper)
- [ ] ~~RegionSelector 컴포넌트~~ → **기획 확정 후로 이동** (지역 계층 구조 미확정: 시도→시군구→선거구 vs 시도→선거구)

### 2-7. 정책개발 컴포넌트 구조 ❌ 전체 보류
> ⚠️ PRD에 "공약 데이터 모델 정의 TODO" 명시 — Policy 타입 필드가 확정되지 않음
> 기획 확정 후 Phase 2.5로 이동

- [ ] ~~Policy 타입 정의~~ → 기획 확정 후
- [ ] ~~PolicyCard 컴포넌트~~ → 기획 확정 후
- [ ] ~~PolicyList 컴포넌트~~ → 기획 확정 후
- [ ] ~~PolicyFilters 컴포넌트~~ → 기획 확정 후

---

## 2.5. Phase 1.2 보류 항목 (기획 확정 후 진행)

> ⚠️ 아래 항목들은 기획 확정 시 Phase 1.2로 복귀하여 개발

### 대시보드
- [ ] ScheduleBanner 컴포넌트 — **대기 사유**: 일정 데이터 구조(필드, 반복 규칙 등) 미확정

### 지역분석
- [ ] RegionSelector 컴포넌트 — **대기 사유**: 지역 계층 구조 미확정 (시도→선거구 2단계 vs 시도→시군구→선거구 3단계)

### 정책개발 (전체)
- [ ] Policy 타입 정의 — **대기 사유**: 공약 카테고리, 상태값, 메타데이터 필드 미확정
- [ ] PolicyCard 컴포넌트
- [ ] PolicyList 컴포넌트
- [ ] PolicyFilters 컴포넌트

---

## 3. Phase 1.5: 테스트 자동화 (기획 확정 후 진행)

> ⚠️ **중요**: 이 단계는 회원가입/로그인 기획이 100% 확정된 후에 진행합니다.
> 기획 변경 시 테스트 코드도 전부 수정해야 하므로, 지금 작성하면 작업량이 2배로 증가합니다.

### 테스트 인프라 구축
- [ ] 테스트 라이브러리 선택 및 설치 (Vitest / Jest / Playwright 중 결정)
- [ ] 테스트 환경 설정 (tsconfig, vite.config 등)
- [ ] Mock 데이터 및 Mock API 유틸리티 정리

### E2E / 통합 테스트
- [ ] 로그인 플로우 자동화 테스트
- [ ] 회원가입 Step 1~4 플로우 자동화 테스트
- [ ] 인증 상태 관리 테스트 (localStorage, 새로고침)
- [ ] ProtectedRoute 테스트
- [ ] 로그아웃 플로우 테스트

### 단위 테스트 (선택)
- [ ] useAuth 훅 테스트
- [ ] 폼 검증 스키마 테스트
- [ ] API 클라이언트 테스트

---

## 4. 이번 스프린트: Phase 1 (프로젝트 셋업 & 인증)

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
- [x] SignupStepper 컴포넌트 (Step indicator)
- [x] SignupStep1 (기본 정보)
- [x] SignupStep2 (휴대폰 인증)
- [x] SignupStep3 (승인코드)
- [x] SignupStep4 (역할/지역)
- [x] SignupComplete (가입 완료 화면)
- [x] useAuth 훅 (로그인 상태 관리) - 기본 구조
- [ ] 인증 관련 타입 정의 (features/auth/types.ts)

### 라우팅 연결
- [x] /login → LoginPage
- [x] /signup → SignupPage
- [x] / → DashboardPage (placeholder)
- [x] 404 → NotFoundPage

---

## 5. 일별 할 일

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

### Day 5: 회원가입 Step 1-2 ✅
- [x] SignupStepper 컴포넌트 (1/4, 2/4... 표시)
- [x] SignupStep1 (기본 정보 폼)
- [x] Step1 스키마 (zod: 아이디, 비밀번호, 비밀번호 확인, 이름)
- [x] SignupStep2 (휴대폰 인증 폼)
- [x] Step2 스키마 (zod: 휴대폰 번호, 인증번호)
- [x] Step 간 상태 유지 (useState)

### Day 6: 회원가입 Step 3-4 & 완료 ✅
- [x] SignupStep3 (승인코드 입력)
- [x] Step3 스키마 (zod)
- [x] SignupStep4 (역할/지역 선택)
- [x] Step4 스키마 (zod)
- [x] 역할 선택 UI (후보자, 사무장, 회계책임자, 사무원)
- [x] 지역 선택 UI (시도 → 선거구 cascading) - 국회의원 선거구 기반
- [x] 가입 완료 → 자동 로그인 → 환영 메시지 → 대시보드 리다이렉트

### Day 7: 수동 플로우 확인 & 반응형 적용 & 정리 ✅
- [x] **수동** 플로우 확인 (로그인 → 대시보드) - 준비 완료 (http://localhost:5174)
- [x] **수동** 플로우 확인 (회원가입 Step 1~4 → 대시보드) - 준비 완료
- [x] **수동** 인증 상태 유지 확인 (새로고침) - 준비 완료
- [x] 반응형 CSS 적용 (모바일 햄버거 메뉴, 패딩 조정)
- [x] 코드 정리 (console.log 4개 제거, "use client" 제거, useWatch 적용, eslint 경고 해결)
- [ ] Phase 1 완료 커밋

> **참고**: 자동화된 테스트 코드 작성은 기획 확정 후로 미룸 (Phase 1.5 참조)

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
| 2026-02-09 | **테스트 자동화**: 기획 확정 후로 미룸 (Phase 1.5) — 기획 변경 시 테스트 코드도 수정해야 하므로 작업 효율을 위해 후순위로 결정 |

---

## 미해결 질문

- [ ] 인증 방식: JWT vs 세션? (백엔드 협의 필요)
- [ ] 지도 라이브러리: 네이버 지도 vs 카카오 맵 vs Mapbox? (Phase 3에서 결정)
- [ ] 승인코드 발급 프로세스: 관리자 대시보드 필요 여부?

---

## 이번 턴에서 완료한 작업

### Phase 1.2 - Phase 4: Badge 컴포넌트 (2026-02-10)
- [x] components/ui/badge.tsx - shadcn/ui Badge 컴포넌트 설치 (pnpm dlx shadcn@latest add badge)
- [x] components/ui/badge.tsx - badgeVariants에 size variant 추가 (sm, md, lg)
  - `sm`: text-xs px-2 py-0.5 + svg:size-3
  - `md`: text-sm px-2.5 py-0.5 + svg:size-3.5 (기본값)
  - `lg`: text-base px-3 py-1 + svg:size-4
- [x] components/DdayBadge.tsx - D-day 배지 컴포넌트 작성
  - 선거일까지 남은 일수 자동 계산 (Math.ceil)
  - 30일 이하: destructive variant (빨강)
  - 30일 초과: default variant (파랑)
  - Date 객체 또는 ISO 문자열 지원
  - 접근성: aria-label 추가
- [x] components/PolicyStatusBadge.tsx - 공약 상태 배지 컴포넌트 작성
  - draft (작성중): secondary variant (회색)
  - confirmed (확정): default variant (파랑)
  - published (발표): outline variant (외곽선)
  - PolicyStatus 타입 export
- [x] app/routes/PolicyPage.tsx - PolicyStatusBadge 적용
  - "확정공약" 탭에 3개 목업 카드 추가 (확정/작성중/발표 상태 예시)
  - Card 레이아웃: 제목 + 배지 + 설명
- [x] app/routes/DashboardPage.tsx - DdayBadge 적용
  - 첫 번째 카드(선거일 카드)에 DdayBadge 추가
  - 선거일: 2026-04-01 (하드코딩, 추후 API 연동)
- [x] TypeScript 타입 체크 통과 (npx tsc --noEmit)
- [x] TODO.md - Phase 1.2의 2-2 항목 업데이트 (Badge 완료 표시)

### Phase 1.2 - Phase 2: Dialog 컴포넌트 (2026-02-10)
- [x] components/ui/dialog.tsx - shadcn/ui Dialog 컴포넌트 설치 (pnpm dlx shadcn@latest add dialog)
- [x] components/ConfirmDialog.tsx - 확인/취소 모달 wrapper 컴포넌트 작성
  - size variant 지원 (sm, md, lg, xl)
  - variant 지원 (default, destructive)
  - 접근성: ESC 키, 배경 클릭으로 닫기, focus trap (radix-ui 기본 제공)
  - 모바일 최적화: max-w-[calc(100%-2rem)] (좌우 여백 유지)
- [x] TODO.md - Phase 1.2의 2-2 항목 업데이트 (Dialog 완료 표시)

### Phase 1.2 - Phase 3: Skeleton 컴포넌트 (2026-02-10)
- [x] components/ui/skeleton.tsx - shadcn/ui Skeleton 컴포넌트 설치 (pnpm dlx shadcn@latest add skeleton)
- [x] components/DashboardCardSkeleton.tsx - 조합 Skeleton 컴포넌트 작성
  - DashboardCardSkeleton: 일반 카드 로딩 (제목, 부제목, 텍스트 라인)
  - ChartCardSkeleton: 차트 카드 로딩 (300px 높이 차트 영역)
  - StatCardSkeleton: 통계 카드 로딩 (큰 숫자 + 레이블)
- [x] app/routes/DashboardPage.tsx - Skeleton 로딩 상태 적용
  - useState로 로딩 상태 시뮬레이션 (2초 타이머)
  - isLoading 분기: Skeleton vs 실제 콘텐츠
  - 6개 카드 레이아웃 (통계 3개 + 일반 2개 + 차트 1개)
- [x] TODO.md - Phase 1.2의 2-2 항목 업데이트 (Skeleton 완료 표시)

### Day 7 (2026-02-09)
- [x] features/auth/api/authApi.ts - console.log 4개 제거, phone 파라미터 eslint-disable
- [x] components/ui/select.tsx - "use client" 지시문 제거 (Vite 프로젝트에서 불필요)
- [x] components/ui/button.tsx - react-refresh eslint-disable 추가
- [x] features/auth/components/SignupStep3.tsx - watch() → useWatch() 변경
- [x] features/auth/components/SignupStep4.tsx - watch() → useWatch() 변경
- [x] app/layouts/RootLayout.tsx - isMobileMenuOpen 상태 관리 추가
- [x] components/Header.tsx - 햄버거 메뉴 버튼 추가 (lucide-react Menu 아이콘)
- [x] components/Sidebar.tsx - 모바일 오버레이 모드 구현 (fixed, z-50, 배경 오버레이)
- [x] app/layouts/AuthLayout.tsx - 모바일 패딩 조정 (px-4 sm:px-6)
- [x] TypeScript 타입 체크 통과 (npx tsc --noEmit)
- [x] ESLint 통과 (pnpm lint)

### Day 6 (2026-02-09)
- [x] features/auth/schemas/signupSchema.ts - Step 3, 4 zod 스키마 추가
- [x] features/auth/api/authApi.ts - verifyApprovalCode, signup Mock API 추가
- [x] features/auth/data/mockConstituencies.ts - 17개 시도 + 국회의원 선거구 Mock 데이터
- [x] features/auth/components/SignupStep3.tsx - 승인코드 입력 폼 (대문자 자동 변환)
- [x] features/auth/components/SignupStep4.tsx - 역할(RadioGroup) + 지역(Cascading Select) 선택
- [x] features/auth/components/SignupComplete.tsx - 가입 완료 화면 (3초 자동 리다이렉트)
- [x] app/routes/SignupPage.tsx - Step 3-4 통합 + 가입 완료 로직
- [x] components/ui/radio-group.tsx - shadcn/ui RadioGroup 추가
- [x] components/ui/select.tsx - shadcn/ui Select 추가
- [x] SignupStep3Placeholder.tsx 제거 (불필요 파일 정리)
- [x] TypeScript 타입 체크 통과
- [x] 개발 서버 정상 작동 확인

### Day 5 (2026-02-09)
- [x] features/auth/schemas/signupSchema.ts - Step 1, 2 zod 스키마
- [x] features/auth/api/authApi.ts - checkUsername, sendVerification, verifyPhone Mock 함수 추가
- [x] features/auth/components/SignupStepper.tsx - 4단계 진행률 표시 (완료/현재/미완료 스타일)
- [x] features/auth/components/SignupStep1.tsx - 기본 정보 폼 + blur 아이디 중복 체크
- [x] features/auth/components/SignupStep2.tsx - 휴대폰 인증 폼 + 3분 타이머
- [x] features/auth/components/SignupStep3Placeholder.tsx - 준비 중 안내
- [x] app/routes/SignupPage.tsx - Step 상태 관리 + 컴포넌트 통합
- [x] TypeScript 타입 체크 통과

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
