# Region 모듈 상세 구조

> 최종 업데이트: 2026-03-12 (지역 비교분석 기능: 4 ViewMode + 비교 카드 + 차트 Switch)

---

## 개요

`src/features/region/` — 행정구역 지도 시각화, 4단계 드릴다운, 검색, 지역분석 결과 표시.

---

## 디렉토리 구조

```
features/region/
├── components/
│   ├── map/                      # 지도 관련 컴포넌트
│   │   ├── KoreaAdminMap.tsx     #   메인 지도 (드릴다운, 줌, choropleth)
│   │   ├── RegionPolygon.tsx     #   개별 폴리곤 (hover/select)
│   │   ├── MapTooltip.tsx        #   호버 툴팁
│   │   ├── MapBreadcrumb.tsx     #   드릴다운 경로
│   │   ├── RegionSearch.tsx      #   검색 자동완성
│   │   ├── MapZoomControls.tsx   #   줌 +/- 컨트롤
│   │   ├── MapLegend.tsx         #   Choropleth 범례
│   │   ├── MapSkeleton.tsx       #   로딩 스켈레톤
│   │   └── index.ts              #   re-export
│   ├── MetricListRow.tsx         # 지표 행 (라벨, 값, 단위, 델타 뱃지)
│   ├── AiAnalysisBox.tsx         # AI 기본 분석 결과 박스
│   ├── MetricActionButtons.tsx   # 분석/비교분석 액션 버튼 (preview/analysis 모드)
│   ├── MetricComparisonCard.tsx  # 비교 모드 좌우 분할 메트릭 카드
│   └── ComparisonSummaryBox.tsx  # 비교 해석 텍스트 박스
├── hooks/
│   ├── useMapDrillDown.ts        # 4단계 드릴다운 상태 관리
│   ├── useTopoJsonData.ts        # TopoJSON 동적 import + GeoJSON 변환
│   ├── useProjection.ts          # D3 geoMercator (fitExtent)
│   ├── useMapZoom.ts             # D3 줌 동작
│   └── useMapTransition.ts       # D3 전환 애니메이션
├── lib/
│   ├── choropleth-utils.ts       # oklch 색상 보간, 범례 생성
│   ├── map-theme.ts              # 지도 CSS 변수
│   ├── sido-utils.ts             # 시도 코드 ↔ 이름
│   ├── sigun-utils.ts            # 시군 유틸리티
│   └── __tests__/
│       └── choropleth-utils.test.ts
└── data/
    ├── categories.ts             # 9개 카테고리 + 서브카테고리 + 아이콘 에셋
    ├── mock-comparison.ts        # 비교분석 Mock 데이터 (메트릭, 월별추이, 해석 텍스트)
    ├── sido.topojson.json
    ├── sigun.topojson.json
    ├── sigungu.topojson.json
    └── emd.topojson.json
```

---

## 주요 컴포넌트

### MetricListRow

지표 행 컴포넌트. RegionResultPage의 우측 카드에서 사용.

```typescript
interface DeltaInfo {
  label: string;         // "전년대비", "전국평균 대비"
  value: string;         // "4.5%"
  direction: "up" | "down";
  color: "blue" | "red"; // blue=dpk, red=ppp
}

interface MetricListRowProps {
  label: string;          // "인구수"
  value: string;          // "207,018"
  unit?: string;          // "명"
  subValueBadge?: string; // "50.7%" (초록 뱃지)
  deltas?: DeltaInfo[];   // 우측 델타 (최대 2개)
}
```

- 델타 화살표: `WantedCaretUp` 아이콘 + `direction=down`일 때 `rotate-180`
- 컬러: `text-party-dpk` (blue) / `text-party-ppp` (red) CSS 변수 사용
- SubValue 뱃지: `bg-status-positive` + `opacity-[0.08]` 오버레이 기법

### AiAnalysisBox

AI 분석 결과 표시. `WantedMagicWand` 아이콘 + primary 배경.

```typescript
interface AiAnalysisBoxProps {
  label?: string;  // 기본값 "기본 분석 결과"
  text: string;
}
```

- 배경: `bg-primary-alpha-5`
- 테두리: `border-primary` 1.5px + `rounded-2xl`

---

## CategoryNav 아이콘 렌더링

`categories.ts`에 정의된 9개 카테고리는 각각 Figma에서 추출한 PNG 마스크 아이콘을 보유.

