# 역대공약분석 개요 페이지 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 역대공약분석 개요(랜딩) 페이지를 구현하여, 사용자가 선거 유형별 페이지로 진입하거나 빠른시작 카드로 특정 선거회차에 접근할 수 있게 한다.

**Architecture:** 기존 `/policy` 라우트를 `/pledges`로 대체. PledgesOverviewPage에 선거 유형 카드 3개 + 빠른시작 카드 3개를 하드코딩으로 배치. 하위 선거 페이지는 placeholder만 생성.

**Tech Stack:** React + TypeScript, Tailwind CSS, React Router DOM, useBreadcrumb 훅

**Spec:** `docs/superpowers/specs/2026-03-15-pledges-overview-design.md`

---

## File Structure

| 파일 | 액션 | 책임 |
|------|------|------|
| `src/assets/pledges/election-icon.png` | 생성 | 선거 카드/빠른시작 아이콘 (mask-luminance) |
| `src/assets/pledges/location-fill.svg` | 생성 | 위치 배지 아이콘 |
| `src/components/Sidebar.tsx` | 수정 | "정책개발"→"역대공약분석", href 변경 |
| `src/app/routes/PledgesPlaceholderPage.tsx` | 생성 | 하위 선거 페이지 placeholder |
| `src/app/routes/PledgesOverviewPage.tsx` | 생성 | 개요 페이지 (메인 작업) |
| `src/app/router.tsx` | 수정 | 라우트 변경 (/policy→/pledges) |

---

## Chunk 1: 인프라 (에셋, 사이드바, 라우팅)

### Task 1: GitHub 이슈 생성 및 브랜치 전환

**Files:** (없음 — git 작업)

- [ ] **Step 1: GitHub 이슈 생성**

```bash
gh issue create \
  --title "feat: 역대공약분석 개요 페이지 구현" \
  --body "## 설명
역대공약분석 모듈의 개요(랜딩) 페이지를 구현합니다.

## 완료 조건
- [ ] 사이드바 '정책개발' → '역대공약분석' 변경
- [ ] /pledges 개요 페이지 구현 (선거 유형 카드 3개 + 빠른시작 카드 3개)
- [ ] /pledges/presidential, /pledges/parliamentary, /pledges/local placeholder 라우트 생성
- [ ] 기존 /policy 라우트 제거
- [ ] SVG 에셋 로컬 저장
- [ ] 문서 업데이트 (MODULE_MAP.md, ARCHITECTURE.md)

## 관련 문서
- 설계: docs/superpowers/specs/2026-03-15-pledges-overview-design.md" \
  --label "enhancement"
```

이슈 번호를 기록한다.

- [ ] **Step 2: 브랜치 생성 및 전환**

현재 `feature/8-gnb-category-panel` 브랜치에 있으므로, main에서 새 브랜치를 생성한다.

```bash
git checkout main
git pull origin main
git checkout -b feature/{이슈번호}-pledges-overview
```

---

### Task 2: SVG 에셋 다운로드

**Files:**
- Create: `src/assets/pledges/election-icon.png`
- Create: `src/assets/pledges/location-fill.svg`

- [ ] **Step 1: 에셋 디렉토리 생성 및 다운로드**

Figma MCP localhost에서 필요한 에셋 2개를 다운로드한다:

```bash
mkdir -p src/assets/pledges

# 선거 아이콘 (mask-luminance용 PNG — CategoryNav과 동일 스타일)
curl -o src/assets/pledges/election-icon.png \
  "http://localhost:3845/assets/0315db59d49ba148bf2709927bf4ab24ac0368f9.png"

# 위치 아이콘 (배지 내 위치 표시)
curl -o src/assets/pledges/location-fill.svg \
  "http://localhost:3845/assets/c444b1f15ca6f3cd1074b7ca0ff6df64f1bb0c48.svg"
```

- [ ] **Step 2: 에셋 파일 존재 확인**

```bash
ls -la src/assets/pledges/
```

Expected: `election-icon.png`과 `location-fill.svg` 두 파일이 존재

- [ ] **Step 3: 커밋**

```bash
git add src/assets/pledges/
git commit -m "feat(pledges): 역대공약분석 페이지용 에셋 추가"
```

