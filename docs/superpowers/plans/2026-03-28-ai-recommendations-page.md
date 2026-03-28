# AI 추천 공약 페이지 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/policy/recommendations` 라우트에 AI 추천 공약 전체 목록 페이지를 구현한다.

**Architecture:** mock 데이터 기반의 정적 페이지. `AiRecommendationDetail` 타입을 정의하고, RegionInfoBar · RecommendationCard · RecommendationDetailModal 컴포넌트를 조합하여 페이지를 구성한다. 정렬 필터는 Chip + popover 드롭다운으로 구현한다.

**Tech Stack:** React 19 · TypeScript · Tailwind CSS 4 · Radix UI Dialog · Lucide React · Vitest + Testing Library

**Spec:** `docs/superpowers/specs/2026-03-27-ai-recommendations-page-design.md`

---

## 파일 구조

| 동작 | 파일 경로 | 역할 |
|---|---|---|
| Modify | `src/features/policy/data/mock-policy.ts` | `AiRecommendationDetail` 타입 + mock 데이터 추가 |
| Create | `src/features/policy/components/RegionInfoBar.tsx` | 지역 정보 + 특성 뱃지 바 |
| Create | `src/features/policy/components/RecommendationCard.tsx` | 추천 공약 카드 |
| Create | `src/features/policy/components/RecommendationDetailModal.tsx` | 상세보기 모달 |
| Create | `src/app/routes/AiRecommendationsPage.tsx` | 페이지 컴포넌트 |
| Modify | `src/features/policy/components/index.ts` | barrel export 추가 |
| Modify | `src/app/router.tsx` | `/policy/recommendations` 라우트 추가 |
| Modify | `src/features/policy/components/AiRecommendationSection.tsx` | "추천 공약 전체보기" 네비게이션 연결 |
| Create | `src/features/policy/components/__tests__/RecommendationCard.test.tsx` | 카드 컴포넌트 테스트 |
| Create | `src/features/policy/components/__tests__/RecommendationDetailModal.test.tsx` | 모달 컴포넌트 테스트 |

---

## Task 1: 데이터 레이어 — 타입 정의 + Mock 데이터

**Files:**
- Modify: `src/features/policy/data/mock-policy.ts`

- [ ] **Step 1: `AiRecommendationDetail` 인터페이스 추가**

`mock-policy.ts` 하단(기존 타입 선언 영역 뒤)에 추가:

```typescript
export interface AiRecommendationDetail extends AiRecommendation {
  region: string;
  categoryId: string;
  tags: { categoryId: string; label: string }[];
  aiInsight: string;
  expectedEffect: string;
  description: string;
  updatedAt: string;
  isAdopted: boolean;
}

export interface RegionInfo {
  name: string;
  updatedAt: string;
  characteristics: { categoryId: string; label: string }[];
}
```

- [ ] **Step 2: Mock 데이터 추가**

같은 파일 하단에 추가:

