# Region 모듈 상세 구조

> 최종 업데이트: 2026-04-01

---

## 개요

`src/features/region/` — 행정구역 지도 시각화, 4단계 드릴다운, 선거구 뷰 모드, 검색, 지역분석 결과 표시.

---

## 디렉토리 구조

```
features/region/
├── components/
│   ├── map/                      # 지도 관련 컴포넌트
│   │   ├── KoreaAdminMap.tsx     #   메인 지도 (드릴다운, 줌, choropleth, 선거구 뷰)
│   │   ├── RegionPolygon.tsx     #   개별 폴리곤 (hover/select)
│   │   ├── MapTooltip.tsx        #   호버 툴팁
│   │   ├── MapBreadcrumb.tsx     #   드릴다운 경로 (선거구 드릴다운 포함)
│   │   ├── RegionSearch.tsx      #   검색 자동완성
│   │   ├── MapZoomControls.tsx   #   줌 +/- 컨트롤
│   │   ├── MapLegend.tsx         #   Choropleth 범례
│   │   ├── MapSkeleton.tsx       #   로딩 스켈레톤
│   │   └── index.ts              #   re-export
│   ├── MetricListRow.tsx         # 지표 행 (라벨, 값, 단위, 델타 뱃지)
│   ├── AiAnalysisBox.tsx         # AI 기본 분석 결과 박스
│   └── MetricActionButtons.tsx   # 분석 결과 보기 액션 버튼 (preview 모드)
├── hooks/
│   ├── useMapDrillDown.ts        # 4단계 드릴다운 상태 관리
│   ├── useTopoJsonData.ts        # TopoJSON 동적 import + GeoJSON 변환
│   ├── useProjection.ts          # D3 geoMercator (fitExtent 전체 영역)
│   ├── useMapZoom.ts             # D3 줌 동작 (identity 리셋, 1x~8x)
│   ├── useMapTransition.ts       # D3 전환 애니메이션
│   └── useHeatmapMode.ts        # 히트맵 모드 상태 관리 (카테고리→choropleth)
├── lib/
│   ├── choropleth-utils.ts       # oklch 색상 보간, 범례 생성
│   ├── constituency-colors.ts    # 선거구 OKLCH 8색 팔레트 + EMD→선거구 색상 맵 빌드
│   ├── map-theme.ts              # 지도 CSS 변수 (fill, hover, stroke, strokeHover)
│   ├── sido-utils.ts             # 시도 코드 ↔ 이름
│   ├── sigun-utils.ts            # 시군 유틸리티
│   └── __tests__/
│       └── choropleth-utils.test.ts
└── data/
    ├── categories.ts             # 9개 카테고리 + 서브카테고리 + 아이콘 에셋
    ├── heatmap-configs.ts        # 히트맵 카테고리 설정 + mock 데이터 생성 함수
    ├── mock-comparison.ts        # 비교분석 Mock 데이터
    ├── mock-constituency-tooltip.ts  # 선거구별 mock 툴팁 데이터 (Proxy 기반)
    ├── sido.topojson.json
    ├── constituencies.topojson.json  # 22대 국회의원 선거구 경계 (254개, SGG_Code 속성)
    ├── sigun.topojson.json
    ├── sigungu.topojson.json
    └── emd.topojson.json             # 읍면동 경계 (3,558개, SGG_Code로 선거구 매핑)
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
- 반응형: Body 영역 `flex-wrap` + `gap-y-1` — 너비 부족 시 subValueBadge와 deltas가 줄바꿈

### AiAnalysisBox

AI 분석 결과 표시. `WantedMagicWand` 아이콘 + primary 배경.

- 배경: `bg-primary-alpha-5`
- 비교 차트 카드 내부에서는 `border-[1.5px] border-primary` 추가

---

## 지도 (Map)

### RegionPolygon hover/selected stroke

- **기본 상태**: `strokeWidth: 0.5`, `stroke: mapColors.stroke` (무채색)
- **hover/selected 상태**: `strokeWidth: 3`, `stroke: mapColors.strokeHover` (고채도 파란색)
- CSS 변수: `--map-stroke-hover` (Light: `oklch(0.45 0.2 250)`, Dark: `oklch(0.7 0.2 250)`)
- 전환 애니메이션: `transition: fill 150ms, stroke 150ms, stroke-width 150ms`

### SVG 4-layer 렌더링 (z-index 대체)

SVG는 CSS z-index가 아닌 DOM 순서로 렌더링 우선순위가 결정됨. `KoreaAdminMap`에서 `regionData.map()`을 세 번 순회 + 선거구 오버레이:

1. **Layer 1**: 비활성 폴리곤 `<path>`만 렌더링 (`showLabel={false}`)
2. **Layer 2**: 비활성 폴리곤 `<text>` label만 렌더링 — 모든 path 위에 그려져 인접 폴리곤에 가리지 않음
3. **Layer 3**: hover/selected 폴리곤 `<path>` + `<text>` 함께 렌더링 (최상위)
4. **Layer 4**: 선거구 경계 오버레이 (선거구 개요 모드에서만) — SVG `clipPath` + `evenodd` 규칙으로 외곽선만 표시

Layer 2의 `<text>`는 `mapColors.label` 색상, `fontSize={10}`, `pointerEvents="none"` — `RegionPolygon` 내부 label과 동일 스타일.

이를 통해:
- 모든 label이 인접 폴리곤 fill 위에 표시됨
- hover된 폴리곤의 3px stroke가 다른 폴리곤 위에 항상 표시됨
- 선거구 외곽선만 두껍게 표시됨 (내부 행정동 경계 제외)

### Auto-fit Zoom (동적 컨테이너 크기 감지)

`KoreaAdminMap`은 `useContainerSize` 훅(`src/hooks/useContainerSize.ts`)으로 컨테이너의 실제 width/height를 ResizeObserver로 감지한다.

- `useProjection`이 `fitExtent()`로 전체 컨테이너 영역(`[padding, width-padding] × [padding, height-padding]`)에 피처를 최적 맞춤
- `useMapZoom`의 초기/리셋 transform = `zoomIdentity` (1x, translate 없음)
- 레벨 변경 시 `smoothZoomReset()`으로 identity 리셋 → projection 재계산과 함께 새 피처가 뷰포트를 최대한 채움
- 줌 범위: 1x ~ 8x (MIN_ZOOM ~ MAX_ZOOM)
- 컨테이너 측정 전 fallback: `config.width ?? 600`, `config.height ?? 800`

### 선거구 뷰 모드

읍면동 레벨에서 22대 국회의원 선거구 단위로 행정동을 그룹화하여 시각화하는 모드.

#### 데이터 흐름

```
constituencies.topojson.json → useTopoJsonData
  → constituencyInfoMap (SGG_Code → { sgg, sidoSgg, sido })

