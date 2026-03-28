# Architecture Overview

> 최종 업데이트: 2026-03-18

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | React | 19.2 |
| Bundler | Vite | 7.2 |
| Language | TypeScript | 5.9 (strict) |
| Server State | TanStack React Query | 5.90 |
| Form | React Hook Form + Zod | 7.71 / 4.3 |
| Routing | React Router DOM | 7.13 |
| Styling | Tailwind CSS | 4.1 |
| UI Primitives | Radix UI (via shadcn) | 1.4 |
| Charts | Recharts | 3.7 |
| Map/Geo | D3 (geo, selection, transition, zoom) + topojson-client | 3.x |
| Icons | Lucide React + SVGR (커스텀) | 0.563 |
| Toast | Sonner | 2.0 |
| Component Variants | class-variance-authority (CVA) | 0.7 |
| Testing | Vitest + Testing Library | 4.0 / 16.3 |
| Linting | ESLint + typescript-eslint | 9.39 / 8.46 |

---

## 디렉토리 구조

```
src/
├── app/                        # 라우팅 & 레이아웃
│   ├── layouts/                # AuthLayout, RootLayout, ProtectedRoute
│   ├── routes/                 # *Page.tsx (페이지 컴포넌트)
│   └── router.tsx              # createBrowserRouter 설정
│
├── features/                   # 도메인별 코드 (feature-based)
│   ├── auth/                   # 인증
│   │   ├── api/                #   API 함수 + 타입
│   │   ├── components/         #   로그인/회원가입 UI
│   │   ├── hooks/              #   useAuth 등
│   │   ├── schemas/            #   Zod 유효성 검사
│   │   └── data/               #   Mock 데이터
│   ├── dashboard/              # 대시보드
│   │   └── components/         #   CardSection, Greeting, SummaryCard, InsightListItem, ScheduleListItem, WeekStrip
│   ├── pledges/                # 역대공약분석
│   │   ├── components/         #   CandidateCard, CandidateGrid, 필터 컴포넌트
│   │   └── data/               #   Mock 후보자 데이터, 지역 매핑
│   ├── region/                 # 지역분석
│   │   ├── components/map/     #   지도 컴포넌트 (폴리곤, 검색 등)
│   │   ├── components/         #   MetricListRow, AiAnalysisBox (결과 페이지용)
│   │   ├── hooks/              #   useMapDrillDown, useTopoJsonData, useHeatmapMode 등
│   │   ├── lib/                #   choropleth-utils, sido-utils, map-theme
│   │   └── data/               #   TopoJSON, 카테고리 정의, 히트맵 설정
│   ├── policy/                 # 정책개발 (AI 추천, 벤치마킹, 나의 공약)
│   └── test/                   # 테스트 페이지
│
├── components/                 # 공유 UI 컴포넌트
│   ├── ui/                     # shadcn 기반 (Button, Card, Input 등)
│   ├── charts/                 # 차트 래퍼
│   ├── tables/                 # 테이블 컴포넌트
│   ├── icons/                  # SVGR 자동 생성 아이콘
│   ├── Header.tsx
│   ├── Sidebar.tsx              # Figma 기반 (접힘 80px / 펼침 280px, Duo 아이콘)
│   └── ...                     # ConfirmDialog, DdayBadge 등
│
├── contexts/                   # 공유 컨텍스트 (NavigationContext, GnbPanelContext)
│
├── hooks/                      # 공유 훅 (useContainerSize, useLongPress, useRecentSearches)
│
├── lib/                        # 유틸리티 & 인프라
│   ├── api/                    # REST 클라이언트 + React Query 훅
│   │   ├── client.ts           #   fetch 기반 API 클라이언트
│   │   ├── hooks.ts            #   useApiQuery, useApiMutation
│   │   └── errors.ts           #   에러 처리 유틸
│   ├── toast/                  # Sonner 래퍼 (toast.success/error/...)
│   ├── utils.ts                # cn() (clsx + tailwind-merge)
│   ├── chart-theme.ts
│   └── hangul-utils.ts         # 한글 처리 유틸
│
├── assets/                     # 정적 에셋 (Figma 추출 아이콘 PNG 등)
│   └── category-icons/         #   CategoryNav 마스크 아이콘 (mask-luminance)
│
├── types/                      # 공유 타입
│   ├── api.ts                  # ApiResponse<T>, Login/Signup 타입
│   ├── common.ts               # User, Region, Pagination
│   ├── chart.ts
│   └── map.ts                  # MapRegion, projection 타입
│
├── test/                       # 테스트 설정
│   └── setup.ts
│
└── index.css                   # 글로벌 스타일 & 디자인 토큰 (Figma → CSS vars)
```

