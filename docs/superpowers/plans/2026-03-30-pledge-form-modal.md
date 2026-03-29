# 공약 추가/수정 모달 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 내 공약관리 페이지에서 공약을 추가/수정할 수 있는 모달 폼을 구현한다.

**Architecture:** `PledgeFormModal` 컴포넌트를 `src/features/policy/components/`에 생성하고, `MyPledgesPage`에서 모달 열기/닫기를 관리한다. 데이터 모델(`MyPledge`)을 다중선택(regions/categoryIds) 지원으로 확장하고, 기존 컴포넌트(`MyPledgeCard`, `PledgeRow`, `MyPledgesSection`)를 새 인터페이스에 맞게 수정한다.

**Tech Stack:** React 19, TypeScript (strict), React Hook Form + Zod, Radix UI Dialog, Tailwind CSS 4, lucide-react

**Spec:** `docs/superpowers/specs/2026-03-30-pledge-form-modal-design.md`

---

## 파일 구조

```
신규:
  src/features/policy/schemas/pledgeFormSchema.ts    — Zod 스키마 + PledgeFormData 타입
  src/features/policy/components/PledgeFormModal.tsx  — 모달 컴포넌트

수정:
  src/features/policy/data/mock-policy.ts            — MyPledge/PledgeSummary/PledgeStatus 확장 + mock 데이터 변환
  src/features/policy/components/MyPledgeCard.tsx     — 필드명 변경 + "approved" 상태 추가
  src/features/policy/components/PledgeRow.tsx        — PledgeRowProps 필드명 변경
  src/features/policy/components/MyPledgesSection.tsx — PledgeRow 호출부 + 요약카드 5개
  src/features/policy/components/index.ts            — PledgeFormModal export 추가
  src/app/routes/MyPledgesPage.tsx                   — 모달 상태 + STATUS_FILTERS approved 추가
  src/app/routes/PolicyPage.tsx                      — (타입 변경은 자동 반영, 코드 변경 없음)
```

---

### Task 1: 데이터 모델 변경 — PledgeStatus, MyPledge, PledgeSummary 확장

**Files:**
- Modify: `src/features/policy/data/mock-policy.ts`

- [ ] **Step 1: PledgeStatus에 "approved" 추가**

```typescript
// 변경 전 (line 14):
export type PledgeStatus = "drafting" | "reviewing" | "confirmed";

// 변경 후:
export type PledgeStatus = "drafting" | "reviewing" | "approved" | "confirmed";
```

- [ ] **Step 2: MyPledge 인터페이스 변경**

```typescript
// 변경 전 (lines 16-24):
export interface MyPledge {
	id: string;
	category: string;
	categoryId: string;
	title: string;
	description: string;
	region: string;
	createdAt: string;
	status: PledgeStatus;
}

// 변경 후:
export interface MyPledge {
	id: string;
	categoryIds: string[];
	title: string;
	summary: string;
	content: string;
	regions: string[];
	createdAt: string;
	status: PledgeStatus;
}
```

- [ ] **Step 3: PledgeSummary에 approved 추가 + computePledgeSummary 업데이트**

```typescript
// 변경 전 (lines 26-31):
export interface PledgeSummary {
	total: number;
	drafting: number;
	reviewing: number;
	confirmed: number;
}

// 변경 후:
export interface PledgeSummary {
	total: number;
	drafting: number;
	reviewing: number;
	approved: number;
	confirmed: number;
}

// 변경 전 (lines 33-39):
export function computePledgeSummary(pledges: MyPledge[]): PledgeSummary {
	return {
		total: pledges.length,
		drafting: pledges.filter((p) => p.status === "drafting").length,
		reviewing: pledges.filter((p) => p.status === "reviewing").length,
		confirmed: pledges.filter((p) => p.status === "confirmed").length,
	};
}

// 변경 후:
export function computePledgeSummary(pledges: MyPledge[]): PledgeSummary {
	return {
		total: pledges.length,
		drafting: pledges.filter((p) => p.status === "drafting").length,
		reviewing: pledges.filter((p) => p.status === "reviewing").length,
		approved: pledges.filter((p) => p.status === "approved").length,
		confirmed: pledges.filter((p) => p.status === "confirmed").length,
	};
}
```

- [ ] **Step 4: getCategoryLabel 헬퍼 함수 추가**

파일 상단 import 아래에 추가:

```typescript
import { CATEGORIES } from "@/features/region/data/categories";

export function getCategoryLabel(categoryId: string): string {
	return CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
}
```

- [ ] **Step 5: mockMyPledges 데이터를 새 인터페이스로 변환**

모든 20건의 mock 데이터를 변환한다. `region` → `regions[]`, `category`+`categoryId` → `categoryIds[]`, `description` → `summary`, `content: ""` 추가. 지역은 `AVAILABLE_REGIONS`(신사동, 논현1동, 논현2동, 압구정동, 청담동, 역삼1동, 역삼2동) 중에서만 사용. 기존 "대치동", "삼성동", "역삼동"은 각각 "압구정동", "청담동", "역삼1동"으로 대체. "approved" 상태 데이터 2건 추가 (id 21, 22).

