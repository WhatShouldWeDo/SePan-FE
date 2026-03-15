# Module Map

> 최종 업데이트: 2026-03-11 (지역분석 결과 페이지 Figma R.2.0 퍼블리싱)

---

## Feature 모듈

### Auth

- **경로**: `src/features/auth/`
- **역할**: 로그인, 회원가입(4단계 폼), 인증 상태 관리
- **핵심 파일**:
  - `api/authApi.ts` — 인증 API 함수 (login, logout, getMe, signup, checkUsername 등)
  - `api/authApi.mock.ts` — Mock API (VITE_USE_MOCK 환경변수로 전환)
  - `api/types.ts` — Auth 전용 요청/응답 타입
  - `api/index.ts` — Mock/실제 API 동적 export
  - `hooks/useAuth.ts` — React Query 기반 인증 상태 훅 (토큰 관리, 로그인/로그아웃)
  - `components/LoginForm.tsx` — 로그인 폼 (react-hook-form + Zod)
  - `components/SignupStep1~4.tsx` — 회원가입 4단계 폼
  - `components/SignupStepper.tsx` — 회원가입 진행 표시기
  - `components/SignupComplete.tsx` — 가입 완료 화면
  - `schemas/loginSchema.ts` — 로그인 Zod 스키마
  - `schemas/signupSchema.ts` — 회원가입 Zod 스키마
  - `schemas/__tests__/schemas.test.ts` — 스키마 유닛 테스트
  - `data/mockConstituencies.ts` — 목업 선거구 데이터
- **의존하는 모듈**: `lib/api` (client, hooks), `types/api`, `types/common`, `components/ui`
- **관련 ADR**: [ADR-001](decisions/001-api-client-architecture.md), [ADR-014](decisions/014-mock-api-env-switching.md)
- **상세 문서**: [`docs/architecture/auth.md`](architecture/auth.md)

### Region

- **경로**: `src/features/region/`
- **역할**: 행정구역 지도 시각화, 4단계 드릴다운 (시도→시군→구→읍면동), Choropleth, 검색, 지역분석 결과 표시
- **핵심 파일**:
  - `components/map/KoreaAdminMap.tsx` — 메인 지도 컴포넌트 (드릴다운, 줌, choropleth)
  - `components/map/RegionPolygon.tsx` — 개별 폴리곤 (hover/select 상태)
  - `components/map/MapTooltip.tsx` — 호버 시 지역 정보 툴팁
  - `components/map/MapBreadcrumb.tsx` — 드릴다운 경로 표시
  - `components/map/RegionSearch.tsx` — 지역 검색 자동완성
  - `components/map/MapZoomControls.tsx` — 줌 컨트롤
  - `components/map/MapLegend.tsx` — Choropleth 범례
  - `components/map/MapSkeleton.tsx` — 로딩 스켈레톤
  - `components/map/index.ts` — 컴포넌트 re-export
  - `hooks/useMapDrillDown.ts` — 4단계 드릴다운 상태 관리 + 지역 변환 함수
  - `hooks/useTopoJsonData.ts` — TopoJSON 동적 import + GeoJSON 변환
  - `hooks/useProjection.ts` — D3 geoMercator 프로젝션 (fitExtent 자동 스케일링)
  - `hooks/useMapZoom.ts` — D3 줌 동작 관리
  - `hooks/useMapTransition.ts` — D3 전환 애니메이션
  - `lib/choropleth-utils.ts` — oklch 색상 보간, choropleth 색상 매핑, 범례 생성
  - `lib/map-theme.ts` — 지도 CSS 변수 (fill, hover, selected, stroke 등)
  - `lib/sido-utils.ts` — 시도 코드 ↔ 이름 매핑
  - `lib/sigun-utils.ts` — 시군 유틸리티
  - `lib/__tests__/choropleth-utils.test.ts` — Choropleth 유닛 테스트
  - `components/MetricListRow.tsx` — 지표 행 (라벨, 값, 단위, 델타 뱃지) — RegionResultPage에서 사용
  - `components/AiAnalysisBox.tsx` — AI 기본 분석 결과 박스 — RegionResultPage에서 사용
  - `components/MetricActionButtons.tsx` — 분석/비교분석 액션 버튼 — preview/analysis 모드에서 사용
  - `components/MetricComparisonCard.tsx` — 비교 모드 좌우 분할 메트릭 카드 — compare 모드에서 사용
  - `components/ComparisonSummaryBox.tsx` — 비교 해석 텍스트 박스 — MetricComparisonCard에서 사용
  - `data/categories.ts` — 분석 지표 카테고리 정의 (9개 카테고리 + 서브카테고리 + Figma 아이콘 에셋 경로)
  - `data/mock-comparison.ts` — 비교분석 Mock 데이터 (내 선거구/선택 지역 메트릭·월별추이, 비교 해석 텍스트)
  - `data/*.topojson.json` — 시도/시군/시군구/읍면동 지리 데이터
