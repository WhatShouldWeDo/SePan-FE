# 히트맵 모드 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** CategoryNav에서 교통 카테고리 선택 시 폴리곤 지도를 히트맵 모드로 전환하여 지역별 데이터 강도를 채도로 표현한다.

**Architecture:** `useHeatmapMode` 훅이 카테고리 선택 상태와 드릴다운 레벨을 입력받아 `ChoroplethData`/`ChoroplethConfig`를 생성. `RegionResultPage`가 훅의 반환값을 `KoreaAdminMap`의 기존 choropleth props로 전달. KoreaAdminMap은 모드를 모르고 데이터만 렌더링.

**Tech Stack:** React, TypeScript, Tailwind CSS, D3 (기존), oklch 색상 보간 (기존 `choropleth-utils.ts`)

**Spec:** `docs/superpowers/specs/2026-03-18-heatmap-mode-design.md`

---

## File Structure

| 파일 | 역할 | 상태 |
|------|------|------|
| `src/features/region/data/heatmap-configs.ts` | 히트맵 카테고리 설정 + mock 데이터 생성 | **신규** |
| `src/features/region/hooks/useHeatmapMode.ts` | 히트맵 모드 상태 관리 훅 | **신규** |
| `src/features/region/lib/map-theme.ts` | `fillDisabled` 추가 | 수정 |
| `src/index.css` | `--map-fill-disabled` CSS 변수 추가 | 수정 |
| `src/features/region/components/map/MapTooltip.tsx` | `MapTooltipData`에 `heatmap` 필드 추가 + 분기 렌더링 | 수정 |
| `src/index.css` (`@theme inline` 섹션) | `--color-map-fill-disabled` Tailwind 브리지 변수 추가 | 수정 |
| `src/features/region/components/map/KoreaAdminMap.tsx` | `tooltipDataProvider` prop, disabled fill, `onLevelChange` 콜백 | 수정 |
| `src/app/routes/RegionResultPage.tsx` | `useHeatmapMode` 연동, 히트맵 끄기 버튼 | 수정 |

---

### Task 1: CSS 변수 & map-theme 확장

**Files:**
- Modify: `src/index.css:367-373` (light theme), `src/index.css:409-415` (dark theme)
- Modify: `src/features/region/lib/map-theme.ts:7-22`

- [ ] **Step 1: `--map-fill-disabled` CSS 변수 추가 (light + dark + Tailwind 브리지)**

`src/index.css` `@theme inline` 섹션 (`--color-map-fill-search-highlight` 다음, 약 156행):
```css
--color-map-fill-disabled: var(--map-fill-disabled);
```

light theme 섹션 (`:root` 내 `--map-fill-search-highlight` 다음):
```css
--map-fill-disabled: 0.92 0 0;
```

dark theme 섹션 (`.dark` 내 `--map-fill-search-highlight` 다음):
```css
--map-fill-disabled: 0.3 0 0;
```

- [ ] **Step 2: `mapColors.fillDisabled` 추가**

`src/features/region/lib/map-theme.ts`의 `mapColors` 객체에 추가:
```typescript
/** 데이터 미제공 폴리곤 채우기 (disabled) */
fillDisabled: "oklch(var(--map-fill-disabled))",
```

- [ ] **Step 3: 빌드 확인**

Run: `pnpm run build`
Expected: 에러 없이 빌드 성공

- [ ] **Step 4: 커밋**

```bash
git add src/index.css src/features/region/lib/map-theme.ts
git commit -m "feat(region): --map-fill-disabled CSS 변수 + mapColors.fillDisabled 추가"
```

---

### Task 2: MapTooltipData 타입 확장

**Files:**
- Modify: `src/features/region/components/map/MapTooltip.tsx:8-17` (MapTooltipData 인터페이스)
- Modify: `src/features/region/components/map/MapTooltip.tsx:26-75` (MapTooltipContent 컴포넌트)

