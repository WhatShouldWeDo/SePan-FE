# 지방선거 통계분석 탭 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 `/pledges/local` 페이지의 "통계분석" 탭 플레이스홀더를 4개 섹션 카드(카테고리 분포, 민원 인사이트, 주요 지표, 정당별 비교)로 구현한다.

**Architecture:** `LocalElectionStatistics` 오케스트레이터가 4개 카드 컴포넌트를 조합. Mock 데이터 기반, 기존 `CardSection`/`CardSectionHeader`/`PledgeDonutChart`/`Banner`/`Badge` 재사용. 정당별 바 차트만 Recharts 직접 사용.

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS 4, Recharts 3.7, Vitest + Testing Library

**Spec:** `docs/superpowers/specs/2026-03-29-local-election-statistics-design.md`

---

## File Structure

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/features/pledges/data/mock-local-statistics.ts` | 타입 정의 + Mock 데이터 |
| Create | `src/features/pledges/components/CategoryDistributionCard.tsx` | 카테고리 분포 도넛 차트 |
| Create | `src/features/pledges/components/PledgeInsightCard.tsx` | 민원 인사이트 (배너 + 2x2 그리드) |
| Create | `src/features/pledges/components/PledgeMetricsCard.tsx` | 주요 지표 + 비교 인사이트 행 |
| Create | `src/features/pledges/components/PartyPledgeComparisonCard.tsx` | 정당별 수평 바 차트 |
| Create | `src/features/pledges/components/LocalElectionStatistics.tsx` | 통계 탭 오케스트레이터 |
| Modify | `src/features/pledges/components/index.ts` | barrel export 추가 |
| Modify | `src/app/routes/LocalElectionPledgesPage.tsx:177-183` | 플레이스홀더 → 컴포넌트 교체 |

---

### Task 1: 타입 정의 및 Mock 데이터 ✅ COMPLETED

> **이미 구현 및 커밋 완료** (commit `18247e2`). 이후 Task의 에이전트는 이 계획의 draft 코드가 아닌 실제 커밋된 파일 `src/features/pledges/data/mock-local-statistics.ts`을 참조해야 합니다.

**Files:**
- Create: `src/features/pledges/data/mock-local-statistics.ts`

- [ ] **Step 1: 타입 및 Mock 데이터 파일 생성**

```typescript
// src/features/pledges/data/mock-local-statistics.ts

import type { PledgeKeywordStat } from "./mock-candidate-detail"
import type { Party } from "./mock-candidates"

// ── 민원 인사이트 ──

interface PledgeInsightItem {
  icon: React.ReactNode
  iconBgColor: string
  label: string
  value: string
  trailing:
    | { type: "badge"; text: string; className?: string }
    | { type: "delta"; label: string; value: string; isPositive: boolean }
}

interface PledgeInsightData {
  bannerMessage: string
  bannerActionLabel: string
  bannerActionUrl?: string
  items: PledgeInsightItem[]
}

// ── 주요 지표 ──

interface MetricItem {
  label: string
  value: string
  trailing:
    | { type: "badge"; text: string; className?: string }
    | { type: "delta"; label: string; value: string; isPositive: boolean }
}

interface MetricInsightItem {
  icon: React.ReactNode
  iconBgColor: string
  label: string
  value: string
  trailingText: string
  trailingColor: string
}

interface PledgeMetricsData {
  title: string
  description: string
  metrics: MetricItem[]
  insights: MetricInsightItem[]
}

// ── 정당별 비교 ──

interface PartyPledgeData {
  partyName: string
  partyId: Party
  partyColor: string
  fulfillmentTime: number // 분 단위
}

// ── 종합 ──

export interface LocalElectionStatisticsData {
  categoryDistribution: PledgeKeywordStat[]
  pledgeInsight: PledgeInsightData
  pledgeMetrics: PledgeMetricsData
  partyComparison: PartyPledgeData[]
}

