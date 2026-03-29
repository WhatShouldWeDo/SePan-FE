# 지방선거 통계분석 탭 디자인 스펙

> **날짜**: 2026-03-29
> **범위**: `/pledges/local` 페이지의 "통계분석" 탭 구현
> **Figma 프레임**: `C.2.0.역대공약분석-통계분석` (node: 1326:121553)

---

## 1. 개요

기존 `LocalElectionPledgesPage`의 "통계분석" 탭 플레이스홀더를 Figma 디자인에 맞게 구현한다.
선택된 필터(회차, 선거유형, 시·도)에 따른 공약 관련 통계를 3개 섹션 카드로 제공한다.

### 사용자 플로우

1. `/pledges/local` 진입 → 필터 선택 (회차, 선거유형, 시도)
2. "통계분석" 탭 클릭
3. 선택된 필터 기준으로 카테고리 분포, 주요 지표, 정당별 비교 확인

---

## 2. 컴포넌트 구조

```
LocalElectionPledgesPage.tsx (기존, ~220줄)
└── TabsContent value="statistics"
    └── LocalElectionStatistics              ← 신규 (오케스트레이션)
        ├── [Row] 2칸 레이아웃 (gap-16px)
        │   ├── CategoryDistributionCard     ← 신규 (도넛 차트)
        │   └── PledgeInsightCard            ← 신규 (민원 인사이트)
        ├── PledgeMetricsCard                ← 신규 (주요 지표)
        └── PartyPledgeComparisonCard        ← 신규 (정당별 바 차트)
```

### 파일 구조

```
src/features/pledges/
├── components/
│   ├── LocalElectionStatistics.tsx        # 통계 탭 루트 (3섹션 조합)
│   ├── CategoryDistributionCard.tsx       # 카테고리 분포 도넛 차트
│   ├── PledgeInsightCard.tsx              # 민원 인사이트 카드
│   ├── PledgeMetricsCard.tsx              # 주요 지표 + 비교 인사이트
│   ├── PartyPledgeComparisonCard.tsx      # 정당별 공약 비교 바 차트
│   └── index.ts                          # ← barrel export 업데이트 필요
└── data/
    └── mock-local-statistics.ts           # 통계 Mock 데이터 + 타입 정의
```

### LocalElectionStatistics Props

```typescript
interface LocalElectionStatisticsProps {
  term: number | null
  electionType: string | null
  sido: string | null
}
```

`LocalElectionPledgesPage`의 `useState` 타입과 정확히 일치한다.

---

## 3. 섹션별 상세 스펙

### 3.1 섹션 1 좌측: CategoryDistributionCard

**Figma node**: `1326:122594`

기존 `PledgeDonutChart`를 재사용하여 공약 카테고리 분포를 도넛 차트로 표현.

**레이아웃**:
- `CardSection` 래퍼 (width: 약 36%, flex 비율)
- `CardSectionHeader`: title="카테고리 분포", trailingContent=info 아이콘 버튼
- `PledgeDonutChart`: stats 배열 전달

**데이터 인터페이스**:
```typescript
// PledgeDonutChart의 기존 인터페이스 그대로 사용
// 원본: src/features/pledges/data/mock-candidate-detail.ts
interface PledgeKeywordStat {
  keyword: string
  percentage: number
  color: string  // hex 또는 rgba
}
```

**재사용**: `CardSection`, `CardSectionHeader`, `PledgeDonutChart` 그대로 사용. 신규 코드 최소화.

**참고**: `CardSection`은 `src/features/dashboard/components/CardSection.tsx`에 위치하며 크로스 모듈 import가 필요하다. 현재 다른 feature에서도 사용되는 패턴이므로 허용하되, 향후 `src/components/ui/`로 승격을 고려할 수 있다.

---

### 3.2 섹션 1 우측: PledgeInsightCard

**Figma node**: `1337:131381`

민원 관련 인사이트를 배너 알림 + 2x2 카드 그리드로 제공.