- [ ] **Step 1: `MapTooltipData` 타입에 `heatmap` 필드 추가**

`src/features/region/components/map/MapTooltip.tsx`의 `MapTooltipData` 인터페이스에 추가:
```typescript
/** 히트맵 모드 데이터 (존재 시 히트맵 표시, 기존 필드 무시) */
heatmap?: {
  label: string;    // "교통 혼잡도"
  value: number;    // 78.5
  unit: string;     // "점"
};
```

- [ ] **Step 2: `MapTooltipContent`에 히트맵 분기 렌더링 추가**

`MapTooltipContent` 컴포넌트 상단에 히트맵 분기 추가:
```typescript
function MapTooltipContent({ data }: { data: MapTooltipData }) {
  // 히트맵 모드 — 데이터값만 표시
  if (data.heatmap) {
    return (
      <div className="flex items-center gap-1 py-1">
        <span className="text-label-3 font-semibold leading-[1.3] text-white/72">
          {data.heatmap.label}
        </span>
        <span className="text-label-3 font-semibold leading-[1.3] text-white">
          {data.heatmap.value.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}
          {data.heatmap.unit}
        </span>
      </div>
    );
  }

  // 기존 유권자/정당 정보
  const hasVoter = data.voterCount != null;
  // ...기존 코드 유지
```

- [ ] **Step 3: 빌드 확인**

Run: `pnpm run build`
Expected: 에러 없이 빌드 성공

- [ ] **Step 4: 커밋**

```bash
git add src/features/region/components/map/MapTooltip.tsx
git commit -m "feat(region): MapTooltipData에 heatmap 필드 추가 + 분기 렌더링"
```

---

### Task 3: 히트맵 카테고리 설정 & Mock 데이터

**Files:**
- Create: `src/features/region/data/heatmap-configs.ts`

- [ ] **Step 1: `HeatmapCategoryConfig` 타입 및 교통 카테고리 설정 작성**

```typescript
import type { MapLevel, ChoroplethData, ChoroplethConfig } from "@/types/map";

/** 히트맵 지원 카테고리 설정 (순수 설정, mock 데이터와 분리) */
export interface HeatmapCategoryConfig {
  categoryId: string;
  label: string;
  unit: string;
  /** oklch "L C H" — 최솟값 (연한 색) */
  colorMin: string;
  /** oklch "L C H" — 최댓값 (진한 색) */
  colorMax: string;
}

/** 히트맵 지원 카테고리 설정 맵 — 여기에 등록된 카테고리만 히트맵 활성화 */
export const HEATMAP_CATEGORY_CONFIGS: Record<string, HeatmapCategoryConfig> = {
  transport: {
    categoryId: "transport",
    label: "교통 혼잡도",
    unit: "점",
    colorMin: "0.92 0.03 145",
    colorMax: "0.45 0.16 145",
  },
};
```

- [ ] **Step 2: ChoroplethConfig 빌더 함수**

```typescript
/** HeatmapCategoryConfig → ChoroplethConfig 변환 */
export function buildHeatmapChoroplethConfig(
  config: HeatmapCategoryConfig,
): ChoroplethConfig {
  return {
    colorMin: config.colorMin,
    colorMax: config.colorMax,
    legendTitle: config.label,
    legendUnit: config.unit,
    legendSteps: 5,
  };
}
```

- [ ] **Step 3: 시드 기반 Mock 데이터 생성 함수**

