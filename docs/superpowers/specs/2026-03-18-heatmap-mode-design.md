# 히트맵 모드 설계

> 폴리곤 지도에서 특정 카테고리 선택 시 지역별 데이터 강도를 채도로 표현하는 히트맵 모드

## 요약

- CategoryNav에서 히트맵 지원 카테고리(현재: 교통) 선택 시 폴리곤 지도가 히트맵으로 전환
- 지역별 데이터 값이 높을수록 카테고리 고유 색상의 채도가 강해짐
- hover 시 지역명 + 데이터값 표시, 데이터 미제공 지역은 disabled 처리
- 별도 "히트맵 끄기" 버튼으로만 해제 (카테고리 재클릭으로는 해제 안 됨)

## 접근방식

**접근 B: useHeatmapMode 훅 분리** 선택.
- RegionResultPage는 훅 반환값만 KoreaAdminMap에 전달
- KoreaAdminMap은 기존 choropleth props 그대로 수신 — 모드 개념을 모름
- 향후 서브카테고리별 히트맵 on/off 제어 시 훅 내부만 확장

## 1. 데이터 구조 & Mock 데이터

### 히트맵 카테고리 설정 타입

```typescript
// 순수 설정 — mock 데이터 생성 함수는 별도 파일로 분리
interface HeatmapCategoryConfig {
  categoryId: string;           // "transport"
  label: string;                // "교통 혼잡도"
  unit: string;                 // "점"
  colorMin: string;             // oklch "L C H" (예: "0.92 0.03 145")
  colorMax: string;             // oklch "L C H" (예: "0.45 0.16 145")
}
```

### 색상 스케일