```typescript
export const mockMyPledges: MyPledge[] = [
	{ id: "22", categoryIds: ["welfare", "aging"], title: "어르신 맞춤형 돌봄 서비스 확대", summary: "65세 이상 어르신을 위한 개인 맞춤형 돌봄 서비스 확대", content: "65세 이상 어르신을 위한 개인 맞춤형 돌봄 서비스를 마포구 전 지역으로 확대합니다.", regions: ["논현1동", "역삼1동"], createdAt: "5분 전", status: "approved" },
	{ id: "21", categoryIds: ["economy", "welfare"], title: "소상공인 긴급 경영 안정 자금 지원", summary: "매출 급감 소상공인 대상 긴급 경영 안정 자금 지원", content: "", regions: ["신사동"], createdAt: "8분 전", status: "approved" },
	{ id: "20", categoryIds: ["aging"], title: "어린이집 확충 및 보육 인프라 강화", summary: "국공립 어린이집 신설 및 기존 시설 리모델링 추진", content: "", regions: ["청담동"], createdAt: "10분 전", status: "drafting" },
	{ id: "19", categoryIds: ["education"], title: "AI 디지털 교육 센터 설립", summary: "초중고 디지털 리터러시 교육 강화 및 AI 체험관 운영", content: "", regions: ["논현1동"], createdAt: "30분 전", status: "confirmed" },
	{ id: "18", categoryIds: ["culture"], title: "공공 도서관 확대 및 야간 운영", summary: "주민 접근성 향상을 위한 소규모 도서관 3개소 신설", content: "", regions: ["압구정동"], createdAt: "1시간 전", status: "reviewing" },
	{ id: "17", categoryIds: ["transport"], title: "자전거 도로 확충 및 공유 자전거 확대", summary: "주요 도로 자전거 전용 도로 신설 및 공유 자전거 스테이션 추가", content: "", regions: ["신사동"], createdAt: "2시간 전", status: "drafting" },
	{ id: "16", categoryIds: ["welfare"], title: "다문화 가정 한국어 교육 지원", summary: "다문화 가정 맞춤형 한국어 교육 및 문화 적응 프로그램 운영", content: "", regions: ["역삼1동"], createdAt: "3시간 전", status: "drafting" },
	{ id: "15", categoryIds: ["economy"], title: "청년 창업 지원센터 운영", summary: "창업 초기 사무 공간 및 멘토링 프로그램 제공", content: "", regions: ["청담동"], createdAt: "5시간 전", status: "reviewing" },
	{ id: "14", categoryIds: ["safety"], title: "CCTV 사각지대 해소 프로젝트", summary: "주택가 골목 및 공원 주변 스마트 CCTV 200대 추가 설치", content: "", regions: ["논현2동"], createdAt: "8시간 전", status: "drafting" },
	{ id: "13", categoryIds: ["housing"], title: "노후 아파트 리모델링 지원", summary: "20년 이상 노후 공동주택 리모델링 비용 일부 지원", content: "", regions: ["청담동"], createdAt: "12시간 전", status: "confirmed" },
	{ id: "12", categoryIds: ["education"], title: "방과후 프로그램 다양화", summary: "코딩·예체능 등 방과후 프로그램 확대 및 강사 수당 인상", content: "", regions: ["압구정동"], createdAt: "1일 전", status: "drafting" },
	{ id: "11", categoryIds: ["transport"], title: "불법 주정차 단속 강화", summary: "주요 이면도로 이동식 단속 카메라 설치 및 주민 신고 앱 도입", content: "", regions: ["신사동"], createdAt: "1일 전", status: "reviewing" },
	{ id: "10", categoryIds: ["welfare"], title: "장애인 이동권 보장 확대", summary: "저상 버스 도입 확대 및 장애인 콜택시 대기 시간 단축", content: "", regions: ["역삼1동"], createdAt: "1일 전", status: "drafting" },
	{ id: "9", categoryIds: ["economy"], title: "전통시장 현대화 사업", summary: "전통시장 아케이드 설치 및 온라인 판매 플랫폼 구축 지원", content: "", regions: ["압구정동"], createdAt: "2일 전", status: "reviewing" },
	{ id: "8", categoryIds: ["aging"], title: "스마트 경로당 전환 사업", summary: "기존 경로당 디지털 설비 설치 및 건강 모니터링 시스템 도입", content: "", regions: ["청담동"], createdAt: "2일 전", status: "confirmed" },
	{ id: "7", categoryIds: ["culture"], title: "청소년 문화시설 신설", summary: "청소년 전용 공연장 및 창작 공간 조성", content: "", regions: ["청담동"], createdAt: "3일 전", status: "drafting" },
	{ id: "6", categoryIds: ["safety"], title: "학교 주변 안심 귀가 인프라 강화", summary: "스마트 가로등 및 비상벨 설치, 야간 순찰 강화", content: "", regions: ["논현1동"], createdAt: "3일 전", status: "reviewing" },
	{ id: "5", categoryIds: ["transport"], title: "강남구 대중교통 환승 체계 개선 및 버스 노선 확대", summary: "심야버스 노선 신설 및 버스정류장 스마트셸터 설치 확대", content: "", regions: ["역삼1동", "역삼2동"], createdAt: "4일 전", status: "drafting" },
	{ id: "4", categoryIds: ["education"], title: "공립 유치원 확충 및 보육교사 처우 개선", summary: "국공립 어린이집 비율 50% 달성 및 보육료 단계적 인하", content: "", regions: ["논현2동"], createdAt: "2026.03.05", status: "drafting" },
	{ id: "3", categoryIds: ["welfare"], title: "노인 요양시설 접근성 개선 및 운영비 지원", summary: "치매안심센터 확충 및 재가요양 서비스 품질 향상 추진", content: "", regions: ["신사동"], createdAt: "2026.03.03", status: "confirmed" },
	{ id: "2", categoryIds: ["housing"], title: "강남구 도시숲 조성 및 미세먼지 저감 대책", summary: "학교 주변 생활환경 개선 및 전기차 충전 인프라 확대", content: "", regions: ["논현1동"], createdAt: "2026.03.01", status: "reviewing" },
	{ id: "1", categoryIds: ["economy"], title: "소상공인 임대료 부담 경감 지원 확대", summary: "공공임대상가 공급 확대 및 임대료 상한제 도입 추진", content: "", regions: ["청담동"], createdAt: "2026.02.28", status: "drafting" },
];
```

