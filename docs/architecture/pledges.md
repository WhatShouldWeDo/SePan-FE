# Pledges (역대공약분석) 모듈

> 최종 업데이트: 2026-03-21

## 개요

역대공약분석 모듈. 사용자가 선거 유형(대통령/국회의원/지방)을 선택해 해당 선거의 공약을 분석할 수 있는 기능. 기존 `/policy` 라우트를 대체.

## 라우트

| 경로 | 컴포넌트 | 상태 |
|------|----------|------|
| `/pledges` | `PledgesOverviewPage` | 완료 |
| `/pledges/presidential` | `PresidentialPledgesPage` | 완료 (mock 데이터) |
| `/pledges/parliamentary` | `ParliamentaryPledgesPage` | 완료 (mock 데이터) |
| `/pledges/local` | `LocalElectionPledgesPage` | 완료 (mock 데이터) |
| `/pledges/:type` | `PledgesPlaceholderPage` | placeholder |

## 파일 구조

```
src/
├── app/routes/
│   ├── PledgesOverviewPage.tsx         # 개요 랜딩 페이지
│   ├── PresidentialPledgesPage.tsx     # 대통령선거 후보자 목록
│   ├── ParliamentaryPledgesPage.tsx    # 국회의원선거 후보자 목록
│   ├── LocalElectionPledgesPage.tsx    # 지방선거 후보자 목록
│   └── PledgesPlaceholderPage.tsx      # 하위 선거 페이지 placeholder
├── components/ui/
│   └── segmented-control.tsx           # 카드/리스트 뷰 토글 공통 컴포넌트 (제네릭)
├── features/pledges/
│   ├── components/
│   │   ├── CandidateCard.tsx           # 후보자 프로필 카드
│   │   ├── CandidateGrid.tsx           # 2열 그리드 + 검색결과 헤더 + 빈 상태
│   │   ├── CandidateTable.tsx          # 후보자 테이블 뷰
│   │   ├── ElectionTermFilter.tsx      # 선거회차 Chip 드롭다운 필터
│   │   ├── ElectionTypeFilter.tsx      # 선거종류 Chip 드롭다운 필터 (국회의원/비례대표)
│   │   ├── RegionSidoFilter.tsx        # 시/도 버튼 그리드 팝오버 필터
│   │   ├── RegionSigunguFilter.tsx     # 시/군/구 버튼 그리드 팝오버 필터 (멀티셀렉트 최대 3개)
│   │   ├── KeywordChips.tsx            # 상위 키워드 칩 (정보 표시용)
│   │   └── index.ts                    # re-export
│   └── data/
│       ├── mock-candidates.ts          # Mock 대통령선거 후보자 데이터 + 타입 + 정당 색상 매핑
│       ├── mock-parliamentary.ts       # Mock 국회의원선거 후보자 데이터 (12명)
│       ├── mock-local.ts               # Mock 지방선거 후보자 데이터 (15명)
│       ├── region-data.ts              # 시/도 목록, 시/군/구 매핑, 키워드 매핑, 선거종류/회차 상수
│       └── local-election-data.ts      # 지방선거 필터 옵션 데이터
└── assets/pledges/
    └── location-fill.svg               # 위치 배지 아이콘
```

## 컴포넌트 구조

### PledgesOverviewPage

- **브레드크럼**: `useBreadcrumb([{ label: "역대공약분석" }])` — 1 depth
- **선거 유형 카드 (ElectionTypeCard)**: 3개 카드 그리드, 클릭 시 하위 라우트로 이동
  - 상단: 분홍 배경(`rgba(181,29,82,0.08)`) + mask-luminance 아이콘
  - 하단: 선거명 + 설명
- **빠른시작 카드 (QuickStartCard)**: 3개 카드 그리드, 최근 검색 선거회차
  - 좌측: 64px mask-luminance 아이콘
  - 우측: 선거회차명 + 지역구 배지(primary) + 정당 배지(party color)
- 데이터: 하드코딩 (API 연동 전)

### PresidentialPledgesPage

- **브레드크럼**: `[{ label: "역대공약분석", path: "/pledges" }, { label: "대통령선거" }]` — 2 depth
- **선거회차 필터**: `ElectionTermFilter` — Chip 드롭다운으로 선거 회차 선택
- **탭**: "후보자" / "통계분석" (통계분석은 placeholder)
- **후보자 목록**: `CandidateGrid` — 2열 그리드, `CandidateCard`로 구성
- 데이터: `mock-candidates.ts` (mock)

### ParliamentaryPledgesPage

- **브레드크럼**: `[{ label: "역대공약분석", path: "/pledges" }, { label: "국회의원선거" }]` — 2 depth
- **4단계 캐스케이딩 필터**:
  1. `ElectionTermFilter` — 선거 회차
  2. `ElectionTypeFilter` — 선거 종류 (지역구/비례대표)
  3. `RegionSidoFilter` — 시/도 선택
  4. `RegionSigunguFilter` — 시/군/구 선택 (멀티셀렉트, 최대 3개)
