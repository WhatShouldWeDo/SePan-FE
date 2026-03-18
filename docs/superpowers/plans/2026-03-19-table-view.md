# 지역분석 표 보기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 지역분석 페이지 차트 섹션에서 "표 보기" 탭 선택 시 차트 데이터를 테이블로 표시

**Architecture:** CHIP_FILTERS를 VIEW_TABS로 교체하고, `activeViewTab` 상태에 따라 BarChart/DataTable/placeholder를 조건부 렌더링. DataTable은 ChartConfig를 그대로 받아 컬럼을 자동 생성하며, 조건부 페이지네이션 포함.

**Tech Stack:** React, TypeScript, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-19-table-view-design.md`

---

## 파일 구조

| 액션 | 파일 | 역할 |
|------|------|------|
| Create | `src/components/tables/DataTable.tsx` | 테이블 + 조건부 페이지네이션 컴포넌트 |
| Create | `src/components/tables/index.ts` | barrel export |
| Modify | `src/app/routes/RegionResultPage.tsx` | CHIP_FILTERS→VIEW_TABS 교체, 조건부 렌더링 |

---

### Task 1: DataTable 컴포넌트 생성

**Files:**
- Create: `src/components/tables/DataTable.tsx`
- Create: `src/components/tables/index.ts`
- Reference: `src/types/chart.ts` (ChartConfig, ChartData 타입)

- [ ] **Step 1: `src/components/tables/DataTable.tsx` 기본 구조 작성**

Props 인터페이스와 테이블 렌더링 (페이지네이션 제외):

```tsx
import { useState } from "react";
import type { ChartData, ChartConfig } from "@/types/chart";