- **의존하는 모듈**: `types/map`, `lib/utils`, `components/ui`, `components/icons` (WantedCaretUp, WantedMagicWand)
- **외부 의존성**: d3-geo, d3-zoom, d3-transition, d3-selection, topojson-client
- **관련 ADR**: [ADR-003](decisions/003-map-rendering-stack.md), [ADR-004](decisions/004-pointer-events-migration.md), [ADR-005](decisions/005-topojson-dynamic-import.md), [ADR-006](decisions/006-hangul-chosung-search.md), [ADR-007](decisions/007-oklch-choropleth.md), [ADR-008](decisions/008-d3-transition-reversal.md), [ADR-011](decisions/011-constituency-to-admin-code.md), [ADR-012](decisions/012-conditional-4level-drilldown.md)
- **상세 문서**: [`docs/architecture/region.md`](architecture/region.md)
- **상태**: RegionResultPage Figma R.2.0 퍼블리싱 완료, 데이터는 하드코딩 (API 연동 전)

### Dashboard

- **경로**: `src/features/dashboard/`
- **역할**: 대시보드 홈 (인사말, 요약 카드, 인사이트 목록, 일정 관리)
- **핵심 파일**:
  - `components/CardSection.tsx` — 흰색 배경 라운드 카드 컨테이너 (대시보드 섹션 래퍼)
  - `components/DashboardGreeting.tsx` — 상단 인사말 + D-day 배지
  - `components/SummaryCard.tsx` — 그라데이션 요약 카드 3종 (schedule/dday-blue/dday-purple)
  - `components/InsightListItem.tsx` — 인사이트 행 + `InsightDelta` 서브컴포넌트 (증감 표시, `WantedCaretUp` 아이콘 사용). Container Query(`@container` + `@[16rem]`) 기반 반응형: 넓을 때 trailing 인라인, 좁을 때 label/value 하단으로 줄바꿈. 텍스트 `min-w-0` + `truncate` 오버플로 처리
  - `components/ScheduleListItem.tsx` — 일정 행 (컬러바 + 제목 + 날짜 + 배지)
  - `components/WeekStrip.tsx` — 컴팩트 주간 날짜 스트립 (월요일 시작)
  - `components/index.ts` — re-export
- **의존하는 모듈**: `components/ui` (Badge, Banner, Button, CardSectionHeader), `components/DashboardCardSkeleton`, `lib/utils`
- **관련 ADR**: [ADR-015](decisions/015-dashboard-component-architecture.md)
- **상세 문서**: [`docs/architecture/dashboard.md`](architecture/dashboard.md)
- **상태**: Figma H.1.0.Main 디자인 반영 완료, 데이터는 하드코딩 (API 연동 전)

### Policy

- **경로**: `src/features/policy/` (빈 디렉토리)
- **역할**: 정책/공약 관리 (현재 페이지 수준만 존재)
- **핵심 파일**:
  - `(없음)` — 로직이 `app/routes/PolicyPage.tsx`, `PolicyFormPage.tsx`에 직접 작성됨 (MVP 목업)