---

## 핵심 패턴

### Feature-Based 구조

도메인별로 `features/{module}/` 디렉토리에 api, components, hooks, schemas를 응집. 모듈 간 직접 참조 최소화.

### 컴포넌트 3계층

| 계층 | 위치 | 역할 |
|------|------|------|
| **Page** | `app/routes/*Page.tsx` | 데이터 패칭 + 레이아웃 조합 |
| **Section** | `features/*/components/` | 기능 단위 UI (지도, 검색, 비교 등) |
| **Pure UI** | `components/ui/` | 재사용 프리미티브 (Button, Card 등) |

### 상태 관리 우선순위

1. **useState** — 로컬 UI 상태
2. **React Query** — 서버 상태 (캐시, 동기화)
3. **Zustand** — 필요 시 경량 글로벌 상태 (현재 미사용)

Context는 테마/인증 등 제한적 사용만 허용. Redux, MobX 등 금지.

### API 패턴

- **`ApiResponse<T>`** — 모든 API 응답의 Union 타입 (`{ success: true, data: T } | { success: false, error: {...} }`)
- **`api.get/post/put/patch/delete`** — fetch 기반 REST 클라이언트 (`src/lib/api/client.ts`)
- **`useApiQuery` / `useApiMutation`** — React Query 래퍼. `ApiResponse<T>` 자동 처리 + Toast 연동

### 지도/시각화

- TopoJSON → GeoJSON 변환 (`topojson-client`)
- D3 projection + `fitExtent()` 전체 영역 자동 스케일링 (컨테이너 크기 동적 감지)
- `useContainerSize` 훅으로 ResizeObserver 기반 컨테이너 width/height 실시간 추적
- 레벨 변경 시 `fitExtent`가 최적 확대 비율·중앙 좌표를 자동 계산, d3-zoom identity(1x) 리셋
- 동적 import로 TopoJSON 지연 로딩 (`useTopoJsonData`)
- `React.memo` + 커스텀 `arePropsEqual`로 폴리곤 렌더링 최적화

### 폼 검증

- **React Hook Form** — 폼 상태 관리
- **Zod** — 스키마 정의 + 검증 (`@hookform/resolvers`로 연동)
- 한국어 에러 메시지, `safeParse()` 패턴

---

## 데이터 흐름

```
┌─────────────────────────────────────────────────────────┐
│  Page Component                                         │
│                                                         │
│  useApiQuery({ queryKey, queryFn })                     │
│       │                                                 │
│       ▼                                                 │
│  Feature API 함수 (features/*/api/)                     │
│       │                                                 │
│       ▼                                                 │
│  api.get/post() (lib/api/client.ts)                     │
│       │  ┌──────────────────────┐                       │
│       ├──│ Bearer token 자동첨부│ ← localStorage        │
│       │  └──────────────────────┘                       │
│       ▼                                                 │
│  fetch() → REST API (VITE_API_BASE_URL || /api)         │
│       │                                                 │
│       ▼                                                 │
│  ApiResponse<T> { success, data | error }               │
│       │                                                 │
│       ├── success: true  → data를 React Query 캐시에 저장│
│       └── success: false → Error throw + Toast 표시     │
│                                                         │
│  Section / UI Components ← data (props drilling)        │
└─────────────────────────────────────────────────────────┘
```