```typescript
/**
 * 시드 기반 의사난수 (동일 입력 → 동일 출력)
 * @see https://en.wikipedia.org/wiki/Mulberry32
 */
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 문자열을 간단한 해시 숫자로 변환 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}

/**
 * 지역 코드 목록으로 mock ChoroplethData 생성
 * @param codes - 현재 레벨에서 보이는 지역 코드 배열
 * @param level - 현재 드릴다운 레벨 (시드 분기용)
 * @param missingRatio - 데이터 미제공 비율 (0~1, 기본 0.15)
 */
export function generateMockHeatmapData(
  codes: string[],
  level: MapLevel,
  missingRatio = 0.15,
): ChoroplethData {
  const seed = hashString(`heatmap-${level}`);
  const rand = mulberry32(seed);

  const values: Record<string, number> = {};
  for (const code of codes) {
    // 일부 지역은 의도적 누락 (데이터 미제공 테스트)
    const codeRand = mulberry32(hashString(code + level));
    if (codeRand() < missingRatio) continue;

    // 0~100 범위의 mock 값
    values[code] = Math.round(rand() * 1000) / 10;
  }

  return { values };
}
```

- [ ] **Step 4: 빌드 확인**

Run: `pnpm run build`
Expected: 에러 없이 빌드 성공

- [ ] **Step 5: 커밋**

```bash
git add src/features/region/data/heatmap-configs.ts
git commit -m "feat(region): 히트맵 카테고리 설정 + mock 데이터 생성기"
```

---

### Task 4: useHeatmapMode 훅

**Files:**
- Create: `src/features/region/hooks/useHeatmapMode.ts`

- [ ] **Step 1: 훅 작성**

```typescript
import { useState, useMemo, useCallback, useEffect } from "react";
import type { MapLevel, ChoroplethData, ChoroplethConfig } from "@/types/map";
import {
  HEATMAP_CATEGORY_CONFIGS,
  buildHeatmapChoroplethConfig,
  generateMockHeatmapData,
} from "@/features/region/data/heatmap-configs";

export interface UseHeatmapModeReturn {
  /** 히트맵 모드 활성 여부 */
  isHeatmapActive: boolean;
  /** KoreaAdminMap에 전달할 choropleth 데이터 */
  choroplethData: ChoroplethData | null;
  /** KoreaAdminMap에 전달할 choropleth 설정 */
  choroplethConfig: ChoroplethConfig | null;
  /** 히트맵 데이터 라벨 (예: "교통 혼잡도") */
  heatmapLabel: string | null;
  /** 히트맵 데이터 단위 (예: "점") */
  heatmapUnit: string | null;
  /** 히트맵 끄기 */
  deactivateHeatmap: () => void;
}

/**
 * 히트맵 모드 상태 관리 훅
 *
 * @param categoryId - 현재 선택된 카테고리 ID
 * @param level - 현재 드릴다운 레벨
 * @param visibleCodes - 현재 지도에 보이는 지역 코드 목록
 */
export function useHeatmapMode(
  categoryId: string | undefined,
  level: MapLevel,
  visibleCodes: string[],
): UseHeatmapModeReturn {
  const [forcedOff, setForcedOff] = useState(false);
  const [prevCategoryId, setPrevCategoryId] = useState(categoryId);

  // categoryId 변경 시 forcedOff 리셋
  if (prevCategoryId !== categoryId) {
    setPrevCategoryId(categoryId);
    setForcedOff(false);
  }

  const config = categoryId
    ? HEATMAP_CATEGORY_CONFIGS[categoryId] ?? null
    : null;

  const isHeatmapActive = config !== null && !forcedOff;

  const choroplethData = useMemo(() => {
    if (!isHeatmapActive) return null;
    return generateMockHeatmapData(visibleCodes, level);
  }, [isHeatmapActive, visibleCodes, level]);

  const choroplethConfig = useMemo(() => {
    if (!isHeatmapActive || !config) return null;
    return buildHeatmapChoroplethConfig(config);
  }, [isHeatmapActive, config]);

  const deactivateHeatmap = useCallback(() => {
    setForcedOff(true);
  }, []);

  return {
    isHeatmapActive,
    choroplethData,
    choroplethConfig,
    heatmapLabel: isHeatmapActive && config ? config.label : null,
    heatmapUnit: isHeatmapActive && config ? config.unit : null,
    deactivateHeatmap,
  };
}
```

- [ ] **Step 2: 빌드 확인**

