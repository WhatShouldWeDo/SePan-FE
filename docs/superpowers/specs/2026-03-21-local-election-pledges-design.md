# 지방선거 역대공약분석 페이지 설계

## 개요

역대공약분석 기능의 지방선거 페이지를 신규 구현한다. 기존 대통령/국회의원 선거 페이지의 패턴과 컴포넌트를 최대한 재사용하되, 카드/리스트 뷰 토글과 DataTable이 핵심 신규 기능이다.

## 범위

### 포함
- 지방선거 페이지 (`/pledges/local`)
- 선거종류 3종: 시·도지사, 시·도의회의원, 구·시·군의장
- 카드 뷰 (기존 CandidateGrid 재사용) + 리스트 뷰 (신규 CandidateTable)
- SegmentedControl 공통 컴포넌트
- Mock 데이터 (종류당 5명, 총 15명)

### 제외
- 통계분석 탭 (placeholder 유지)
- API 연동 (mock 데이터 단계)
- 테이블 페이지네이션 (15건이라 불필요)
- 액션 버튼 동작 (placeholder)

## 라우팅

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/pledges/local` | `LocalElectionPledgesPage` | 기존 PledgesPlaceholderPage 대체 |

**주의:** `router.tsx`에서 `/pledges/local` 라우트는 반드시 `/pledges/:type` 와일드카드 라우트 **위에** 배치해야 한다. 기존 `/pledges/presidential`, `/pledges/parliamentary`와 동일한 위치.

**Breadcrumb:**
```typescript
useBreadcrumb([
  { label: "역대공약분석" },
  { label: "지방선거" },
])
```

## 페이지 레이아웃

```
Breadcrumb: 역대공약분석 > 지방선거
Heading: "지방선거" + 설명 텍스트
─────────────────────────────
필터 칩 3개: [회차] [선거종류] [지역]
─────────────────────────────
탭: 후보자 목록 | 통계분석(placeholder)
─────────────────────────────
결과 헤더: "{필터 요약}"  {N}건  [카드|리스트]
─────────────────────────────
콘텐츠: CandidateGrid (카드) 또는 CandidateTable (리스트)
```

## 필터 구조

국회의원 선거 페이지와 동일한 계단식(cascading) 패턴. 3단계:

1. **ElectionTermFilter** — 회차 (제8회~제6회 등) → 기존 컴포넌트 재사용
2. **ElectionTypeFilter** — 선거종류 (시·도지사/시·도의회의원/구·시·군의장) → 기존 컴포넌트 재사용, 데이터만 변경
3. **RegionSidoFilter** — 지역 (17개 시·도) → 기존 컴포넌트 재사용

국회의원 선거의 4단계(시·군·구 필터)와 달리 시·도 단위까지만 필터링.

### 계단식 리셋 규칙
- 회차 변경 → 선거종류, 지역 초기화
- 선거종류 변경 → 지역 초기화
- 지역 변경 → 단독 변경

## 신규 컴포넌트

### 1. SegmentedControl (`src/components/ui/segmented-control.tsx`)

공통 UI 컴포넌트. 향후 대통령/국회의원 페이지에도 적용 가능.

```typescript
interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string; icon?: ReactNode }[]
  value: T
  onChange: (value: T) => void
  size?: "sm" | "md"  // md = 36px (default)
  className?: string
}
```

**스타일 (디자인 토큰 사용):**
- 컨테이너: `bg-fill-normal` 배경, `rounded-lg`, `p-[3px]`
- 활성 탭: `bg-white shadow-sm`, `font-semibold`, `text-label-normal`
- 비활성 탭: `bg-transparent`, `font-medium`, `text-label-alternative`
- 최소 높이: 44px (UX 가드레일)

### 2. CandidateTable (`src/features/pledges/components/CandidateTable.tsx`)

후보자 리스트 뷰 테이블.

```typescript
interface CandidateTableProps {
  candidates: Candidate[]
}
```

**컬럼 구성:**

| 컬럼 | 너비 | 내용 |
|------|------|------|
| 사진 | 56px | 40x40 원형 아바타 (placeholder: 성 이니셜) |
| 이름 | 100px | font-weight 600 |
| 정당 | 120px | PARTY_COLOR_MAP 뱃지 재사용 |
| 지역 | 160px | 위치 아이콘 + 지역명 (선거종류별 상세도 차이) |
| 주요 경력 | auto | `careers[0]` 표시, 1줄 truncate with ellipsis |
| 선거 정보 | 180px | "제 N회 {선거종류}" |
| 액션 | 60px | `...` 더보기 (placeholder) |

**지역 컬럼 상세도:**
- 시·도지사: `서울특별시` (sido만)
- 시·도의회의원: `서울 강남구 제1선거구` (sido + regionDetail)
- 구·시·군의장: `서울 강남구` (sido + regionDetail)

**스타일:**
- 헤더: 44px 높이, `rgba(107,114,128,0.08)` 배경
- 행: 64px 높이, `rgba(107,114,128,0.12)` 하단 border
- 빈 상태: "검색 결과가 없습니다" 메시지 (CandidateGrid와 동일)

## 상태 관리

```typescript
// 필터 상태 — 계단식 패턴
const [selectedTerm, setSelectedTerm] = useState<number | null>(null)
const [selectedElectionType, setSelectedElectionType] = useState<string | null>(null)
const [selectedSido, setSelectedSido] = useState<string | null>(null)

