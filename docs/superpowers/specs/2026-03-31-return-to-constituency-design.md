# 내 선거구로 돌아가기 버튼 — Design Spec

> **Feature**: 지역분석 페이지 폴리곤 지도에 "내 선거구로 돌아가기" 플로팅 버튼 추가
> **Date**: 2026-03-31
> **Status**: Draft

---

## 1. Feature Summary

지역분석 페이지의 폴리곤 지도에서 사용자가 **자신의 선거구 기본 뷰가 아닌 다른 상태**(다른 지역 선택, 상위 레벨 이동 등)에 있을 때, 지도 하단 중앙에 "내 선거구로 돌아가기" 플로팅 버튼을 표시한다. 버튼을 클릭하면 현재 지도 레벨(전국, 시도 등)에 관계없이 **페이지 초기 로드와 동일한 기본 뷰로 복원**된다.

---

## 2. Acceptance Criteria

| # | 조건 | 검증 방법 |
|---|------|----------|
| AC1 | 다른 지역을 선택(preview/analysis 모드)하면 버튼이 표시된다 | viewMode !== "default" 확인 |
| AC2 | breadcrumb으로 전국/시도 레벨로 이동하면 버튼이 표시된다 | `isAtHome === false` 확인 |
| AC3 | 내 선거구 기본 뷰에서는 버튼이 숨겨진다 | `viewMode === "default" && isAtHome === true` |
| AC4 | 버튼 클릭 시 전국 레벨에서도 내 선거구 레벨까지 자동 drill-down된다 | `searchNavigation` prop을 `MY_REGION_NAV`로 재설정하여 네비게이션 트리거 |
| AC5 | 복귀 시 페이지 초기 로드와 동일한 상태가 된다 | viewMode="default", selectedRegion=null |
| AC6 | 클릭 타겟이 44×44px 이상이다 | min-height 44px 확인 |
| AC7 | 즉시 표시/숨김 (애니메이션 없음) | 조건부 렌더링 확인 |
| AC8 | 내 선거구 폴리곤 직접 클릭으로도 기본 뷰 복귀 | 기존 `handleRegionSelect` 로직 보존 확인 |

---

## 3. Architecture Decisions

### 3-1. 컴포넌트 배치

버튼은 **`RegionResultPage`의 지도 카드 섹션** (`<section>`)에 배치한다.

**이유**: `RegionResultPage`가 `viewMode`, `selectedRegion` 상태를 소유하고, `KoreaAdminMap`은 controlled component로 `searchNavigation` prop을 받는 구조. 버튼 클릭 핸들러가 페이지 레벨 상태와 지도 네비게이션을 동시에 제어해야 하므로, 지도 외부(페이지 레벨)에 위치하는 것이 기존 패턴과 일치.

```
<section className="relative ...">   ← 지도 카드 섹션 (positioning parent)
  <CardSectionHeader />              ※ 기존 section에 `relative` 클래스 추가 필요
  <KoreaAdminMap />
  {showReturnButton && <ReturnToConstituencyButton />}  ← 여기에 배치
</section>
```

### 3-2. 네비게이션 트리거 방식

`searchNavigation` prop 변경을 통해 `KoreaAdminMap` 내부의 `useEffect` → `navigateToSearchResult` 호출을 트리거한다.

**방법**: `searchNavigation`을 상수 대신 state로 관리하고, 버튼 클릭 시 `{ ...MY_REGION_NAV }`로 새 객체 참조를 생성하여 useEffect re-trigger. React의 Object.is 비교에서 새 참조는 이전과 다른 값으로 인식되므로 별도의 null 사이클이나 counter가 불필요.

### 3-3. 초기 상태 판별 (`isAtHome`)

`KoreaAdminMap`에 새 콜백 prop `onHomeStateChange?: (isAtHome: boolean) => void`을 추가한다. 지도 내부의 drill-down 상태가 초기 네비게이션 결과와 동일한지를 판별하여 부모에게 알린다.

**초기 상태 기준** (`MY_REGION_NAV = { sido: "서울", cityCode: "11680", guCode: null }`):
- `selectedSido === "서울"`
- `selectedCity === "11680"` (string 타입, 코드 값 자체)
- `selectedGu === null`
- `level === "eupMyeonDong"` (cityCode 11680은 HAS_GU=false이므로 emd 레벨로 진입)

### 3-4. 기존 요소와의 위치 관계