Run: `pnpm run build`
Expected: 에러 없이 빌드 성공

- [ ] **Step 3: 커밋**

```bash
git add src/features/region/hooks/useHeatmapMode.ts
git commit -m "feat(region): useHeatmapMode 훅 구현"
```

---

### Task 5: KoreaAdminMap 확장 — tooltipDataProvider, disabled fill, onLevelChange

**Files:**
- Modify: `src/features/region/components/map/KoreaAdminMap.tsx:34-51` (props), `src/features/region/components/map/KoreaAdminMap.tsx:280-293` (handleHover), `src/features/region/components/map/KoreaAdminMap.tsx:360-373` (choroplethColorMap), `src/features/region/components/map/KoreaAdminMap.tsx:569` (MapTooltip)

- [ ] **Step 1: Props 확장**

`KoreaAdminMapProps`에 3개 prop 추가:
```typescript
/** Tooltip 데이터 제공 함수 — 모드 비인지 방식 (Phase heatmap) */
tooltipDataProvider?: (code: string) => MapTooltipData | undefined;
/** 드릴다운 레벨 변경 콜백 (Phase heatmap) */
onLevelChange?: (level: MapLevel) => void;
/** 현재 보이는 지역 코드 변경 콜백 (Phase heatmap) */
onVisibleCodesChange?: (codes: string[]) => void;
```

import에 `MapTooltipData`와 `MapLevel` 추가:
```typescript
import type { MapTooltipData } from "./MapTooltip";
```
(`MapLevel`은 이미 `@/types/map`에서 import 가능 — 기존 import 라인에 추가)

- [ ] **Step 2: 컴포넌트 함수 인자에 새 props destructure 추가**

```typescript
export function KoreaAdminMap({
  config,
  selectedCode,
  onRegionSelect,
  searchNavigation,
  choroplethData,
  choroplethConfig,
  tooltipDataProvider,  // 추가
  onLevelChange,        // 추가
  onVisibleCodesChange, // 추가
  isLoading,
  className,
}: KoreaAdminMapProps) {
```

- [ ] **Step 3: `onLevelChange` 콜백 호출 추가**

`useMapDrillDown`의 `level` 반환값 (변수명: 현재 코드에서 `currentLevel`)이 변경될 때 콜백 호출. 기존 코드에서 `currentLevel`은 `useMapDrillDown` 반환값의 `level`:

```typescript
// currentLevel이 변경될 때 onLevelChange 콜백 호출
useEffect(() => {
  onLevelChange?.(currentLevel);
}, [currentLevel, onLevelChange]);
```

- [ ] **Step 4: `onVisibleCodesChange` 콜백 호출 추가 (ref로 참조 안정화)**

`regionData`가 변경될 때 보이는 코드 목록 전달. 코드 배열이 실제로 변경되었을 때만 콜백 호출하여 불필요한 리렌더 방지:

import에 `useRef` 추가 (기존 `useState, useCallback, useMemo, useEffect` 라인에):
```typescript
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
```

컴포넌트 내부 (hover 상태 선언부 근처):
```typescript
// 보이는 지역 코드 목록 안정화 (참조 비교로 불필요한 리렌더 방지)
const prevCodesRef = useRef<string[]>([]);
useEffect(() => {
  const codes = regionData.map((r) => r.region.code);
  const prev = prevCodesRef.current;
  if (codes.length !== prev.length || codes.some((c, i) => c !== prev[i])) {
    prevCodesRef.current = codes;
    onVisibleCodesChange?.(codes);
  }
}, [regionData, onVisibleCodesChange]);
```

- [ ] **Step 5: choroplethColorMap에 disabled fill 로직 추가**

`src/features/region/components/map/KoreaAdminMap.tsx`의 기존 `choroplethColorMap` useMemo를 수정:

