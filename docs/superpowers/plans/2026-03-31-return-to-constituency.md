# 내 선거구로 돌아가기 — Implementation Plan

> **Spec**: `docs/superpowers/specs/2026-03-31-return-to-constituency-design.md`
> **Date**: 2026-03-31
> **Status**: Draft

---

## 1. Component / Module Breakdown

### 1-1. 신규 컴포넌트

**없음** — 별도 컴포넌트 파일 생성 없이 `RegionResultPage.tsx` 내 인라인 JSX로 구현. 버튼이 단순하고 재사용 시나리오가 없으므로 조기 추상화를 피함.

### 1-2. 수정 파일

| 파일 | 변경 내용 | 영향도 |
|------|----------|--------|
| `src/app/routes/RegionResultPage.tsx` | (1) `searchNavigation`을 state로 전환 (2) `isAtHome` 상태 추가 (3) 복귀 핸들러 추가 (4) 버튼 JSX 렌더링 (5) section에 `relative` 추가 | 높음 |
| `src/features/region/components/map/KoreaAdminMap.tsx` | (1) `onHomeStateChange` 콜백 prop 추가 (2) `isAtHome` 계산 및 콜백 호출 | 중간 |

### 1-3. 변경 없는 파일

- `useMapDrillDown.ts` — 기존 인터페이스 그대로 사용
- `mock-comparison.ts` — `MY_REGION_NAV` 상수 그대로 사용
- `MapBreadcrumb.tsx`, `MapZoomControls.tsx` — 변경 없음

---

## 2. State Management

### 2-1. 기존 상태 변경

```typescript
// RegionResultPage.tsx — 기존: 상수 전달
// <KoreaAdminMap searchNavigation={MY_REGION_NAV} ... />

// 변경: state로 관리
const [searchNav, setSearchNav] = useState<SearchSelectedRegion | null>(MY_REGION_NAV);
```

### 2-2. 신규 상태

```typescript
// RegionResultPage.tsx
const [isAtHome, setIsAtHome] = useState(true); // KoreaAdminMap 콜백으로 업데이트
```

### 2-3. 파생 값

```typescript
// 버튼 표시 조건: 기본 뷰가 아닌 모든 상태
const showReturnButton = !(viewMode === "default" && isAtHome);
```

---

## 3. Data Flow

```
[RegionResultPage]
  │
  ├─ searchNav state ──────────────→ KoreaAdminMap.searchNavigation prop
  │                                      │
  │                                      ├─ useEffect → navigateToSearchResult()
  │                                      │
  │                                      └─ isAtHome 계산 → onHomeStateChange 콜백
  │                                                              │
  ├─ isAtHome state ←──────────────────────────────────────────┘
  │
  ├─ viewMode state ──┐
  │                    ├─→ showReturnButton 파생
  ├─ isAtHome state ───┘
  │
  └─ handleReturnHome() ──→ setViewMode("default")
                           ──→ setSelectedRegion(null)
                           ──→ setSearchNav({ ...MY_REGION_NAV })  // re-trigger
```

---

## 4. Implementation Steps

### Step 1: KoreaAdminMap에 `onHomeStateChange` 콜백 추가

**파일**: `src/features/region/components/map/KoreaAdminMap.tsx`

1. `KoreaAdminMapProps`에 `onHomeStateChange?: (isAtHome: boolean) => void` 추가
2. 컴포넌트 내부에서 `isAtHome` 계산 (`level` 포함):
   ```typescript
   const isAtHome = useMemo(() => {
     if (!searchNavigation) return false;
     return (
       currentLevel === "eupMyeonDong" &&
       selectedSido === searchNavigation.sido &&
       selectedCity === (searchNavigation.cityCode ?? null) &&
       selectedGu === (searchNavigation.guCode ?? null)
     );
   }, [currentLevel, selectedSido, selectedCity, selectedGu, searchNavigation]);
   ```
   > **참고**: `level` 체크를 포함하여 시군 레벨에서 같은 cityCode가 일치해도 false를 반환하도록 보장. 버튼이 `isAtHome=true`일 때 숨겨지므로 동일 상태 re-trigger 시나리오는 발생하지 않음.