- **의존하는 모듈**: `components/ui` (Tabs, Card), `components/PolicyStatusBadge`
- **상태**: MVP 목업. feature 분리 전 단계

### Test

- **경로**: `src/features/test/`
- **역할**: 디자인 시스템 컴포넌트 쇼케이스 (개발용)
- **핵심 파일**:
  - `sections/BannerSection.tsx` — Banner 쇼케이스
  - `sections/CardSectionHeaderSection.tsx` — CardSectionHeader 쇼케이스
  - `sections/CategoryNavSection.tsx` — CategoryNav 쇼케이스
  - `sections/ChipSection.tsx` — Chip 쇼케이스
  - `sections/ChipTagSection.tsx` — ChipTag 쇼케이스
  - `sections/FormControlsSection.tsx` — 폼 컨트롤 쇼케이스
  - `sections/ToastSection.tsx` — Toast 쇼케이스
  - `sections/SelectCellSection.tsx` — SelectCell 쇼케이스
- **의존하는 모듈**: `components/ui`

---

## 공유 모듈

### Components (공유 UI)

- **경로**: `src/components/`
- **역할**: 전체 앱에서 재사용하는 UI 프리미티브 및 레이아웃 컴포넌트

#### 레이아웃/비즈니스 컴포넌트

| 파일 | 역할 | 의존 |
|------|------|------|
| `Header.tsx` | 상단 네비게이션 (브레드크럼, Chevron 패널 토글, 유저 드롭다운) | `auth/hooks/useAuth`, `GnbPanelContext` |
| `GnbPanel.tsx` | GNB 하단 슬라이드 패널 (CategoryNav 포탈 타겟, 스크롤 시 자동 닫힘) | `GnbPanelContext` |
| `Sidebar.tsx` | 좌측 사이드바 (Figma 기반, 접힌/펼친 상태, Duo 아이콘, 비활성 항목 지원) | react-router-dom, `icons/*` |
| `ConfirmDialog.tsx` | 확인/취소 다이얼로그 | `ui/dialog` |
| `DdayBadge.tsx` | 선거일 D-day 배지 | — |
| `DashboardCardSkeleton.tsx` | 대시보드 스켈레톤 로더 | `ui/skeleton` |
| `PolicyStatusBadge.tsx` | 공약 상태 배지 (확정/초안/발행) | `ui/badge` |

#### UI 프리미티브 (`ui/`)

| 파일 | 역할 |
|------|------|
| `badge.tsx` | 배지 (CVA variants) |
| `banner.tsx` | 알림 배너 (해제 가능) |
| `button.tsx` | 버튼 (CVA variants) |
| `card.tsx`, `card-section-header.tsx` | 카드 + 섹션 헤더 |
| `category-nav.tsx` | 카테고리 탭 네비게이션 (CSS mask-luminance 아이콘, 서브카테고리 패널) |
| `check.tsx`, `check-multiple.tsx`, `checkbox.tsx` | 체크박스 변형 |
| `chip.tsx`, `chip-tag.tsx` | 칩/태그 |
| `date-picker.tsx` | 날짜 선택기 (single/range, 월요일 시작) |
| `dialog.tsx` | 모달 다이얼로그 |
| `input.tsx`, `text-field.tsx`, `text-area.tsx` | 텍스트 입력 |
| `label.tsx` | 폼 라벨 |
| `radio.tsx`, `radio-group.tsx` | 라디오 버튼 |
| `select.tsx` | 드롭다운 셀렉트 |
| `select-cell.tsx` | 셀렉트 셀 (드롭다운/리스트 항목 기반 컴포넌트, Composition 슬롯) |
| `skeleton.tsx` | 스켈레톤 로더 |
| `spinner.tsx` | 로딩 스피너 |
| `switch.tsx` | 토글 스위치 |
| `tabs.tsx` | 탭 (CVA variants: line/pill) |
| `toast.tsx` | Toast UI (sonner 래퍼) |
| `tooltip.tsx` | 툴팁 |