지도 카드 섹션 내 absolute positioned 요소들의 배치:
- `MapZoomControls`: `absolute bottom-4 left-4`
- `MapLegend`: `absolute bottom-4 right-4`
- **"내 선거구로 돌아가기" 버튼**: `absolute bottom-4 left-1/2 -translate-x-1/2` (하단 중앙)
- z-index: 버튼은 `z-10`으로 설정, MapTooltip보다 아래에 위치

---

## 4. UI States & Transitions

### 4-1. 버튼 디자인 (Figma 기반)

| 속성 | 값 |
|------|-----|
| 형태 | Pill-shape (rounded-full) |
| 배경 | white (bg-background) |
| 테두리 | 2px solid primary (border-2 border-primary) |
| 그림자 | shadow-[0px_2px_8px_0px_rgba(20,40,113,0.06)] |
| 패딩 | px-3.5 py-3 |
| 아이콘 | MapPin (lucide-react), `fill="currentColor"` 적용하여 filled 스타일 구현 |
| 텍스트 | "내 선거구로 돌아가기" — font-semibold text-label-3 text-primary |
| 위치 | 지도 카드 섹션 하단 중앙, absolute + left-1/2 -translate-x-1/2 |
| hover | hover:bg-primary/5 (배경에 primary 5% overlay) |
| focus | focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none |
| 전환 중 (transition guard) | 클릭 무시 (이벤트 핸들러에서 early return), 시각적 변화 없음 |

### 4-2. 상태 전환

```
[기본 뷰 (default)] ──── 다른 지역 선택 또는 레벨 이동 ────→ [버튼 표시]
                                                                │
[기본 뷰 (default)] ←──────── 버튼 클릭 ───────────────────────┘
                                                                │
[기본 뷰 (default)] ←──────── 내 선거구 폴리곤 직접 클릭 ───────┘
```

### 4-3. 버튼 출현 조건 (상세)

**표시 조건** = `!(viewMode === "default" && isAtHome)`

| viewMode | isAtHome | 버튼 |
|----------|----------|------|
| default | true | 숨김 (기본 뷰) |
| default | false | **표시** (레벨 이동) |
| preview | true/false | **표시** (다른 지역 선택) |
| analysis | true/false | **표시** (다른 지역 분석 중) |

---

## 5. Edge Cases

| # | 케이스 | 처리 |
|---|--------|------|
| E1 | 전국(sido) 레벨에서 버튼 클릭 | searchNavigation 재설정 → 시도→시군→읍면동 자동 전환 |
| E2 | 다른 시도의 읍면동에서 클릭 | 동일하게 전체 경로 재설정 |
| E3 | 지도 전환 애니메이션 중 클릭 | 핸들러에서 early return (시각적 변화 없음) |
| E4 | 히트맵 모드 활성화 중 복귀 | 히트맵 유지 (사용자가 수동 비활성화한 경우 복구하지 않음), 레벨 변경에 따라 데이터 자동 갱신 |
| E5 | 내 선거구(강남구) 내 다른 읍면동 선택 후 복귀 | fullName이 MY_REGION.fullName("서울 강남구 갑")과 불일치 → viewMode="preview" → 버튼 표시 → 클릭 시 default 복귀 |
| E6 | 검색으로 다른 지역 이동 후 | 동일하게 버튼 표시 |
| E7 | 페이지 초기 로드 | 기본 뷰 → 버튼 숨김 |

---

## 6. Out of Scope

- 사용자별 동적 선거구 매핑 (현재 `MY_REGION_NAV` 하드코딩 유지)
- 선거구 경계 폴리곤 렌더링 (행정구역 기반 유지)
- 버튼 진입/퇴장 애니메이션 (사용자 확인: 즉시 show/hide)
- 모바일 반응형 (현재 데스크톱 전용)

---

## 7. Design References

- **Figma**: 강남구 선거구 단위 지도 + 하단 플로팅 버튼
- **Figma Annotation**: "내 선거구 외 다른 지도영역 selected 상태일 시, 지도 하단에 내 선거구로 돌아갈 수 있는 Floating Button 제시. 버튼 selected 시, 내 선거구 영역이 선택된 상태로 되돌아감"
- **버튼 컴포넌트**: Button/Outlined (Figma Design System)
- **아이콘**: Icon/Wanted/Fill/Location — Lucide `MapPin`에 `fill="currentColor"` 적용
