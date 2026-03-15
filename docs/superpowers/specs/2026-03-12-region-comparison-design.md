# 지역 비교분석 기능 설계

> RegionResultPage에서 지도 선택 → 분석 → 비교 흐름 추가

## 배경

현재 RegionResultPage는 단일 지역(Mock: 강남구 갑)의 데이터만 고정 표시. 사용자가 지도에서 다른 지역을 선택하고, 내 선거구와 비교분석할 수 있는 기능이 필요.

## 상태 모델

페이지는 4가지 뷰 모드(`ViewMode`)로 동작한다.

```
default → preview → analysis → compare
                  ↘ compare
```

### 1. default (페이지 진입)

- **트리거**: 페이지 최초 로드
- **메트릭 카드**: 내 선거구(강남구, 기본값) 데이터
- **하단 차트**: 내 선거구 추이
- **버튼**: 없음
- **데이터**: 사용자 정보에서 선거구를 받아옴 (현재는 `MOCK_REGION_NAME = "강남구 갑"` 기본값)

### 2. preview (다른 지역 선택)

- **트리거**: 지도에서 내 선거구가 아닌 지역 클릭
- **메트릭 카드**: 선택 지역 이름 + 데이터, 하단에 버튼 2개
  - "분석 결과 보기" (Primary)
  - "내 선거구와 비교분석 하기" (Outlined)
- **하단 차트**: 내 선거구 차트 유지 (변경 없음)
- **지도**: 선택 지역 하이라이트

### 3. analysis (분석 결과)

- **트리거**: preview에서 "분석 결과 보기" 클릭
- **메트릭 카드**: 선택 지역 데이터 + "내 선거구와 비교분석 하기" 버튼만
- **하단 차트**: 선택 지역 추이로 변경 (차트 제목도 선택 지역명 반영)

### 4. compare (비교 모드)

- **트리거**: preview 또는 analysis에서 "내 선거구와 비교분석 하기" 클릭
- **메트릭 카드**: 카드 2개 좌우 분할 (내 선거구 vs 선택 지역) + 하단 비교 해석 박스
  - 우상단에 "초기화" 텍스트 버튼
- **하단 차트**: Switch 토글로 2가지 뷰
  - Off: Grouped Bar (하나의 차트에 두 지역 막대 나란히)
  - On: 좌우 분리 (각 지역 독립 차트)
- **Switch 위치**: 추이 차트 섹션 CardSectionHeader 우상단 (`trailingContent`)

### 복귀 경로

- "초기화" 클릭 → preview (현재 선택 지역 유지)
- 지도에서 새 지역 클릭 → preview (새 지역으로 전환)
- 지도에서 내 선거구 클릭 → default

## 상태 설계

```typescript
type ViewMode = "default" | "preview" | "analysis" | "compare";

// 페이지 상태
const [viewMode, setViewMode] = useState<ViewMode>("default");
const [myRegionName] = useState(MOCK_REGION_NAME);        // 내 선거구 (추후 사용자 정보에서)
const [selectedRegion, setSelectedRegion] = useState<{     // 지도에서 선택한 지역
  code: string;
  name: string;
  fullName: string;
} | null>(null);
const [compareChartSplit, setCompareChartSplit] = useState(false); // Switch 토글
```

### 상태 전환 로직

```typescript
// 지도 클릭
handleRegionSelect(region) → {
  if (region.fullName === myRegionName) → viewMode = "default", selectedRegion = null
  else → viewMode = "preview", selectedRegion = region
}

// "분석 결과 보기" 클릭
handleAnalysis() → viewMode = "analysis"

// "비교분석 하기" 클릭
handleCompare() → viewMode = "compare"

// "초기화" 클릭
handleReset() → viewMode = "preview"
```

## 컴포넌트 변경

### 수정 파일

- `RegionResultPage.tsx` — ViewMode 상태 관리, 조건부 렌더링

### 신규 컴포넌트 (features/region/components/)

- `MetricComparisonCard.tsx` — 비교 모드용 좌우 분할 메트릭 카드
- `ComparisonSummaryBox.tsx` — 비교 해석 텍스트 박스 (디자인 추후 Figma 확정)
- `MetricActionButtons.tsx` — "분석 결과 보기" + "비교분석 하기" 버튼 영역

### 기존 컴포넌트 활용

- `Switch` (`@/components/ui/switch`) — 차트 뷰 토글
- `CardSectionHeader` — `trailingContent`에 Switch 또는 "초기화" 배치
- `BarChart` — `ChartConfig.series`에 2개 시리즈 추가로 Grouped Bar 구현

## Mock 데이터 전략

현재 API 미연동 상태이므로 선택 지역용 Mock 데이터셋을 추가:

```typescript
const MOCK_SELECTED_METRICS: MetricRowData[] = [...]; // 다른 수치
const MOCK_SELECTED_MONTHLY_DATA: ChartData = [...];  // 다른 추이
```

## 비교 해석 박스

하단에 위치하는 비교 결과 해석 UI. 구체적 디자인은 추후 Figma에서 확정.
MVP에서는 Mock 텍스트로 구현.

## 범위 외

- 실제 API 연동 (Mock 데이터 사용)
- 사용자 정보 시스템 연동 (하드코딩 기본값)
- 비교 해석 박스 세부 디자인 (추후 Figma)
