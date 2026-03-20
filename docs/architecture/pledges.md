# Pledges (역대공약분석) 모듈

> 최종 업데이트: 2026-03-18

## 개요

역대공약분석 모듈. 사용자가 선거 유형(대통령/국회의원/지방)을 선택해 해당 선거의 공약을 분석할 수 있는 기능. 기존 `/policy` 라우트를 대체.

## 라우트

| 경로 | 컴포넌트 | 상태 |
|------|----------|------|
| `/pledges` | `PledgesOverviewPage` | 완료 |
| `/pledges/presidential` | `PresidentialPledgesPage` | 완료 (mock 데이터) |
| `/pledges/parliamentary` | `ParliamentaryPledgesPage` | 완료 (mock 데이터) |
| `/pledges/:type` | `PledgesPlaceholderPage` | placeholder (지방선거 등) |

## 파일 구조

```
src/
├── app/routes/
│   ├── PledgesOverviewPage.tsx         # 개요 랜딩 페이지
│   ├── PresidentialPledgesPage.tsx     # 대통령선거 후보자 목록
│   ├── ParliamentaryPledgesPage.tsx    # 국회의원선거 후보자 목록
│   └── PledgesPlaceholderPage.tsx      # 하위 선거 페이지 placeholder
├── features/pledges/
│   ├── components/
│   │   ├── CandidateCard.tsx           # 후보자 프로필 카드
│   │   ├── CandidateGrid.tsx           # 2열 그리드 + 검색결과 헤더 + 빈 상태
│   │   ├── ElectionTermFilter.tsx      # 선거회차 Chip 드롭다운 필터
│   │   ├── ElectionTypeFilter.tsx      # 선거종류 Chip 드롭다운 필터 (국회의원/비례대표)
│   │   ├── RegionSidoFilter.tsx        # 시/도 버튼 그리드 팝오버 필터
│   │   ├── RegionSigunguFilter.tsx     # 시/군/구 버튼 그리드 팝오버 필터 (멀티셀렉트 최대 3개)
│   │   ├── KeywordChips.tsx            # 상위 키워드 칩 (정보 표시용)
│   │   └── index.ts                    # re-export
│   └── data/
│       ├── mock-candidates.ts          # Mock 대통령선거 후보자 데이터 + 타입 + 정당 색상 매핑
│       ├── mock-parliamentary.ts       # Mock 국회의원선거 후보자 데이터 (12명)
│       └── region-data.ts             # 시/도 목록, 시/군/구 매핑, 키워드 매핑, 선거종류/회차 상수
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
- "페이지 준비 중입니다" 메시지 표시 (지방선거 등 미구현 선거 유형)

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
- `components/ui` — Chip, Tabs
- `src/assets/category-icons/aging.png` — 선거 아이콘 (공유 에셋)
