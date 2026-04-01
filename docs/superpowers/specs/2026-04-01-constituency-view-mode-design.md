# 선거구 단위 뷰 모드 (Constituency View Mode) — 디자인 스펙

> 작성일: 2026-04-01
> 상태: draft

---

## 1. 기능 요약

행정동(eupMyeonDong) 레벨 폴리곤 맵에서 **"선거구 보기" 토글**을 제공한다.
토글 ON 시 같은 국회의원 선거구(SGG_Code)에 속하는 행정동들을 **동일 색상**으로 표시하고,
클릭/호버/선택을 **선거구 단위**로 동작하게 한다.

### 데이터 기준

- `constituencies.topojson.json` — 22대 국회의원선거 (2024) 254개 선거구
- `emd.topojson.json` — 3,558개 행정동, 모두 `SGG_Code` 보유 (누락 0건)
- 매핑: EMD의 `SGG_Code` → constituency의 `SGG_Code` (1:N)
- constituency 속성: `{ SGG_Code, SGG, SIDO, SIDO_SGG }`

### 데이터 로딩

`useTopoJsonData` 훅에서 `constituencies.topojson.json`을 추가 로딩하여 SGG_Code → constituency 속성 룩업 맵을 제공한다. 지오메트리는 불필요 — 속성(properties)만 추출하여 `Map<string, { sgg: string; sidoSgg: string; sido: string }>` 형태로 반환한다.

---

## 2. 수용 기준 (Acceptance Criteria)

| # | 조건 | 검증 방법 |
|---|------|-----------|
| AC-1 | "선거구 보기" 토글이 `eupMyeonDong` 레벨에서만 표시된다 | 다른 레벨(sido/sigun/gu)에서 토글이 보이지 않음 |
| AC-2 | 토글 ON 시 같은 SGG_Code를 가진 행정동들이 동일 색상으로 표시된다 | 같은 선거구 내 행정동이 모두 같은 fillOverride를 받음 |
| AC-3 | 서로 다른 선거구는 시각적으로 구별 가능한 다른 색상을 사용한다 | 인접 선거구 색상이 다름 |
| AC-4 | 행정동 폴리곤은 개별적으로 보이지만, 클릭 시 선거구 단위로 `onRegionSelect` 호출 | `MapRegion { code: SGG_Code, sido, name: SGG, fullName: SIDO_SGG }` |
| AC-5 | 호버 시 같은 선거구의 모든 행정동이 동시에 하이라이트된다 (stroke 3px) | 마우스를 한 행정동에 올리면 같은 선거구의 다른 행정동도 하이라이트 |
| AC-6 | 선택된 선거구의 모든 행정동에 두꺼운 외곽선(3px)이 표시된다 | `selectedCode === SGG_Code`일 때 해당 선거구 전체에 isSelected 적용 |
| AC-7 | 호버 시 선거구 정보 툴팁이 표시된다 (선거구명, 유권자수, 진보/보수 비율) | 기존 `MapTooltipData` 필드 활용한 mock 데이터 |
| AC-8 | 히트맵 활성 시 선거구 모드는 완전 비활성 (색상 + 인터랙션 모두 일반 모드) | choroplethData가 있으면 토글 숨김 |
| AC-9 | 토글 OFF 시 기존 행정동 개별 동작으로 즉시 복귀한다 | 색상/클릭/호버가 원래 행정동 단위로 동작 |
| AC-10 | 행정동 레벨에서 다른 레벨로 이동 시 토글이 자동 OFF 된다 | 브레드크럼 뒤로가기 등으로 레벨 변경 시 리셋 |

---

## 3. 상태 관리

### 3-1. 상태 소유권

| 상태 | 소유자 | 설명 |
|------|--------|------|
| `isConstituencyMode` | **KoreaAdminMap 내부** (`useState`) | 토글 ON/OFF. `currentLevel !== "eupMyeonDong"` 시 자동 `false` 리셋 |
| `hoveredConstituencyCode` | **KoreaAdminMap 내부** (파생) | 호버 중인 EMD의 SGG_Code. 같은 선거구 전체 하이라이트에 사용 |
| `selectedCode` (prop) | **RegionResultPage** (기존) | 선거구 모드 시 SGG_Code, 일반 모드 시 EMD_CD |