카테고리 hex 색상(#389d40)을 oklch로 변환하여 `colorMin`/`colorMax`를 직접 지정:
- `colorMin`: `"0.92 0.03 145"` — 낮은 채도 + 높은 명도 (연한 초록)
- `colorMax`: `"0.45 0.16 145"` — 높은 채도 + 낮은 명도 (진한 초록)

향후 카테고리 추가 시 해당 카테고리의 hex → oklch H값을 기준으로 `colorMin`/`colorMax` 쌍을 설정.

### Mock 데이터

TopoJSON 지역 코드 기반 시드 기반 의사난수로 생성 (동일 레벨에서 일관된 데이터). 일부 지역 의도적 누락으로 "데이터 미제공" 테스트. mock 생성 함수는 `heatmap-configs.ts`에 위치하되 `HeatmapCategoryConfig` 타입과는 분리하여 추후 API 전환 시 설정은 유지하고 데이터 소스만 교체 가능.

## 2. useHeatmapMode 훅

```typescript
// src/features/region/hooks/useHeatmapMode.ts

interface UseHeatmapModeReturn {
  isHeatmapActive: boolean;
  choroplethData: ChoroplethData | null;
  choroplethConfig: ChoroplethConfig | null;
  heatmapLabel: string | null;        // "교통 혼잡도"
  heatmapUnit: string | null;         // "점"
  deactivateHeatmap: () => void;      // 히트맵 끄기 버튼용
}

function useHeatmapMode(
  categoryId: string | undefined,
  level: MapLevel,
): UseHeatmapModeReturn
```

### 동작 흐름

1. `categoryId`가 `HEATMAP_CATEGORY_CONFIGS`에 등록된 카테고리면 → `isHeatmapActive = true`
2. `level` 변경 시 해당 레벨의 mock 데이터 재생성
3. `HeatmapCategoryConfig`의 `colorMin`/`colorMax`로 `ChoroplethConfig` 생성
4. `deactivateHeatmap()` 호출 시 내부 `forcedOff` 상태로 비활성화, 카테고리 선택은 유지

### deactivateHeatmap과 카테고리 재선택

- `deactivateHeatmap()` → 내부 `forcedOff = true` → `isHeatmapActive = false`
- **`categoryId`가 변경되면 `forcedOff`를 자동 리셋** (다른 카테고리 갔다가 다시 교통 선택 시 히트맵 재활성화)
- 같은 카테고리를 CategoryNav에서 재클릭하면 CategoryNav의 토글 로직에 의해 카테고리가 해제(deselect)됨 — 이때 `categoryId`가 변경되므로 `forcedOff`도 리셋됨

### 히트맵 지원 판별

`HEATMAP_CATEGORY_CONFIGS` 맵에 등록된 카테고리만 활성화. 향후 서브카테고리 단위 제어 시 이 맵 구조만 확장.

## 3. MapTooltip 확장 & 데이터 미제공 처리

### MapTooltipData 타입 확장

```typescript
interface MapTooltipData {
  // 기존 필드 유지
  voterCount?: number;
  totalRatio?: number;
  progressive?: number;
  conservative?: number;
  // 히트맵 모드 추가
  heatmap?: {
    label: string;    // "교통 혼잡도"
    value: number;    // 78.5
    unit: string;     // "점"
  };
}
```

### 표시 분기

- `heatmap` 필드 존재 → 지역명 + 히트맵 데이터 표시
- `heatmap` 없음 → 기존 유권자 정보 표시
- 데이터 미제공 지역 → 지역명만 표시

### 데이터 미제공 지역 처리

| 요소 | 데이터 있음 | 데이터 없음 |
|------|------------|------------|
| 폴리곤 색상 | 채도 스케일 (연→진) | disabled 색상 (`--map-fill-disabled`) |
| 툴팁 | 지역명 + 데이터값 | 지역명만 |
| 클릭 | 지역 선택 + 메트릭 표시 | 지역 선택 + "데이터 미제공" UI |

### disabled 색상 메커니즘

1. `map-theme.ts`에 `--map-fill-disabled` CSS 변수 추가 (연한 gray, 예: `oklch(0.92 0 0)`)
2. `mapColors.fillDisabled` 추가
3. `KoreaAdminMap`의 choroplethColorMap 계산 시 **"choropleth 활성이지만 해당 지역 데이터 없음"** 구분:
   - `choroplethData === null` → choropleth 비활성, `fillOverride = null` (기본 fill 사용)
   - `choroplethData !== null && region.code not in values` → `fillOverride = mapColors.fillDisabled`
   - `choroplethData !== null && region.code in values` → `fillOverride = 계산된 색상`
4. `RegionPolygon` 변경 없음 — `KoreaAdminMap`에서 올바른 `fillOverride` 전달로 해결

### 툴팁 데이터 플로우 (M1 해결)

현재 `<MapTooltip hovered={tooltip} />`에서 `data` prop이 전달되지 않는 문제 해결:

1. `KoreaAdminMapProps`에 `tooltipDataProvider?: (code: string) => MapTooltipData | undefined` prop 추가
2. KoreaAdminMap은 모드를 모름 — 함수를 받아서 hover된 지역 코드로 호출할 뿐
3. `RegionResultPage`에서 히트맵 모드일 때 provider 함수를 생성하여 전달:
   ```typescript
   const tooltipDataProvider = useCallback((code: string) => {
     if (!heatmap.isHeatmapActive || !heatmap.choroplethData) return undefined;
     const value = heatmap.choroplethData.values[code];
     if (value === undefined) return undefined; // 미제공 → 지역명만
     return { heatmap: { label: heatmap.heatmapLabel!, value, unit: heatmap.heatmapUnit! } };
   }, [heatmap]);
   ```
4. KoreaAdminMap 내부 handleHover에서 `tooltipDataProvider?.(region.code)`를 호출하여 `MapTooltip`의 `data` prop으로 전달

### "데이터 미제공" 클릭 UI

우측 메트릭 리스트 영역에 빈 상태 표시. 이번 설계 범위에서는 `isHeatmapActive` + 해당 지역의 데이터 유무를 외부로 노출하여 메트릭 컴포넌트에서 분기 처리할 수 있도록 함. 구체적인 "데이터 미제공" UI 디자인은 메트릭 리스트 컴포넌트 설계 시 결정.

## 4. 히트맵 끄기 버튼 & 모드 전환 UX

### 히트맵 끄기 버튼

- 위치: 지도 영역 상단 (MapBreadcrumb 근처)
- 조건부 렌더링: `isHeatmapActive === true`일 때만 노출
- 동작: `deactivateHeatmap()` → 기본 폴리곤 모드 복귀

### 모드 전환 흐름

```
기본 폴리곤 모드
  ├─ "교통" 카테고리 선택 → 히트맵 진입 + 끄기 버튼 노출
  ├─ "히트맵 끄기" 클릭 → 기본 모드 복귀 + 버튼 숨김
  └─ 히트맵 미지원 카테고리 선택 → 자동으로 기본 모드
```

### 전환 시 상태 보존

- 드릴다운 레벨: 유지
- 선택된 지역: 유지
- 줌 상태: 유지

## 5. 변경 파일

| 파일 | 변경 |
|------|------|
| `src/features/region/hooks/useHeatmapMode.ts` | **신규** — 히트맵 모드 훅 |
| `src/features/region/data/heatmap-configs.ts` | **신규** — 카테고리별 히트맵 설정 + mock 데이터 |
| `src/types/map.ts` | `MapTooltipData`에 `heatmap` 필드 추가 |
| `src/features/region/components/map/MapTooltip.tsx` | 히트맵 모드 분기 렌더링 |
| `src/app/routes/RegionResultPage.tsx` | `useHeatmapMode` 연동, 끄기 버튼, 툴팁 분기 |
| `src/features/region/components/map/KoreaAdminMap.tsx` | disabled 폴리곤 색상 처리, `tooltipDataProvider` prop 추가, tooltip에 data 전달 |
| `src/features/region/lib/map-theme.ts` | `fillDisabled` 추가 |

### 변경하지 않는 것

- `CategoryNav` — 기존 선택 콜백 그대로
- `choropleth-utils.ts` — 기존 로직 활용
- `RegionPolygon` — KoreaAdminMap에서 fill 전달로 처리

## 6. 범례 (Legend)

히트맵 모드 활성 시 `ChoroplethConfig`의 `legendTitle`/`legendUnit` 필드를 `useHeatmapMode`에서 설정:
- `legendTitle`: 카테고리 라벨 (예: "교통 혼잡도")
- `legendUnit`: 카테고리 단위 (예: "점")
- `legendSteps`: 5 (기본값)

기존 `MapLegend` 컴포넌트가 자동으로 렌더링 — 추가 변경 불필요.