```typescript
export const mockRegionInfo: RegionInfo = {
  name: "서울특별시 강남구 갑",
  updatedAt: "오늘 오전 9:23",
  characteristics: [
    { categoryId: "economy", label: "소상공인 밀집" },
    { categoryId: "transport", label: "교통 혼잡" },
    { categoryId: "aging", label: "고령화 진행" },
    { categoryId: "housing", label: "주거비 상위" },
    { categoryId: "education", label: "사교육 과열" },
    { categoryId: "safety", label: "1인가구 증가" },
  ],
};

export const mockRecommendationDetails: AiRecommendationDetail[] = [
  {
    id: "1",
    title: "소상공인 임대료 및 공공요금 한시적 지원",
    matchRate: 89,
    region: "삼성동",
    categoryId: "economy",
    tags: [
      { categoryId: "economy", label: "경제" },
      { categoryId: "welfare", label: "복지·분배" },
    ],
    aiInsight:
      "강남구 갑 지역 소상공인 폐업률이 전년 대비 12.3% 증가하였으며, 임대료 부담이 가장 큰 요인으로 분석됩니다.",
    expectedEffect:
      "소상공인 연간 운영비 약 15% 절감 효과가 예상되며, 폐업률 감소에 기여할 것으로 보입니다.",
    description:
      "강남구 갑 지역은 상가 임대료가 서울시 평균의 1.8배에 달하며, 소상공인들의 경영 부담이 심각한 상황입니다. 본 공약은 공공요금 한시적 감면과 함께 공공임대상가 공급을 확대하여 소상공인의 안정적인 영업 환경을 조성하고자 합니다. 특히 코로나19 이후 매출 회복이 더딘 업종을 우선 지원 대상으로 선정합니다.",
    updatedAt: "2026-03-27",
    isAdopted: false,
  },
  {
    id: "2",
    title: "스마트 경로당 및 디지털 교육 센터 확충",
    matchRate: 78,
    region: "역삼동",
    categoryId: "aging",
    tags: [
      { categoryId: "aging", label: "저출산·고령화" },
      { categoryId: "education", label: "교육" },
    ],
    aiInsight:
      "65세 이상 인구 비율이 18.7%로 고령화가 빠르게 진행 중이며, 디지털 격차 해소가 시급합니다.",
    expectedEffect:
      "어르신 디지털 역량 강화를 통해 행정 서비스 접근성이 향상되고, 사회 참여율 증가가 기대됩니다.",
    description:
      "기존 경로당을 스마트 경로당으로 전환하여 키오스크 교육, 온라인 민원 처리, 원격 건강 상담 등의 서비스를 제공합니다. 디지털 교육 전담 인력을 배치하고, 주 2회 이상 정기 교육 프로그램을 운영합니다.",
    updatedAt: "2026-03-26",
    isAdopted: true,
  },
  {
    id: "3",
    title: "학교 주변 안심 귀가 인프라 강화",
    matchRate: 72,
    region: "논현동",
    categoryId: "safety",
    tags: [
      { categoryId: "safety", label: "사회안전" },
      { categoryId: "education", label: "교육" },
    ],
    aiInsight:
      "논현동 일대 야간 범죄 신고 건수가 전년 대비 8.5% 증가하였으며, 학교 주변 CCTV 사각지대가 확인되었습니다.",
    expectedEffect:
      "CCTV 사각지대 해소 및 안심 귀가 서비스 확대로 야간 범죄 발생률 20% 감소가 목표입니다.",
    description:
      "학교 반경 500m 이내 CCTV 사각지대에 스마트 가로등과 비상벨을 설치하고, 야간 귀가 동행 서비스를 시범 운영합니다. 지역 경찰서와 협력하여 순찰 경로를 최적화합니다.",
    updatedAt: "2026-03-25",
    isAdopted: false,
  },
  {
    id: "4",
    title: "친환경 공영주차장 전환 및 교통 체증 완화",
    matchRate: 66,
    region: "청담동",
    categoryId: "transport",
    tags: [
      { categoryId: "transport", label: "교통" },
      { categoryId: "housing", label: "주거·부동산" },
    ],
    aiInsight:
      "청담동 주요 도로의 평균 통행 속도가 시내 최하위권이며, 공영주차장 부족이 이중주차의 주요 원인입니다.",
    expectedEffect:
      "공영주차장 500면 추가 확보 시 이중주차 40% 감소, 평균 통행 속도 15% 개선이 예상됩니다.",
    description:
      "노후 공영주차장을 친환경 입체 주차장으로 전환하고, 전기차 충전 인프라를 함께 설치합니다. 실시간 주차 정보 시스템을 도입하여 주차 탐색 시간을 줄입니다.",
    updatedAt: "2026-03-24",
    isAdopted: false,
  },
  {
    id: "5",
    title: "사교육비 절감을 위한 공교육 방과후 프로그램 확대",
    matchRate: 58,
    region: "대치동",
    categoryId: "education",
    tags: [
      { categoryId: "education", label: "교육" },
      { categoryId: "economy", label: "경제" },
    ],
    aiInsight:
      "강남구 가구당 월평균 사교육비가 전국 평균의 2.3배이며, 방과후 프로그램 참여율이 저조합니다.",
    expectedEffect:
      "양질의 방과후 프로그램 제공으로 사교육비 월평균 20만원 절감 효과를 목표로 합니다.",
    description:
      "공교육 기반의 방과후 프로그램을 대폭 확대하고, 우수 강사진을 확보하여 사교육 수요를 공교육으로 흡수합니다. AI 기반 맞춤 학습 시스템을 도입하여 학생별 수준에 맞는 교육을 제공합니다.",
    updatedAt: "2026-03-23",
    isAdopted: false,
  },
];
```