---

### Task 3: 사이드바 네비게이션 변경

**Files:**
- Modify: `src/components/Sidebar.tsx:32-38` (mainNavItems 배열)

- [ ] **Step 1: Sidebar.tsx 수정**

`mainNavItems` 배열에서 정책개발 항목을 역대공약분석으로 변경한다:

```ts
// Before
{ href: "/policy", label: "정책개발", icon: DuoBookOpen },

// After
{ href: "/pledges", label: "역대공약분석", icon: DuoBookOpen },
```

- [ ] **Step 2: 개발 서버에서 사이드바 확인**

```bash
pnpm run dev
```

브라우저에서 사이드바의 "역대공약분석" 항목이 표시되는지 확인한다.

- [ ] **Step 3: 커밋**

```bash
git add src/components/Sidebar.tsx
git commit -m "feat(sidebar): 정책개발 → 역대공약분석 네비게이션 변경"
```

---

### Task 4: PledgesPlaceholderPage 생성

**Files:**
- Create: `src/app/routes/PledgesPlaceholderPage.tsx`

- [ ] **Step 1: Placeholder 페이지 작성**

```tsx
import { useParams } from "react-router-dom"
import { useBreadcrumb } from "@/contexts/useNavigation"

const ELECTION_TYPE_LABELS: Record<string, string> = {
  presidential: "대통령 선거",
  parliamentary: "국회의원 선거",
  local: "지방선거",
}

export function PledgesPlaceholderPage() {
  const { type } = useParams<{ type: string }>()
  const label = ELECTION_TYPE_LABELS[type ?? ""] ?? "선거"

  useBreadcrumb([
    { label: "역대공약분석" },
    { label },
  ])

  return (
    <div className="flex items-center justify-center p-10">
      <p className="text-title-3 font-bold text-label-alternative">
        {label} 페이지 준비 중입니다.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/routes/PledgesPlaceholderPage.tsx
git commit -m "feat(pledges): placeholder 페이지 생성"
```

---

### Task 5: 라우터 업데이트

**Files:**
- Modify: `src/app/router.tsx`

- [ ] **Step 1: router.tsx 수정**

기존 policy 관련 import·라우트를 제거하고, pledges 라우트를 추가한다:

```tsx
// 제거할 import:
// import { PolicyPage } from "@/app/routes/PolicyPage"
// import { PolicyFormPage } from "@/app/routes/PolicyFormPage"

// 추가할 import:
import { PledgesOverviewPage } from "@/app/routes/PledgesOverviewPage"
import { PledgesPlaceholderPage } from "@/app/routes/PledgesPlaceholderPage"

// RootLayout children에서:
// 제거:
//   { path: "/policy", element: <PolicyPage /> },
//   { path: "/policy/new", element: <PolicyFormPage /> },
//   { path: "/policy/:id/edit", element: <PolicyFormPage /> },

// 추가:
{ path: "/pledges", element: <PledgesOverviewPage /> },
{ path: "/pledges/:type", element: <PledgesPlaceholderPage /> },
```

주의: PledgesOverviewPage는 아직 생성하지 않았으므로, 임시로 빈 export를 만들거나 Task 6 이후에 이 작업을 수행한다. **대안: Task 6(PledgesOverviewPage 생성) 후에 이 Task를 수행.**

- [ ] **Step 2: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: PledgesOverviewPage가 아직 없으면 에러 발생 → Task 6 이후에 수행

- [ ] **Step 3: 커밋**

```bash
git add src/app/router.tsx
git commit -m "feat(router): /policy → /pledges 라우트 마이그레이션"
```

---

## Chunk 2: PledgesOverviewPage 구현

### Task 6: PledgesOverviewPage 생성

**Files:**
- Create: `src/app/routes/PledgesOverviewPage.tsx`

**참조 파일:**
- `src/contexts/useNavigation.ts` — useBreadcrumb 훅
- `src/components/ui/badge.tsx` — Badge 컴포넌트
- `src/assets/pledges/election-icon.png` — 선거 아이콘
- `src/assets/pledges/location-fill.svg` — 위치 아이콘

- [ ] **Step 1: 페이지 파일 작성**