export interface DataTableProps {
  data: ChartData;
  config: ChartConfig;
  defaultPageSize?: number;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function DataTable({
  data,
  config,
  defaultPageSize = 10,
  valueFormatter = (v) => v.toLocaleString(),
  className,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);

  const xLabel = config.xLabel ?? config.xKey;
  const showPagination = data.length > rowsPerPage;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const pageData = showPagination
    ? data.slice(startIdx, startIdx + rowsPerPage)
    : data;

  if (data.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-[16px] font-medium leading-[1.5] text-label-alternative">
          데이터가 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 테이블 */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-line-neutral">
            <th className="px-4 py-3 text-left text-[14px] font-semibold leading-[1.3] text-label-normal">
              {xLabel}
            </th>
            {config.series.map((s) => (
              <th
                key={s.key}
                className="px-4 py-3 text-left text-[14px] font-semibold leading-[1.3] text-label-normal"
              >
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((row) => (
            <tr
              key={String(row[config.xKey])}
              className="border-b border-line-neutral last:border-b-0"
            >
              <td className="px-4 py-3 text-[16px] font-medium leading-[1.5] text-label-normal">
                {row[config.xKey]}
              </td>
              {config.series.map((s) => (
                <td
                  key={s.key}
                  className="px-4 py-3 text-[16px] font-medium leading-[1.5] text-label-normal"
                >
                  {typeof row[s.key] === "number"
                    ? valueFormatter(row[s.key] as number)
                    : row[s.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 — Task 2에서 구현 */}
    </div>
  );
}
```

- [ ] **Step 2: `src/components/tables/index.ts` barrel export 생성**

```typescript
export { DataTable } from "./DataTable";
export type { DataTableProps } from "./DataTable";
```

- [ ] **Step 3: 빌드 확인**

Run: `pnpm run build`
Expected: 빌드 성공 (DataTable은 아직 import되지 않으므로 tree-shaken)

- [ ] **Step 4: 커밋**

```bash
git add src/components/tables/
git commit -m "feat(tables): DataTable 컴포넌트 기본 구조 생성"
```

---

### Task 2: DataTable 페이지네이션 추가

**Files:**
- Modify: `src/components/tables/DataTable.tsx`

- [ ] **Step 1: 페이지네이션 UI를 DataTable 하단에 추가**

테이블 `</table>` 닫는 태그 아래, `</div>` 닫는 태그 위에 삽입:

```tsx
{/* 페이지네이션 */}
{showPagination && (
  <div className="flex items-center justify-between pt-4">
    {/* 좌측: rows-per-page */}
    <div className="flex items-center gap-2">
      <select
        value={rowsPerPage}
        onChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
        className="min-h-[44px] min-w-[44px] rounded-lg border border-line-neutral px-2 py-1 text-[14px] font-semibold leading-[1.3] text-label-normal"
      >
        {[10, 20, 50].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <span className="text-[12px] leading-[1.3] text-label-alternative">
        씩 보기
      </span>
    </div>

    {/* 중앙: 페이지 번호 */}
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[14px] text-label-alternative disabled:opacity-30"
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[14px] font-semibold ${
            page === currentPage
              ? "bg-surface-inverse text-label-inverse"
              : "text-label-alternative"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[14px] text-label-alternative disabled:opacity-30"
      >
        &gt;
      </button>
    </div>

    {/* 우측: 페이지 이동 */}
    <div className="flex items-center gap-2">
      <span className="text-[12px] leading-[1.3] text-label-alternative">
        페이지 이동
      </span>
      <input
        type="number"
        min={1}
        max={totalPages}
        defaultValue=""
        aria-label="페이지 번호 입력"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const val = Number((e.target as HTMLInputElement).value);
            if (val >= 1 && val <= totalPages) {
              setCurrentPage(val);
              (e.target as HTMLInputElement).value = "";
            }
          }
        }}
        className="min-h-[44px] w-[60px] rounded-lg border border-line-neutral px-2 py-1 text-center text-[14px] font-semibold text-label-normal"
      />
    </div>
  </div>
)}
```

- [ ] **Step 2: 빌드 확인**

Run: `pnpm run build`
Expected: 빌드 성공

- [ ] **Step 3: 커밋**

```bash
git add src/components/tables/DataTable.tsx
git commit -m "feat(tables): DataTable 조건부 페이지네이션 추가"
```

---

### Task 3: RegionResultPage에 VIEW_TABS 교체 및 DataTable 연동

**Files:**
- Modify: `src/app/routes/RegionResultPage.tsx:66-72` (CHIP_FILTERS 제거)
- Modify: `src/app/routes/RegionResultPage.tsx:74` (CompareViewTab → ViewTab 리네이밍)
- Modify: `src/app/routes/RegionResultPage.tsx:249` (activeChip 상태 제거)
- Modify: `src/app/routes/RegionResultPage.tsx:713-738` (비교 모드 아닌 차트 섹션)

- [ ] **Step 1: import 추가**

`src/app/routes/RegionResultPage.tsx` 상단 import에 추가:

```typescript
import { DataTable } from "@/components/tables";
```

- [ ] **Step 2: CHIP_FILTERS 상수 및 activeChip 상태 제거**

삭제할 코드:

```typescript
// 삭제: lines 66-72
type ChipFilter = "yearly" | "quarterly" | "monthly";

const CHIP_FILTERS: { id: ChipFilter; label: string }[] = [
	{ id: "yearly", label: "연도별" },
	{ id: "quarterly", label: "분기별" },
	{ id: "monthly", label: "월별" },
];

// 삭제: line 249
const [activeChip, setActiveChip] = useState<ChipFilter>("monthly");
```

리네이밍 (line 74): `CompareViewTab` → `ViewTab` (비교 모드 외에서도 사용하므로)

```typescript
// before
type CompareViewTab = "graph" | "table" | "treemap";
const VIEW_TABS: { id: CompareViewTab; label: string }[] = [
// after
type ViewTab = "graph" | "table" | "treemap";
const VIEW_TABS: { id: ViewTab; label: string }[] = [
```

`activeViewTab` 상태 타입도 함께 변경 (line 258):
```typescript
// before
const [activeViewTab, setActiveViewTab] = useState<CompareViewTab>("graph");
// after
const [activeViewTab, setActiveViewTab] = useState<ViewTab>("graph");
```

- [ ] **Step 3: 비교 모드가 아닌 차트 섹션 교체**

현재 코드 (lines 713-738):
```tsx
<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
    <CardSectionHeader
        title={chartTitle}
        description="월별 인구수 변화 추이"
    />
    <div className="flex gap-2">
        {CHIP_FILTERS.map((chip) => (
            // ... chip 렌더링
        ))}
    </div>
    <BarChart data={currentChartData} config={SINGLE_CHART_CONFIG} />
</section>
```

교체할 코드:
```tsx
<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
    <CardSectionHeader
        title={chartTitle}
        description="월별 인구수 변화 추이"
    />
    <div className="flex gap-2">
        {VIEW_TABS.map((tab) => (
            <button
                key={tab.id}
                type="button"
                className={cn(
                    "min-h-[44px] rounded-full px-3.5 py-2 text-[16px] font-semibold leading-[1.3] transition-colors",
                    activeViewTab === tab.id
                        ? "bg-surface-inverse text-label-inverse"
                        : "bg-surface-primary text-label-alternative",
                )}
                onClick={() => setActiveViewTab(tab.id)}
            >
                {tab.label}
            </button>
        ))}
    </div>

    {activeViewTab === "graph" && (
        <BarChart data={currentChartData} config={SINGLE_CHART_CONFIG} />
    )}

    {activeViewTab === "table" && (
        <DataTable data={currentChartData} config={SINGLE_CHART_CONFIG} />
    )}

    {activeViewTab === "treemap" && (
        <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-[16px] font-medium leading-[1.5] text-label-alternative">
                준비 중입니다
            </p>
        </div>
    )}
</section>
```

- [ ] **Step 4: 타입 체크 및 빌드 확인**

Run: `npx tsc --noEmit && pnpm run build`
Expected: 타입 에러 없음, 빌드 성공

- [ ] **Step 5: 개발 서버에서 시각적 확인**

Run: `pnpm run dev`
확인 항목:
1. 지역분석 페이지 하단 차트 섹션에 "그래프 보기 / 표 보기 / 트리맵 보기" 탭 표시
2. "그래프 보기" 선택 → 기존 BarChart 표시
3. "표 보기" 선택 → 월별 인구수 테이블 표시 (12행 > defaultPageSize 10이므로 페이지네이션 표시, 2페이지)
4. "트리맵 보기" 선택 → "준비 중입니다" placeholder
5. 탭 활성 스타일 정상 동작

- [ ] **Step 6: 커밋**

```bash
git add src/app/routes/RegionResultPage.tsx
git commit -m "feat(region): 차트 섹션 CHIP_FILTERS를 VIEW_TABS로 교체 및 DataTable 연동"
```

---

### Task 4: 문서 업데이트

**Files:**
- Modify: `docs/MODULE_MAP.md`
- Modify: `docs/architecture/region.md`

- [ ] **Step 1: MODULE_MAP.md에 tables 모듈 추가**

`src/components/` 섹션에 추가:
```markdown
### `src/components/tables/`
| 파일 | 역할 |
|------|------|
| `DataTable.tsx` | 차트 데이터를 테이블로 표시 + 조건부 페이지네이션 |
| `index.ts` | barrel export |
```

- [ ] **Step 2: architecture/region.md에 표 보기 반영**

차트 섹션 설명에 VIEW_TABS 기반 조건부 렌더링 반영.

- [ ] **Step 3: 커밋**

```bash
git add -f docs/MODULE_MAP.md docs/architecture/region.md
git commit -m "docs: MODULE_MAP, architecture/region에 표 보기 반영"
```