3. `onHomeStateChange` 콜백 호출 (기존 searchNavigation useEffect를 **교체**):
   ```typescript
   const hasNavigated = useRef(false);
   const settledAfterNav = useRef(false);

   // 기존 KoreaAdminMap의 searchNavigation useEffect (line 172-176)를 교체
   useEffect(() => {
     if (searchNavigation && enableDrillDown) {
       navigateToSearchResult(searchNavigation);
       hasNavigated.current = true;
       settledAfterNav.current = false; // 네비게이션마다 리셋
     }
   }, [searchNavigation, enableDrillDown, navigateToSearchResult]);

   useEffect(() => {
     if (!hasNavigated.current) return;
     if (!settledAfterNav.current) {
       // mount effect 순서상 Effect B가 Effect A와 같은 렌더 사이클에서 실행되어
       // isAtHome이 아직 stale(false)인 상태. 첫 호출을 건너뛰고 다음 렌더에서 settled 값 전파.
       settledAfterNav.current = true;
       return;
     }
     onHomeStateChange?.(isAtHome);
   }, [isAtHome, onHomeStateChange]);
   ```
   > **참고**: React effects는 선언 순서대로 동일 렌더 사이클 내에서 실행됨. Effect A가 `navigateToSearchResult`를 호출해도 setState는 batching되어 다음 렌더까지 반영되지 않으므로, 같은 사이클의 Effect B는 stale `isAtHome=false`를 갖고 있음. `settledAfterNav` ref로 이 첫 호출을 건너뛰어 부모에 false가 전파되는 것을 방지. 부모의 `useState(true)` 초기값이 올바른 초기 상태를 보장.

### Step 2: RegionResultPage에 복귀 기능 구현

**파일**: `src/app/routes/RegionResultPage.tsx`

1. `searchNavigation`을 state로 전환:
   ```typescript
   const [searchNav, setSearchNav] = useState<SearchSelectedRegion | null>(MY_REGION_NAV);
   ```
2. `isAtHome` state 추가:
   ```typescript
   const [isAtHome, setIsAtHome] = useState(true);
   ```
3. 복귀 핸들러 추가:
   ```typescript
   const handleReturnHome = useCallback(() => {
     setViewMode("default");
     setSelectedRegion(null);
     setSearchNav({ ...MY_REGION_NAV }); // 새 참조로 re-trigger
   }, []);
   ```
4. 파생 값:
   ```typescript
   const showReturnButton = !(viewMode === "default" && isAtHome);
   ```

### Step 3: 버튼 JSX 렌더링

**파일**: `src/app/routes/RegionResultPage.tsx`

1. 지도 카드 `<section>`에 `relative` 클래스 추가
2. `KoreaAdminMap` 아래에 조건부 버튼 렌더링:
   ```tsx
   {showReturnButton && (
     <button
       type="button"
       onClick={handleReturnHome}
       className="absolute bottom-4 left-1/2 z-10 flex min-h-[44px] -translate-x-1/2 items-center gap-1 rounded-full border-2 border-primary bg-background px-3.5 py-3 text-label-3 font-semibold text-primary shadow-[0px_2px_8px_0px_rgba(20,40,113,0.06)] hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
     >
       <MapPin className="size-4 fill-current" />
       내 선거구로 돌아가기
     </button>
   )}
   ```
3. `KoreaAdminMap`에 새 props 전달:
   ```tsx
   <KoreaAdminMap
     searchNavigation={searchNav}
     onHomeStateChange={setIsAtHome}
     ...
   />
   ```

---

## 5. Potential Side Effects & Risks

| 리스크 | 영향 | 완화 |
|--------|------|------|
| `searchNavigation` state 전환 시 초기 로드 동작 변경 | 낮음 | 초기값을 `MY_REGION_NAV`로 설정하여 동일 동작 유지 |
| `isAtHome` 계산의 불필요한 re-render | 낮음 | useMemo + useEffect로 변경 시에만 콜백 호출 |
| 히트맵 모드에서 레벨 변경 시 데이터 갱신 | 없음 | 기존 `useHeatmapMode` 훅이 자동 처리 |
| 지도 전환 애니메이션 중 클릭 | 낮음 | 기존 `isTransitioning` guard 재활용 가능 (구현 시 확인) |

---

## 6. Verification Checklist

- [ ] 페이지 초기 로드 시 버튼 미표시
- [ ] 다른 읍면동 클릭 후 버튼 표시
- [ ] 전국 레벨로 이동 후 버튼 표시
- [ ] 버튼 클릭 시 기본 뷰 복원 (viewMode, selectedRegion, 지도 레벨)
- [ ] 전국 레벨에서 버튼 클릭 시 정확히 강남구 읍면동 레벨까지 drill-down
- [ ] 히트맵 모드에서 복귀 시 히트맵 유지
- [ ] 클릭 타겟 44×44px 이상
- [ ] `pnpm run build` 성공
- [ ] `pnpm run lint` 통과
- [ ] `npx tsc --noEmit` 통과