**레이아웃**:
- `CardSection` 래퍼 (width: 약 64%, flex 비율)
- `CardSectionHeader`: title, description, trailingContent="바로가기 >" 버튼
- `Banner` variant="notice": children에 메시지, action prop에 "보러가기 >" 링크 버튼
- 2x2 그리드 (grid-cols-2, gap-8px): 각 항목은 아이콘(48px) + 라벨 + 값 + 뱃지

**Banner 사용법**:
`Banner` 컴포넌트의 실제 API:
```tsx
<Banner variant="notice" action={<button onClick={...}>보러가기 &gt;</button>}>
  내 선거구에 새로운 민원 295개가 추가되었어요
</Banner>
```
- 메시지는 `children`으로 전달 (message prop 아님)
- action은 `React.ReactNode`로 전달

**인사이트 아이템 구조** (인라인 구현, 별도 컴포넌트 불필요):
```
[아이콘 48x48, 컬러 bg, rounded-xl] [라벨 (caption) + 값 (bold)] [Badge/Delta 우측]
```

**InsightListItem 미사용 사유**: 기존 `InsightListItem`은 `bg-fill-alt` 배경 + container query(`@[16rem]`) 반응형 패턴을 사용한다. 이 섹션의 2x2 그리드 아이템은 배경 없이 border 구분선 위에 배치되고, 고정 2열 grid이므로 container query 불필요. 타이포그래피도 다르다 (`InsightListItem`: caption-1/title-2 vs 이 섹션: label-4/title-4). 인라인 구현이 적절.

각 아이템의 Mock 데이터 (Figma에서 2,3번이 동일한 플레이스홀더이므로 Mock에서는 구분된 데이터 사용):

| # | 라벨 | 값 | trailing |
|---|------|----|----------|
| 1 | 최다 민원 지역 | 삼성동 | Badge "신규" (default) |
| 2 | 주요 민원 유형 | 교통혼잡 | Delta "전년대비 ▲ 8.4%" |
| 3 | 주요 민원 분류 | 환경·소음 | Delta "전년대비 ▲ 5.2%" |
| 4 | 민원 증가율 | +14.5% | Badge "상승" (className 커스텀) |

> **참고**: Figma 원안에서 2번과 3번 아이템이 동일한 플레이스홀더 데이터를 사용. Mock에서는 의미 있는 서로 다른 데이터로 대체.

**데이터 인터페이스**:
```typescript
interface PledgeInsightData {
  /** Banner children으로 전달 */
  bannerMessage: string
  /** Banner action slot에 ReactNode로 전달 */
  bannerActionLabel: string
  bannerActionUrl?: string
  items: PledgeInsightItem[]
}

interface PledgeInsightItem {
  icon: React.ReactNode   // 아이콘 컴포넌트 (예: <WantedFillMessage />)
  iconBgColor: string     // Tailwind bg 클래스 (예: "bg-party-dpk")
  label: string
  value: string
  trailing:
    | { type: "badge"; text: string; className?: string }
    | { type: "delta"; label: string; value: string; isPositive: boolean }
}
```

> Badge는 `<Badge className={trailing.className}>{trailing.text}</Badge>` 형태로 사용. CVA 기본 variant("default")에 className 오버라이드로 색상 커스터마이징. Figma에서 뱃지 색상이 다양하므로(파란색, 분홍색 등) variant 대신 className이 유연하다.

**재사용**: `CardSection`, `CardSectionHeader`, `Banner` (variant="notice"), `Badge`

---

### 3.3 섹션 2: PledgeMetricsCard

**Figma node**: `1337:132089`

주요 지표 2x2 그리드 + 비교 인사이트 목록.

**레이아웃**:
- `CardSection` 래퍼 (전체 폭)
- `CardSectionHeader`: title, description, trailingContent=Outlined 버튼
- **상단**: 2x2 메트릭 그리드 (2행, 각 행 2칸, gap-32px)
  - 각 메트릭: 라벨(text-label-3 font-semibold, text-label-alternative) + 값(text-title-1 font-bold) + trailing(Badge 또는 Delta)