#### Charts (`charts/`)

| 파일 | 역할 |
|------|------|
| `BarChart.tsx` | Recharts 바 차트 래퍼 |
| `LineChart.tsx` | Recharts 라인 차트 래퍼 |
| `index.ts` | re-export |

#### Icons (`icons/`)

| 파일 | 역할 |
|------|------|
| `CheckmarkIcon.tsx` | 체크마크 |
| `CircleCheckFill.tsx` | 성공 아이콘 |
| `CircleCloseFill.tsx` | 닫기/실패 아이콘 |
| `CircleExclamationFill.tsx` | 경고 아이콘 |
| `CircleInfoFill.tsx` | 정보 아이콘 |
| `DuoHome.tsx` | 홈 아이콘 (Duo) — 사이드바 |
| `DuoChartPie.tsx` | 차트 파이 아이콘 (Duo) — 사이드바 |
| `DuoBookOpen.tsx` | 책 아이콘 (Duo) — 사이드바 |
| `DuoBinocular.tsx` | 쌍안경 아이콘 (Duo) — 사이드바 |
| `DuoAddressBook.tsx` | 주소록 아이콘 (Duo) — 사이드바 |
| `WantedSetting.tsx` | 설정 아이콘 — 사이드바 |
| `WantedCrown.tsx` | 왕관 아이콘 — 사이드바 |
| `WantedFillMessage.tsx` | 채팅 메시지 아이콘 (32×32) — 대시보드 인사이트 |
| `WantedFillTriangleExclamation.tsx` | 삼각 느낌표 아이콘 (32×32) — 대시보드 인사이트 |
| `WantedFillMegaphone.tsx` | 메가폰 아이콘 (32×32) — 대시보드 인사이트 |
| `WantedCaretUp.tsx` | 위쪽 화살표 아이콘 — InsightDelta 증감 표시 |
| `WantedCalendar.tsx` | 캘린더 아이콘 |
| `WantedMagicWand.tsx` | 마법봉 아이콘 — 지역분석 AI 분석 결과 |
| `MegaphoneFill.tsx` | 메가폰 아이콘 (24×24) — Toast/Banner 전용 |
| `MinusLineIcon.tsx` | 마이너스 아이콘 |
| `ThinClose.tsx` | 얇은 닫기 아이콘 |
| `TriangleWarningFill.tsx` | 삼각 경고 아이콘 |
| `index.ts` | re-export |

> SVGR로 자동 생성 (`pnpm run icons:generate`): `design-tokens/icons/` → `src/components/icons/`

### Lib (유틸리티)

- **경로**: `src/lib/`
- **역할**: API 클라이언트, React Query 래퍼, 에러 처리, Toast, 유틸리티

| 파일 | 역할 | 의존 |
|------|------|------|
| `api/client.ts` | fetch 기반 REST 클라이언트 (Bearer 토큰 자동 첨부) | — |
| `api/hooks.ts` | `useApiQuery`, `useApiMutation` (React Query + ApiResponse 자동 처리) | `types/api`, `api/errors`, `toast` |
| `api/errors.ts` | `parseApiError`, `toastError`, `handleApiError` | `types/api`, `toast` |
| `api/__tests__/errors.test.ts` | 에러 유틸 테스트 | — |
| `toast/toast.tsx` | Sonner 기반 Toast (success/error/info/warning) | `components/ui/toast`, `components/icons` |
| `chart-theme.ts` | 차트 컬러 팔레트 | — |
| `hangul-utils.ts` | 한글 초성 검색 등 | — |
| `__tests__/hangul-utils.test.ts` | 한글 유틸 테스트 | — |
| `utils.ts` | `cn()` 함수 (clsx + tailwind-merge) | — |

### Contexts (공유 컨텍스트)

