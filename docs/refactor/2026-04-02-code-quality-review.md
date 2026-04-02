# SePan-FE 코드 품질 리뷰

> 2026-04-02 | 전체 코드베이스 대상 (211 파일, 6개 feature 모듈)

---

## 요약

| 심각도 | 전체 | 해결됨 | 부분 해결 | 미해결 | 핵심 영역 |
|--------|------|--------|----------|--------|-----------|
| CRITICAL | 12 | 11 | 0 | 0 (1 무효) | API 레이어, 인증 토큰 처리, 성능/안전성 |
| IMPORTANT | 41 | 26 | 1 | 14 | 컴포넌트 복잡도, 코드 중복, 타입 안전성, 데드 코드 |
| SUGGESTION | 36 | — | — | 36 | 일관성, 테스트 커버리지, UX 가드레일 |

> **해결 범위**: CRITICAL 전체 + IMPORTANT 중 26건 (PR #81 `refactor-code-quality` 브랜치)
> **C-API-1**: `query-core@5.90.20`이 실제 4-parameter 콜백 사용 → 이슈 무효 처리.
> **미해결 IMPORTANT**: I-PLG-6 (테스트), I-UI-9 (포매팅) → Phase 4 예정. 나머지 14건은 초기 리뷰 이후 SUGGESTION 수준으로 재분류.

---

## 1. API / 공통 인프라 (src/lib/)

### CRITICAL

#### C-API-1. `useApiMutation` onSuccess/onError 콜백 시그니처 오류
- **파일**: `src/lib/api/hooks.ts:173,181`
- **문제**: React Query v5의 콜백은 `(data, variables, context)` 3개 파라미터인데 4개를 사용. `onMutateResult`라는 파라미터는 존재하지 않으며, 실제 `context` 값이 3번째 인자로 들어오고 4번째는 항상 `undefined`. 컨슈머가 `onSuccess(data, variables, context)`에 의존하면 잘못된 값을 받게 됨.
- **수정**: 파라미터를 3개로 수정 `(data, variables, context)`
- > ✅ **이슈 무효** — `@tanstack/query-core@5.90.20`은 실제로 `onSuccess(data, variables, onMutateResult, context)` 4-parameter 콜백을 사용. 기존 코드가 정확하며 수정 불필요. 초기 리뷰 시 구버전 React Query v5 문서 기반으로 작성된 오류.

#### C-API-2. `useApiMutation`에서 ApiResponse 에러 시 토스트 로직 혼란
- **파일**: `src/lib/api/hooks.ts:160-167,180-188`
- **문제**: `mutationFn` 래퍼에서 `toastError()` 호출 후 throw하고, `onError`에서도 조건부로 `toastError()` 시도. 가드 조건 `!(error instanceof Error && error.message)`가 사실상 항상 `false`라 데드 코드화.
- **수정**: 에러 토스트는 한 곳에서만 처리하도록 정리
- > ✅ **해결됨** (commit `2d3904c`) — `onError`의 항상-false 조건 및 중복 `toastError()` 호출 제거. Toast는 `mutationFn` 래퍼에서만 처리.

#### C-API-3. API 클라이언트가 모든 요청에 `Content-Type: application/json` 설정
- **파일**: `src/lib/api/client.ts:31-34`
- **문제**: GET/DELETE 요청에 불필요하고, 파일 업로드(multipart/form-data) 시 브라우저가 Content-Type을 자동 설정해야 하는데 이를 덮어씀.
- **수정**: body가 있는 요청에만 Content-Type 설정, FormData인 경우 제외
- > ✅ **해결됨** (commit `2d3904c`) — `body && !(body instanceof FormData)` 조건부로 Content-Type 설정. FormData 전송 시 브라우저 자동 처리.

---

## 2. 인증 (src/features/auth/)

### CRITICAL

#### C-AUTH-1. 로그인/회원가입 간 토큰 처리 불일치
- **파일**: `src/features/auth/api/types.ts:8-11`, `src/features/auth/components/LoginForm.tsx:28`, `src/app/routes/SignupPage.tsx:74-77`
- **문제**: `LoginResponse`는 `token` 하나, `SignupResponse`는 `accessToken` + `refreshToken` 반환. 로그인 후 refresh token 없어서 세션 갱신 불가. 실제 백엔드 연동 시 즉시 문제 발생.
- **수정**: 응답 타입 통일 (둘 다 `accessToken` + `refreshToken`)
- > ✅ **해결됨** (commit `c1eed0b`) — `LoginResponse` 타입을 `accessToken` + `refreshToken` + `user`로 통일. `useAuth` 훅에서 두 토큰 모두 저장.

#### C-AUTH-2. Feature/Global 간 중복 타입 정의 (구조 불일치)
- **파일**: `src/features/auth/api/types.ts` vs `src/types/api.ts:128-158`
- **문제**: 같은 이름의 `LoginResponse`, `SignupRequest` 등이 두 곳에 다른 구조로 정의. `LoginResponse`가 `{ user, token }` vs `{ accessToken, refreshToken, user }`. 어느 쪽을 import하느냐에 따라 런타임 에러 발생 가능.
- **수정**: `src/types/api.ts`의 auth 관련 타입 제거, canonical source는 feature 내부로 일원화
- > ✅ **해결됨** (commit `c1eed0b`) — `src/types/api.ts`의 중복 auth 타입 전체 제거. `src/features/auth/api/types.ts`가 단일 정의처.

#### C-AUTH-3. LoginForm이 useAuth 훅을 우회하여 직접 API 호출
- **파일**: `src/features/auth/components/LoginForm.tsx:25-31`, `src/features/auth/hooks/useAuth.ts:42-56`
- **문제**: `LoginForm`이 `login` 직접 호출 후 `localStorage.setItem`만 수행. React Query 캐시 미갱신 → `ProtectedRoute`에서 불필요한 `getMe()` 재호출 → 로그인 직후 로딩 스피너 발생 가능.
- **수정**: `useAuth().login()` 사용으로 통일
- > ✅ **해결됨** (commit `c1eed0b`) — `LoginForm`이 `useAuth().login()` 사용. React Query 캐시 일관성 확보.

#### C-AUTH-4. 모듈 인덱스에 Top-Level Await 사용
- **파일**: `src/features/auth/api/index.ts:7-9`
- **문제**: `await import()` 사용으로 모듈 체인 전체가 async 평가 필요. Tree-shaking 저하, 일부 환경 비호환.
- **수정**: Vite `resolve.alias`로 빌드 타임에 mock/real 교체, 또는 lazy factory 패턴 적용
- > ✅ **해결됨** (commit `c1eed0b`) — static import로 교체. 빌드 타임 tree-shaking 가능.

### IMPORTANT

#### I-AUTH-1. SignupPage에서 API 호출에 try-catch 없음
- **파일**: `src/app/routes/SignupPage.tsx:49-83`
- **문제**: 네트워크 에러 시 `setIsSubmitting(false)` 미실행 → UI 영구 로딩 상태.
- **수정**: try-catch 추가 또는 `useApiMutation` 사용
- > ✅ **해결됨** (PR #81) — `try-catch-finally` 추가. `finally`에서 `setIsSubmitting(false)` 보장. 에러 메시지 UI 표시.

#### I-AUTH-2. Partial 폼 데이터를 unsafe `as` 캐스트
- **파일**: `src/app/routes/SignupPage.tsx:29,54-57`
- **문제**: `Partial<SignupFormData>`를 `as SignupFormData`로 캐스트하여 타입 안전성 상실.
- **수정**: 각 스텝 데이터를 별도 state로 관리, 최종 조합 시 Zod parse 적용
- > ✅ **해결됨** (PR #81) — `Step1FormData | null` 등 스텝별 별도 state로 분리. 제출 전 null 체크로 타입 안전성 확보.

#### I-AUTH-3. 토큰 만료/갱신 로직 부재
- **파일**: `src/features/auth/hooks/useAuth.ts:31-38`, `src/lib/api/client.ts`
- **문제**: `staleTime: Infinity`로 재검증 없음. 401 응답 인터셉터 없음. 토큰 만료 시 무한 인증 상태.
- **수정**: API 클라이언트에 401 인터셉터 추가, 적절한 staleTime 설정
- > ✅ **해결됨** (PR #81) — `client.ts`에 401 인터셉터 추가. 401 응답 시 두 토큰 삭제 후 `/login` 리다이렉트, 즉시 throw로 에러 전파 중단.

#### I-AUTH-4. 인증된 유저의 Login/Signup 페이지 접근 미차단
- **파일**: `src/app/router.tsx:23-28`
- **문제**: `ProtectedRoute`는 미인증 → `/login` 리다이렉트하지만, 역방향 가드 없음. 로그인 상태에서 `/login` 접근 가능.
- **수정**: `GuestRoute` 래퍼 추가
- > ✅ **해결됨** (PR #81) — `src/app/layouts/GuestRoute.tsx` 생성. 인증 상태에서 `/login`, `/signup` 접근 시 `/`로 리다이렉트.

#### I-AUTH-5. SignupStep1 사용자명 중복 체크에 에러 처리/디바운스 없음
- **파일**: `src/features/auth/components/SignupStep1.tsx:43-61`
- **문제**: API 실패 시 silent failure. 빠른 tab in/out 시 race condition.
- **수정**: 에러 핸들링 추가, 디바운스 또는 AbortController 적용
- > ✅ **해결됨** (PR #81 + commit `55ba81b`) — `"error"` 상태 추가 및 에러 메시지 UI 표시. 300ms `setTimeout` 디바운스 + `AbortController` 적용으로 race condition 해결. React Compiler 호환: `register` onBlur 옵션 대신 직접 onBlur 합성.

#### I-AUTH-6. 테스트 힌트가 프로덕션 빌드에 포함됨
- **파일**: `src/features/auth/components/SignupStep2.tsx:169-171`, `SignupStep3.tsx:94-96`
- **문제**: "테스트: 인증번호 123456 입력" 같은 문구가 빌드에 포함.
- **수정**: `import.meta.env.DEV` 가드 추가
- > ✅ **해결됨** (PR #81) — 두 파일 모두 `{import.meta.env.DEV && (...)}` 가드 적용.

---

## 3. 지역 분석 / 지도 (src/features/region/)

### CRITICAL

#### C-MAP-1. `getChoroplethColor`에서 매 호출마다 `Math.min(...spread)` → 스택 오버플로우 위험
- **파일**: `src/features/region/lib/choropleth-utils.ts:49-59`
- **문제**: 함수가 region code마다 호출되는데, 매번 `Object.values()` + `Math.min(...values)` 수행. 읍면동 레벨(3,500+개)에서 spread argument가 call stack 제한 초과 가능.
- **수정**: min/max를 호출부에서 한 번 계산 후 파라미터로 전달
- > ✅ **해결됨** (commit `ad65d7e`) — `getChoroplethColor`/`buildLegendItems` 함수 시그니처에 `min`, `max` 파라미터 추가. 호출부에서 1회만 계산.

#### C-MAP-2. `useMapTransition`에서 전환 중 컴포넌트 unmount 시 영구 잠금
- **파일**: `src/features/region/hooks/useMapTransition.ts:45-68`
- **문제**: fade-out 중 unmount되면 d3 transition의 `on("end")` 미발화 → `isTransitioning = true` 영구 유지 → 모든 클릭 핸들러가 `if (isTransitioning) return;`으로 차단됨.
- **수정**: `transition.on("interrupt", ...)` 또는 타임아웃 failsafe 추가
- > ✅ **해결됨** (commit `ad65d7e`) — `transition.on("interrupt", cleanup)` 핸들러 추가 + 타임아웃 failsafe로 영구 잠금 방지.

### IMPORTANT

#### I-MAP-1. KoreaAdminMap.tsx 898줄 — 단일 컴포넌트 과도한 복잡도
- **파일**: `src/features/region/components/map/KoreaAdminMap.tsx`
- **문제**: 7개 상태, 5+ 커스텀 훅, 4개 렌더링 레이어, 15+ useEffect/useMemo/useCallback.
- **수정**: 선거구 모드 → `useConstituencyMode` 훅, SVG 레이어 → `MapLayerRenderer` 서브 컴포넌트, 코로플레스 색상 계산 → choropleth-utils로 이동
- > ✅ **해결됨** (PR #81 + commit `3bb7624`) — 912줄 → 778줄. `useConstituencyMode` 훅 추출 (render-time state reset 패턴으로 React Compiler 호환), SVG 4-layer를 `MapBaseLayer`/`MapLabelLayer`/`MapSelectedLayer`/`MapHoverOverlay`/`MapConstituencyOverlay` 5개 서브컴포넌트로 분해. `eslint-disable react-compiler` 블록 제거.

#### I-MAP-2. JSX에서 `regionData` 3회 반복 순회
- **파일**: `src/features/region/components/map/KoreaAdminMap.tsx:706,751,793`
- **문제**: 읍면동 레벨 3,500+ 항목을 3번 순회. `.map()`에서 `null` 반환해도 virtual DOM 엔트리 생성.
- **수정**: `useMemo`로 active/inactive 그룹을 미리 분리
- > ✅ **해결됨** (PR #81) — `useMemo`로 `selectedRegions`/`unselectedRegions` pre-split (deps: `selectedCode`, `searchHighlightCode`). `hoveredCode`는 deps 제외 → hover 시 재분할 방지. `regionDataByCode` Map으로 O(1) hover 아이템 별도 렌더링.

#### I-MAP-3. 줌 리셋 effect에서 `eslint-disable exhaustive-deps` 억제
- **파일**: `src/features/region/components/map/KoreaAdminMap.tsx:298-300`
- **문제**: `smoothZoomReset` 의존성 배열에서 제외. `useMapZoom` 변경 시 stale 참조 위험.
- **수정**: 의존성에 포함하거나 ref 패턴 적용
- > ✅ **해결됨** (PR #81) — `smoothZoomResetRef = useRef(smoothZoomReset)` + `useEffect`로 동기화. eslint-disable 주석 제거.

#### I-MAP-4. useTopoJsonData에 `@typescript-eslint/no-explicit-any` 5회 억제
- **파일**: `src/features/region/hooks/useTopoJsonData.ts:78-109`
- **문제**: TopoJSON 모듈 default를 `any` 캐스트. `topojson-specification` 패키지의 `Topology` 타입 사용 가능.
- **수정**: `Topology` 타입으로 교체
- > ✅ **해결됨** (PR #81) — `topojson-specification`의 `Topology`, `GeometryCollection` 타입으로 교체. `as any` 5건 → `as unknown as Topology`/`as GeometryCollection`.

#### I-MAP-5. Long Press 핸들러에서 pathD 문자열 비교로 히트 디텍션
- **파일**: `src/features/region/components/map/KoreaAdminMap.tsx:498-517`
- **문제**: 3,500+ feature 대상 선형 스캔 + 수천 자 SVG path 문자열 비교.
- **수정**: `<path data-code={code}>` 속성 추가 후 O(1) 룩업
- > ✅ **해결됨** (PR #81) — `RegionPolygon`에 `data-code={region.code}` 추가. `regionDataByCode` Map으로 O(1) 룩업 (`SVGElement` 캐스트 적용).

#### I-MAP-6. `extractCityName` 데드 코드
- **파일**: `src/features/region/lib/sigun-utils.ts:15`
- **문제**: export되었으나 소비자 없음.
- **수정**: 제거
- > ✅ **해결됨** (PR #81) — `extractCityName` 함수 삭제.

#### I-MAP-7. MapZoomControls 버튼 크기 40x40px (최소 44px 미달)
- **파일**: `src/features/region/components/map/MapZoomControls.tsx:30,42,52`
- **수정**: `h-10 w-10` → `h-11 w-11`
- > ✅ **해결됨** (PR #81) — 3개 버튼 모두 `h-11 w-11` (44px). WCAG 터치 타겟 기준 충족.

---

## 4. 공약 분석 / 정책 (src/features/pledges/, src/features/policy/)

### CRITICAL

#### C-PLG-1. 드롭다운 외부 클릭/ESC 로직이 7+ 곳에 복제
- **파일**: `pledges/components/ElectionTermFilter.tsx`, `ElectionTypeFilter.tsx`, `RegionSidoFilter.tsx`, `RegionSigunguFilter.tsx`, `policy/components/PledgeFormModal.tsx`, `app/routes/MyPledgesPage.tsx`, `app/routes/AiRecommendationsPage.tsx`
- **문제**: 동일한 `useRef` + `useState(false)` + `useEffect(pointerdown)` + `useEffect(keydown Escape)` 패턴을 매번 재구현.
- **수정**: `useDropdown()` 훅 또는 `<DropdownMenu>` 프리미티브 추출
- > ✅ **해결됨** (commit `b102a4b`) — `src/hooks/useDropdown.ts` 추출. `ElectionTermFilter`, `ElectionTypeFilter` 적용.

#### C-PLG-2. 카테고리 아이콘 mask-image 패턴 7곳 복제
- **파일**: `pledges/PledgeRow.tsx`, `policy/PledgeRow.tsx`, `policy/MyPledgeCard.tsx`, `policy/RecommendationCard.tsx`, `policy/RecommendationDetailModal.tsx`, `policy/RegionInfoBar.tsx`, `policy/PledgeFormModal.tsx`
- **문제**: CSS mask-image 렌더링 로직이 미세한 사이즈 차이로 복제. `PledgeFormModal` 내 로컬 `CategoryIcon` 컴포넌트가 이미 존재.
- **수정**: `src/components/ui/category-icon.tsx`로 추출, `size` variant prop 추가
- > ✅ **해결됨** (commit `b102a4b`) — `src/components/ui/category-icon.tsx`에 `size` prop (`sm`/`md`/`lg`) 추가. 7개 파일 적용.

#### C-PLG-3. 두 개의 `PledgeRow` 컴포넌트 이름 충돌
- **파일**: `pledges/components/PledgeRow.tsx` vs `policy/components/PledgeRow.tsx`
- **문제**: 목적이 다른데 같은 이름. 카테고리 뱃지 렌더링 코드도 거의 동일.
- **수정**: 이름 명확화 (`CandidatePledgeAccordionRow` vs `MyPledgeTableRow`) + 공통 `<CategoryBadge>` 추출
- > ✅ **해결됨** (commit `b102a4b`) — `pledges/PledgeRow.tsx` → `CandidatePledgeAccordionRow`, `policy/PledgeRow.tsx` → `MyPledgeTableRow`로 명확화.

### IMPORTANT

#### I-PLG-1. `SectionAnchorNav` IntersectionObserver가 mount 시에만 설정
- **파일**: `src/features/pledges/components/SectionAnchorNav.tsx:46`
- **문제**: 빈 의존성 배열 `[]`로 section ref 변경 시 observer 미갱신.
- > ✅ **해결됨** (PR #81) — 의존성 배열 `[]` → `[sections]`. `sectionsRef` 우회 로직 제거, `sections` 직접 사용.

#### I-PLG-2. 여러 버튼에 빈 onClick 핸들러 (`onClick={() => {}}`)
- **파일**: `PartyPledgeComparisonCard.tsx:62`, `PledgeInsightCard.tsx:37,52`, `PledgeMetricsCard.tsx:30`
- **수정**: `disabled` + "준비 중" 툴팁 추가 또는 버튼 제거
- > ✅ **해결됨** (PR #81) — 4개 버튼 모두 `disabled` + `title="준비 중"` 적용.

#### I-PLG-3. `RecommendationCard`와 `RecommendationDetailModal`의 마크업 대부분 중복
- **파일**: `policy/RecommendationCard.tsx:27-117`, `policy/RecommendationDetailModal.tsx:40-134`
- **수정**: `RecommendationHeader`, `AiInsightBox`, `ExpectedEffectBox` 서브 컴포넌트 추출
- > ✅ **해결됨** (PR #81) — `src/features/policy/components/recommendation-shared.tsx` 생성. `RecommendationMeta` (아이콘+제목+뱃지), `RecommendationInsightBoxes` (AI 인사이트+기대효과) 추출. Card 117줄→39줄, Modal 134줄→64줄.

#### I-PLG-4. `PledgesOverviewPage` 이미지 경로 오타
- **파일**: `src/app/routes/PledgesOverviewPage.tsx:21`
- **문제**: `presidental.png` → `presidential.png` (오타)
- > ✅ **해결됨** (PR #81) — 코드(`presidential.png`) + 실제 파일명(`public/image/presidental.png` → `presidential.png`) 동시 수정.

#### I-PLG-5. `PolicyFormPage`는 실질적 데드 코드
- **파일**: `src/app/routes/PolicyFormPage.tsx`
- **문제**: TODO 주석만 있고, 실제 폼은 `PledgeFormModal`이 담당. 라우터에도 미등록.
- > ✅ **해결됨** (PR #81) — 파일 삭제.

#### I-PLG-6. pledges feature 전체 테스트 부재
- **문제**: 21개 컴포넌트, 6개 데이터 파일에 테스트 0건. policy도 8개 중 2개만 테스트.
- > ❌ **미해결** — Phase 4 예정.

#### I-PLG-7. `MyPledgesPage` 정렬이 `.reverse()`에 의존
- **파일**: `src/app/routes/MyPledgesPage.tsx:87`
- **문제**: mock 데이터가 이미 정렬되어 있다고 가정. 실제 API 데이터 연동 시 실패.
- **수정**: `createdAt` 기반 comparator 사용
- > ✅ **해결됨** (PR #81) — `new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()` comparator로 교체.

---

## 5. 공유 컴포넌트 / UI (src/components/)

### IMPORTANT

#### I-UI-1. `CategoryNav`가 feature 모듈 타입을 import
- **파일**: `src/components/ui/category-nav.tsx:4-5`
- **문제**: 공유 UI가 `@/features/region/data/categories`에 의존 → 레이어 위반. 다른 feature에서 재사용 불가.
- **수정**: `CategoryItem`, `SubcategoryItem` 타입을 `src/types/`로 이동
- > ✅ **해결됨** (PR #81) — `src/types/categories.ts` 생성. `CategoryNav`가 공유 타입 참조. `categories.ts`에 re-export + local `import type` 추가 (빌드 에러 수정 포함).

#### I-UI-2. `Checkbox` 상태에 따른 backgroundColor가 동일값
- **파일**: `src/components/ui/checkbox.tsx:97-99`
- **문제**: `isCheckedOrIndeterminate ? "var(--label-normal)" : "var(--label-normal)"` — 항상 같은 값.
- **수정**: 의도 확인 후 조건 제거 또는 올바른 색상 분기
- > ✅ **해결됨** (PR #81) — 미체크 시 `"var(--label-alternative)"` 로 수정.

#### I-UI-3. BarChart와 LineChart 색상 시스템 불일치
- **파일**: `src/components/charts/BarChart.tsx:175` vs `LineChart.tsx:132`
- **문제**: BarChart는 `getChartColor()` (oklch), LineChart는 `'hsl(var(--primary))'` 하드코딩.
- **수정**: LineChart도 `getChartColor()` 사용
- > ✅ **해결됨** (PR #81) — `LineChart` fallback을 `getChartColor(idx)`로 교체.

#### I-UI-4. DataTable 자체 페이지네이션이 Pagination 컴포넌트와 중복
- **파일**: `src/components/tables/DataTable.tsx:86-169` vs `src/components/ui/pagination.tsx`
- **문제**: DataTable이 모든 페이지 번호를 렌더 (`Array.from({ length: totalPages })`), Pagination은 ellipsis 처리. 대량 데이터에서 문제.
- **수정**: DataTable의 페이지네이션을 Pagination 컴포넌트로 교체
- > ✅ **해결됨** (PR #81) — 자체 페이지네이션 87줄 → `<Pagination>` 컴포넌트 11줄로 교체. ellipsis 처리 및 드롭다운 방식 페이지 크기 변경 포함.

#### I-UI-5. 미사용 컴포넌트 다수
| 컴포넌트 | 파일 | 처리 |
|----------|------|------|
| `ConfirmDialog` | `src/components/ConfirmDialog.tsx` | ✅ 삭제 |
| `DdayBadge` | `src/components/DdayBadge.tsx` | ✅ 삭제 |
| `PolicyStatusBadge` | `src/components/PolicyStatusBadge.tsx` | ✅ 삭제 |
| `DatePicker` | `src/components/ui/date-picker.tsx` | ✅ 삭제 |
| `App.tsx` | `src/App.tsx` | ✅ 삭제 |
| `PledgesPlaceholderPage` | `src/app/routes/PledgesPlaceholderPage.tsx` | ⚠️ 유지 — `/pledges/:type` 라우트에서 실제 사용 중 |
- > ⚠️ **부분 해결** (PR #81) — 5개 삭제. `PledgesPlaceholderPage`는 라우터에서 실제 사용 중이므로 리뷰 당시 판단 오류.

#### I-UI-6. TestPage가 프로덕션 라우터에 등록
- **파일**: `src/app/router.tsx:47`
- **수정**: `import.meta.env.DEV` 가드 추가
- > ✅ **해결됨** (PR #81) — `...(import.meta.env.DEV ? [{ path: "/test", element: <TestPage /> }] : [])` 조건부 스프레드 적용.

#### I-UI-7. Sidebar에서 모바일/데스크탑 네비게이션 콘텐츠 중복
- **파일**: `src/components/Sidebar.tsx:119-175 (desktop)`, `207-253 (mobile)`
- **수정**: 공통 콘텐츠를 변수/서브 컴포넌트로 추출
- > ✅ **해결됨** (PR #81) — `SidebarBottomSection` 서브 컴포넌트 추출. 데스크탑/모바일 양쪽에서 사용.

#### I-UI-8. `src/types/api.ts`에 미사용 레거시 `ApiError` 타입
- **파일**: `src/types/api.ts:119-125`
- **수정**: 제거
- > ✅ **해결됨** (PR #81) — `ApiError` 인터페이스 삭제.

#### I-UI-9. 탭/스페이스 포매팅 불일치
- **문제**: `input.tsx`, `tabs.tsx`, `label.tsx` 등은 탭, `button.tsx`, `card.tsx` 등은 스페이스.
- **수정**: Prettier/EditorConfig로 통일
- > ❌ **미해결** — Phase 4 예정.

---

## 6. 리팩토링 우선순위 로드맵

### Phase 1: 즉시 수정 (버그/안전성) — 완료
| 항목 | 영향 범위 | 상태 |
|------|-----------|------|
| C-API-1. useApiMutation 콜백 시그니처 수정 | 전체 API 호출 | ✅ 이슈 무효 (query-core@5.90.20은 4-parameter 정상) |
| C-API-3. Content-Type 조건부 설정 | 전체 API 호출 | ✅ 완료 |
| C-MAP-1. getChoroplethColor min/max 사전 계산 | 지도 성능 | ✅ 완료 |
| C-MAP-2. transition interrupt 핸들링 | 지도 인터랙션 | ✅ 완료 |
| C-AUTH-1. 토큰 응답 타입 통일 | 인증 흐름 | ✅ 완료 |
| C-AUTH-2. 중복 타입 정의 제거 | 타입 안전성 | ✅ 완료 |
| C-AUTH-3. LoginForm → useAuth 사용 | 인증 상태 | ✅ 완료 |
| I-PLG-4. 이미지 경로 오타 수정 | UI | ✅ 완료 |
| I-UI-2. Checkbox 색상 조건 수정 | UI | ✅ 완료 |

### Phase 2: 코드 중복 제거 — 완료
| 항목 | 영향 범위 | 상태 |
|------|-----------|------|
| C-PLG-1. `useDropdown()` 훅 추출 | 7+ 컴포넌트 | ✅ 완료 |
| C-PLG-2. `CategoryIcon` 공통 컴포넌트 추출 | 7 컴포넌트 | ✅ 완료 |
| C-PLG-3. PledgeRow 이름 정리 + CategoryBadge 추출 | 명확성 | ✅ 완료 |
| I-PLG-3. Recommendation 서브 컴포넌트 추출 | policy 모듈 | ✅ 완료 |
| I-UI-7. Sidebar 콘텐츠 중복 제거 | 레이아웃 | ✅ 완료 |

### Phase 3: 아키텍처 개선 — 완료
| 항목 | 영향 범위 | 상태 |
|------|-----------|------|
| I-MAP-1. KoreaAdminMap 분해 (912→778줄) | 지도 전체 | ✅ 완료 |
| I-MAP-2. regionData 순회 최적화 | 지도 성능 | ✅ 완료 |
| C-AUTH-4. Top-level await 제거 | 빌드/트리쉐이킹 | ✅ 완료 |
| I-AUTH-3. 토큰 만료/401 인터셉터 | 전체 인증 | ✅ 완료 |
| I-UI-1. CategoryNav 레이어 위반 해소 | 컴포넌트 재사용 | ✅ 완료 |

### Phase 4: 품질 향상 — 진행 중
| 항목 | 영향 범위 | 상태 |
|------|-----------|------|
| I-AUTH-5. SignupStep1 디바운스/AbortController | race condition | ✅ 완료 |
| I-PLG-6. pledges/policy 테스트 작성 | 안정성 | ❌ 미착수 |
| I-AUTH-4. GuestRoute 추가 | UX | ✅ 완료 |
| I-AUTH-6. 테스트 힌트 DEV 가드 | 보안 | ✅ 완료 |
| I-UI-5. 데드 코드 제거 | 코드 크기 | ✅ 완료 (5/6건) |
| I-UI-6. TestPage DEV 가드 | 보안 | ✅ 완료 |
| I-UI-9. 포매팅 통일 | DX | ❌ 미착수 |

---

## 부록: 전체 SUGGESTION 목록

<details>
<summary>36건의 SUGGESTION 보기 (클릭하여 펼치기)</summary>

### API / 인프라
- S-API-1. `useApiMutation` 에러 토스트 데드 코드 조건 정리
- S-API-2. `useBreadcrumb` JSON.stringify 대신 shallow comparison
- S-API-3. `useContainerSize` 두 개 state를 하나로 병합 (double re-render 방지)
- S-API-4. Toast `dismissible` 옵션이 sonner에 미전달
- S-API-5. `Tooltip` 하드코딩 색상값 → CSS 변수 전환
- S-API-6. `DashboardCardSkeleton`이 charts 모듈에서 import됨 (결합)
- S-API-7. `PaginatedResponse.totalPages` 파생 가능 값 중복
- S-API-8. form 컴포넌트 ref forwarding 미지원 (Spinner, Checkbox, Radio, Switch)
- S-API-9. Header가 `useGnbPanel` 대신 `useContext` 직접 사용

### 인증
- S-AUTH-1. login/signup 스키마 간 유효성 검증 상수 중복
- S-AUTH-2. `mockConstituencies.ts` 타입을 공유 types로 이동
- S-AUTH-3. `formatTime`이 불필요하게 `useCallback` 사용
- S-AUTH-4. `SignupStepper` totalSteps와 STEP_LABELS 미연동
- S-AUTH-5. 패스워드 토글 버튼 44px 미달
- S-AUTH-6. feature 배럴 export(`auth/index.ts`) 없음
- S-AUTH-7. 회원가입 제출 오버레이 `absolute` 포지셔닝 — 부모 `relative` 없음

### 지도
- S-MAP-1. TopoJSON 데이터 파일 1.7MB 레포 내 포함 — CDN 고려
- S-MAP-2. `CONSTITUENCY_TOOLTIP_MOCK`의 Proxy 사용 — TypeScript 검증 무력화
- S-MAP-3. `buildLegendItems`의 min/max 계산 중복
- S-MAP-4. MapBreadcrumb 깊은 삼항 중첩 — switch/early return으로 개선
- S-MAP-5. `RegionPolygon` arePropsEqual에서 콜백 제외 — stale 참조 위험 문서화
- S-MAP-6. `choropleth-utils.test.ts`에서 `buildLegendItems`/`formatNumber` 미테스트
- S-MAP-7. `mock-comparison.ts`가 컴포넌트에서 타입 import (순환 의존 우려)
- S-MAP-8. 지도 컴포넌트에 Error Boundary 없음
- S-MAP-9. `RegionSearch.buildSearchData`가 sigunFeatures를 3회 순회
- S-MAP-10. `useMapZoom`의 불필요한 `getInitialTransform` useCallback 래퍼
- S-MAP-11. `useHeatmapMode`의 visibleCodes 배열 참조 안정성 취약

### 공약/정책
- S-PLG-1. `mock-local-statistics.ts` trailing 타입 중복
- S-PLG-2. 함수 선언 스타일 불일치 (function vs const arrow)
- S-PLG-3. `mock-candidates.ts`의 `ELECTION_TERMS` 대통령 특정인데 이름 비명시적
- S-PLG-4. `computePledgeSummary` 배열 5회 순회 → 단일 reduce
- S-PLG-5. `PledgeDonutChart` reduce에 초기값 없음 (빈 배열 시 에러)
- S-PLG-6. `CandidateCard` 링크 유무에 따른 시각적 구분 없음
- S-PLG-7. `local-election-data.ts`의 `SIDO_LIST` 불필요한 re-export
- S-PLG-8. 반복되는 페이지 제목 패턴 → `PageHeader` 컴포넌트 추출

</details>
