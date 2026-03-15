# 역대공약분석 개요 페이지 설계

> 작성일: 2026-03-15

## 개요

역대공약분석 모듈의 개요(랜딩) 페이지. 사용자가 선거 유형(대통령/국회의원/지방)을 선택하거나, 빠른시작 카드로 특정 선거회차에 직접 진입할 수 있다.

## 수정 사항 (Figma 디자인 대비)

1. GNB 브레드크럼: "역대공약분석" 1 depth만 (2 depth 제거)
2. 타이틀: "역대공약분석" 단일 타이틀 (기존 "국회의원 선거" + 설명 텍스트 제거)
3. SVG 아이콘: Figma localhost URL → 로컬 다운로드 (`src/assets/pledges/`)

## 라우팅

| 경로 | 페이지 | 비고 |
|------|--------|------|
| `/pledges` | `PledgesOverviewPage` | 개요 (이번 작업) |
| `/pledges/presidential` | `PledgesPlaceholderPage` | 대통령 선거 (placeholder) |
| `/pledges/parliamentary` | `PledgesPlaceholderPage` | 국회의원 선거 (placeholder) |
| `/pledges/local` | `PledgesPlaceholderPage` | 지방선거 (placeholder) |

기존 `/policy`, `/policy/new`, `/policy/:id/edit` 라우트 제거.

## 사이드바

`mainNavItems`에서 "정책개발" → "역대공약분석", `href: "/policy"` → `"/pledges"`.

## 페이지 구조 (PledgesOverviewPage)

```
<div className="p-10 space-y-10">
  <!-- 브레드크럼: useBreadcrumb([{ label: "역대공약분석" }]) -->

  <!-- 타이틀 -->
  <h1>역대공약분석</h1>

  <!-- 선거 유형 카드 3개 (grid 3col) -->
  <div className="grid grid-cols-3 gap-6">
    <Link to="/pledges/presidential"><ElectionTypeCard /></Link>
    <Link to="/pledges/parliamentary"><ElectionTypeCard /></Link>
    <Link to="/pledges/local"><ElectionTypeCard /></Link>
  </div>

  <!-- 빠른시작 섹션 -->
  <section>
    <h2>빠른시작</h2>
    <p>최근 검색한 역대공약분석</p>
    <div className="grid grid-cols-3 gap-6">
      <QuickStartCard />  <!-- 제 22대 국회의원 선거 / 강남구 갑 / 더불어민주당 -->
      <QuickStartCard />  <!-- 제 21대 비례대표 국회의원 선거 / 강남구 전체 / 국민의힘 -->
      <QuickStartCard />  <!-- 제 8회 시·도지사 선거 / 서울특별시 / 더불어민주당 -->
    </div>
  </section>
</div>
```

## 컴포넌트 설계

### ElectionTypeCard (인라인)
- Figma: 분홍 배경 상단 영역 + 아이콘 + 하단 흰색 영역에 선거명 + 설명
- Props: `icon: string`, `title: string`, `description: string`, `to: string`
- Link 래핑으로 클릭 시 해당 라우트 이동

### QuickStartCard (인라인)
- Figma: 흰색 카드, 좌측 아이콘(64px rounded), 우측 선거명 + 배지들
- Props: `icon: string`, `title: string`, `subtitle: string`, `badges: Array<{label, color}>`
- 배지: 기존 `Badge` 컴포넌트 재사용 (지역구=primary, 정당=party color)

## 재사용 컴포넌트

- `Badge` (`components/ui/badge.tsx`) — 지역구·정당 배지
- `useBreadcrumb` — GNB 브레드크럼 설정

## SVG 에셋

Figma MCP localhost URL에서 다운로드 → `src/assets/pledges/`에 로컬 저장:
- 선거 카드 아이콘 (bar chart 스타일, category-icons와 유사)
- location 아이콘 (배지 내 위치 표시)

## 데이터

하드코딩. 빠른시작 카드 데이터:

```ts
const quickStartItems = [
  { title: "제 22대", subtitle: "국회의원 선거", region: "강남구 갑", party: "더불어민주당", partyColor: "dpk" },
  { title: "제 21대", subtitle: "비례대표 국회의원 선거", region: "강남구 전체", party: "국민의힘", partyColor: "ppp" },
  { title: "제 8회", subtitle: "시·도지사 선거", region: "서울특별시", party: "더불어민주당", partyColor: "dpk" },
]
```

## UX 가드레일

- 카드 클릭 타겟: 카드 전체 영역 (44px 이상 보장)
- 타이틀 텍스트: `text-heading-2` (26px Bold), 섹션 타이틀: `text-title-2` (20px Bold)
- 대비: 기존 디자인 토큰 (`--label-normal`, `--label-alternative`) 사용 → WCAG AA 충족

## 파일 변경 목록

| 파일 | 액션 |
|------|------|
| `src/app/router.tsx` | 수정 (라우트 변경) |
| `src/app/routes/PledgesOverviewPage.tsx` | 생성 |
| `src/app/routes/PledgesPlaceholderPage.tsx` | 생성 |
| `src/components/Sidebar.tsx` | 수정 (네비 항목 변경) |
| `src/assets/pledges/` | 생성 (SVG 에셋 다운로드) |
| `src/app/routes/PolicyPage.tsx` | 라우트에서 제거 (파일은 보존) |
| `src/app/routes/PolicyFormPage.tsx` | 라우트에서 제거 (파일은 보존) |

## 작업 후 문서 업데이트

- `MODULE_MAP.md` — pledges feature 모듈 추가, policy 모듈 상태 변경
- `ARCHITECTURE.md` — 라우팅 테이블 업데이트
- `architecture/pledges.md` — 신규 생성