export type {
  PledgeInsightData,
  PledgeInsightItem,
  PledgeMetricsData,
  MetricItem,
  MetricInsightItem,
  PartyPledgeData,
}
```

- [ ] **Step 2: Mock 데이터 상수 추가**

같은 파일 하단에 Mock 데이터를 추가한다. `icon` 필드는 `React.ReactNode`이므로 Mock 데이터에서는 `null`로 두고, 컴포넌트에서 아이콘을 직접 매핑한다. 대신 `iconName: string` 필드를 추가하여 매핑 키로 사용.

**타입 수정** — `icon` 필드를 제거하고 `iconName`으로 대체:

```typescript
// PledgeInsightItem과 MetricInsightItem의 icon 필드를 수정:
// icon: React.ReactNode → iconName: string
// 이렇게 하면 Mock 데이터가 순수 데이터로 유지되고,
// 컴포넌트에서 iconName → React.ReactNode 매핑 처리

interface PledgeInsightItem {
  iconName: string      // "message" | "megaphone" | "warning" | "info"
  iconBgColor: string
  label: string
  value: string
  trailing:
    | { type: "badge"; text: string; className?: string }
    | { type: "delta"; label: string; value: string; isPositive: boolean }
}

interface MetricInsightItem {
  iconName: string
  iconBgColor: string
  label: string
  value: string
  trailingText: string
  trailingColor: string
}
```

Mock 데이터:

```typescript
export const MOCK_LOCAL_STATISTICS: LocalElectionStatisticsData = {
  categoryDistribution: [
    { keyword: "복지·분배", percentage: 53.7, color: "#6B5CFF" },
    { keyword: "교통", percentage: 28.1, color: "rgba(107, 92, 255, 0.5)" },
    { keyword: "주거·부동산", percentage: 18.2, color: "rgba(107, 92, 255, 0.2)" },
  ],

  pledgeInsight: {
    bannerMessage: "내 선거구에 새로운 민원 295개가 추가되었어요",
    bannerActionLabel: "보러가기",
    items: [
      {
        iconName: "message",
        iconBgColor: "bg-party-dpk",
        label: "최다 민원 지역",
        value: "삼성동",
        trailing: { type: "badge", text: "신규", className: "bg-status-positive text-white" },
      },
      {
        iconName: "warning",
        iconBgColor: "bg-status-cautionary",
        label: "주요 민원 유형",
        value: "교통혼잡",
        trailing: { type: "delta", label: "전년대비", value: "8.4%", isPositive: false },
      },
      {
        iconName: "warning",
        iconBgColor: "bg-status-cautionary",
        label: "주요 민원 분류",
        value: "환경·소음",
        trailing: { type: "delta", label: "전년대비", value: "5.2%", isPositive: false },
      },
      {
        iconName: "megaphone",
        iconBgColor: "bg-status-negative",
        label: "민원 증가율",
        value: "+14.5%",
        trailing: { type: "badge", text: "상승", className: "bg-status-negative/10 text-status-negative" },
      },
    ],
  },

  pledgeMetrics: {
    title: "지역 공약 현황",
    description: "선택된 지역구의 공약 관련 주요 지표입니다",
    metrics: [
      {
        label: "총 공약 수",
        value: "735",
        trailing: { type: "badge", text: "+10.1%", className: "bg-party-dpk/10 text-party-dpk" },
      },
      {
        label: "평균 이행률",
        value: "21.5%",
        trailing: { type: "delta", label: "전년대비", value: "8.4%", isPositive: false },
      },
      {
        label: "진행 중 공약",
        value: "735",
        trailing: { type: "badge", text: "+10.1%", className: "bg-party-dpk/10 text-party-dpk" },
      },
      {
        label: "미이행 비율",
        value: "21.5%",
        trailing: { type: "delta", label: "전년대비", value: "8.4%", isPositive: false },
      },
    ],
    insights: [
      {
        iconName: "message",
        iconBgColor: "bg-party-dpk",
        label: "라벨 내용이 들어갑니다",
        value: "비교 결과 해석 내용이 들어갑니다",
        trailingText: "29%",
        trailingColor: "text-party-dpk",
      },
      {
        iconName: "message",
        iconBgColor: "bg-party-dpk",
        label: "라벨 내용이 들어갑니다",
        value: "강남구 병이 인구수가 19.2% 더 많음",
        trailingText: "29%",
        trailingColor: "text-party-dpk",
      },
      {
        iconName: "message",
        iconBgColor: "bg-party-dpk",
        label: "라벨 내용이 들어갑니다",
        value: "강남구 갑이 20대 비율이 더 많음",
        trailingText: "29%",
        trailingColor: "text-party-dpk",
      },
    ],
  },

  partyComparison: [
    { partyName: "더불어민주당", partyId: "dpk", partyColor: "#023b95", fulfillmentTime: 175 },
    { partyName: "국민의힘", partyId: "ppp", partyColor: "#e61e2b", fulfillmentTime: 395 },
    { partyName: "조국혁신당", partyId: "justice", partyColor: "#6B5CFF", fulfillmentTime: 155 },
    { partyName: "개혁신당", partyId: "reform", partyColor: "#f47925", fulfillmentTime: 250 },
    { partyName: "진보당", partyId: "other", partyColor: "#d90720", fulfillmentTime: 290 },
    { partyName: "그 외", partyId: "other", partyColor: "#9ca3af", fulfillmentTime: 330 },
  ],
}
```

- [ ] **Step 3: 타입 체크 확인**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: 새 파일에 에러 없음 (기존 에러만 표시)

- [ ] **Step 4: 커밋**

```bash
git add src/features/pledges/data/mock-local-statistics.ts
git commit -m "feat(pledges): 지방선거 통계분석 타입 정의 및 Mock 데이터 추가"
```

---

### Task 2: CategoryDistributionCard

**Files:**
- Create: `src/features/pledges/components/CategoryDistributionCard.tsx`

- [ ] **Step 1: 컴포넌트 작성**

```tsx
// src/features/pledges/components/CategoryDistributionCard.tsx