```tsx
import { Link } from "react-router-dom"
import { useBreadcrumb } from "@/contexts/useNavigation"
import electionIcon from "@/assets/pledges/election-icon.png"
import locationFillIcon from "@/assets/pledges/location-fill.svg"

/* ─── Types ─── */

interface ElectionTypeItem {
  to: string
  title: string
  description: string
}

interface QuickStartItem {
  title: string
  subtitle: string
  region: string
  party: string
  partyColorClass: string
  partyBgClass: string
}

/* ─── Data ─── */

const ELECTION_TYPES: ElectionTypeItem[] = [
  { to: "/pledges/presidential", title: "대통령 선거", description: "대통령 선거" },
  { to: "/pledges/parliamentary", title: "국회의원선거", description: "국회의원 선거" },
  { to: "/pledges/local", title: "지방선거", description: "지방 선거" },
]

const QUICK_START_ITEMS: QuickStartItem[] = [
  {
    title: "제 22대",
    subtitle: "국회의원 선거",
    region: "강남구 갑",
    party: "더불어민주당",
    partyColorClass: "text-party-dpk",
    partyBgClass: "bg-party-dpk/8",
  },
  {
    title: "제 21대",
    subtitle: "비례대표 국회의원 선거",
    region: "강남구 전체",
    party: "국민의힘",
    partyColorClass: "text-party-ppp",
    partyBgClass: "bg-party-ppp/8",
  },
  {
    title: "제 8회",
    subtitle: "시·도지사 선거",
    region: "서울특별시",
    party: "더불어민주당",
    partyColorClass: "text-party-dpk",
    partyBgClass: "bg-party-dpk/8",
  },
]

/* ─── ElectionTypeCard ─── */

function ElectionTypeCard({ to, title, description }: ElectionTypeItem) {
  return (
    <Link
      to={to}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)] transition-shadow hover:shadow-[0px_4px_40px_0px_rgba(8,31,116,0.12)]"
    >
      {/* 상단 아이콘 영역 */}
      <div className="flex items-center justify-center bg-[rgba(181,29,82,0.08)] px-6 py-8">
        <div className="size-12 overflow-hidden rounded-[18px]">
          <div
            className="size-full bg-[#b51d52]"
            style={{
              maskImage: `url('${electionIcon}')`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: `url('${electionIcon}')`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
        </div>
      </div>
      {/* 하단 텍스트 영역 */}
      <div className="flex flex-col items-center gap-1 px-6 py-5">
        <span className="text-title-3 font-bold text-label-normal">{title}</span>
        <span className="text-body-3 text-label-alternative">{description}</span>
      </div>
    </Link>
  )
}

/* ─── QuickStartCard ─── */

function QuickStartCard({ title, subtitle, region, party, partyColorClass, partyBgClass }: QuickStartItem) {
  return (
    <div className="flex flex-1 items-center gap-4 rounded-3xl bg-white p-6 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]">
      {/* 좌측 아이콘 */}
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[rgba(181,29,82,0.08)]">
        <div
          className="size-12 bg-[#b51d52]"
          style={{
            maskImage: `url('${electionIcon}')`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskImage: `url('${electionIcon}')`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
          }}
        />
      </div>
      {/* 우측 정보 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <span className="text-title-3 font-bold text-label-normal">{title}</span>
          <span className="text-title-3 font-bold text-label-normal">{subtitle}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* 지역구 배지 */}
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/8 px-1.5 py-1 text-label-4 font-semibold text-primary">
            <img src={locationFillIcon} alt="" className="size-3.5" />
            {region}
          </span>
          {/* 정당 배지 */}
          <span className={`inline-flex items-center rounded-md px-1.5 py-1 text-label-4 font-semibold ${partyColorClass} ${partyBgClass}`}>
            {party}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ─── */

export function PledgesOverviewPage() {
  useBreadcrumb([{ label: "역대공약분석" }])

  return (
    <div className="space-y-10 p-10">
      {/* 타이틀 */}
      <h1 className="text-heading-2 font-bold text-label-normal">역대공약분석</h1>

      {/* 선거 유형 카드 */}
      <div className="grid grid-cols-3 gap-6">
        {ELECTION_TYPES.map((item) => (
          <ElectionTypeCard key={item.to} {...item} />
        ))}
      </div>

      {/* 빠른시작 */}
      <section className="space-y-4">
        <div>
          <h2 className="text-title-2 font-bold text-label-normal">빠른시작</h2>
          <p className="text-body-2 text-label-alternative">최근 검색한 역대공약분석</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {QUICK_START_ITEMS.map((item) => (
            <QuickStartCard key={`${item.title}-${item.subtitle}`} {...item} />
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음 (에셋 import는 Vite가 처리)

- [ ] **Step 3: 개발 서버에서 페이지 확인**

```bash
pnpm run dev
```

브라우저에서 `/pledges`로 이동:
- "역대공약분석" 타이틀 표시
- 선거 유형 카드 3개 (대통령 선거, 국회의원선거, 지방선거)
- 빠른시작 카드 3개 (지역구·정당 배지 포함)
- GNB 브레드크럼에 "역대공약분석" 표시
- 선거 카드 클릭 시 placeholder 페이지로 이동

- [ ] **Step 4: 커밋**

```bash
git add src/app/routes/PledgesOverviewPage.tsx src/app/router.tsx
git commit -m "feat(pledges): 역대공약분석 개요 페이지 구현"
```

---

## Chunk 3: 검증 및 문서 업데이트

### Task 7: 린트 및 빌드 검증

- [ ] **Step 1: 린트 실행**

```bash
pnpm run lint
```

Expected: 에러 없음

- [ ] **Step 2: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 문제가 있으면 수정 후 커밋**

```bash
git add -A
git commit -m "fix(pledges): 린트/타입 에러 수정"
```

---

### Task 8: 문서 업데이트

**Files:**
- Modify: `docs/MODULE_MAP.md`
- Modify: `docs/ARCHITECTURE.md`

- [ ] **Step 1: MODULE_MAP.md 업데이트**

Policy 모듈 상태를 "라우트 제거됨"으로 변경하고, Pledges 모듈을 추가한다.

Policy 섹션:
```markdown
### Policy