### 렌더링 방식: CSS `mask-luminance`

```css
background-color: {iconColor};
mask-image: url({iconAsset});
mask-mode: luminance;
mask-size: 39px 39px;
mask-position: 5.5px 5.5px;
```

- `mask-mode: luminance` — 마스크 PNG의 밝기(luminance)로 불투명도 결정
  - 밝은(흰) 영역 → 완전 불투명 (배경색 표시)
  - 어두운 영역 → 반투명 (배경색이 연하게 표시)
  - 검은 영역 → 투명 (숨김)
- 이 방식으로 단일 배경색 + 단일 마스크 PNG만으로 다층 톤 아이콘 표현
- 컨테이너 크기: 50×50px
- 에셋 경로: `src/assets/category-icons/{id}.png`

### 아이콘 에셋 없을 때 폴백

`iconAsset`이 없으면 이니셜 원형(배경색 원 + 첫 글자) 렌더링.

### SubcategoryPanel hover 동작

- **표시 조건**: `hoveredCategoryId`가 설정된 경우에만 패널 표시. `selectedCategoryId`로 폴백하지 않음.
- **숨김**: wrapper div의 `onPointerLeave`에서 `hoveredCategoryId`를 `null`로 초기화하여 패널 숨김.
- **스크롤 시 숨김**: `window` scroll 이벤트 리스너로 `hoveredCategoryId`를 `null`로 초기화. GNB 패널 슬라이드 닫힘과 SubcategoryPanel 숨김이 동기화됨.
- **Hover gap 방지**: wrapper div에 `pb-2` 추가, SubcategoryPanel에서 `mt-2` 제거. 이를 통해 카테고리 행과 패널 사이에 커서가 wrapper 밖으로 벗어나지 않음.
- **z-index**: `z-20` — GNB sticky 컨테이너(`z-30`)보다 낮아 스크롤 시 GNB 아래로 가려짐.

---

## RegionResultPage 레이아웃

Figma `R.2.0.지역분석-결과` 기반. 4가지 ViewMode로 조건부 렌더링.

### ViewMode 상태 전환

```
default ──(지도 타 지역 클릭)──→ preview
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             │             ▼
               analysis          │          compare
          ("분석 결과 보기")       │    ("비교분석 하기")
                    │             │             │
                    └─("비교분석")─┘    ("초기화")─┘ → preview
                                                │
지도 새 지역 클릭 → preview (어느 모드에서든)
지도 내 선거구 클릭 → default (어느 모드에서든)
```

| 모드 | 메트릭 카드 | 하단 차트 | 버튼 |
|------|------------|----------|------|
| **default** | 내 선거구 데이터 + "내 선거구" 뱃지 | 내 선거구 추이 | 없음 |
| **preview** | 선택 지역 데이터 | 내 선거구 추이 (유지) | "분석 결과 보기" + "비교분석 하기" |
| **analysis** | 선택 지역 데이터 | 선택 지역 추이 | "비교분석 하기" |
| **compare** | 좌우 분할 카드 + 비교 해석 박스 | Switch 토글 (Grouped Bar / 분리) | "초기화" 우상단 |

### 레이아웃 (default/preview/analysis)

```
┌──────────────────────────────────────────────────┐
│  [GNB] Header (sticky) + Chevron → GnbPanel      │
├──────────────────────────────────────────────────┤
│  CategoryNav (9개 카테고리 + 서브카테고리 패널)     │
├──────────────────────────────────────────────────┤
│  Heading: {서브카테고리명} + Badge{지역명}          │
├──────────────────────────────────────────────────┤
│  AiAnalysisBox: AI 분석 텍스트                    │
├───────────────────────┬──────────────────────────┤
│  CardSection (지도)    │  CardSection (지표)       │
│  KoreaAdminMap        │  MetricListRow × 5        │
│                       │  [MetricActionButtons]    │
├───────────────────────┴──────────────────────────┤
│  CardSection (차트)                               │
│  Chip 필터 3개 + BarChart                         │
└──────────────────────────────────────────────────┘
```

### 레이아웃 (compare)