import { CardSection } from "@/features/dashboard/components/CardSection"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import { CircleInfoFill } from "@/components/icons"
import { PledgeDonutChart } from "./PledgeDonutChart"
import type { PledgeKeywordStat } from "../data/mock-candidate-detail"

interface CategoryDistributionCardProps {
  stats: PledgeKeywordStat[]
}

export function CategoryDistributionCard({ stats }: CategoryDistributionCardProps) {
  return (
    <CardSection>
      <CardSectionHeader
        title="카테고리 분포"
        trailingContent={
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full text-label-alternative hover:bg-fill-alt"
            aria-label="카테고리 분포 정보"
          >
            <CircleInfoFill className="size-5" />
          </button>
        }
      />
      <PledgeDonutChart stats={stats} />
    </CardSection>
  )
}
```

- [ ] **Step 2: 렌더링 확인**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "CategoryDistributionCard"`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/pledges/components/CategoryDistributionCard.tsx
git commit -m "feat(pledges): CategoryDistributionCard 컴포넌트 구현"
```

---

### Task 3: PledgeInsightCard

**Files:**
- Create: `src/features/pledges/components/PledgeInsightCard.tsx`

- [ ] **Step 1: 아이콘 매핑 헬퍼 + 컴포넌트 작성**

```tsx
// src/features/pledges/components/PledgeInsightCard.tsx

import { CardSection } from "@/features/dashboard/components/CardSection"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import { Banner } from "@/components/ui/banner"
import { Badge } from "@/components/ui/badge"
import {
  WantedCaretUp,
  WantedFillMessage,
  WantedFillMegaphone,
  WantedFillTriangleExclamation,
  CircleInfoFill,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import type { PledgeInsightData, PledgeInsightItem } from "../data/mock-local-statistics"

const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  message: WantedFillMessage,
  warning: WantedFillTriangleExclamation,
  megaphone: WantedFillMegaphone,
  info: CircleInfoFill,
}