- [ ] **Step 6: 타입 체크 실행**

Run: `npx tsc --noEmit 2>&1 | head -50`
Expected: `MyPledgeCard.tsx`, `PledgeRow.tsx`, `MyPledgesSection.tsx` 등에서 타입 에러 발생 (이후 Task에서 수정)

- [ ] **Step 7: 커밋**

```bash
git add src/features/policy/data/mock-policy.ts
git commit -m "refactor(policy): MyPledge 인터페이스 다중선택 지원으로 확장

- PledgeStatus에 'approved' 추가
- MyPledge: region→regions[], category+categoryId→categoryIds[], description→summary, content 추가
- PledgeSummary에 approved 카운트 추가
- getCategoryLabel 헬퍼 함수 추가
- mock 데이터 22건으로 확장 (approved 2건 포함)"
```

---

### Task 2: 기존 컴포넌트 필드명 변경 대응 — PledgeRow, MyPledgeCard, MyPledgesSection

**Files:**
- Modify: `src/features/policy/components/PledgeRow.tsx`
- Modify: `src/features/policy/components/MyPledgeCard.tsx`
- Modify: `src/features/policy/components/MyPledgesSection.tsx`

- [ ] **Step 1: PledgeRow.tsx — PledgeRowProps 변경**

`PledgeRowProps`의 필드를 새 MyPledge 인터페이스에 맞게 변경한다. 이 컴포넌트는 `MyPledgesSection`에서 개별 props로 전달받으므로, props 이름을 새 필드명과 일치시킨다.

```typescript
// 변경 전:
interface PledgeRowProps {
	category: string;
	categoryId: string;
	title: string;
	description: string;
	region: string;
	createdAt: string;
	onEdit?: () => void;
}

// 변경 후:
interface PledgeRowProps {
	categoryIds: string[];
	title: string;
	summary: string;
	regions: string[];
	createdAt: string;
	onEdit?: () => void;
}
```

함수 시그니처와 본문도 변경:

```typescript
function PledgeRow({
	categoryIds,
	title,
	summary,
	regions,
	createdAt,
	onEdit,
}: PledgeRowProps) {
	const primaryCategoryId = categoryIds[0];
	const categoryData = CATEGORIES.find((c) => c.id === primaryCategoryId);
	const badgeColor = categoryData?.iconColor ?? "#6B7280";
	// ... badgeStyle 동일 ...
```

본문에서 필드 참조 변경:
- `{category}` → `{categoryData?.label ?? primaryCategoryId}` (분야 배지 텍스트)
- `{description}` → `{summary}` (공약 설명)
- `{region}` → `{regions[0]}` (지역)

- [ ] **Step 2: MyPledgeCard.tsx — 필드명 변경 + "approved" 상태 추가**

`STATUS_LABEL`과 `STATUS_STYLE`에 "approved" 추가:

```typescript
const STATUS_LABEL: Record<PledgeStatus, string> = {
	drafting: "작성중",
	reviewing: "검토중",
	approved: "승인완료",
	confirmed: "확정됨",
};

const STATUS_STYLE: Record<PledgeStatus, { text: string; bg: string }> = {
	drafting: {
		text: "text-status-cautionary",
		bg: "bg-status-cautionary/8",
	},
	reviewing: {
		text: "text-status-positive",
		bg: "bg-status-positive/8",
	},
	approved: {
		text: "text-status-positive",
		bg: "bg-status-positive/8",
	},
	confirmed: {
		text: "text-primary",
		bg: "bg-primary/8",
	},
};
```

함수 본문 필드 참조 변경:
- `pledge.region` → `pledge.regions[0]` (지역 배지)
- `pledge.categoryId` → `pledge.categoryIds[0]` (카테고리 데이터 조회)
- `pledge.category` → `categoryData?.label ?? pledge.categoryIds[0]` (카테고리 배지 텍스트)
- `pledge.description` → `pledge.summary` (설명)

구체적으로:

```typescript
function MyPledgeCard({ pledge, onEdit }: MyPledgeCardProps) {
	const primaryCategoryId = pledge.categoryIds[0];
	const categoryData = CATEGORIES.find((c) => c.id === primaryCategoryId);
	const badgeColor = categoryData?.iconColor ?? "#6B7280";
	// ...

	return (
		// ...
		{/* Leading: 지역 배지 */}
		<span className="...">
			<MapPin className="size-3.5 fill-current" />
			{pledge.regions[0]}
		</span>

		{/* Middle: 카테고리 배지 텍스트 */}
		{categoryData?.label ?? primaryCategoryId}

		{/* 설명 */}
		<p className="...">{pledge.summary}</p>
		// ...
	);
}
```

- [ ] **Step 3: MyPledgesSection.tsx — PledgeRow 호출부 + 요약카드 approved 추가**

PledgeRow 호출부 변경:

```typescript
// 변경 전:
<PledgeRow
	key={pledge.id}
	category={pledge.category}
	categoryId={pledge.categoryId}
	title={pledge.title}
	description={pledge.description}
	region={pledge.region}
	createdAt={pledge.createdAt}
/>

// 변경 후:
<PledgeRow
	key={pledge.id}
	categoryIds={pledge.categoryIds}
	title={pledge.title}
	summary={pledge.summary}
	regions={pledge.regions}
	createdAt={pledge.createdAt}
/>
```

요약카드에 "승인완료" 추가 (imports에 `ShieldCheck` 추가):

```typescript
import { ..., ShieldCheck } from "lucide-react";

// 요약 카드 섹션에 추가 (검토중과 확정됨 사이):
<SummaryCard
	label="승인완료"
	value={`${summary.approved}건`}
	icon={<ShieldCheck className="size-6" />}
	valueClassName="text-status-positive"
/>
```

- [ ] **Step 4: 타입 체크 실행**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: 이전 Task의 타입 에러 해소. 나머지 에러 있으면 확인.

- [ ] **Step 5: 커밋**

```bash
git add src/features/policy/components/PledgeRow.tsx src/features/policy/components/MyPledgeCard.tsx src/features/policy/components/MyPledgesSection.tsx
git commit -m "refactor(policy): 기존 컴포넌트를 새 MyPledge 인터페이스에 맞게 수정

- PledgeRow: PledgeRowProps 필드명 변경 (categoryIds, summary, regions)
- MyPledgeCard: 필드명 변경 + approved 상태 스타일 추가
- MyPledgesSection: PledgeRow 호출부 수정 + 승인완료 요약카드 추가"
```

---

### Task 3: MyPledgesPage — STATUS_FILTERS에 "승인완료" 추가

**Files:**
- Modify: `src/app/routes/MyPledgesPage.tsx`

- [ ] **Step 1: STATUS_FILTERS에 approved 항목 추가**

imports에 `ShieldCheck` 추가:

```typescript
import { Plus, Pencil, Clock, CircleCheck, ShieldCheck } from "lucide-react";
```

STATUS_FILTERS 배열에 "승인완료" 추가 (confirmed 앞에):

```typescript
const STATUS_FILTERS: {
  value: StatusFilter;
  label: string;
  icon?: React.ReactNode;
}[] = [
  { value: "all", label: "전체" },
  { value: "drafting", label: "작성중", icon: <Pencil className="size-4" /> },
  { value: "reviewing", label: "검토중", icon: <Clock className="size-4" /> },
  { value: "approved", label: "승인완료", icon: <ShieldCheck className="size-4" /> },
  {
    value: "confirmed",
    label: "확정됨",
    icon: <CircleCheck className="size-4" />,
  },
];
```