### Mutation 흐름

```
Form (react-hook-form) → Zod 검증 → useApiMutation → API 호출
    → 성공: onSuccess 콜백 + (선택) Toast
    → 실패: Error throw + Toast
```

### 인증 흐름

- 로그인 성공 → `localStorage`에 `auth_token` 저장 → React Query 캐시 갱신
- 모든 API 요청 → `Authorization: Bearer {token}` 자동 첨부
- `ProtectedRoute` → 토큰 유무로 인증 확인 → 미인증 시 `/login` 리다이렉트

### 라우팅

| 경로 | 페이지 | 인증 |
|------|--------|------|
| `/login` | LoginPage | 불필요 |
| `/signup` | SignupPage | 불필요 |
| `/` | DashboardPage | 필요 |
| `/region` | RegionResultPage | 필요 |
| `/pledges` | PledgesOverviewPage | 필요 |
| `/pledges/presidential` | PresidentialPledgesPage | 필요 |
| `/pledges/parliamentary` | ParliamentaryPledgesPage | 필요 |
| `/pledges/:type` | PledgesPlaceholderPage | 필요 |
| `/policy` | PolicyPage | 필요 |
| `/policy/recommendations` | AiRecommendationsPage | AI 추천 공약 전체 목록 |
| `/test` | TestPage | 필요 |

---

## 주요 규칙

### 코드 작성

- **TypeScript strict 모드** — `noUnusedLocals`, `noUnusedParameters` 활성화
- **Import alias** — 모든 프로젝트 import에 `@/` 사용 (`@/ → ./src/`)
- **Tailwind 유틸리티 우선** — 커스텀 CSS 최소화, `cn()` 함수로 조건부 클래스 병합
- **CVA** — 변형이 많은 컴포넌트 (Badge, Chip, Button)에 `class-variance-authority` 사용
- **Pointer events** — 마우스 이벤트 대신 `onPointerDown/Up/Move` 사용 (크로스 플랫폼)

### ESLint

- `no-console: warn` (`console.warn`, `console.error`는 허용)
- `@typescript-eslint/no-unused-vars: error` (접두사 `_`는 허용)

### 디자인 토큰

컬러 토큰은 3계층 구조:

1. **Primitive** — Figma Color 페이지의 원시 팔레트 (`--cool-neutral-*`, `--blue-*`, `--violet-*`, `--dpk-*`, `--ppp-*`)
2. **Semantic** — 용도 기반 토큰 (`--label-*`, `--fill-*`, `--line-*` 등), primitive를 `var()`로 참조
3. **shadcn 호환** — `--primary`, `--background` 등, primitive/semantic을 `var()`로 참조

- Figma에서 추출한 primitive + semantic token → `src/index.css`의 CSS 변수로 직접 반영
- Typography: 19단계 (`text-display-1` ~ `text-caption-3`) + weight 조합. `@theme inline`에 `--text-*` + `--text-*--line-height` 형식으로 정의 (Tailwind v4 호환)
- Tailwind 유틸리티: `@theme inline`에 `--color-{palette}-{step}` 매핑 (`bg-cool-neutral-5`, `text-violet-500` 등)
- 지도 전용 토큰: `--map-fill`, `--map-fill-hover`, `--map-fill-selected` (oklch)

> 상세: [`docs/architecture/design-tokens.md`](architecture/design-tokens.md)

### 아이콘

- `pnpm run icons:generate` — SVGR로 `design-tokens/icons/` → `src/components/icons/` 자동 변환

### 테스트

- Vitest + jsdom 환경
- `@testing-library/react`로 컴포넌트 테스트
- 테스트 파일은 `__tests__/` 폴더에 배치

### 빌드

- `pnpm run build` → `tsc -b && vite build`
- `tsc --noEmit`은 정상 동작 (타입 체크용)
- 환경 변수: `VITE_API_BASE_URL` (기본값 `/api`)