```
├───────────────────────┬──────────────────────────┤
│  CardSection (지도)    │  MetricComparisonCard     │
│  KoreaAdminMap        │  ┌────────┬────────┐     │
│                       │  │ 내 선거구│ 선택 지역│    │
│                       │  └────────┴────────┘     │
│                       │  ComparisonSummaryBox     │
│                       │  [초기화] 우상단           │
├───────────────────────┴──────────────────────────┤
│  CardSection (비교 차트)              [Switch 토글] │
│  Grouped Bar (off) / 좌우 분리 (on)               │
└──────────────────────────────────────────────────┘
```

### 상태 관리 (useState)

| 상태 | 타입 | 초기값 | 용도 |
|------|------|--------|------|
| `selectedCategoryId` | `string` | `"voter"` | 카테고리 선택 |
| `selectedSubcategoryId` | `string \| null` | `"population"` | 서브카테고리 선택 |
| `activeChip` | `ChipFilter` | `"monthly"` | 차트 필터 |
| `viewMode` | `ViewMode` | `"default"` | 4가지 뷰 모드 |
| `selectedRegion` | `{ code, name, fullName } \| null` | `null` | 지도에서 선택한 지역 |
| `compareChartSplit` | `boolean` | `false` | 비교 차트 분리 보기 토글 |

- `handleSubcategorySelect`는 `categoryId`도 함께 받아 `selectedCategoryId`를 동기화.
- `handleRegionSelect`는 내 선거구 클릭 시 `default`, 타 지역 클릭 시 `preview`로 전환.
- 파생 값: `regionDisplayName`, `currentMetrics`, `currentChartData`, `chartTitle`, `compareChartConfig`

### 비교 모드 컴포넌트

- **MetricActionButtons** — `showAnalysis` prop으로 "분석 결과 보기" 버튼 조건부 표시. Button `default` + `outline` variant 사용.
- **MetricComparisonCard** — 좌우 분할 카드 (`grid-cols-2`). 내 선거구(primary 색상) vs 선택 지역(status-negative 색상). 하단에 ComparisonSummaryBox. 우상단 "초기화" 텍스트 버튼.
- **ComparisonSummaryBox** — `bg-primary-alpha-5` 배경 + primary 제목. 디자인 추후 Figma 확정.

### 차트 비교 모드

- **Grouped Bar** (Switch off) — `mergeMonthlyData()`로 두 데이터셋을 합산. `ChartConfig.series`에 2개 시리즈(primary + red) 지정.
- **분리 보기** (Switch on) — `grid-cols-2`로 각 지역 독립 BarChart 렌더링.
- Switch 위치: `CardSectionHeader.trailingContent`

### 데이터

현재 모든 데이터는 `mock-comparison.ts`의 하드코딩 Mock 상수. API 연동 전 단계.
- `MY_REGION` — 내 선거구 정보 (name, fullName, districtName)
- `MY_REGION_METRICS` / `SELECTED_REGION_METRICS` — 각 지역 메트릭
- `MY_REGION_MONTHLY` / `SELECTED_REGION_MONTHLY` — 월별 추이 데이터
- `mergeMonthlyData()` — 두 데이터셋을 월 기준으로 인덱스 매칭 (API 연동 시 키 기반 조인으로 변경 필요)

### 카드 스타일

Dashboard의 `CardSection`(shadow 기반)과 달리, Region 결과 페이지는 `border border-line-neutral rounded-3xl` 스타일 사용.

---

## 의존 관계

```
RegionResultPage
├── CategoryNav (components/ui) × 2 — 페이지 내 + GnbPanel 포탈 (상태 공유)
├── CardSectionHeader (components/ui)
├── Chip (components/ui)
├── Badge (components/ui)
├── Switch (components/ui) — 비교 차트 분리 보기 토글
├── BarChart (components/charts)
├── KoreaAdminMap (region/components/map)
├── MetricListRow (region/components)
│   └── WantedCaretUp (components/icons)
├── AiAnalysisBox (region/components)
│   └── WantedMagicWand (components/icons)
├── MetricActionButtons (region/components) — 분석/비교 버튼
│   └── Button (components/ui)
├── MetricComparisonCard (region/components) — 비교 모드 좌우 카드
│   ├── CardSectionHeader (components/ui)
│   ├── MetricListRow (region/components)
│   └── ComparisonSummaryBox (region/components)
├── CATEGORIES, SUBCATEGORIES (region/data/categories)
│   └── category-icons/*.png (assets)
└── mock-comparison.ts (region/data) — Mock 데이터 + 유틸리티
```