- [ ] **Step 2: 빌드 확인**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/routes/MyPledgesPage.tsx
git commit -m "feat(policy): MyPledgesPage STATUS_FILTERS에 승인완료 추가"
```

---

### Task 4: Zod 스키마 생성

**Files:**
- Create: `src/features/policy/schemas/pledgeFormSchema.ts`

- [ ] **Step 1: schemas 디렉토리 확인**

Run: `ls src/features/policy/schemas/ 2>/dev/null || echo "directory does not exist"`

없으면 파일 생성 시 자동으로 디렉토리가 만들어진다.

- [ ] **Step 2: pledgeFormSchema.ts 작성**

```typescript
import { z } from "zod";

export const pledgeFormSchema = z.object({
	title: z
		.string()
		.min(1, "공약 제목을 입력해주세요")
		.max(60, "60자 이내로 입력해주세요"),
	summary: z
		.string()
		.min(1, "요약내용을 입력해주세요")
		.max(200, "200자 이내로 입력해주세요"),
	regions: z
		.array(z.string())
		.min(1, "지역을 1개 이상 선택해주세요"),
	categoryIds: z
		.array(z.string())
		.min(1, "카테고리를 1개 이상 선택해주세요"),
	content: z
		.string()
		.max(2000, "2000자 이내로 입력해주세요")
		.default(""),
	status: z.enum(["drafting", "reviewing", "approved", "confirmed"]),
});

export type PledgeFormData = z.infer<typeof pledgeFormSchema>;
```

- [ ] **Step 3: 타입 체크 실행**

Run: `npx tsc --noEmit 2>&1 | grep pledgeFormSchema`
Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add src/features/policy/schemas/pledgeFormSchema.ts
git commit -m "feat(policy): 공약 폼 Zod 유효성 스키마 추가"
```

---

### Task 5: PledgeFormModal 컴포넌트 구현

**Files:**
- Create: `src/features/policy/components/PledgeFormModal.tsx`
- Modify: `src/features/policy/components/index.ts`

- [ ] **Step 1: PledgeFormModal.tsx 작성**

```tsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, MapPin, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TextArea } from "@/components/ui/text-area";
import { TextField } from "@/components/ui/text-field";
import { CATEGORIES } from "@/features/region/data/categories";
import type { MyPledge, PledgeStatus } from "@/features/policy/data/mock-policy";
import {
	pledgeFormSchema,
	type PledgeFormData,
} from "@/features/policy/schemas/pledgeFormSchema";

/* ── 상수 ──────────────────────────────────────── */

const AVAILABLE_REGIONS = [
	"신사동",
	"논현1동",
	"논현2동",
	"압구정동",
	"청담동",
	"역삼1동",
	"역삼2동",
];

const STATUS_OPTIONS: { value: PledgeStatus; label: string }[] = [
	{ value: "drafting", label: "작성중" },
	{ value: "reviewing", label: "검토중" },
	{ value: "approved", label: "승인완료" },
	{ value: "confirmed", label: "확정됨" },
];

/** Figma 기준 짧은 라벨 ("유권자 분석" → "유권자") */
const CATEGORY_DISPLAY_LABELS: Record<string, string> = {
	voter: "유권자",
	economy: "경제",
	housing: "주거·부동산",
	safety: "사회안전",
	welfare: "복지·분배",
	transport: "교통",
	culture: "문화여가",
	aging: "저출산·고령화",
	education: "교육",
};

/* ── CategoryIcon ──────────────────────────────── */

function CategoryIcon({
	categoryId,
	size,
	color,
}: {
	categoryId: string;
	size: number;
	color?: string;
}) {
	const cat = CATEGORIES.find((c) => c.id === categoryId);
	if (!cat?.iconAsset) return null;
	return (
		<span
			className="inline-block shrink-0 rounded-full"
			style={{
				width: size,
				height: size,
				backgroundColor: color ?? cat.iconColor,
				maskImage: `url('${cat.iconAsset}')`,
				maskSize: `${size}px ${size}px`,
				maskRepeat: "no-repeat",
				maskPosition: "center",
				maskMode: "luminance",
				WebkitMaskImage: `url('${cat.iconAsset}')`,
				WebkitMaskSize: `${size}px ${size}px`,
				WebkitMaskRepeat: "no-repeat",
				WebkitMaskPosition: "center",
			}}
		/>
	);
}

/* ── StatusDropdown ────────────────────────────── */

function StatusDropdown({
	value,
	onChange,
}: {
	value: PledgeStatus;
	onChange: (status: PledgeStatus) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen) return;
		const handlePointerDown = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node))
				setIsOpen(false);
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsOpen(false);
		};
		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	const currentLabel =
		STATUS_OPTIONS.find((o) => o.value === value)?.label ?? "작성중";

	return (
		<div ref={ref} className="relative">
			<Chip
				label={currentLabel}
				size="large"
				state="default"
				variant="outlined"
				isOpen={isOpen}
				onClick={() => setIsOpen(!isOpen)}
			/>
			{isOpen && (
				<div className="absolute bottom-full left-0 mb-2 w-[320px] rounded-[16px] border border-line-neutral bg-white py-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]">
					<div className="flex flex-col px-5 py-2">
						{STATUS_OPTIONS.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => {
									onChange(option.value);
									setIsOpen(false);
								}}
								className="flex w-full items-center justify-between py-3"
							>
								<span
									className={cn(
										"text-[16px] font-semibold leading-[1.3]",
										option.value === value
											? "text-primary"
											: "text-label-normal",
									)}
								>
									{option.label}
								</span>
								{option.value === value && (
									<Check className="size-5 text-primary" />
								)}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

/* ── PledgeFormModal ───────────────────────────── */

interface PledgeFormModalProps {
	open: boolean;
	onClose: () => void;
	pledge: MyPledge | null;
	onSubmit: (data: PledgeFormData) => void;
	onSaveDraft: (data: PledgeFormData) => void;
}

function PledgeFormModal({
	open,
	onClose,
	pledge,
	onSubmit,
	onSaveDraft,
}: PledgeFormModalProps) {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors, isValid },
	} = useForm<PledgeFormData>({
		resolver: zodResolver(pledgeFormSchema),
		mode: "onChange",
		defaultValues: {
			title: "",
			summary: "",
			regions: [],
			categoryIds: [],
			content: "",
			status: "drafting",
		},
	});

	/* 모달 열릴 때 폼 초기화 */
	useEffect(() => {
		if (open && pledge) {
			reset({
				title: pledge.title,
				summary: pledge.summary,
				regions: pledge.regions,
				categoryIds: pledge.categoryIds,
				content: pledge.content,
				status: pledge.status,
			});
		} else if (open && !pledge) {
			reset({
				title: "",
				summary: "",
				regions: [],
				categoryIds: [],
				content: "",
				status: "drafting",
			});
		}
	}, [open, pledge, reset]);

	const watchedTitle = watch("title");
	const watchedSummary = watch("summary");
	const selectedRegions = watch("regions");
	const selectedCategoryIds = watch("categoryIds");
	const watchedStatus = watch("status");

	/* 지역 토글 */
	const toggleRegion = (region: string) => {
		const current = selectedRegions;
		const next = current.includes(region)
			? current.filter((r) => r !== region)
			: [...current, region];
		setValue("regions", next, { shouldValidate: true });
	};

	/* 카테고리 토글 */
	const toggleCategory = (categoryId: string) => {
		const current = selectedCategoryIds;
		const next = current.includes(categoryId)
			? current.filter((c) => c !== categoryId)
			: [...current, categoryId];
		setValue("categoryIds", next, { shouldValidate: true });
	};

	/* 임시저장 */
	const handleDraft = () => {
		const data = {
			title: watchedTitle,
			summary: watchedSummary,
			regions: selectedRegions,
			categoryIds: selectedCategoryIds,
			content: watch("content"),
			status: watchedStatus,
		};
		onSaveDraft(data as PledgeFormData);
	};

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent
				className="flex max-h-[85vh] flex-col gap-0 rounded-[20px] border-0 p-0 sm:max-w-2xl"
				showCloseButton={false}
				onInteractOutside={(e) => e.preventDefault()}
			>
				{/* ── 헤더 (고정) ── */}
				<div className="flex items-start justify-between px-8 pt-8 pb-2">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<h2 className="text-heading-3 font-bold text-label-strong">
								{watchedTitle || "새 공약 추가하기"}
							</h2>
							{selectedRegions.length > 0 && (
								<span className="inline-flex items-center gap-1 rounded-[8px] bg-primary/8 px-2 py-[5px] text-label-4 font-semibold text-primary">
									<MapPin className="size-4 fill-current" />
									{selectedRegions[0]}
								</span>
							)}
						</div>
						{selectedCategoryIds.length > 0 && (
							<div className="flex flex-wrap gap-1.5">
								{selectedCategoryIds.map((id) => (
									<span
										key={id}
										className="inline-flex items-center gap-1 text-[14px] font-semibold text-label-alternative"
									>
										<CategoryIcon categoryId={id} size={14} />
										{CATEGORY_DISPLAY_LABELS[id] ?? id}
									</span>
								))}
							</div>
						)}
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1"
						aria-label="닫기"
					>
						<X className="size-6 text-label-normal" />
					</button>
				</div>

				{/* ── 스크롤 영역 ── */}
				<div className="flex-1 overflow-y-auto px-8 py-6">
					<form
						id="pledge-form"
						className="flex flex-col gap-8"
						onSubmit={handleSubmit(onSubmit)}
					>
						{/* 1. 공약 제목 */}
						<div className="flex flex-col gap-2">
							<TextField
								label="공약 제목"
								required
								placeholder="텍스트를 입력해주세요."
								maxLength={60}
								status={errors.title ? "error" : "default"}
								helperText={errors.title?.message}
								{...register("title")}
							/>
							<div className="flex justify-end px-1">
								<span className="text-[14px] font-medium tracking-[-0.035px] text-label-alternative">
									{watchedTitle.length}/60
								</span>
							</div>
						</div>

						{/* 2. 요약내용 */}
						<div className="flex flex-col gap-2">
							<TextField
								label="요약내용"
								required
								placeholder="텍스트를 입력해주세요."
								maxLength={200}
								status={errors.summary ? "error" : "default"}
								helperText={errors.summary?.message}
								{...register("summary")}
							/>
							<div className="flex justify-end px-1">
								<span className="text-[14px] font-medium tracking-[-0.035px] text-label-alternative">
									{watchedSummary.length}/200
								</span>
							</div>
						</div>

						{/* 3. 지역선택 */}
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-0.5">
								<span className="text-[16px] font-semibold leading-[1.3] text-label-normal">
									지역선택
								</span>
								<span className="text-[18px] font-semibold leading-[1.3] text-primary">
									*
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{AVAILABLE_REGIONS.map((region) => {
									const isSelected = selectedRegions.includes(region);
									return (
										<button
											key={region}
											type="button"
											onClick={() => toggleRegion(region)}
											className={cn(
												"w-[100px] rounded-[10px] border px-5 py-3 text-[16px] font-semibold leading-[1.3] transition-colors",
												isSelected
													? "border-primary/50 bg-primary text-white"
													: "border-line-neutral bg-white text-label-normal",
											)}
										>
											{region}
										</button>
									);
								})}
							</div>
							{errors.regions && (
								<p className="px-1 text-[12px] font-medium text-status-negative">
									{errors.regions.message}
								</p>
							)}
						</div>

						{/* 4. 카테고리 */}
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-0.5">
								<span className="text-[16px] font-semibold leading-[1.3] text-label-normal">
									카테고리
								</span>
								<span className="text-[18px] font-semibold leading-[1.3] text-primary">
									*
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{CATEGORIES.map((cat) => {
									const isSelected = selectedCategoryIds.includes(cat.id);
									return (
										<button
											key={cat.id}
											type="button"
											onClick={() => toggleCategory(cat.id)}
											className={cn(
												"inline-flex items-center gap-[3px] rounded-full px-3.5 py-2 text-[16px] font-semibold leading-[1.3] transition-colors",
												isSelected
													? "bg-primary text-white"
													: "border border-line-neutral bg-white text-label-normal",
											)}
										>
											<CategoryIcon
												categoryId={cat.id}
												size={16}
												color={isSelected ? "white" : cat.iconColor}
											/>
											{CATEGORY_DISPLAY_LABELS[cat.id] ?? cat.label}
										</button>
									);
								})}
							</div>
							{errors.categoryIds && (
								<p className="px-1 text-[12px] font-medium text-status-negative">
									{errors.categoryIds.message}
								</p>
							)}
						</div>

						{/* 5. 상세내용 */}
						<TextArea
							label="상세내용"
							placeholder="메시지를 입력해주세요."
							maxLength={2000}
							rows={5}
							status={errors.content ? "error" : "default"}
							helperText={errors.content?.message}
							{...register("content")}
						/>
					</form>
				</div>

				{/* ── 하단 액션 바 (고정) ── */}
				<div className="flex items-center justify-between border-t border-line-neutral px-8 py-4">
					<StatusDropdown
						value={watchedStatus}
						onChange={(v) => setValue("status", v)}
					/>
					<div className="flex items-center gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={handleDraft}
							className="h-auto rounded-[12px] border-line-neutral px-7 py-[15px] text-label-2 font-semibold"
						>
							임시저장
						</Button>
						<Button
							type="submit"
							form="pledge-form"
							disabled={!isValid}
							className={cn(
								"h-auto rounded-[12px] bg-primary px-7 py-[15px] text-label-2 font-semibold text-white",
								!isValid && "pointer-events-none opacity-40",
							)}
						>
							등록
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export { PledgeFormModal };
export type { PledgeFormModalProps };
```

