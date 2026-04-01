# 선거구 단위 뷰 모드 — 구현 계획

> 작성일: 2026-04-01
> 스펙: `docs/superpowers/specs/2026-04-01-constituency-view-mode-design.md`
> 상태: approved (리뷰 2회차 통과)

---

## 1. 이슈 구조

단일 이슈로 구현. 변경 범위가 KoreaAdminMap 내부에 집중되어 분리 시 오히려 의존성 관리가 복잡해짐.

---

## 2. 파일 변경 목록

### 2-1. 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/types/map.ts` | `ConstituencyInfo` 타입 추가 |
| `src/features/region/hooks/useTopoJsonData.ts` | constituencies.topojson.json 로딩, `constituencyInfoMap` 반환 추가 |
| `src/features/region/components/map/RegionPolygon.tsx` | fill 우선순위 변경: `fillOverride` > hover/selected |
| `src/features/region/components/map/KoreaAdminMap.tsx` | 선거구 모드 상태, 토글 UI, 색상 맵, 그룹 hover/click/select, 툴팁 |
| `src/app/routes/RegionResultPage.tsx` | `selectedCode` prop 전달, `onConstituencyModeChange` 핸들러, mock 데이터 주입 |

### 2-2. 신규 파일

| 파일 | 내용 |
|------|------|
| `src/features/region/lib/constituency-colors.ts` | 선거구 색상 팔레트 상수 + EMD→색상 맵 빌더 |
| `src/features/region/data/mock-constituency-tooltip.ts` | SGG_Code별 mock MapTooltipData |

---

## 3. 구현 상세

### Step 1: 타입 정의

**`src/types/map.ts`에 추가:**

```typescript
/** 선거구 정보 (SGG_Code → 속성 매핑용) */
export interface ConstituencyInfo {
  sggCode: string;   // "2112301"
  sgg: string;       // "강남갑"
  sidoSgg: string;   // "서울 강남갑"
  sido: string;      // "서울"
}
```

### Step 2: 데이터 로딩 확장

**`src/features/region/hooks/useTopoJsonData.ts` 수정:**

TopoJsonDataState 인터페이스에 추가:
```typescript
interface TopoJsonDataState {
  // ... 기존 4개 필드 ...
  /** 선거구 SGG_Code → ConstituencyInfo 매핑 */
  constituencyInfoMap: Map<string, ConstituencyInfo> | null;
  isLoading: boolean;
  error: string | null;
}
```

로딩 로직:
```typescript
const CONSTITUENCY_TOPOJSON_OBJECT_KEY = "2024_22_Elec_simplify";

// Promise.all에 5번째 항목 추가
const [sidoModule, sigunModule, sigunguModule, emdModule, constituencyModule] =
  await Promise.all([
    import("@/features/region/data/sido.topojson.json"),
    import("@/features/region/data/sigun.topojson.json"),
    import("@/features/region/data/sigungu.topojson.json"),
    import("@/features/region/data/emd.topojson.json"),
    import("@/features/region/data/constituencies.topojson.json"),
  ]);

// geometry 변환 불필요 — properties만 추출
const constituencyTopo = constituencyModule.default as any;
const geoms = constituencyTopo.objects[CONSTITUENCY_TOPOJSON_OBJECT_KEY].geometries;
const constituencyInfoMap = new Map<string, ConstituencyInfo>();
for (const g of geoms) {
  const p = g.properties;
  constituencyInfoMap.set(p.SGG_Code, {
    sggCode: p.SGG_Code,
    sgg: p.SGG,
    sidoSgg: p.SIDO_SGG,
    sido: p.SIDO,
  });
}
```

초기값과 에러 시: `constituencyInfoMap: null`

### Step 3: RegionPolygon fill 우선순위 변경

**`src/features/region/components/map/RegionPolygon.tsx` 수정:**

**변경 전:**
```typescript
const fill = isSelected
  ? mapColors.fillSelected
  : isHovered
    ? mapColors.fillHover
    : (fillOverride ?? mapColors.fill);
```

**변경 후:**
```typescript
// fillOverride가 있으면 항상 우선 (선거구/choropleth 색상 유지)
// hover/selected 피드백은 stroke로만 제공
const fill = fillOverride
  ?? (isSelected
    ? mapColors.fillSelected
    : isHovered
      ? mapColors.fillHover
      : mapColors.fill);
```