- **경로**: `src/features/policy/` (빈 디렉토리)
- **역할**: 정책/공약 관리 (현재 라우트에서 제거됨, 파일 보존)
- **상태**: 라우트 비활성 (/pledges로 대체)
```

Pledges 섹션 추가:
```markdown
### Pledges (역대공약분석)

- **경로**: `src/app/routes/PledgesOverviewPage.tsx`, `PledgesPlaceholderPage.tsx`
- **역할**: 역대공약분석 개요 페이지 (선거 유형 선택 + 빠른시작)
- **핵심 파일**:
  - `PledgesOverviewPage.tsx` — 개요 랜딩 페이지 (선거 유형 카드 3개 + 빠른시작 카드 3개)
  - `PledgesPlaceholderPage.tsx` — 하위 선거 페이지 placeholder
- **에셋**: `src/assets/pledges/` (election-icon.png, location-fill.svg)
- **의존하는 모듈**: `contexts/useNavigation` (useBreadcrumb), react-router-dom
- **상태**: 개요 페이지 완료, 하위 선거 페이지는 placeholder
```

라우팅 테이블 업데이트:
```markdown
| `/pledges` | PledgesOverviewPage | 필요 |
| `/pledges/:type` | PledgesPlaceholderPage | 필요 |
```

`/policy` 관련 라우트 3개 제거.

- [ ] **Step 2: ARCHITECTURE.md 라우팅 테이블 업데이트**

라우팅 섹션에서 `/policy` 관련 행 제거, `/pledges` 행 추가.

- [ ] **Step 3: architecture/pledges.md 생성**

`docs/architecture/pledges.md`에 새 모듈 문서를 작성한다. 현재 상태(개요 페이지 완료, 하위 페이지 placeholder)와 라우트 구조, 에셋 위치를 문서화한다.

- [ ] **Step 4: 커밋**

```bash
git add docs/MODULE_MAP.md docs/ARCHITECTURE.md docs/architecture/pledges.md
git commit -m "docs(pledges): MODULE_MAP, ARCHITECTURE, architecture/pledges.md 업데이트"
```
