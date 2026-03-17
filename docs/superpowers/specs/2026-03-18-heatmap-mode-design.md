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
interface HeatmapCategoryConfig {
  categoryId: string;           // "transport"
  label: string;                // "교통 혼잡도"
  unit: string;                 // "점"
  colorHue: number;             // oklch H값 — 카테고리 색상에서 추출
  getMockData: (level: MapLevel) => ChoroplethData;
}
```

### 색상 스케일

카테고리 hex 색상(#389d40)을 oklch로 변환:
- `colorMin`: 낮은 채도 + 높은 명도 (연한 초록)
- `colorMax`: 높은 채도 + 낮은 명도 (진한 초록)

### Mock 데이터

TopoJSON 지역 코드 기반 `Math.random()` 생성. 일부 지역 의도적 누락으로 "데이터 미제공" 테스트.

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
3. 카테고리 hex → oklch 변환하여 `ChoroplethConfig` 자동 생성
4. `deactivateHeatmap()` 호출 시 내부 상태로 강제 비활성화, 카테고리 선택은 유지

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
| 폴리곤 색상 | 채도 스케일 (연→진) | disabled 색상 (gray) |
| 툴팁 | 지역명 + 데이터값 | 지역명만 |
| 클릭 | 지역 선택 + 메트릭 표시 | 지역 선택 + "데이터 미제공" UI |

`getChoroplethColor`가 데이터 없으면 `null` 반환 → `RegionPolygon`에서 disabled fill 적용.

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
| `src/features/region/components/map/KoreaAdminMap.tsx` | disabled 폴리곤 색상 처리 |

### 변경하지 않는 것

- `CategoryNav` — 기존 선택 콜백 그대로
- `choropleth-utils.ts` — 기존 로직 활용
- `RegionPolygon` — KoreaAdminMap에서 fill 전달로 처리