**근거:** Figma annotation "기존 선택된 영역은 색상 그대로 유지". hover/selected 피드백은 stroke 3px + strokeHover 색상으로 충분. choropleth 모드에서도 hover 시 데이터 색상이 유지되어 더 나은 UX.

**arePropsEqual 업데이트 불필요:** `fillOverride`는 이미 비교 항목에 포함.

### Step 4: 선거구 색상 유틸

**`src/features/region/lib/constituency-colors.ts` (신규):**

```typescript
import type { ConstituencyInfo } from "@/types/map";

/** 선거구 구분 색상 팔레트 — 인접 인덱스 간 hue 차이 극대화 */
export const CONSTITUENCY_PALETTE: ReadonlyArray<{ base: string; hover: string }> = [
  { base: "oklch(0.65 0.18 280)", hover: "oklch(0.60 0.24 280)" },  // 보라
  { base: "oklch(0.65 0.15 185)", hover: "oklch(0.60 0.21 185)" },  // 청록
  { base: "oklch(0.70 0.15 60)",  hover: "oklch(0.65 0.21 60)"  },  // 주황
  { base: "oklch(0.65 0.15 340)", hover: "oklch(0.60 0.21 340)" },  // 핑크
  { base: "oklch(0.72 0.12 280)", hover: "oklch(0.67 0.18 280)" },  // 연보라
  { base: "oklch(0.65 0.15 145)", hover: "oklch(0.60 0.21 145)" },  // 녹색
  { base: "oklch(0.65 0.15 25)",  hover: "oklch(0.60 0.21 25)"  },  // 코랄
  { base: "oklch(0.70 0.12 220)", hover: "oklch(0.65 0.18 220)" },  // 하늘
];

export interface ConstituencyColorEntry {
  base: string;
  hover: string;
  sggCode: string;
}

/**
 * 현재 뷰의 EMD FeatureCollection에서 EMD_CD → 선거구 색상 맵을 빌드한다.
 * eupMyeonDong 레벨에서만 호출할 것.
 *
 * @param emdFeatures eupMyeonDong 레벨의 FeatureCollection (EMD_CD, SGG_Code 필수)
 */
export function buildConstituencyColorMap(
  emdFeatures: GeoJSON.FeatureCollection,
): Map<string, ConstituencyColorEntry> {
  // 1. 고유 SGG_Code 추출 + 정렬
  const sggCodes = new Set<string>();
  for (const f of emdFeatures.features) {
    const code = f.properties?.SGG_Code as string | undefined;
    if (code) sggCodes.add(code);
  }
  const sortedSggCodes = [...sggCodes].sort();

  // 2. SGG_Code → 팔레트 인덱스 배정
  const sggToColor = new Map<string, { base: string; hover: string }>();
  sortedSggCodes.forEach((code, i) => {
    sggToColor.set(code, CONSTITUENCY_PALETTE[i % CONSTITUENCY_PALETTE.length]);
  });

  // 3. EMD_CD → 색상 + SGG_Code 매핑
  const result = new Map<string, ConstituencyColorEntry>();
  for (const f of emdFeatures.features) {
    const emdCd = f.properties?.EMD_CD as string;
    const sggCode = f.properties?.SGG_Code as string;
    const colors = sggToColor.get(sggCode);
    if (emdCd && colors) {
      result.set(emdCd, { ...colors, sggCode });
    }
  }
  return result;
}
```

### Step 5: KoreaAdminMap 핵심 변경

**`src/features/region/components/map/KoreaAdminMap.tsx` 수정:**

#### 5-1. 새 Props

```typescript
export interface KoreaAdminMapProps {
  // ... 기존 ...
  /** 선거구 모드 변경 콜백 */
  onConstituencyModeChange?: (isOn: boolean) => void;
  /** 선거구 모드 툴팁 데이터 (SGG_Code → MapTooltipData) */
  constituencyTooltipData?: Record<string, MapTooltipData>;
}
```

#### 5-2. useTopoJsonData 디스트럭처링 업데이트

```typescript
const {
  sidoFeatures,
  sigunFeatures,
  sigunguFeatures,
  emdFeatures,
  constituencyInfoMap,  // 추가
  isLoading: isDataLoading,
  error: dataError,
} = useTopoJsonData();
```