토글 ON/OFF 시 부모의 `selectedCode`를 리셋해야 하므로, KoreaAdminMap에 새 prop 추가:
- `onConstituencyModeChange?: (isOn: boolean) => void` — 토글 변경 시 부모에 알림. 부모는 이를 받아 `selectedRegion`을 `null`로 리셋.

### 3-2. 선거구 정보 조회 경로

```
EMD feature → properties.SGG_Code
                    ↓
constituencyInfoMap.get(SGG_Code)
                    ↓
{ sgg: "강남갑", sidoSgg: "서울 강남갑", sido: "서울" }
```

`constituencyInfoMap`은 `useTopoJsonData`에서 한 번 빌드되어 KoreaAdminMap으로 전달된다.

---

## 4. UI 상태 및 전환

### 4-1. 토글 위치 및 외형

- **위치**: 지도 섹션 내, 브레드크럼 우측에 인라인 배치 (`MapBreadcrumb` 컴포넌트 내부에 슬롯 추가 or 브레드크럼 옆 별도 렌더링)
- **컴포넌트**: 기존 `Switch` 컴포넌트 (size="sm", 34×20px) + "선거구 보기" 라벨 (text-body-3)
- **조건부 표시**: `currentLevel === "eupMyeonDong"` AND 히트맵 비활성(choroplethData == null)일 때만 렌더링

### 4-2. 색상 팔레트

선거구별 구분 색상 (OKLCH 기반, 기존 테마 변수와 일관):

| 인덱스 | 색상 | 호버 색상 (채도 +0.06) | 용도 |
|--------|------|------------------------|------|
| 0 | `oklch(0.65 0.18 280)` | `oklch(0.60 0.24 280)` | 보라 |
| 1 | `oklch(0.72 0.12 280)` | `oklch(0.67 0.18 280)` | 연보라 |
| 2 | `oklch(0.65 0.15 185)` | `oklch(0.60 0.21 185)` | 청록 |
| 3 | `oklch(0.65 0.15 145)` | `oklch(0.60 0.21 145)` | 녹색 |
| 4 | `oklch(0.70 0.15 60)` | `oklch(0.65 0.21 60)` | 주황 |
| 5 | `oklch(0.65 0.15 25)` | `oklch(0.60 0.21 25)` | 코랄 |
| 6 | `oklch(0.70 0.12 220)` | `oklch(0.65 0.18 220)` | 하늘 |
| 7 | `oklch(0.65 0.15 340)` | `oklch(0.60 0.21 340)` | 핑크 |

- **호버 색상 도출**: 기본 색상 대비 L -0.05, C +0.06 (Figma annotation "채도 높은 색상")
- 인덱스 할당: 현재 뷰의 고유 SGG_Code를 정렬 후 순서대로 배정
- 한 화면 최대 4~5개 선거구 (하나의 구/시군 내)

### 4-3. 호버 동작 (constituency mode)

1. 마우스가 행정동 폴리곤 진입
2. 해당 EMD의 `SGG_Code`를 `hoveredConstituencyCode`에 설정
3. **같은 SGG_Code를 가진 모든 EMD**에:
   - stroke 3px + 호버 색상 적용 (팔레트의 hover variant)
4. 기존 선택된 선거구가 있으면: 그 선거구의 색상은 변경하지 않음 (Figma: "기존 선택된 영역은 색상 그대로 유지")
5. 툴팁: `hovered.region`에 선거구 정보 표시 (fullName = SIDO_SGG)

### 4-4. 선택 동작 (constituency mode)

1. 행정동 폴리곤 클릭
2. 해당 EMD의 `SGG_Code`로 선거구 정보 조회
3. `onRegionSelect` 호출: `{ code: SGG_Code, sido, name: SGG, fullName: SIDO_SGG }`
4. 부모가 `selectedCode = SGG_Code`로 설정
5. 해당 선거구의 모든 EMD에 stroke 3px + 기본 선거구 색상 유지
6. 다른 선거구 클릭 시 기존 선택 해제 후 새 선거구 선택

### 4-5. 상태 전환 다이어그램

```
[eupMyeonDong 레벨 진입] AND [히트맵 비활성]
  → 토글 표시 (기본 OFF)
  → [토글 ON]
    → onConstituencyModeChange(true) → 부모: selectedRegion = null
    → 선거구 색상 적용 + 선거구 단위 인터랙션
    → [행정동 호버] → 같은 선거구 전체 하이라이트 + 선거구 툴팁
    → [행정동 클릭] → 선거구 단위 선택 + onRegionSelect(constituency)
    → [토글 OFF]
      → onConstituencyModeChange(false) → 부모: selectedRegion = null
      → 원래 행정동 개별 모드 복귀
  → [레벨 변경 (브레드크럼/검색)] → isConstituencyMode = false 자동 리셋
  → [히트맵 활성화] → 토글 숨김, isConstituencyMode = false 자동 리셋
```