emd.topojson.json의 SGG_Code 속성
  → buildConstituencyColorMap() → EMD_CD → { sggCode, base, hover } 색상 맵
```

- 모든 3,558개 EMD에 `SGG_Code` 속성이 존재 (매핑 누락 0건)
- 254개 선거구 (22대 국회의원선거 2024 기준)

#### 상태 관리

| 상태 | 타입 | 초기값 | 용도 |
|------|------|--------|------|
| `isConstituencyMode` | `boolean` | `true` | 선거구 뷰 ON/OFF |
| `selectedConstituency` | `string \| null` | `null` | 선거구 드릴다운 시 SGG_Code |
| `selectedConstituencyName` | `string \| null` | `null` | 선거구명 (브레드크럼용) |

#### 2가지 모드

1. **선거구 개요** (`isConstituencyMode && !selectedConstituency`)
   - 같은 선거구의 EMD는 동일 색상 (OKLCH 8색 팔레트, 최대 hue 분리)
   - 개별 EMD hover 비활성, 선거구 단위로 hover/select
   - hover 시 Layer 4 외곽선 오버레이: SVG compound path + `clipPath(evenodd)` → 외곽선만 표시
   - 클릭 시 선거구 드릴다운 전환

2. **선거구 드릴다운** (`isConstituencyMode && selectedConstituency`)
   - 해당 선거구의 EMD만 `effectiveFeatureCollection`으로 필터
   - `useProjection`이 필터된 EMD에 자동 fit → 선거구 영역 확대
   - 개별 EMD hover/select 활성 (일반 모드와 동일)
   - 토글 스위치 숨김, 브레드크럼에 선거구명 추가

#### SVG 외곽선 오버레이 (clip-path 기법)

```
선거구의 EMD pathD 합치기 → compound SVG path
  ↓
clipPath: 전체 뷰포트 rect + compound path (evenodd)
  → 클립 영역 = 선거구 외부만
  ↓
compound path에 strokeWidth=6 적용 + clipPath 적용
  → 외부 절반(3px)만 표시, 내부 EMD 경계 완전 제거