#### 5-3. 내부 상태 + 자동 리셋

```typescript
const [isConstituencyMode, setIsConstituencyMode] = useState(false);

// 레벨 변경 시 자동 리셋
useEffect(() => {
  if (currentLevel !== "eupMyeonDong") {
    setIsConstituencyMode(false);
  }
}, [currentLevel]);

// searchNavigation 변경 시 자동 리셋
useEffect(() => {
  setIsConstituencyMode(false);
}, [searchNavigation]);

// 히트맵 활성 시 자동 리셋
useEffect(() => {
  if (choroplethData) {
    setIsConstituencyMode(false);
  }
}, [choroplethData]);
```

#### 5-4. 선거구 색상 맵 (useMemo)

```typescript
const constituencyColorMap = useMemo(() => {
  if (!isConstituencyMode || currentLevel !== "eupMyeonDong") return null;
  return buildConstituencyColorMap(featureCollection);
}, [isConstituencyMode, currentLevel, featureCollection]);
```

#### 5-5. Ref 패턴 (stale closure 방지)

RegionPolygon의 `React.memo(arePropsEqual)`가 `onHover`/`onClick` 비교를 제외하므로, 콜백 내에서 최신 값을 읽기 위해 ref 사용:

```typescript
const constituencyColorMapRef = useRef(constituencyColorMap);
constituencyColorMapRef.current = constituencyColorMap;

const constituencyInfoMapRef = useRef(constituencyInfoMap);
constituencyInfoMapRef.current = constituencyInfoMap;

const isConstituencyModeRef = useRef(isConstituencyMode);
isConstituencyModeRef.current = isConstituencyMode;
```

#### 5-6. hover 로직 변경

```typescript
// 선거구 모드에서 hoveredConstituencyCode 파생
const hoveredConstituencyCode = useMemo(() => {
  if (!isConstituencyMode || !hoveredCode || !constituencyColorMap) return null;
  return constituencyColorMap.get(hoveredCode)?.sggCode ?? null;
}, [isConstituencyMode, hoveredCode, constituencyColorMap]);

// handleHover — ref로 최신 상태 접근 (deps 유지 = [])
const handleHover = useCallback(
  (region: MapRegion | null, e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (!region) { setHoveredCode(null); setTooltip(null); return; }
    setHoveredCode(region.code);

    // 선거구 모드: tooltip region을 선거구 정보로 교체
    const cMode = isConstituencyModeRef.current;
    const cMap = constituencyColorMapRef.current;
    const cInfo = constituencyInfoMapRef.current;

    let tooltipRegion = region;
    if (cMode && cMap && cInfo) {
      const sggCode = cMap.get(region.code)?.sggCode;
      const info = sggCode ? cInfo.get(sggCode) : null;
      if (info) {
        tooltipRegion = { code: info.sggCode, sido: info.sido, name: info.sgg, fullName: info.sidoSgg };
      }
    }
    setTooltip({ region: tooltipRegion, position: { x: e.clientX, y: e.clientY } });
  },
  [],
);
```

#### 5-7. click 로직 변경

eupMyeonDong 레벨의 기존 분기에 선거구 모드 추가:

```typescript
} else {
  // 읍면동 레벨
  const cMode = isConstituencyModeRef.current;
  const cMap = constituencyColorMapRef.current;
  const cInfo = constituencyInfoMapRef.current;

  if (cMode && cMap && cInfo) {
    const sggCode = cMap.get(region.code)?.sggCode;
    const info = sggCode ? cInfo.get(sggCode) : null;
    if (info) {
      onRegionSelect?.({
        code: info.sggCode,
        sido: info.sido,
        name: info.sgg,
        fullName: info.sidoSgg,
      });
      return;
    }
  }
  onRegionSelect?.(region);
}
```

#### 5-8. 렌더링 — isActive 판별 변경

3-Layer 렌더링 전체에서 isActive 계산:

```typescript
// regionData.map 내부 (Layer 1, 2, 3 공통 로직)
const emdSggCode = constituencyColorMap?.get(region.code)?.sggCode;

const isHovered = isConstituencyMode
  ? emdSggCode != null && emdSggCode === hoveredConstituencyCode
  : hoveredCode === region.code;

const isSelected = isConstituencyMode
  ? emdSggCode != null && emdSggCode === selectedCode
  : (selectedCode === region.code || searchHighlightCode === region.code);

const isActive = isHovered || isSelected;
```