기존:
```typescript
const choroplethColorMap = useMemo(() => {
  if (!choroplethData || !choroplethConfig) return null;
  const map: Record<string, string> = {};
  for (const code of Object.keys(choroplethData.values)) {
    const color = getChoroplethColor(code, choroplethData, choroplethConfig);
    if (color) map[code] = color;
  }
  return map;
}, [choroplethData, choroplethConfig]);
```

변경:
```typescript
const choroplethColorMap = useMemo(() => {
  if (!choroplethData || !choroplethConfig) return null;
  // 데이터가 있는 지역: 계산된 색상, 없는 지역: disabled fill
  const map: Record<string, string> = {};
  // 먼저 보이는 모든 지역을 disabled로 설정
  for (const { region } of regionData) {
    map[region.code] = mapColors.fillDisabled;
  }
  // 데이터가 있는 지역만 계산된 색상으로 덮어쓰기
  for (const code of Object.keys(choroplethData.values)) {
    const color = getChoroplethColor(code, choroplethData, choroplethConfig);
    if (color) map[code] = color;
  }
  return map;
}, [choroplethData, choroplethConfig, regionData]);
```

- [ ] **Step 6: handleHover에서 tooltipData 계산**

기존 `handleHover`:
```typescript
const handleHover = useCallback(
  (region: MapRegion | null, e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (!region) {
      setHoveredCode(null);
      setTooltip(null);
      return;
    }
    setHoveredCode(region.code);
    setTooltip({ region, position: { x: e.clientX, y: e.clientY } });
  },
  [],
);
```

변경 없음 — tooltip 데이터는 렌더링 시 `tooltipDataProvider`에서 파생:

- [ ] **Step 7: MapTooltip에 data prop 전달**

기존:
```tsx
<MapTooltip hovered={tooltip} />
```

변경:
```tsx
<MapTooltip
  hovered={tooltip}
  data={tooltip && tooltipDataProvider ? tooltipDataProvider(tooltip.region.code) : undefined}
/>
```

- [ ] **Step 8: 빌드 확인**

Run: `pnpm run build`
Expected: 에러 없이 빌드 성공

- [ ] **Step 9: 커밋**

```bash
git add src/features/region/components/map/KoreaAdminMap.tsx
git commit -m "feat(region): KoreaAdminMap에 tooltipDataProvider, disabled fill, 레벨/코드 콜백 추가"
```

---

### Task 6: RegionResultPage 연동 — useHeatmapMode + 히트맵 끄기 버튼

**Files:**
- Modify: `src/app/routes/RegionResultPage.tsx`

- [ ] **Step 1: import 추가**

기존 `MapRegion` import에 `MapLevel` 추가:
```typescript
import type { MapRegion, MapLevel } from "@/types/map";
```

새 import 추가:
```typescript
import { useHeatmapMode } from "@/features/region/hooks/useHeatmapMode";
import { X } from "lucide-react";
import type { MapTooltipData } from "@/features/region/components/map/MapTooltip";
```

- [ ] **Step 2: 드릴다운 레벨 + 보이는 코드 상태 추가**

`RegionResultPage` 컴포넌트 내부, 기존 state 선언부 다음에 추가:
```typescript
const [mapLevel, setMapLevel] = useState<MapLevel>("sido");
const [visibleCodes, setVisibleCodes] = useState<string[]>([]);
```

- [ ] **Step 3: useHeatmapMode 훅 연동**

```typescript
const heatmap = useHeatmapMode(selectedCategoryId, mapLevel, visibleCodes);
```

- [ ] **Step 4: tooltipDataProvider 콜백 생성**

```typescript
const tooltipDataProvider = useCallback(
  (code: string): MapTooltipData | undefined => {
    if (!heatmap.isHeatmapActive || !heatmap.choroplethData) return undefined;
    const value = heatmap.choroplethData.values[code];
    if (value === undefined) return undefined; // 데이터 미제공 → 지역명만
    return {
      heatmap: {
        label: heatmap.heatmapLabel!,
        value,
        unit: heatmap.heatmapUnit!,
      },
    };
  },
  [heatmap.isHeatmapActive, heatmap.choroplethData, heatmap.heatmapLabel, heatmap.heatmapUnit],
);
```