```

#### 자동 리셋 조건

- 레벨이 `eupMyeonDong`이 아닐 때 → OFF
- `searchNavigation` 변경 시 → ON으로 리셋
- `choroplethData` 활성 시 → OFF (상호 배타)

#### RegionPolygon fill 우선순위

```
fillOverride > isSelected > isHovered > default
```

`fillOverride`가 있으면 항상 우선 (선거구/choropleth 색상 유지). hover/selected 피드백은 stroke로만 제공.

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
- 컨테이너 크기: 50×50px
- 에셋 경로: `src/assets/category-icons/{id}.png`

### SubcategoryPanel hover 동작

- **표시 조건**: `hoveredCategoryId`가 설정된 경우에만 패널 표시
- **숨김**: wrapper div의 `onPointerLeave`에서 `hoveredCategoryId`를 `null`로 초기화
- **스크롤 시 숨김**: `window` scroll 이벤트 리스너로 `hoveredCategoryId` 초기화
- **Hover gap 방지**: wrapper div에 `pb-2` 추가, SubcategoryPanel에서 `mt-2` 제거
- **z-index**: `z-20` — GNB sticky 컨테이너(`z-30`)보다 낮음

---

## RegionResultPage 레이아웃

Figma `R.2.0.지역분석-결과` 기반. 3가지 ViewMode로 조건부 렌더링.

### ViewMode 상태 전환

```
default ──(지도 타 지역 클릭)──→ preview
                                  │
                                  ▼
                              analysis
                         ("분석 결과 보기")

지도 새 지역 클릭 → preview (어느 모드에서든)
지도 내 선거구 클릭 → default (어느 모드에서든)
```

| 모드 | 메트릭 카드 | 하단 차트 | 버튼 |
|------|------------|----------|------|
| **default** | 내 선거구 데이터 + "내 선거구" 뱃지 | 내 선거구 추이 | 없음 |
| **preview** | 선택 지역 데이터 | 내 선거구 추이 (유지) | "분석 결과 보기" |
| **analysis** | 선택 지역 데이터 | 선택 지역 추이 | 없음 |

### 뷰 탭 (ViewTab)

"그래프 보기" / "표 보기" / "트리맵 보기" 3개 pill 버튼. `rounded-full`, `bg-surface-inverse` (active) / `bg-surface-primary` (default). 기존 `CHIP_FILTERS` (연도별/분기별/월별)를 `VIEW_TABS`로 대체. 모든 ViewMode의 차트 영역에서 공통 사용.

| ViewTab | 렌더링 |
|---------|--------|
| `"graph"` | `BarChart` (기존 차트) |
| `"table"` | `DataTable` (`components/tables`) — `ChartData`/`ChartConfig` 타입 재사용 |
| `"treemap"` | placeholder (Coming Soon) |

### 차트 설정

| 속성 | 값 | 설명 |
|------|-----|------|
| `barSize` | `20` | 바 너비 고정 20px |
| `barGap` | `4` | 같은 카테고리 내 바 간격 4px |
| `barRadius` | `6` | 바 상단 모서리 둥글기 6px |
| `height` | `560` | 차트 높이 560px |

### 상태 관리 (useState)

| 상태 | 타입 | 초기값 | 용도 |
|------|------|--------|------|
| `selectedCategoryId` | `string` | `"voter"` | 카테고리 선택 |
| `selectedSubcategoryId` | `string \| null` | `"population"` | 서브카테고리 선택 |
| `activeViewTab` | `ViewTab` | `"graph"` | 뷰 탭 (graph/table/treemap, 모든 모드 공통) |
| `viewMode` | `ViewMode` | `"default"` | 3가지 뷰 모드 |
| `selectedRegion` | `{ code, name, fullName } \| null` | `null` | 지도에서 선택한 지역 |

### 지도 초기 드릴다운

`KoreaAdminMap`에 `searchNavigation={MY_REGION_NAV}`를 전달하여 페이지 로딩 시 기본 선거구(강남구) 읍면동 레벨로 자동 드릴다운. 선거구 뷰 모드는 기본 ON (`isConstituencyMode` 초기값 `true`).

### 데이터

현재 모든 데이터는 `mock-comparison.ts`의 하드코딩 Mock 상수. API 연동 전 단계.
- `MY_REGION` — 내 선거구 정보
- `MY_REGION_METRICS` / `SELECTED_REGION_METRICS` — 각 지역 메트릭
- `MY_REGION_MONTHLY` / `SELECTED_REGION_MONTHLY` — 월별 추이 데이터
- `MY_REGION_NAV` — 내 선거구 지도 초기 네비게이션

---

## 의존 관계

```
RegionResultPage
├── CategoryNav (components/ui) × 2 — 페이지 내 + GnbPanel 포탈
├── CardSectionHeader (components/ui)
├── DataTable (components/tables) — 표 보기 탭
├── Badge (components/ui)
├── BarChart (components/charts) — barSize/barGap/barRadius
├── KoreaAdminMap (region/components/map) — hover stroke 3px, auto-fit zoom, 선거구 뷰
├── MetricListRow (region/components)
├── AiAnalysisBox (region/components)
├── MetricActionButtons (region/components)
├── CATEGORIES, SUBCATEGORIES (region/data/categories)
├── mock-comparison.ts (region/data)
└── CONSTITUENCY_TOOLTIP_MOCK (region/data/mock-constituency-tooltip)
```

---

## 히트맵 모드

히트맵 모드는 CategoryNav에서 카테고리를 선택했을 때 지도 위에 Choropleth 색상 오버레이를 표시하는 기능.

### 전환 흐름

```
CategoryNav 카테고리 선택 (categoryId 변경)
  ↓