- **하단**: 인사이트 행 목록 (gap-8px)
  - 각 행: 아이콘(48px, bg-party-dpk, rounded-xl) + 라벨 + 값(bold) + trailing 퍼센트

**메트릭 아이템 (인라인 구현)**:
```
라벨 내용입니다         (text-label-3 font-semibold, text-label-alternative)
735  +10.1%            (text-title-1 font-bold + Badge)
```

**인사이트 행 (인라인 구현)**:

InsightListItem 미사용 사유: 이 행들은 `bg-fill-alt` 배경 + `rounded-2xl` + `p-4`로, InsightListItem의 `bg-fill-alt` + `p-6`과 패딩이 다르다. 또한 trailing이 고정 텍스트(퍼센트)이고 InsightListItem의 `React.ReactNode` trailing과 다른 구조. 인라인 구현이 명확하다.

- 배경: `bg-fill-alt` (rgba(107,114,128,0.05))
- rounded-2xl, p-4
- 아이콘: 48x48, bg-party-dpk, rounded-xl
- 라벨(text-label-4 font-semibold, text-label-alternative) + 값(text-title-4 font-bold) + 우측 퍼센트(text-title-4 font-bold, text-party-dpk)

**데이터 인터페이스**:
```typescript
interface PledgeMetricsData {
  title: string
  description: string
  metrics: MetricItem[]
  insights: MetricInsightItem[]
}

interface MetricItem {
  label: string
  value: string
  trailing:
    | { type: "badge"; text: string; className?: string }
    | { type: "delta"; label: string; value: string; isPositive: boolean }
}

interface MetricInsightItem {
  icon: React.ReactNode
  iconBgColor: string     // Tailwind bg 클래스
  label: string
  value: string
  trailingText: string
  trailingColor: string   // Tailwind text 클래스 (예: "text-party-dpk")
}
```

> `MetricItem.trailing`과 `PledgeInsightItem.trailing`은 동일한 discriminated union 구조를 사용한다. 두 인터페이스가 동일한 `TrailingContent` 타입을 공유할 수 있으나, 현재 규모에서는 인라인 정의로 충분하다.

**재사용**: `CardSection`, `CardSectionHeader`, `Badge`

---

### 3.4 섹션 3: PartyPledgeComparisonCard

**Figma node**: `1337:132485`

정당별 공약 이행 소요 시간을 수평 바 차트로 비교.

**레이아웃**:
- `CardSection` 래퍼 (전체 폭)
- `CardSectionHeader`: title="정당별 공약 비교", description="정당별 공약 비교", trailingContent=Outlined 버튼
- 커스텀 수평 바 차트 (정당 아바타 + 이름 포함)

**기존 BarChart 재사용 평가**:
기존 `BarChart`는 Recharts 기반으로 Y축에 텍스트 라벨만 지원. Figma 디자인은 Y축에 **정당 아바타(원형 이미지) + 정당명**이 필요하므로, Recharts의 `customized` tick 또는 커스텀 Y축 컴포넌트를 사용해야 한다.

**구현 방식**: 기존 `BarChart`를 직접 사용하지 않고, Recharts의 `<BarChart>` + `<Bar>` + 커스텀 Y축 tick을 조합하여 `PartyPledgeComparisonCard` 내에 구현.