- **경로**: `src/contexts/`
- **역할**: 앱 전체에서 공유되는 React Context

| 파일 | 역할 | 의존 |
|------|------|------|
| `NavigationContext.tsx` | 브레드크럼 상태 관리 | — |
| `GnbPanelContext.tsx` | GNB 패널 상태 (panelEl, isPanelOpen, hasPanel) | — |
| `useNavigation.ts` | `useBreadcrumb`, `useNavigation`, `useGnbPanel` 훅 | `NavigationContext`, `GnbPanelContext` |

### Hooks (공유 훅)

- **경로**: `src/hooks/`
- **역할**: Feature에 속하지 않는 범용 커스텀 훅

| 파일 | 역할 | 의존 |
|------|------|------|
| `useLongPress.ts` | 롱프레스 제스처 감지 | — |
| `useRecentSearches.ts` | localStorage 기반 최근 검색 이력 (최대 5개, 중복 제거) | — |

### Types (공유 타입)

- **경로**: `src/types/`
- **역할**: 모듈 간 공유되는 타입 정의

| 파일 | 역할 |
|------|------|
| `api.ts` | `ApiResponse<T>`, `ApiSuccessResponse`, `ApiErrorResponse`, Login/Signup 타입 |
| `common.ts` | `User`, `UserRole`, `Region`, `PaginationParams`, `PaginatedResponse` |
| `map.ts` | `MapLevel`, `MapRegion`, `SearchSelectedRegion`, `MapConfig`, `ChoroplethData/Config`, `LegendItem` |
| `chart.ts` | `ChartData`, `ChartDataPoint`, `ChartSeriesConfig`, `ChartConfig`, `ChartFormatter` |

---

## App 모듈

### App (라우팅 & 레이아웃)

- **경로**: `src/app/`
- **역할**: 라우팅 정의, 페이지 컴포넌트, 레이아웃

#### 라우팅 (`router.tsx`)

| 경로 | 페이지 | 인증 |
|------|--------|------|
| `/login` | LoginPage | 불필요 |
| `/signup` | SignupPage | 불필요 |
| `/` | DashboardPage | 필요 |
| `/region` | RegionResultPage | 필요 |
| `/policy` | PolicyPage | 필요 |
| `/policy/new` | PolicyFormPage | 필요 |
| `/policy/:id/edit` | PolicyFormPage | 필요 |
| `/test` | TestPage | 필요 |

#### 레이아웃 (`layouts/`)

| 파일 | 역할 | 의존 |
|------|------|------|
| `RootLayout.tsx` | 앱 레이아웃 (Sidebar + Header + GnbPanel + Outlet, sticky GNB 컨테이너 포함) | `components/Sidebar`, `components/Header`, `components/GnbPanel`, `GnbPanelContext` |
| `AuthLayout.tsx` | 인증 레이아웃 (중앙 정렬 폼) — SignupPage 전용. LoginPage는 자체 레이아웃 사용 | — |
| `ProtectedRoute.tsx` | 인증 가드 (미인증 시 `/login` 리다이렉트) | `auth/hooks/useAuth` |

#### 페이지 (`routes/`)

| 파일 | 역할 | 의존 |
|------|------|------|
| `DashboardPage.tsx` | 대시보드 홈 (Figma H.1.0.Main), 바로가기 네비게이션(`/region`, `/policy`), 주간 일정 탐색. InsightListItem 그리드 2곳에 Container Query(`@container` + `@lg:grid-cols-2`) 적용 — 컨테이너 512px 미만 시 1열 전환 | `features/dashboard/components`, `components/ui`, `DashboardCardSkeleton`, `components/icons` (WantedFill*), `react-router-dom` |
| `LoginPage.tsx` | 로그인 (자체 전체화면 레이아웃: 좌 62.5% Primary 배경 / 우 37.5% 폼 영역, AuthLayout 미사용) | `auth/components/LoginForm`, `lucide-react` |
| `SignupPage.tsx` | 회원가입 | `auth/components/Signup*` |
| `RegionResultPage.tsx` | 지역분석 (`/region`): 4가지 ViewMode(default/preview/analysis/compare) + CategoryNav×2 + AI분석 + 폴리곤지도/MetricList 2열 + 비교모드(좌우카드+Grouped/분리차트) | `region/components/*`, `region/data/*`, `components/ui`, `components/charts`, `contexts/useNavigation` |
| `PolicyPage.tsx` | 정책 관리 (탭 기반, MVP 목업) | `components/ui/tabs`, `PolicyStatusBadge` |
| `PolicyFormPage.tsx` | 정책 작성/수정 폼 | `components/ui` |
| `TestPage.tsx` | 컴포넌트 쇼케이스 | `test/sections/*` |
| `NotFoundPage.tsx` | 404 페이지 | — |