useHeatmapMode 활성화 (categoryId 인자로 받음)
  ↓
카테고리별 mock 데이터 → ChoroplethData/Config 생성
  ↓
KoreaAdminMap에 choroplethData 전달 (지도는 mode를 모름)
  ↓
RegionPolygon이 choroplethData 활성 여부로 색상 결정
```

### useHeatmapMode 훅

```typescript
interface HeatmapModeState {
  categoryId: string | null;     // 현재 히트맵 카테고리 ID
  choroplethData: ChoroplethData | null;
  choroplethConfig: ChoroplethConfig | null;
  forcedOff: boolean;            // 사용자가 명시적으로 히트맵 끈 상태
}

function useHeatmapMode() {
  // categoryId → heatmap-configs.ts의 HEATMAP_CATEGORY_CONFIGS 참조
  // 선택된 레벨(level)의 지역 코드 목록(visibleCodes) → choropleth 데이터 생성
  // 결과: ChoroplethData (지역코드→값 매핑) + ChoroplethConfig (범례, 색상 스케일)

  // forcedOff 리셋 로직:
  // - categoryId가 새로 설정되면 forcedOff = false (자동 활성화)
  // - 사용자가 "히트맵 끄기" 클릭 시 forcedOff = true
}
```

### TooltipDataProvider 콜백 패턴

`KoreaAdminMap`의 `tooltipDataProvider` prop은 모드를 인지하지 않는 순수 함수:

```typescript
tooltipDataProvider={(regionCode: string) => {
  // 지역 코드 → 툴팁 데이터
  // KoreaAdminMap은 이 함수만 호출, mode/heatmap 로직을 모름
}}
```

부모 컴포넌트에서:
- Choropleth 활성 → 함수에서 choroplethData[regionCode]의 값을 포함한 데이터 반환
- Choropleth 비활성 → 기본 지역 정보만 반환

### Disabled Fill (3-way 로직)

RegionPolygon의 fill 색상 결정:

```
IF choroplethData 활성 AND 지역코드 in choroplethData:
  → oklch 스케일 색상
ELSE IF choroplethData 활성 AND 지역코드 NOT in choroplethData:
  → mapColors.fillDisabled (약 20% 회색)
ELSE:
  → mapColors.fill (기본 중립 색상)
```

### 히트맵 끄기 버튼

CategoryNav 또는 지도 영역에 "히트맵 끄기" 버튼 배치:

```typescript
function deactivateHeatmap() {
  // forcedOff = true (히트맵 시각적 비활성화)
  // (주의) categoryId는 유지 — 버튼 다시 누르면 자동 복구 가능
}

// 자동 리셋 트리거:
// - CategoryNav에서 다른 카테고리 선택
// - RegionPolygon 선택 (level 변경) → useMapDrillDown 발동 → categoryId 초기화
```

### 향후 확장

- **HEATMAP_CATEGORY_CONFIGS**: `src/features/region/data/heatmap-configs.ts`
  - 새 카테고리 추가 시 여기에만 config 및 mock 데이터 생성 함수 추가
  - 서브카테고리 단위 제어 가능 (e.g., `population.young`, `population.elderly`)
  - 각 카테고리별 mock 데이터 스키마 통일

- **choroplethData 소스 교체**:
  - 현재: mock 데이터
  - 향후: API 연동 시 `useApiQuery` 로 데이터 페칭 + `useHeatmapMode`에서 처리