- [ ] **Step 5: KoreaAdminMap에 새 props 전달**

기존:
```tsx
<KoreaAdminMap
  searchNavigation={MY_REGION_NAV}
  onRegionSelect={handleRegionSelect}
  className="h-[460px] w-full [&>svg]:h-full [&>svg]:w-full"
/>
```

변경:
```tsx
<KoreaAdminMap
  searchNavigation={MY_REGION_NAV}
  onRegionSelect={handleRegionSelect}
  choroplethData={heatmap.choroplethData}
  choroplethConfig={heatmap.choroplethConfig}
  tooltipDataProvider={heatmap.isHeatmapActive ? tooltipDataProvider : undefined}
  onLevelChange={setMapLevel}
  onVisibleCodesChange={setVisibleCodes}
  className="h-[460px] w-full [&>svg]:h-full [&>svg]:w-full"
/>
```

- [ ] **Step 6: 히트맵 끄기 버튼 추가**

지도 섹션 내부, `KoreaAdminMap` 바로 위에 추가:
```tsx
{heatmap.isHeatmapActive && (
  <div className="flex justify-end">
    <button
      type="button"
      onClick={heatmap.deactivateHeatmap}
      className="flex items-center gap-1 rounded-full bg-surface-primary px-3 py-1.5 text-label-3 font-semibold text-label-alternative transition-colors hover:bg-surface-primary/80"
    >
      <X className="size-3.5" />
      히트맵 끄기
    </button>
  </div>
)}
```

- [ ] **Step 7: 빌드 확인**

Run: `pnpm run build`
Expected: 에러 없이 빌드 성공

- [ ] **Step 8: 개발 서버에서 수동 확인**

Run: `pnpm run dev`

확인 사항:
1. 기본 모드: 폴리곤 지도 정상 표시 (변경 없음)
2. "교통" 카테고리 클릭 → 히트맵 모드 진입 (초록 채도 스케일)
3. 데이터 있는 지역 hover → 지역명 + "교통 혼잡도 XX.X점" 표시
4. 데이터 없는 지역 → gray disabled 색상, hover 시 지역명만
5. "히트맵 끄기" 버튼 클릭 → 기본 폴리곤 모드 복귀
6. 다른 카테고리(예: 유권자 분석) 클릭 → 히트맵 해제
7. 다시 "교통" 클릭 → 히트맵 재활성화
8. 드릴다운 (시도→시군) → 히트맵 유지, 해당 레벨 데이터로 갱신
9. 범례(Legend) 자동 표시 확인

- [ ] **Step 9: 커밋**

```bash
git add src/app/routes/RegionResultPage.tsx
git commit -m "feat(region): RegionResultPage에 useHeatmapMode 연동 + 히트맵 끄기 버튼"
```

---

### Task 7: 문서 업데이트

**Files:**
- Modify: `docs/MODULE_MAP.md`
- Modify: `docs/architecture/region.md`

- [ ] **Step 1: MODULE_MAP.md 업데이트**

히트맵 관련 신규 파일 추가:
- `src/features/region/data/heatmap-configs.ts` — 히트맵 카테고리 설정 + mock 데이터 생성
- `src/features/region/hooks/useHeatmapMode.ts` — 히트맵 모드 상태 관리 훅

- [ ] **Step 2: architecture/region.md 업데이트**

히트맵 모드 섹션 추가:
- 히트맵 모드 전환 흐름
- useHeatmapMode 훅 역할
- tooltipDataProvider 패턴
- disabled fill 메커니즘

- [ ] **Step 3: 커밋**

```bash
git add docs/MODULE_MAP.md docs/architecture/region.md
git commit -m "docs: MODULE_MAP, architecture/region에 히트맵 모드 반영"
```