- X축: 시간 (0, 1h, 3h, 6h, 9h)
- Y축: 정당 아바타(40px 원형) + 정당명(text-caption-2 font-medium)
- 바 기본색: `bg-[#e3efff]` — 연한 파란색 (Figma: secondary-colors/blue100, CSS 토큰 미정의이므로 arbitrary value 사용)
- 바 하이라이트(hover): `bg-[#2388ff]` — 진한 파란색 (Figma: primary-color/blue). **정당별 고유색은 사용하지 않음** (Figma 기준)
- 툴팁: 다크 배경(--neutral-colors/800, #19213d), "6hr 35m" 형식, 하단 삼각형 beak

**데이터 인터페이스**:
```typescript
interface PartyPledgeData {
  partyName: string
  partyId: Party             // "dpk" | "ppp" | "justice" | "reform" | "other" — mock-candidates.ts의 Party 타입 import
  partyColor: string        // 아바타 배경색 (hex)
  fulfillmentTime: number   // 분 단위
}
```

**정당 로고**: `mock-local-statistics.ts`에서 placeholder 이미지 URL 또는 파티 이니셜 아바타로 구현. 기존 `mock-candidates.ts`의 `PARTY_COLOR_MAP` (타입: `Record<Party, { bg: string; text: string }>`)과 `Party` 타입을 import하여 재사용.

**재사용**: `CardSection`, `CardSectionHeader`. 차트는 Recharts 직접 사용.

---

## 4. 데이터 타입 종합

모든 타입은 `mock-local-statistics.ts`에 정의하고 export한다.

```typescript
// src/features/pledges/data/mock-local-statistics.ts

import type { PledgeKeywordStat } from "./mock-candidate-detail"

export interface LocalElectionStatisticsData {
  /** 카테고리 분포 도넛 차트 */
  categoryDistribution: PledgeKeywordStat[]

  /** 민원 인사이트 */
  pledgeInsight: PledgeInsightData

  /** 주요 지표 */
  pledgeMetrics: PledgeMetricsData

  /** 정당별 공약 비교 */
  partyComparison: PartyPledgeData[]
}

// PledgeInsightData, PledgeInsightItem, PledgeMetricsData,
// MetricItem, MetricInsightItem, PartyPledgeData
// → 섹션 3.2~3.4에 정의된 인터페이스 참조
```

`PledgeKeywordStat`은 기존 `mock-candidate-detail.ts`에서 import하여 재사용.

Mock 데이터는 Figma의 플레이스홀더 값을 기반으로 생성.
메트릭 항목은 배열 기반이므로 기획 변경 시 데이터만 수정하면 UI가 자동 반영된다.

---

## 5. 재사용 컴포넌트 매핑

| Figma 요소 | 기존 컴포넌트 | import 경로 |
|------------|-------------|------------|
| CardSection | `CardSection` | `@/features/dashboard/components/CardSection` |
| CardSectionHeader | `CardSectionHeader` | `@/components/ui/card-section-header` |
| 도넛 차트 | `PledgeDonutChart` | `@/features/pledges/components/PledgeDonutChart` |
| 정보 배너 | `Banner` (variant="notice") | `@/components/ui/banner` |
| 뱃지 | `Badge` (variant="default" + className) | `@/components/ui/badge` |
| 탭 | `Tabs` (variant="line") | `@/components/ui/tabs` |

| Figma 요소 | 신규 구현 | 이유 |
|------------|----------|------|
| 2x2 인사이트 그리드 | `PledgeInsightCard` 내 인라인 | 고정 2열 grid, InsightListItem과 스타일/구조 차이 |
| 메트릭 행 (라벨+값+뱃지) | `PledgeMetricsCard` 내 인라인 | 2x2 grid, 데이터 기반 동적 렌더링 |
| 인사이트 행 (아이콘+텍스트+%) | `PledgeMetricsCard` 내 인라인 | InsightListItem과 배경/패딩/타이포 차이 |
| 정당 바 차트 | `PartyPledgeComparisonCard` 내 | 커스텀 Y축(아바타) 필요, 기존 BarChart 부적합 |

---

## 6. 스타일 토큰

Figma에서 사용된 주요 디자인 토큰과 실제 CSS 변수 매핑:

| Figma 토큰 | CSS 변수 | 값 | 용도 |
|-----------|---------|---|------|
| label/normal | `--label-normal` | #374151 | 기본 텍스트 |
| label/alternative | `--label-alternative` | #9ca3af | 보조 텍스트, 라벨 |
| label/neutral | `--label-neutral` | #6b7280 | 중립 텍스트 (정당명) |
| line/neutral | `--line-neutral` | rgba(107,114,128,0.16) | 카드 테두리 |
| fill/alternative | `--fill-alt` | rgba(107,114,128,0.05) | 섹션 2 인사이트 행 배경 (Tailwind: `bg-fill-alt`) |
| party/dpk/main | `--party-dpk` | #0065f4 | 민주당 색상, 인사이트 퍼센트 텍스트 |
| party/ppp/main | `--party-ppp` | #ff2b3a | 국민의힘 색상, Delta 부정 지표 |
| secondary-colors/blue100 | (CSS 토큰 미정의) | #e3efff | 섹션 3 바 차트 기본색 — `bg-[#e3efff]` 사용 |
| primary-color/blue | (CSS 토큰 미정의) | #2388ff | 섹션 3 바 차트 하이라이트 — `bg-[#2388ff]` 사용 |

---

## 7. 타이포그래피

모든 토큰은 `src/index.css` `@theme`에 정의됨을 확인 완료.

| 용도 | Figma 스타일 | Tailwind 클래스 |
|------|-------------|----------------|
| 카드 제목 | Title 2/Bold (20px/1.4) | `text-title-2 font-bold` |
| 메트릭 값 | Title 1/Bold (22px/1.4) | `text-title-1 font-bold` |
| 메트릭 라벨 | Label 3/SemiBold (16px/1.3) | `text-label-3 font-semibold` |
| 뱃지/Delta | Label 4/SemiBold (14px/1.3) | `text-label-4 font-semibold` |
| 설명/부제목 | Body 3/Medium (14px/1.5) | `text-body-3 font-medium` |
| 정당명 | Caption 2/Medium (12px/1.3) | `text-caption-2 font-medium` |
| 인사이트 값 | Title 4/Bold (16px/1.4) | `text-title-4 font-bold` |
| 인사이트 라벨 | Label 4/SemiBold (14px/1.3) | `text-label-4 font-semibold` |

---

## 8. 통합 방식

`LocalElectionPledgesPage.tsx`의 기존 플레이스홀더를 교체:

```tsx
// Before
<TabsContent value="statistics" className="pt-4">
  <div className="flex items-center justify-center py-20">
    <p className="text-body-2 font-medium text-label-alternative">
      통계분석 기능은 준비 중입니다
    </p>
  </div>
</TabsContent>

// After
<TabsContent value="statistics" className="pt-4">
  <LocalElectionStatistics
    term={selectedTerm}
    electionType={selectedElectionType}
    sido={selectedSido}
  />
</TabsContent>
```

`LocalElectionStatistics`는 필터 props를 받아 해당 조건의 Mock 데이터를 표시.
현재 MVP 단계에서는 Mock 데이터만 사용하며, 향후 API 연동 시 `useLocalElectionStatistics(filters)` 훅으로 전환.

---

## 9. 로딩 및 빈 상태

현재 MVP는 Mock 데이터 기반이므로 실질적인 로딩/에러 상태는 없다.

- **로딩**: Mock 단계에서는 불필요. API 연동 시 `LocalElectionStatistics` 레벨에서 로딩 스켈레톤 추가.
- **빈 상태**: 필터 조합에 해당하는 데이터가 없을 경우 "해당 조건의 통계 데이터가 없습니다" 메시지 표시. 기존 후보자 목록의 empty state 패턴(`flex items-center justify-center py-20`)을 따른다.
- **에러**: API 연동 시 React Query의 `isError` + Banner variant="error"로 처리.

---

## 10. 범위 외 사항

- API 연동: Mock 데이터로 구현, API 확정 후 별도 작업
- 인터랙션: 바 차트 hover 툴팁 외 클릭 액션 없음
- "바로가기"/"버튼" 클릭 동작: 라우팅 미확정, onClick placeholder
- 반응형: 데스크톱 1200px 기준, 모바일 대응은 별도 작업