---

## 5. 엣지 케이스

| # | 케이스 | 처리 방식 |
|---|--------|-----------|
| E-1 | 히트맵 활성 시 | 토글 숨김 + `isConstituencyMode` 자동 `false`. 일반 행정동 모드로 동작. |
| E-2 | 선거구가 여러 구에 걸침 (예: 중구·성동구갑) | 현재 뷰의 행정동만 해당 선거구 색상. 다른 구의 행정동은 보이지 않음. 정상 동작. |
| E-3 | 선거구 선택 후 토글 OFF | `onConstituencyModeChange(false)` → 부모가 `selectedRegion = null` 리셋. |
| E-4 | 선거구 선택 후 레벨 변경 | `isConstituencyMode = false` 자동 리셋. 부모의 selectedRegion은 레벨 변경 로직에서 별도 처리 (기존 동작). |
| E-5 | 하나의 선거구만 존재하는 뷰 | 단일 색상 적용. 정상 동작. |
| E-6 | 줌 조작 중 선거구 모드 | 줌/팬 기존 동작 유지. 선거구 색상/인터랙션 유지. |
| E-7 | "내 선거구로 돌아가기" + 선거구 모드 | 돌아가기는 `searchNav` 변경 → eupMyeonDong 레벨 유지 → `isConstituencyMode`는 `false`로 리셋 (searchNavigation useEffect에서 리셋). |
| E-8 | 검색 네비게이션으로 다른 지역 이동 | 레벨 변경 수반 → `isConstituencyMode = false` 자동 리셋. |

---

## 6. 선거구 툴팁 (Mock 데이터)

### 6-1. 기존 인터페이스 재사용

`MapTooltipData`에 이미 `voterCount`, `totalRatio`, `progressive`, `conservative` 필드가 존재한다.
선거구 모드에서는 이 필드들을 선거구 단위 mock 데이터로 채워서 반환한다.

### 6-2. 데이터 흐름

```
[constituency mode ON + hover]
  → hoveredCode = EMD_CD
  → SGG_Code = emdFeature.properties.SGG_Code
  → constituencyTooltipProvider(SGG_Code) → MapTooltipData
  → MapTooltip 표시:
    - title = SIDO_SGG (예: "서울 강남병")
    - 유권자수, 전체대비, 진보%, 보수%
```

### 6-3. Mock 데이터

SGG_Code별 mock 데이터를 상수 맵으로 정의:

```typescript
// mock-constituency-tooltip.ts
export const CONSTITUENCY_TOOLTIP_MOCK: Record<string, MapTooltipData> = {
  "2112301": { voterCount: 9523, totalRatio: 38, progressive: 35.2, conservative: 60.1 },
  "2112302": { voterCount: 8871, totalRatio: 36, progressive: 33.8, conservative: 61.5 },
  "2112303": { voterCount: 9899, totalRatio: 42, progressive: 29.8, conservative: 65.9 },
  // ... 254개 전체 or 주요 지역만
};
```

실제 구현 시 254개 전체를 넣거나, 현재 뷰에 해당하는 선거구만 mock으로 충분.

---

## 7. Out of Scope (비목표)

- 지방선거 선거구 데이터 (현재 데이터는 22대 국회의원선거 기준)
- 선거구 경계 외곽선 별도 렌더링 (행정동 폴리곤 그룹핑으로 표현)
- 선거구별 상세 분석 패널 (클릭 후 우측 패널은 기존 로직 활용)
- 선거구 검색 기능
- 서버 API 연동 (mock 데이터만 사용)

---

## 8. 디자인 참조

- Figma: 강남구 선거구 단위 뷰 (현재 선택된 노드)
- 색상: 보라/연보라/청록 3색으로 갑/을/병 구분
- 호버 annotation: "지도영역 hover 시, 해당하는 영역의 stroke 3px 표시(inside) + 영역 색상 대비 높은 채도색상으로 지정 + 기존 선택된 영역은 색상 그대로 유지"
- 툴팁 annotation: "지도영역 hover 시, tooltip 제시"