- **키워드 칩**: `KeywordChips` — 선택된 시/군/구에 매핑된 상위 키워드 표시
- **탭**: "후보자" / "통계분석" (통계분석은 placeholder)
- **후보자 목록**: `CandidateGrid` — 2열 그리드
- 데이터: `mock-parliamentary.ts` (mock)

### PledgesPlaceholderPage

- URL 파라미터 `type`으로 선거 유형 판별
- "페이지 준비 중입니다" 메시지 표시 (미구현 선거 유형)

### LocalElectionPledgesPage

- **라우트**: `/pledges/local`
- **브레드크럼**: `[{ label: "역대공약분석", path: "/pledges" }, { label: "지방선거" }]` — 2 depth
- **3단 계단식 필터**:
  1. `ElectionTermFilter` — 선거 회차
  2. `ElectionTypeFilter` — 선거 종류 (시·도지사 / 시·도의회의원 / 구·시·군의장)
  3. `RegionSidoFilter` — 지역(시·도) 선택
- **뷰 토글**: `SegmentedControl` — "카드" / "리스트" 전환. 필터 변경 시 viewMode 유지.
- **카드 뷰**: `CandidateGrid` (hideHeader prop 사용) — 2열 그리드
- **리스트 뷰**: `CandidateTable` — 테이블 형태, 선거종류에 따라 지역 상세도 칼럼이 다름
- **탭**: "후보자" / "통계분석" (통계분석은 placeholder)
- 데이터: `mock-local.ts` (mock)

## 신규 컴포넌트

### SegmentedControl (`components/ui/segmented-control.tsx`)

- 앱 전역에서 재사용 가능한 뷰 토글 컴포넌트
- 제네릭 타입 `T extends string`으로 임의 옵션 집합을 지원
- `value`, `onChange`, `options` (label + value) props로 제어
- 현재 LocalElectionPledgesPage의 카드/리스트 뷰 전환에서 사용

### CandidateTable (`features/pledges/components/CandidateTable.tsx`)

- 지방선거 후보자 리스트 뷰 전용 테이블
- 칼럼: 이름, 정당, 선거종류, 지역 상세(`regionDetail`)
- `regionDetail` 필드는 선거종류(governor/council/mayor)에 따라 표시 내용이 다름 (시·도 / 선거구 / 구·시·군)
- `CandidateGrid`와 동일한 후보자 목록 데이터를 받아 다른 레이아웃으로 렌더링

## 데이터

### mock-local.ts

- 지방선거 Mock 후보자 15명: governor 5명, council 5명, mayor 5명
- `Candidate` 타입의 `electionType` 필드: `"governor"` | `"council"` | `"mayor"` 값 사용
- `regionDetail` 필드: 선거종류별 지역 상세 문자열

### local-election-data.ts

- `LOCAL_ELECTION_TERMS`: 지방선거 회차 목록 (3회차)
- `LOCAL_ELECTION_TYPES`: 선거종류 목록 (시·도지사 / 시·도의회의원 / 구·시·군의장)
- `SIDO_LIST`: `region-data.ts`의 시/도 목록 re-export

## Candidate 타입 확장 (`mock-candidates.ts`)

`electionType` 유니온에 지방선거 유형 추가:
- 기존: `"지역구"` | `"비례대표"` | `"대통령"`
- 추가: `"governor"` | `"council"` | `"mayor"`

`regionDetail?: string` 필드 추가 — 지방선거에서 선거종류별 지역 상세 표시용.

## 상태 관리 (LocalElectionPledgesPage)

- `selectedTerm` — 선택된 선거 회차 (string | null)
- `selectedElectionType` — 선택된 선거 종류 (string | null)
- `selectedSido` — 선택된 시/도 (string | null)
- `viewMode` — `"card"` | `"list"` (필터 변경 시 리셋하지 않음)
- 필터 파생 후보자 목록은 `useMemo`로 계산
- 나머지 패턴은 `ParliamentaryPledgesPage`와 동일 (`useState` 기반, React Query 미사용)

## 아이콘 렌더링

`src/assets/category-icons/aging.png`을 재사용. CategoryNav과 동일한 CSS mask-luminance 패턴:

```tsx
style={{
  backgroundColor: "#b51d52",
  maskImage: `url('${agingIcon}')`,
  maskMode: "luminance",
  maskSize: "50px 50px",
  maskPosition: "center",
  maskRepeat: "no-repeat",
}}
```

## 에셋

- `aging.png` (`src/assets/category-icons/`): CategoryNav 공유 에셋. mask-luminance로 `#b51d52` 색상 적용
- `location-fill.svg` (`src/assets/pledges/`): 지역구 배지 내 위치 아이콘 (`<img>` 태그로 사용)

## 의존 모듈

- `contexts/useNavigation` — `useBreadcrumb` 훅
- `react-router-dom` — `Link`, `useParams`
- `components/ui` — Chip, Tabs, SegmentedControl
- `src/assets/category-icons/aging.png` — 선거 아이콘 (공유 에셋)