- [ ] **Step 2: index.ts에 PledgeFormModal export 추가**

```typescript
// 기존 export 아래에 추가:
export { PledgeFormModal } from "./PledgeFormModal";
```

- [ ] **Step 3: 타입 체크 실행**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add src/features/policy/components/PledgeFormModal.tsx src/features/policy/components/index.ts
git commit -m "feat(policy): PledgeFormModal 공약 추가/수정 모달 구현

- React Hook Form + Zod 유효성 검증 (mode: onChange)
- 지역/카테고리 다중선택 칩 토글
- 상태 드롭다운 (작성중/검토중/승인완료/확정됨)
- 동적 헤더 (제목 실시간 반영 + 지역 Badge + 카테고리 서브칩)
- 글자수 카운터 (60/200/2000)
- 외부 클릭 방지 (onInteractOutside)"
```

---

### Task 6: MyPledgesPage에 모달 연결

**Files:**
- Modify: `src/app/routes/MyPledgesPage.tsx`

- [ ] **Step 1: import 추가**

```typescript
import { PledgeFormModal } from "@/features/policy/components/PledgeFormModal";
import type { PledgeFormData } from "@/features/policy/schemas/pledgeFormSchema";
import type { MyPledge } from "@/features/policy/data/mock-policy";
import { toast } from "@/lib/toast/toast";
```

기존 `mockMyPledges` import는 유지. `type PledgeStatus` import도 유지.

- [ ] **Step 2: 모달 상태 추가**

`MyPledgesPage` 함수 내부, 기존 state 아래에:

```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingPledge, setEditingPledge] = useState<MyPledge | null>(null);
```

- [ ] **Step 3: 핸들러 함수 추가**

```typescript
const handleOpenCreate = () => {
	setEditingPledge(null);
	setIsModalOpen(true);
};