---

## 의존 관계 요약

```
types/          ← 모든 모듈이 참조 (순수 타입, 의존성 없음)
  │
lib/            ← feature, app 모듈이 참조
  ├─ api/       ← auth/api, auth/hooks, app/routes
  ├─ toast/     ← api/hooks, api/errors
  └─ utils      ← 모든 컴포넌트
  │
hooks/          ← app/routes, features (순수 훅, 의존성 없음)
  │
components/
  ├─ ui/        ← 모든 feature, app 모듈이 참조
  ├─ charts/    ← app/routes (대시보드, 지역분석)
  ├─ icons/     ← toast, 기타 UI
  ├─ Header     → auth/hooks/useAuth (역방향 의존)
  └─ Sidebar    → react-router-dom
  │
features/
  ├─ auth/      → lib/api, types, components/ui
  ├─ region/    → types/map, lib/utils, components/ui, d3, topojson
  ├─ dashboard/ → components/ui (Badge, Banner, Button, CardSectionHeader), lib/utils
  ├─ policy/    → (비어있음, PolicyPage에 직접 구현)
  └─ test/      → components/ui
  │
app/
  ├─ layouts/   → auth/hooks, components
  └─ routes/    → features/*, components, types
```

---

## 스타일 & 토큰

| 파일 | 역할 |
|------|------|
| `src/index.css` | 글로벌 CSS 변수: 프리미티브 팔레트 → 시맨틱 토큰 → shadcn 호환 변수, 다크모드, Tailwind 설정 |
| `design-tokens/icons/` | SVG 원본 (SVGR 입력) |
| `src/assets/category-icons/` | CategoryNav 아이콘 에셋 PNG 9개 (Figma에서 추출, CSS mask-luminance로 렌더링) |

#### 컬러 토큰 3계층 (`src/index.css`)

| 계층 | 예시 | 역할 |
|------|------|------|
| **Primitive** | `--cool-neutral-60`, `--blue-50`, `--violet-500` | Figma Color 페이지의 원시 hex 값 (5개 팔레트, 41개 변수) |
| **Semantic** | `--label-neutral`, `--fill-normal`, `--party-dpk`, `--label-inverse-48` | 용도 기반 토큰, primitive를 `var()`로 참조 |
| **shadcn 호환** | `--primary`, `--background`, `--border` | shadcn 컴포넌트용, primitive/semantic을 `var()`로 참조 |

Tailwind 유틸리티: `@theme inline`에 `--color-{palette}-{step}` 매핑 → `bg-cool-neutral-5`, `text-violet-500` 등 사용 가능

> 상세 구조: [`docs/architecture/design-tokens.md`](architecture/design-tokens.md)

---

## 설정 파일

| 파일 | 역할 |
|------|------|
| `vite.config.ts` | Vite 설정 (React, Tailwind 플러그인, `@/` alias) |
| `tsconfig.app.json` | TypeScript strict 설정, `@/` path alias |
| `vitest.config.ts` | Vitest 설정 (jsdom, global APIs, setup file) |
| `eslint.config.js` | ESLint 설정 (no-console warn, no-unused-vars error) |