- [ ] **Step 3: 타입 체크 확인**

Run: `cd /Users/han-ujun/Documents/GitHub/Democrasee && npx tsc --noEmit`
Expected: 기존 에러 외 새로운 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add src/features/policy/data/mock-policy.ts
git commit -m "feat(policy): AI 추천 공약 상세 타입 및 mock 데이터 추가"
```

---

## Task 2: RegionInfoBar 컴포넌트

**Files:**
- Create: `src/features/policy/components/RegionInfoBar.tsx`

- [ ] **Step 1: RegionInfoBar 컴포넌트 작성**

```tsx
import { MapPin } from "lucide-react";

import {
  CATEGORIES,
  type CategoryItem,
} from "@/features/region/data/categories";

interface RegionInfoBarProps {
  name: string;
  updatedAt: string;
  characteristics: { categoryId: string; label: string }[];
}

export function RegionInfoBar({
  name,
  updatedAt,
  characteristics,
}: RegionInfoBarProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[24px] bg-cool-neutral-5 p-8">
      {/* 선거구명 + 업데이트 시간 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-primary" />
          <span className="text-title-2 font-bold text-primary">{name}</span>
        </div>
        <span className="text-label-3 font-semibold text-label-alternative">
          {updatedAt} 업데이트
        </span>
      </div>

      {/* 지역 특성 뱃지 */}
      <div className="flex flex-wrap gap-3">
        {characteristics.map((char) => {
          const category = CATEGORIES.find(
            (c: CategoryItem) => c.id === char.categoryId
          );
          return (
            <div
              key={char.categoryId}
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ backgroundColor: `${category?.iconColor ?? "#888"}1A` }}
            >
              {category?.iconAsset && (
                <span
                  className="inline-block size-4 shrink-0"
                  style={{
                    backgroundColor: category.iconColor,
                    maskImage: `url('${category.iconAsset}')`,
                    maskMode: "luminance",
                    maskSize: "contain",
                    maskPosition: "center",
                    maskRepeat: "no-repeat",
                    WebkitMaskImage: `url('${category.iconAsset}')`,
                    WebkitMaskSize: "contain",
                    WebkitMaskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                  }}
                />
              )}
              <span className="text-label-4 font-medium text-label-normal">
                {char.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 새로운 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/policy/components/RegionInfoBar.tsx
git commit -m "feat(policy): RegionInfoBar 컴포넌트 구현"
```

---

## Task 3: RecommendationCard 컴포넌트 + 테스트

**Files:**
- Create: `src/features/policy/components/RecommendationCard.tsx`
- Create: `src/features/policy/components/__tests__/RecommendationCard.test.tsx`

- [ ] **Step 0: 테스트 의존성 확인**

Run: `pnpm list @testing-library/user-event`

`@testing-library/user-event`이 설치되어 있지 않으면:

Run: `pnpm add -D @testing-library/user-event`

- [ ] **Step 1: 테스트 파일 작성**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { RecommendationCard } from "../RecommendationCard";
import type { AiRecommendationDetail } from "@/features/policy/data/mock-policy";

const mockRecommendation: AiRecommendationDetail = {
  id: "1",
  title: "소상공인 임대료 지원",
  matchRate: 89,
  region: "삼성동",
  categoryId: "economy",
  tags: [{ categoryId: "economy", label: "경제" }],
  aiInsight: "AI 분석 결과입니다.",
  expectedEffect: "예상 효과입니다.",
  description: "상세 설명입니다.",
  updatedAt: "2026-03-27",
  isAdopted: false,
};

describe("RecommendationCard", () => {
  it("제목과 매치율을 렌더한다", () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onViewDetail={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.getByText("소상공인 임대료 지원")).toBeInTheDocument();
    expect(screen.getByText("89% Match")).toBeInTheDocument();
  });

  it("AI 인사이트와 예상 효과를 표시한다", () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onViewDetail={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.getByText("AI 분석 결과입니다.")).toBeInTheDocument();
    expect(screen.getByText("예상 효과입니다.")).toBeInTheDocument();
  });

  it("미채택 상태에서 채택하기 버튼을 표시한다", () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onViewDetail={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "채택하기" })).toBeInTheDocument();
  });

  it("채택 완료 상태에서 채택하기 버튼을 숨긴다", () => {
    render(
      <RecommendationCard
        recommendation={{ ...mockRecommendation, isAdopted: true }}
        onViewDetail={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.queryByRole("button", { name: "채택하기" })).not.toBeInTheDocument();
  });

  it("상세보기 클릭 시 onViewDetail을 호출한다", async () => {
    const onViewDetail = vi.fn();
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onViewDetail={onViewDetail}
        onAdopt={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "상세보기" }));
    expect(onViewDetail).toHaveBeenCalledWith("1");
  });

  it("채택하기 클릭 시 onAdopt를 호출한다", async () => {
    const onAdopt = vi.fn();
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onViewDetail={vi.fn()}
        onAdopt={onAdopt}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "채택하기" }));
    expect(onAdopt).toHaveBeenCalledWith("1");
  });
});
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

Run: `npx vitest run src/features/policy/components/__tests__/RecommendationCard.test.tsx`
Expected: FAIL (모듈 없음)

- [ ] **Step 3: RecommendationCard 컴포넌트 구현**

```tsx
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WantedMagicWand, CircleCheckFill } from "@/components/icons";
import {
  CATEGORIES,
  type CategoryItem,
} from "@/features/region/data/categories";
import type { AiRecommendationDetail } from "@/features/policy/data/mock-policy";

interface RecommendationCardProps {
  recommendation: AiRecommendationDetail;
  onViewDetail: (id: string) => void;
  onAdopt: (id: string) => void;
}

export function RecommendationCard({
  recommendation,
  onViewDetail,
  onAdopt,
}: RecommendationCardProps) {
  const category = CATEGORIES.find(
    (c: CategoryItem) => c.id === recommendation.categoryId
  );

  return (
    <div className="flex flex-col gap-5 rounded-[24px] border border-line-neutral bg-white p-8">
      {/* 상단: 카테고리 아이콘 + 제목/뱃지 + 버튼 */}
      <div className="flex items-start gap-5">
        {/* 카테고리 대형 아이콘 */}
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${category?.iconColor ?? "#888"}1A` }}
        >
          {category?.iconAsset && (
            <span
              className="inline-block size-8"
              style={{
                backgroundColor: category.iconColor,
                maskImage: `url('${category.iconAsset}')`,
                maskMode: "luminance",
                maskSize: "contain",
                maskPosition: "center",
                maskRepeat: "no-repeat",
                WebkitMaskImage: `url('${category.iconAsset}')`,
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
              }}
            />
          )}
        </div>

        {/* 제목 + 뱃지 */}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-title-1 font-bold text-label-normal">
              {recommendation.title}
            </h3>
            <Badge size="lg" className="shrink-0 rounded-[6px] border-0 bg-primary/8 text-primary">
              <WantedMagicWand className="mr-1 size-3.5" />
              {recommendation.matchRate}% Match
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge size="lg" className="rounded-[6px] border-0 bg-primary/8 text-primary">
              <MapPin className="mr-1 size-3" />
              {recommendation.region}
            </Badge>
            {recommendation.tags.map((tag) => {
              const tagCategory = CATEGORIES.find(
                (c: CategoryItem) => c.id === tag.categoryId
              );
              return (
                <Badge
                  key={tag.categoryId}
                  size="lg"
                  className="rounded-[6px] border-0"
                  style={{
                    backgroundColor: `${tagCategory?.iconColor ?? "#888"}1A`,
                    color: tagCategory?.iconColor ?? "#888",
                  }}
                >
                  {tag.label}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex shrink-0 items-center gap-3">
          <Button
            variant="outline"
            className="border-line-neutral"
            onClick={() => onViewDetail(recommendation.id)}
          >
            상세보기
          </Button>
          {!recommendation.isAdopted && (
            <Button onClick={() => onAdopt(recommendation.id)}>
              채택하기
            </Button>
          )}
        </div>
      </div>

      {/* 하단: AI 인사이트 + 예상 효과 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3 rounded-2xl bg-primary/8 px-4 py-3">
          <WantedMagicWand className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-body-2 text-primary">{recommendation.aiInsight}</p>
        </div>
        <div className="flex items-start gap-3 rounded-2xl bg-fill-normal px-4 py-3">
          <CircleCheckFill className="mt-0.5 size-4 shrink-0 text-label-alternative" />
          <p className="text-body-2 text-label-normal">
            {recommendation.expectedEffect}
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

Run: `npx vitest run src/features/policy/components/__tests__/RecommendationCard.test.tsx`
Expected: 6 tests PASS

- [ ] **Step 5: 커밋**

```bash
git add src/features/policy/components/RecommendationCard.tsx src/features/policy/components/__tests__/RecommendationCard.test.tsx
git commit -m "feat(policy): RecommendationCard 컴포넌트 및 테스트 구현"
```

---

## Task 4: RecommendationDetailModal 컴포넌트 + 테스트

**Files:**
- Create: `src/features/policy/components/RecommendationDetailModal.tsx`
- Create: `src/features/policy/components/__tests__/RecommendationDetailModal.test.tsx`

- [ ] **Step 1: 테스트 파일 작성**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { RecommendationDetailModal } from "../RecommendationDetailModal";
import type { AiRecommendationDetail } from "@/features/policy/data/mock-policy";

const mockRecommendation: AiRecommendationDetail = {
  id: "1",
  title: "소상공인 임대료 지원",
  matchRate: 89,
  region: "삼성동",
  categoryId: "economy",
  tags: [{ categoryId: "economy", label: "경제" }],
  aiInsight: "AI 분석 결과입니다.",
  expectedEffect: "예상 효과입니다.",
  description: "상세 설명 텍스트입니다.",
  updatedAt: "2026-03-27",
  isAdopted: false,
};

describe("RecommendationDetailModal", () => {
  it("open=true일 때 모달 내용을 렌더한다", () => {
    render(
      <RecommendationDetailModal
        recommendation={mockRecommendation}
        open={true}
        onClose={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.getByText("소상공인 임대료 지원")).toBeInTheDocument();
    expect(screen.getByText("상세 설명 텍스트입니다.")).toBeInTheDocument();
  });

  it("미채택 상태에서 채택하기 버튼을 표시한다", () => {
    render(
      <RecommendationDetailModal
        recommendation={mockRecommendation}
        open={true}
        onClose={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "채택하기" })).toBeInTheDocument();
  });

  it("채택 완료 상태에서 채택 완료 비활성 버튼을 표시한다", () => {
    render(
      <RecommendationDetailModal
        recommendation={{ ...mockRecommendation, isAdopted: true }}
        open={true}
        onClose={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    const btn = screen.getByRole("button", { name: "채택 완료" });
    expect(btn).toBeDisabled();
  });

  it("채택하기 클릭 시 onAdopt를 호출한다", async () => {
    const onAdopt = vi.fn();
    render(
      <RecommendationDetailModal
        recommendation={mockRecommendation}
        open={true}
        onClose={vi.fn()}
        onAdopt={onAdopt}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "채택하기" }));
    expect(onAdopt).toHaveBeenCalledWith("1");
  });

  it("recommendation이 null이면 DialogContent를 렌더하지 않는다", () => {
    const { container } = render(
      <RecommendationDetailModal
        recommendation={null}
        open={false}
        onClose={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(container.querySelector("[data-slot='dialog-content']")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

Run: `npx vitest run src/features/policy/components/__tests__/RecommendationDetailModal.test.tsx`
Expected: FAIL

- [ ] **Step 3: RecommendationDetailModal 구현**

```tsx
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { WantedMagicWand, CircleCheckFill } from "@/components/icons";
import {
  CATEGORIES,
  type CategoryItem,
} from "@/features/region/data/categories";
import type { AiRecommendationDetail } from "@/features/policy/data/mock-policy";

interface RecommendationDetailModalProps {
  recommendation: AiRecommendationDetail | null;
  open: boolean;
  onClose: () => void;
  onAdopt: (id: string) => void;
}

export function RecommendationDetailModal({
  recommendation,
  open,
  onClose,
  onAdopt,
}: RecommendationDetailModalProps) {
  const category = recommendation
    ? CATEGORIES.find((c: CategoryItem) => c.id === recommendation.categoryId)
    : null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {recommendation && (
        <DialogContent className="flex max-h-[85vh] flex-col gap-6 overflow-y-auto p-8 sm:max-w-2xl">
          <DialogHeader className="flex-row items-start gap-5">
            {/* 카테고리 아이콘 */}
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${category?.iconColor ?? "#888"}1A` }}
            >
              {category?.iconAsset && (
                <span
                  className="inline-block size-8"
                  style={{
                    backgroundColor: category.iconColor,
                    maskImage: `url('${category.iconAsset}')`,
                    maskMode: "luminance",
                    maskSize: "contain",
                    maskPosition: "center",
                    maskRepeat: "no-repeat",
                    WebkitMaskImage: `url('${category.iconAsset}')`,
                    WebkitMaskSize: "contain",
                    WebkitMaskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                  }}
                />
              )}
            </div>

            {/* 제목 + 뱃지 */}
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-title-1 font-bold text-label-normal">
                  {recommendation.title}
                </DialogTitle>
                <Badge size="lg" className="shrink-0 rounded-[6px] border-0 bg-primary/8 text-primary">
                  <WantedMagicWand className="mr-1 size-3.5" />
                  {recommendation.matchRate}% Match
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="lg" className="rounded-[6px] border-0 bg-primary/8 text-primary">
                  <MapPin className="mr-1 size-3" />
                  {recommendation.region}
                </Badge>
                {recommendation.tags.map((tag) => {
                  const tagCat = CATEGORIES.find(
                    (c: CategoryItem) => c.id === tag.categoryId
                  );
                  return (
                    <Badge
                      key={tag.categoryId}
                      size="lg"
                      className="rounded-[6px] border-0"
                      style={{
                        backgroundColor: `${tagCat?.iconColor ?? "#888"}1A`,
                        color: tagCat?.iconColor ?? "#888",
                      }}
                    >
                      {tag.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </DialogHeader>

          <DialogDescription className="sr-only">
            추천 공약 상세 정보
          </DialogDescription>

          {/* 상세 설명 */}
          <p className="text-body-1 leading-relaxed text-label-normal">
            {recommendation.description}
          </p>

          {/* AI 인사이트 + 예상 효과 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 rounded-2xl bg-primary/8 px-4 py-3">
              <WantedMagicWand className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-body-2 text-primary">
                {recommendation.aiInsight}
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-fill-normal px-4 py-3">
              <CircleCheckFill className="mt-0.5 size-4 shrink-0 text-label-alternative" />
              <p className="text-body-2 text-label-normal">
                {recommendation.expectedEffect}
              </p>
            </div>
          </div>

          {/* 푸터 */}
          <DialogFooter>
            {recommendation.isAdopted ? (
              <Button disabled>채택 완료</Button>
            ) : (
              <Button onClick={() => onAdopt(recommendation.id)}>
                채택하기
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

Run: `npx vitest run src/features/policy/components/__tests__/RecommendationDetailModal.test.tsx`
Expected: 5 tests PASS

> **참고**: Radix Dialog가 jsdom에서 portal 렌더에 문제가 있을 수 있음. 실패 시 테스트 코드에서 `recommendation=null` 케이스의 assertion 방법을 조정할 것.

- [ ] **Step 5: 커밋**

```bash
git add src/features/policy/components/RecommendationDetailModal.tsx src/features/policy/components/__tests__/RecommendationDetailModal.test.tsx
git commit -m "feat(policy): RecommendationDetailModal 컴포넌트 및 테스트 구현"
```

---

## Task 5: AiRecommendationsPage 페이지 조합

**Files:**
- Create: `src/app/routes/AiRecommendationsPage.tsx`

- [ ] **Step 1: 페이지 컴포넌트 구현**

정렬 드롭다운(Chip + popover), 상태 관리, 컴포넌트 조합을 모두 포함하는 페이지:

```tsx
import { useState, useRef, useEffect } from "react";

import { useBreadcrumb } from "@/contexts/useNavigation";
import { Chip } from "@/components/ui/chip";
import { RegionInfoBar } from "@/features/policy/components/RegionInfoBar";
import { RecommendationCard } from "@/features/policy/components/RecommendationCard";
import { RecommendationDetailModal } from "@/features/policy/components/RecommendationDetailModal";
import {
  mockRegionInfo,
  mockRecommendationDetails,
  type AiRecommendationDetail,
} from "@/features/policy/data/mock-policy";

type SortOption = "matchRate" | "updatedAt";

const SORT_LABELS: Record<SortOption, string> = {
  matchRate: "매칭률순",
  updatedAt: "최근수정된순",
};

export function AiRecommendationsPage() {
  useBreadcrumb([{ label: "정책개발" }, { label: "AI 추천 공약" }]);

  // 상태
  const [sortBy, setSortBy] = useState<SortOption>("matchRate");
  const [sortOpen, setSortOpen] = useState(false);
  const [adoptedIds, setAdoptedIds] = useState<Set<string>>(
    () => new Set(
      mockRecommendationDetails
        .filter((r) => r.isAdopted)
        .map((r) => r.id)
    )
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 정렬 드롭다운 외부 클릭 + Escape 닫기
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sortOpen) return;
    function handlePointerDown(e: PointerEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSortOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sortOpen]);

  // 정렬된 데이터
  const sorted = [...mockRecommendationDetails].sort((a, b) => {
    if (sortBy === "matchRate") return b.matchRate - a.matchRate;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  // 채택 상태 반영
  const recommendations: AiRecommendationDetail[] = sorted.map((r) => ({
    ...r,
    isAdopted: adoptedIds.has(r.id),
  }));

  // 모달용 데이터
  const selectedRecommendation =
    selectedId
      ? recommendations.find((r) => r.id === selectedId) ?? null
      : null;

  function handleAdopt(id: string) {
    setAdoptedIds((prev) => new Set(prev).add(id));
  }

  return (
    <div className="flex flex-col gap-8 px-20 py-8">
      {/* 페이지 헤더 */}
      <div className="py-4">
        <h1 className="text-heading-1 font-bold text-label-normal">
          AI 추천 공약
        </h1>
        <p className="mt-2 text-body-1 font-medium text-label-alternative">
          지역 분석 데이터와 역대 공약을 기반으로 AI가 추천한 공약 목록입니다.
        </p>
      </div>

      {/* 지역 정보 바 */}
      <RegionInfoBar
        name={mockRegionInfo.name}
        updatedAt={mockRegionInfo.updatedAt}
        characteristics={mockRegionInfo.characteristics}
      />

      {/* 필터 칩 */}
      <div className="flex gap-3">
        <div ref={sortRef} className="relative">
          <Chip
            label={SORT_LABELS[sortBy]}
            state={sortOpen ? "active" : "default"}
            isOpen={sortOpen}
            onClick={() => setSortOpen((prev) => !prev)}
          />
          {sortOpen && (
            <div
              role="listbox"
              aria-label="정렬 옵션"
              className="absolute top-full left-0 z-10 mt-1 rounded-[10px] border border-line-neutral bg-white py-1 shadow-lg"
            >
              {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="option"
                    aria-selected={sortBy === key}
                    className={`w-full px-4 py-2.5 text-left text-label-3 font-medium transition-colors hover:bg-fill-normal ${
                      sortBy === key
                        ? "text-primary font-semibold"
                        : "text-label-normal"
                    }`}
                    onClick={() => {
                      setSortBy(key);
                      setSortOpen(false);
                    }}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
        <Chip label="카테고리" state="disabled" />
        <Chip label="지역" state="disabled" />
      </div>

      {/* 추천 공약 카드 목록 */}
      {recommendations.length === 0 ? (
        <p className="py-20 text-center text-body-1 text-label-alternative">
          추천 공약이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onViewDetail={(id) => setSelectedId(id)}
              onAdopt={handleAdopt}
            />
          ))}
        </div>
      )}

      {/* 상세보기 모달 */}
      <RecommendationDetailModal
        recommendation={selectedRecommendation}
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        onAdopt={handleAdopt}
      />
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 새로운 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/routes/AiRecommendationsPage.tsx
git commit -m "feat(policy): AiRecommendationsPage 페이지 컴포넌트 구현"
```

---

## Task 6: 라우팅 + 네비게이션 연결 + Barrel Export

**Files:**
- Modify: `src/app/router.tsx:1,36` — import 추가 + route 추가
- Modify: `src/features/policy/components/AiRecommendationSection.tsx:1,59-68` — useNavigate 추가
- Modify: `src/features/policy/components/index.ts` — export 추가

- [ ] **Step 1: router.tsx에 라우트 추가**

import 추가 (line 15 뒤):
```typescript
import { AiRecommendationsPage } from "@/app/routes/AiRecommendationsPage";
```

children 배열에 route 추가 (`{ path: "/policy", ... }` 다음 줄):
```typescript
{ path: "/policy/recommendations", element: <AiRecommendationsPage /> },
```

- [ ] **Step 2: AiRecommendationSection에 네비게이션 연결**

import 추가 (파일 상단):
```typescript
import { useNavigate } from "react-router-dom";
```

컴포넌트 내부에 추가:
```typescript
const navigate = useNavigate();
```

기존 "추천 공약 전체보기" `<button>` 에 onClick 추가:
```tsx
<button
  type="button"
  className="group relative inline-flex items-center gap-1 self-start rounded-3xl py-1"
  onClick={() => navigate("/policy/recommendations")}
>
```

- [ ] **Step 3: barrel export 업데이트**

`src/features/policy/components/index.ts`에 추가:
```typescript
export { RegionInfoBar } from "./RegionInfoBar";
export { RecommendationCard } from "./RecommendationCard";
export { RecommendationDetailModal } from "./RecommendationDetailModal";
```

- [ ] **Step 4: 타입 체크 + dev 서버 확인**

Run: `npx tsc --noEmit`
Expected: 새로운 에러 없음

Run: `pnpm run dev`
Manual check: `/policy` → "추천 공약 전체보기" 클릭 → `/policy/recommendations` 이동 확인

- [ ] **Step 5: 전체 테스트 실행**

Run: `npx vitest run`
Expected: 전체 테스트 PASS

- [ ] **Step 6: 커밋**

```bash
git add src/app/router.tsx src/features/policy/components/AiRecommendationSection.tsx src/features/policy/components/index.ts
git commit -m "feat(policy): AI 추천 공약 라우팅 및 네비게이션 연결"
```

---

## Task 7: 문서 업데이트

**Files:**
- Modify: `docs/ARCHITECTURE.md` — 라우팅 테이블에 `/policy/recommendations` 추가
- Modify: `docs/MODULE_MAP.md` — 새 파일/컴포넌트 반영

- [ ] **Step 1: ARCHITECTURE.md 라우팅 테이블 업데이트**

라우팅 테이블에 다음 행 추가:
```
| /policy/recommendations | AiRecommendationsPage | AI 추천 공약 전체 목록 |
```

- [ ] **Step 2: MODULE_MAP.md 업데이트**

policy 모듈 섹션에 새 파일 추가:
```
- `components/RegionInfoBar.tsx` — 지역 정보 + 특성 뱃지 바
- `components/RecommendationCard.tsx` — AI 추천 공약 카드
- `components/RecommendationDetailModal.tsx` — 추천 공약 상세보기 모달
```

routes 섹션에 추가:
```
- `routes/AiRecommendationsPage.tsx` — AI 추천 공약 전체 목록 페이지
```

- [ ] **Step 3: 커밋**

```bash
git add docs/ARCHITECTURE.md docs/MODULE_MAP.md
git commit -m "docs: AI 추천 공약 페이지 문서 업데이트"
```