const handleOpenEdit = (id: string) => {
	const target = mockMyPledges.find((p) => p.id === id) ?? null;
	setEditingPledge(target);
	setIsModalOpen(true);
};

const handleCloseModal = () => {
	setIsModalOpen(false);
	setEditingPledge(null);
};

const handleFormSubmit = (_data: PledgeFormData) => {
	toast.success(
		editingPledge ? "공약이 수정되었습니다." : "공약이 등록되었습니다.",
	);
	handleCloseModal();
};

const handleSaveDraft = (_data: PledgeFormData) => {
	toast.success("임시저장되었습니다.");
};
```

- [ ] **Step 4: "새 공약 추가" 버튼에 onClick 연결**

```tsx
// 변경 전:
<button type="button" className="inline-flex items-center gap-1.5 rounded-[12px] bg-primary px-7 py-[15px] text-label-2 font-semibold text-white">
  <Plus className="size-5" />
  새 공약 추가
</button>

// 변경 후:
<button type="button" onClick={handleOpenCreate} className="inline-flex items-center gap-1.5 rounded-[12px] bg-primary px-7 py-[15px] text-label-2 font-semibold text-white">
  <Plus className="size-5" />
  새 공약 추가
</button>
```

- [ ] **Step 5: MyPledgeCard에 onEdit 연결**

```tsx
// 변경 전:
<MyPledgeCard key={pledge.id} pledge={pledge} />

// 변경 후:
<MyPledgeCard key={pledge.id} pledge={pledge} onEdit={handleOpenEdit} />
```

- [ ] **Step 6: PledgeFormModal 렌더링 추가**

JSX 최하단 (`</div>` 닫기 태그 직전)에:

```tsx
<PledgeFormModal
	open={isModalOpen}
	onClose={handleCloseModal}
	pledge={editingPledge}
	onSubmit={handleFormSubmit}
	onSaveDraft={handleSaveDraft}
/>
```

- [ ] **Step 7: 타입 체크 + 빌드 확인**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 에러 없음

- [ ] **Step 8: 커밋**

```bash
git add src/app/routes/MyPledgesPage.tsx
git commit -m "feat(policy): MyPledgesPage에 공약 추가/수정 모달 연결

- 새 공약 추가 버튼 → 추가 모드 모달
- 카드 편집 버튼 → 수정 모드 모달
- 등록/임시저장 시 toast 알림"
```

---

### Task 7: 통합 확인 + 문서 업데이트

**Files:**
- Verify: 전체 빌드
- Modify: `docs/MODULE_MAP.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/architecture/policy.md`

- [ ] **Step 1: 개발 서버 실행 확인**

Run: `pnpm run build 2>&1 | tail -10`
Expected: 빌드 성공

- [ ] **Step 2: 타입 체크 확인**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 에러 없음 (기존 `authApi.ts`, `client.ts` 에러는 기존 이슈)

- [ ] **Step 3: MODULE_MAP.md 업데이트**

policy 모듈 섹션에 추가:
- `src/features/policy/components/PledgeFormModal.tsx` — 공약 추가/수정 모달
- `src/features/policy/schemas/pledgeFormSchema.ts` — 공약 폼 Zod 스키마

- [ ] **Step 4: ARCHITECTURE.md 업데이트**

정책개발 모듈 설명에 "공약 추가/수정 모달" 기능 반영.

- [ ] **Step 5: architecture/policy.md 업데이트**

컴포넌트 목록에 `PledgeFormModal` 추가. 데이터 모델 변경사항(`MyPledge` 다중선택 지원, `PledgeStatus` 4개 값) 반영.

- [ ] **Step 6: 커밋**

```bash
git add docs/MODULE_MAP.md docs/ARCHITECTURE.md docs/architecture/policy.md
git commit -m "docs: 공약 추가/수정 모달 문서 반영

- MODULE_MAP에 PledgeFormModal, pledgeFormSchema 추가
- ARCHITECTURE에 공약 모달 기능 반영
- architecture/policy.md 데이터 모델 변경사항 반영"
```