interface PledgeInsightCardProps {
  data: PledgeInsightData
}

export function PledgeInsightCard({ data }: PledgeInsightCardProps) {
  return (
    <CardSection>
      <CardSectionHeader
        title="민원 현황"
        description="선거구 민원 인사이트"
        trailingContent={
          <button
            type="button"
            className="flex items-center gap-1 text-label-3 font-semibold text-label-normal"
            onClick={() => {}}
          >
            바로가기
            <span aria-hidden="true">&gt;</span>
          </button>
        }
      />

      <div className="flex flex-col gap-4">
        {/* 배너 */}
        <Banner
          variant="notice"
          action={
            <button
              type="button"
              className="whitespace-nowrap text-label-4 font-semibold text-primary"
              onClick={() => {}}
            >
              {data.bannerActionLabel} &gt;
            </button>
          }
        >
          {data.bannerMessage}
        </Banner>

        {/* 2x2 인사이트 그리드 */}
        <div className="grid grid-cols-2 gap-2">
          {data.items.map((item, index) => (
            <InsightGridItem key={index} item={item} />
          ))}
        </div>
      </div>
    </CardSection>
  )
}

function InsightGridItem({ item }: { item: PledgeInsightItem }) {
  const IconComponent = ICON_MAP[item.iconName] ?? WantedFillMessage

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line-neutral p-4">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          item.iconBgColor,
        )}
      >
        <IconComponent className="size-6 text-white" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-label-4 font-semibold text-label-alternative">
          {item.label}
        </span>
        <span className="truncate text-title-4 font-bold text-label-normal">
          {item.value}
        </span>
      </div>
      <div className="shrink-0">
        {item.trailing.type === "badge" ? (
          <Badge className={item.trailing.className}>{item.trailing.text}</Badge>
        ) : (
          <span className="inline-flex items-center gap-0.5 text-label-4 font-semibold text-status-negative">
            {item.trailing.label}
            <WantedCaretUp
              className={cn("size-4", !item.trailing.isPositive && "rotate-180")}
              aria-hidden="true"
            />
            {item.trailing.value}
          </span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 타입 체크 확인**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "PledgeInsightCard"`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/pledges/components/PledgeInsightCard.tsx
git commit -m "feat(pledges): PledgeInsightCard 컴포넌트 구현"
```

---

### Task 4: PledgeMetricsCard

**Files:**
- Create: `src/features/pledges/components/PledgeMetricsCard.tsx`

- [ ] **Step 1: 컴포넌트 작성**

```tsx
// src/features/pledges/components/PledgeMetricsCard.tsx

import { CardSection } from "@/features/dashboard/components/CardSection"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import { Badge } from "@/components/ui/badge"
import { WantedCaretUp, WantedFillMessage } from "@/components/icons"
import { cn } from "@/lib/utils"
import type {
  PledgeMetricsData,
  MetricItem,
  MetricInsightItem,
} from "../data/mock-local-statistics"

const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  message: WantedFillMessage,
}

interface PledgeMetricsCardProps {
  data: PledgeMetricsData
}

export function PledgeMetricsCard({ data }: PledgeMetricsCardProps) {
  return (
    <CardSection>
      <CardSectionHeader
        title={data.title}
        description={data.description}
        trailingContent={
          <button
            type="button"
            className="rounded-xl border border-line-neutral px-5 py-3 text-label-3 font-semibold text-label-normal"
            onClick={() => {}}
          >
            버튼
          </button>
        }
      />

      <div className="flex flex-col gap-6">
        {/* 메트릭 2x2 그리드 */}
        <div className="flex flex-col gap-4 py-4">
          {Array.from(
            { length: Math.ceil(data.metrics.length / 2) },
            (_, rowIdx) => (
              <div key={rowIdx} className="flex gap-8">
                {data.metrics.slice(rowIdx * 2, rowIdx * 2 + 2).map((metric, colIdx) => (
                  <MetricCell key={colIdx} metric={metric} />
                ))}
              </div>
            ),
          )}
        </div>

        {/* 인사이트 행 목록 */}
        <div className="flex flex-col gap-2">
          {data.insights.map((insight, index) => (
            <InsightRow key={index} insight={insight} />
          ))}
        </div>
      </div>
    </CardSection>
  )
}

function MetricCell({ metric }: { metric: MetricItem }) {
  return (
    <div className="flex flex-1 flex-col gap-1 px-2">
      <span className="text-label-3 font-semibold text-label-alternative">
        {metric.label}
      </span>
      <div className="flex min-h-[31px] items-center gap-2">
        <span className="text-title-1 font-bold text-label-normal">
          {metric.value}
        </span>
        {metric.trailing.type === "badge" ? (
          <Badge className={cn("rounded-md", metric.trailing.className)}>
            {metric.trailing.text}
          </Badge>
        ) : (
          <span className="inline-flex items-center gap-1 pt-1 text-label-4 font-semibold text-status-negative">
            {metric.trailing.label}
            <WantedCaretUp
              className={cn("size-5", !metric.trailing.isPositive && "rotate-180")}
              aria-hidden="true"
            />
            {metric.trailing.value}
          </span>
        )}
      </div>
    </div>
  )
}

function InsightRow({ insight }: { insight: MetricInsightItem }) {
  const IconComponent = ICON_MAP[insight.iconName] ?? WantedFillMessage

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-fill-alt p-4">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          insight.iconBgColor,
        )}
      >
        <IconComponent className="size-8 text-white" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-label-4 font-semibold text-label-alternative">
          {insight.label}
        </span>
        <span className="truncate text-title-4 font-bold text-label-normal">
          {insight.value}
        </span>
      </div>
      <span className={cn("shrink-0 text-title-4 font-bold", insight.trailingColor)}>
        {insight.trailingText}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: 타입 체크 확인**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "PledgeMetricsCard"`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/pledges/components/PledgeMetricsCard.tsx
git commit -m "feat(pledges): PledgeMetricsCard 컴포넌트 구현"
```

---

### Task 5: PartyPledgeComparisonCard

**Files:**
- Create: `src/features/pledges/components/PartyPledgeComparisonCard.tsx`

- [ ] **Step 1: 컴포넌트 작성**

Recharts `<BarChart>` horizontal 모드를 사용하되, Y축에 커스텀 tick(정당 아바타 + 이름)을 렌더링한다.

```tsx
// src/features/pledges/components/PartyPledgeComparisonCard.tsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { CardSection } from "@/features/dashboard/components/CardSection"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import type { PartyPledgeData } from "../data/mock-local-statistics"

interface PartyPledgeComparisonCardProps {
  data: PartyPledgeData[]
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}hr ${mins}m`
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
}) {
  if (!active || !payload?.[0]) return null
  return (
    <div className="rounded bg-[#19213d] px-2 py-2.5 text-sm font-semibold text-white shadow-md">
      {formatTime(payload[0].value)}
    </div>
  )
}

export function PartyPledgeComparisonCard({ data }: PartyPledgeComparisonCardProps) {
  const chartData = data.map((d) => ({
    name: d.partyName,
    fulfillmentTime: d.fulfillmentTime,
    partyColor: d.partyColor,
  }))

  const maxTime = Math.max(...data.map((d) => d.fulfillmentTime))
  const maxHours = Math.ceil(maxTime / 60)
  const ticks = Array.from({ length: maxHours + 1 }, (_, i) => i * 60)

  return (
    <CardSection>
      <CardSectionHeader
        title="정당별 공약 비교"
        description="정당별 공약 이행 소요 시간 비교"
        trailingContent={
          <button
            type="button"
            className="rounded-xl border border-line-neutral px-5 py-3 text-label-3 font-semibold text-label-normal"
            onClick={() => {}}
          >
            버튼
          </button>
        }
      />

      <div className="flex gap-4">
        {/* 정당 아바타 + 이름 (왼쪽) */}
        <div className="flex w-[80px] shrink-0 flex-col gap-3">
          {data.map((party) => (
            <div
              key={party.partyId + party.partyName}
              className="flex h-[62px] flex-col items-center justify-center gap-1.5"
            >
              <div
                className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-line-neutral text-xs font-bold text-white"
                style={{ backgroundColor: party.partyColor }}
              >
                {party.partyName.slice(0, 2)}
              </div>
              <span className="text-caption-2 font-medium text-label-neutral">
                {party.partyName}
              </span>
            </div>
          ))}
        </div>

        {/* 바 차트 (오른쪽) */}
        <div className="min-w-0 flex-1">
          <ResponsiveContainer width="100%" height={data.length * 74}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
              barSize={28}
            >
              <XAxis
                type="number"
                domain={[0, Math.max(...ticks)]}
                ticks={ticks}
                tickFormatter={(v: number) => (v === 0 ? "0" : `${v / 60}h`)}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 14, fill: "#19213d" }}
              />
              <YAxis type="category" dataKey="name" hide />
              <RechartsTooltip
                content={<CustomTooltip />}
                cursor={false}
              />
              <Bar
                dataKey="fulfillmentTime"
                radius={[50, 50, 50, 50]}
                activeBar={{ fill: "#2388ff" }}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill="#e3efff" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardSection>
  )
}
```

- [ ] **Step 2: 타입 체크 확인**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "PartyPledgeComparison"`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/pledges/components/PartyPledgeComparisonCard.tsx
git commit -m "feat(pledges): PartyPledgeComparisonCard 컴포넌트 구현"
```

---

### Task 6: LocalElectionStatistics 오케스트레이터

**Files:**
- Create: `src/features/pledges/components/LocalElectionStatistics.tsx`

- [ ] **Step 1: 오케스트레이터 컴포넌트 작성**

```tsx
// src/features/pledges/components/LocalElectionStatistics.tsx

import { MOCK_LOCAL_STATISTICS } from "../data/mock-local-statistics"
import { CategoryDistributionCard } from "./CategoryDistributionCard"
import { PledgeInsightCard } from "./PledgeInsightCard"
import { PledgeMetricsCard } from "./PledgeMetricsCard"
import { PartyPledgeComparisonCard } from "./PartyPledgeComparisonCard"

interface LocalElectionStatisticsProps {
  term: number | null
  electionType: string | null
  sido: string | null
}

export function LocalElectionStatistics({
  term: _term,
  electionType: _electionType,
  sido: _sido,
}: LocalElectionStatisticsProps) {
  // MVP: Mock 데이터 사용. 향후 API 연동 시 useLocalElectionStatistics(filters) 훅으로 전환.
  const data = MOCK_LOCAL_STATISTICS

  return (
    <div className="flex flex-col gap-4">
      {/* 섹션 1: 카테고리 분포 + 민원 인사이트 (나란히) */}
      <div className="flex gap-4">
        <div className="w-[36%] shrink-0">
          <CategoryDistributionCard stats={data.categoryDistribution} />
        </div>
        <div className="min-w-0 flex-1">
          <PledgeInsightCard data={data.pledgeInsight} />
        </div>
      </div>

      {/* 섹션 2: 주요 지표 */}
      <PledgeMetricsCard data={data.pledgeMetrics} />

      {/* 섹션 3: 정당별 공약 비교 */}
      <PartyPledgeComparisonCard data={data.partyComparison} />
    </div>
  )
}
```

- [ ] **Step 2: 타입 체크 확인**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "LocalElectionStatistics"`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/pledges/components/LocalElectionStatistics.tsx
git commit -m "feat(pledges): LocalElectionStatistics 오케스트레이터 구현"
```

---

### Task 7: 통합 및 barrel export

**Files:**
- Modify: `src/features/pledges/components/index.ts`
- Modify: `src/app/routes/LocalElectionPledgesPage.tsx:177-183`

- [ ] **Step 1: barrel export 추가**

`src/features/pledges/components/index.ts` 파일 하단에 추가:

```typescript
export { CategoryDistributionCard } from "./CategoryDistributionCard"
export { PledgeInsightCard } from "./PledgeInsightCard"
export { PledgeMetricsCard } from "./PledgeMetricsCard"
export { PartyPledgeComparisonCard } from "./PartyPledgeComparisonCard"
export { LocalElectionStatistics } from "./LocalElectionStatistics"
```

- [ ] **Step 2: LocalElectionPledgesPage.tsx에 import 추가**

`src/app/routes/LocalElectionPledgesPage.tsx`에서 `RegionSidoFilter` import 뒤에 `LocalElectionStatistics`를 추가한다.
기존 import에서 `RegionSidoFilter,` 다음 줄에 `LocalElectionStatistics,`를 삽입:

```tsx
// old_string:
  RegionSidoFilter,
} from "@/features/pledges/components"

// new_string:
  RegionSidoFilter,
  LocalElectionStatistics,
} from "@/features/pledges/components"
```

- [ ] **Step 3: 플레이스홀더 교체**

`src/app/routes/LocalElectionPledgesPage.tsx`에서 "통계분석 기능은 준비 중입니다" 텍스트를 포함하는 플레이스홀더 블록을 검색하여 교체한다 (줄 번호는 import 추가로 인해 이동 가능하므로 텍스트 기반 검색):

```tsx
// Before (Line 177-183):
<TabsContent value="statistics" className="pt-4">
  <div className="flex items-center justify-center py-20">
    <p className="text-body-2 font-medium text-label-alternative">
      통계분석 기능은 준비 중입니다
    </p>
  </div>
</TabsContent>

// After:
<TabsContent value="statistics" className="pt-4">
  <LocalElectionStatistics
    term={selectedTerm}
    electionType={selectedElectionType}
    sido={selectedSido}
  />
</TabsContent>
```

- [ ] **Step 4: 타입 체크 + dev 서버 확인**

Run: `npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: 새 파일 관련 에러 없음

Run: `pnpm run dev` (dev 서버 기동 후 `/pledges/local` 접속 → "통계분석" 탭 클릭)
Expected: 3개 섹션 카드가 모두 렌더링됨

- [ ] **Step 5: 커밋**

```bash
git add src/features/pledges/components/index.ts src/app/routes/LocalElectionPledgesPage.tsx
git commit -m "feat(pledges): 지방선거 통계분석 탭 통합 완료"
```

---

### Task 8: 문서 업데이트

**Files:**
- Modify: `docs/MODULE_MAP.md`

- [ ] **Step 1: MODULE_MAP.md에 신규 파일 반영**

pledges 모듈 섹션에 아래 파일 추가:

```markdown
| `components/LocalElectionStatistics.tsx` | 지방선거 통계분석 탭 오케스트레이터 |
| `components/CategoryDistributionCard.tsx` | 카테고리 분포 도넛 차트 카드 |
| `components/PledgeInsightCard.tsx` | 민원 인사이트 카드 (배너 + 2x2 그리드) |
| `components/PledgeMetricsCard.tsx` | 주요 지표 + 비교 인사이트 카드 |
| `components/PartyPledgeComparisonCard.tsx` | 정당별 공약 비교 바 차트 카드 |
| `data/mock-local-statistics.ts` | 통계분석 Mock 데이터 + 타입 정의 |
```

- [ ] **Step 2: 커밋**

```bash
git add docs/MODULE_MAP.md
git commit -m "docs: MODULE_MAP에 지방선거 통계분석 컴포넌트 추가"
```