#### 5-9. fillOverride 계산

```typescript
// Layer 1 (inactive): constituency base color
// Layer 3 (active, hovered): constituency hover color
// Layer 3 (active, selected): constituency base color
const getConstituencyFill = (code: string, hovered: boolean, selected: boolean): string | null => {
  if (!constituencyColorMap) return null;
  const entry = constituencyColorMap.get(code);
  if (!entry) return null;
  // Figma: "기존 선택된 영역은 색상 그대로 유지"
  // hover만 채도 높은 색상 사용 (selected가 아닐 때만)
  return (hovered && !selected) ? entry.hover : entry.base;
};

// RegionPolygon에 전달하는 fillOverride
const fillOverride =
  choroplethColorMap?.[region.code]  // choropleth 우선
  ?? getConstituencyFill(region.code, isHovered, isSelected)
  ?? null;
```

#### 5-10. 토글 UI

```tsx
{/* 브레드크럼 + 토글을 flex row로 배치 */}
<div className="flex items-center justify-between">
  {enableDrillDown && (
    <MapBreadcrumb
      level={level}
      selectedSido={selectedSido}
      selectedCityName={selectedCityName}
      selectedGuName={selectedGuName}
      onBackToNational={handleAnimatedBackToNational}
      onBackToSido={handleAnimatedBackToSido}
      onBackToSigun={handleAnimatedBackToSigun}
    />
  )}
  {currentLevel === "eupMyeonDong" && !choroplethData && (
    <label className="flex shrink-0 items-center gap-1.5 text-body-3 font-medium text-label-alternative">
      선거구 보기
      <Switch
        size="sm"
        checked={isConstituencyMode}
        onCheckedChange={(checked) => {
          setIsConstituencyMode(checked);
          onConstituencyModeChange?.(checked);
        }}
      />
    </label>
  )}
</div>
```

#### 5-11. 선거구 모드 tooltip 데이터

```tsx
{/* MapTooltip 렌더링 — 선거구 모드 시 constituencyTooltipData 사용 */}
<MapTooltip
  hovered={tooltip}
  data={
    tooltip
      ? (isConstituencyMode && constituencyTooltipData
          ? constituencyTooltipData[tooltip.region.code]
          : tooltipDataProvider?.(tooltip.region.code))
      : undefined
  }
/>
```

`tooltip.region.code`는 선거구 모드일 때 `SGG_Code` (handleHover에서 교체됨).

### Step 6: RegionResultPage 연동

**`src/app/routes/RegionResultPage.tsx` 수정:**

```typescript
import { CONSTITUENCY_TOOLTIP_MOCK } from "@/features/region/data/mock-constituency-tooltip";

// selectedCode prop 전달 (기존 누락분)
// onConstituencyModeChange 핸들러
const handleConstituencyModeChange = useCallback(() => {
  setSelectedRegion(null);  // 선택 초기화만. viewMode는 유지.
}, []);

<KoreaAdminMap
  selectedCode={selectedRegion?.code ?? null}   // 추가
  searchNavigation={searchNav}
  onRegionSelect={handleRegionSelect}
  onConstituencyModeChange={handleConstituencyModeChange}
  constituencyTooltipData={CONSTITUENCY_TOOLTIP_MOCK}  // 추가
  choroplethData={heatmap.choroplethData}
  choroplethConfig={heatmap.choroplethConfig}
  tooltipDataProvider={heatmap.isHeatmapActive ? tooltipDataProvider : undefined}
  onLevelChange={setMapLevel}
  onVisibleCodesChange={setVisibleCodes}
  onHomeStateChange={setIsAtHome}
  onTransitionStateChange={handleTransitionStateChange}
  className="h-[460px] w-full [&>svg]:h-full [&>svg]:w-full"
/>
```

### Step 7: Mock 데이터

**`src/features/region/data/mock-constituency-tooltip.ts` (신규):**

SGG_Code별 mock 데이터. 254개 전체를 생성하기 위해 팩토리 함수 사용:

```typescript
import type { MapTooltipData } from "@/features/region/components/map/MapTooltip";

/** 시드 기반 mock 데이터 생성 — SGG_Code에서 결정적으로 값 도출 */
function generateMockData(sggCode: string): MapTooltipData {
  // SGG_Code의 숫자를 시드로 사용하여 일관된 mock 값 생성
  const seed = parseInt(sggCode, 10);
  const voterCount = 5000 + (seed % 10000);
  const totalRatio = 20 + (seed % 60);
  const progressive = 15 + ((seed * 7) % 50);
  const conservative = 100 - progressive - (5 + (seed % 15));
  return {
    voterCount,
    totalRatio: Math.round(totalRatio),
    progressive: Math.round(progressive * 10) / 10,
    conservative: Math.round(conservative * 10) / 10,
  };
}

// 주요 지역 하드코딩 + 나머지 팩토리 생성
const HARDCODED: Record<string, MapTooltipData> = {
  "2112301": { voterCount: 9523, totalRatio: 38, progressive: 35.2, conservative: 60.1 },
  "2112302": { voterCount: 8871, totalRatio: 36, progressive: 33.8, conservative: 61.5 },
  "2112303": { voterCount: 9899, totalRatio: 42, progressive: 29.8, conservative: 65.9 },
};

/** 선거구별 mock 툴팁 데이터. 없는 코드는 generateMockData로 폴백. */
export function getConstituencyTooltipData(sggCode: string): MapTooltipData {
  return HARDCODED[sggCode] ?? generateMockData(sggCode);
}

/** Record 형태로 내보내기 (KoreaAdminMap의 constituencyTooltipData prop용) */
export const CONSTITUENCY_TOOLTIP_MOCK: Record<string, MapTooltipData> = new Proxy(
  HARDCODED,
  { get: (target, prop: string) => target[prop] ?? generateMockData(prop) },
);
```

---

## 4. 렌더링 영향 분석

### 4-1. RegionPolygon 변경 최소화

변경 범위: fill 우선순위 1줄만 변경. `fillOverride`가 있으면 항상 우선.
`arePropsEqual` 변경 불필요 (`fillOverride`는 이미 비교 항목).

### 4-2. 3-Layer 렌더링 구조 유지

기존 3-Layer 구조(inactive paths → inactive labels → active path+labels)를 그대로 사용.
`isActive` 판별 기준만 개별 EMD → 선거구 그룹으로 조건 분기.

### 4-3. 라벨 동작

선거구 모드에서도 **행정동 이름 라벨 유지** (Figma 참조). 변경 없음.

---

## 5. 성능 고려사항

- `constituencyColorMap`: `useMemo` — featureCollection 또는 모드 변경 시에만 재계산
- `hoveredConstituencyCode`: `useMemo` — hoveredCode 변경 시에만 파생
- ref 패턴으로 `handleHover`/`handleClick` 안정 참조 유지 → RegionPolygon 재렌더 방지
- 그룹 hover 시 여러 RegionPolygon 재렌더: EMD 10~30개로 미미
- `constituencyInfoMap`: 앱 전체에서 1회 빌드 (useTopoJsonData 캐시)

---

## 6. 접근성 체크리스트

- [x] 토글 라벨 텍스트 제공 ("선거구 보기")
- [x] Switch: `role="switch"`, `aria-checked` 내장
- [x] 색상 팔레트 L=0.65~0.72 — 배경 대비 충분
- [x] 토글 label + Switch sm → 44px 터치 타겟 충족
- [x] 인접 팔레트 인덱스 간 hue 차이 최소 95° (보라280→청록185→주황60→핑크340)

---

## 7. 파일별 변경 요약

| 파일 | 변경 유형 | 예상 줄 수 |
|------|-----------|------------|
| `src/types/map.ts` | 타입 추가 | +8 |
| `src/features/region/hooks/useTopoJsonData.ts` | 데이터 로딩 확장 | +30 |
| `src/features/region/lib/constituency-colors.ts` | **신규** | ~55 |
| `src/features/region/data/mock-constituency-tooltip.ts` | **신규** | ~35 |
| `src/features/region/components/map/RegionPolygon.tsx` | fill 우선순위 변경 | +3, -3 |
| `src/features/region/components/map/KoreaAdminMap.tsx` | 핵심 로직 추가 | +140 |
| `src/app/routes/RegionResultPage.tsx` | props 전달 + 핸들러 | +15 |
| **합계** | | ~290줄 |