// 뷰 모드 — 필터 변경 시 리셋하지 않음
const [viewMode, setViewMode] = useState<"card" | "list">("card")

// 필터링
const filteredCandidates = MOCK_LOCAL_CANDIDATES.filter(...)

// 결과 헤더 — 페이지 레벨에서 렌더링 (CandidateGrid/CandidateTable 외부)
// CandidateGrid의 기존 내장 헤더("검색결과 N건")를 대체하므로,
// CandidateGrid에 hideHeader prop을 추가하거나,
// 결과 헤더를 CandidateGrid 내장 헤더 위치에 통합한다.
// → CandidateGrid에 hideHeader?: boolean prop 추가 (기존 페이지는 영향 없음, default false)

// 뷰 전환
{viewMode === "card"
  ? <CandidateGrid candidates={filteredCandidates} hideHeader />
  : <CandidateTable candidates={filteredCandidates} />}
```

## 데이터

### 타입 확장

```typescript
// electionType 유니온 타입 확장
electionType?: "national" | "proportional" | "governor" | "council" | "mayor"

// regionDetail 필드 추가
regionDetail?: string  // 선거구/구·시·군 정보 (optional, 시·도지사는 없음)
```

두 변경 모두 optional이므로 기존 대통령/국회의원 mock 데이터에 영향 없음.

### Mock 데이터 파일

**`src/features/pledges/data/mock-local.ts`:**
- `MOCK_LOCAL_CANDIDATES`: 15명 (종류당 5명)
  - governor 5명: `regionDetail` 없음
  - council 5명: `regionDetail` = 선거구 정보
  - mayor 5명: `regionDetail` = 구·시·군 정보

**`src/features/pledges/data/local-election-data.ts`:**
- `LOCAL_ELECTION_TERMS`: 회차 목록 (제8회~제6회, MVP 범위로 3회차만)
- `LOCAL_ELECTION_TYPES`: 선거종류 3종 — `ElectionType` 인터페이스를 `region-data.ts`에서 import
- `SIDO_LIST`: `region-data.ts`에서 재사용 (re-export)

## 재사용 컴포넌트

| 컴포넌트 | 출처 | 변경 |
|----------|------|------|
| CandidateCard | `features/pledges/components/` | 변경 없음 |
| CandidateGrid | `features/pledges/components/` | `hideHeader?: boolean` prop 추가 |
| ElectionTermFilter | `features/pledges/components/` | 변경 없음, 데이터만 다름 |
| ElectionTypeFilter | `features/pledges/components/` | 변경 없음, 데이터만 다름 |
| RegionSidoFilter | `features/pledges/components/` | 변경 없음 |
| Chip | `components/ui/` | 변경 없음 |
| Tabs | `components/ui/` | 변경 없음 |
| PARTY_COLOR_MAP | `features/pledges/data/` | 변경 없음 |

## 파일 구조

```
신규:
  src/app/routes/LocalElectionPledgesPage.tsx
  src/components/ui/segmented-control.tsx
  src/features/pledges/components/CandidateTable.tsx
  src/features/pledges/data/mock-local.ts
  src/features/pledges/data/local-election-data.ts

수정:
  src/app/router.tsx                          (라우트 추가, /pledges/:type 위에 배치)
  src/features/pledges/data/mock-candidates.ts (Candidate 타입: electionType 유니온 확장 + regionDetail 추가)
  src/features/pledges/components/CandidateGrid.tsx (hideHeader prop 추가)
  src/features/pledges/components/index.ts     (CandidateTable export 추가)
```
