# 지방선거 역대공약분석 페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 역대공약분석의 지방선거 페이지를 구현한다. 카드/리스트 뷰 토글과 후보자 테이블이 핵심 신규 기능이며, 기존 컴포넌트를 최대한 재사용한다.

**Architecture:** 기존 ParliamentaryPledgesPage 패턴을 따르되, 3단 계단식 필터(회차→선거종류→지역)와 카드/리스트 뷰 토글을 추가한다. SegmentedControl은 `components/ui/`에 공통 컴포넌트로, CandidateTable은 `features/pledges/components/`에 도메인 컴포넌트로 배치한다.

**Tech Stack:** React + TypeScript, Tailwind CSS, Vite

**Spec:** `docs/superpowers/specs/2026-03-21-local-election-pledges-design.md`

---

## File Structure

### 신규 파일

| 파일 | 역할 |
|------|------|
| `src/components/ui/segmented-control.tsx` | 공통 뷰 토글 컴포넌트 (카드/리스트 등) |
| `src/features/pledges/components/CandidateTable.tsx` | 후보자 리스트(테이블) 뷰 |
| `src/features/pledges/data/mock-local.ts` | 지방선거 mock 후보자 15명 |
| `src/features/pledges/data/local-election-data.ts` | 지방선거 필터 옵션 데이터 |
| `src/app/routes/LocalElectionPledgesPage.tsx` | 지방선거 페이지 컴포넌트 |

### 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/features/pledges/data/mock-candidates.ts:16` | `electionType` 유니온 확장 + `regionDetail` 추가 |
| `src/features/pledges/components/CandidateGrid.tsx:4-8` | `hideHeader?: boolean` prop 추가 |
| `src/features/pledges/components/index.ts` | `CandidateTable` export 추가 |
| `src/app/router.tsx:10-11,35-36` | import + route 추가 |

---

## Task 1: Candidate 타입 확장

**Files:**
- Modify: `src/features/pledges/data/mock-candidates.ts:5-19`

- [ ] **Step 1: `electionType` 유니온 타입 확장**

`mock-candidates.ts`의 Candidate 인터페이스에서 `electionType` 필드를 수정:

```typescript
// Line 16: 기존
electionType?: "national" | "proportional"

// Line 16: 변경 후
electionType?: "national" | "proportional" | "governor" | "council" | "mayor"
```

- [ ] **Step 2: `regionDetail` 필드 추가**

Candidate 인터페이스 끝에 추가 (Line 18, `sigungu` 다음):

```typescript
regionDetail?: string
```

- [ ] **Step 3: 타입 체크 확인**

Run: `npx tsc --noEmit`
Expected: 기존 코드에 영향 없음 (모두 optional 필드)

- [ ] **Step 4: 커밋**

```bash
git add src/features/pledges/data/mock-candidates.ts
git commit -m "feat(pledges): Candidate 타입에 지방선거 필드 추가 (electionType 확장 + regionDetail)"
```

---

## Task 2: 지방선거 데이터 파일 생성

**Files:**
- Create: `src/features/pledges/data/local-election-data.ts`
- Create: `src/features/pledges/data/mock-local.ts`

- [ ] **Step 1: 필터 옵션 데이터 생성**

`src/features/pledges/data/local-election-data.ts`:

```typescript
import type { ElectionTerm } from "@/features/pledges/data/mock-candidates"
import type { ElectionType } from "@/features/pledges/data/region-data"
import { SIDO_LIST } from "@/features/pledges/data/region-data"

// MVP 범위: 3회차
export const LOCAL_ELECTION_TERMS: ElectionTerm[] = [
	{ value: 8, label: "제 8회" },
	{ value: 7, label: "제 7회" },
	{ value: 6, label: "제 6회" },
]

export const LOCAL_ELECTION_TYPES: ElectionType[] = [
	{ value: "governor", label: "시·도지사선거" },
	{ value: "council", label: "시·도의회의원선거" },
	{ value: "mayor", label: "구·시·군의장선거" },
]

// re-export for convenience
export { SIDO_LIST }
```

- [ ] **Step 2: Mock 후보자 데이터 생성**

`src/features/pledges/data/mock-local.ts`:

```typescript
import type { Candidate } from "@/features/pledges/data/mock-candidates"

export const MOCK_LOCAL_CANDIDATES: Candidate[] = [
	// === 시·도지사선거 (governor) 5명 ===
	{
		id: "local-1",
		name: "김영수",
		party: "dpk",
		partyName: "더불어민주당",
		region: "서울특별시",
		electionInfo: "제 8회 시·도지사선거",
		careers: ["전 서울시 부시장", "국토교통부 차관"],
		electionTerm: 8,
		electionType: "governor",
		sido: "서울특별시",
	},
	{
		id: "local-2",
		name: "박지현",
		party: "ppp",
		partyName: "국민의힘",
		region: "서울특별시",
		electionInfo: "제 8회 시·도지사선거",
		careers: ["전 국회의원 3선", "행정안전부 장관"],
		electionTerm: 8,
		electionType: "governor",
		sido: "서울특별시",
	},
	{
		id: "local-3",
		name: "최민정",
		party: "dpk",
		partyName: "더불어민주당",
		region: "경기도",
		electionInfo: "제 8회 시·도지사선거",
		careers: ["전 경기도 행정부지사", "기획재정부 사무관"],
		electionTerm: 8,
		electionType: "governor",
		sido: "경기도",
	},
	{
		id: "local-4",
		name: "이상훈",
		party: "ppp",
		partyName: "국민의힘",
		region: "부산광역시",
		electionInfo: "제 7회 시·도지사선거",
		careers: ["전 부산시 정무부시장", "변호사"],
		electionTerm: 7,
		electionType: "governor",
		sido: "부산광역시",
	},
	{
		id: "local-5",
		name: "한수진",
		party: "justice",
		partyName: "정의당",
		region: "광주광역시",
		electionInfo: "제 7회 시·도지사선거",
		careers: ["시민단체 대표", "전 광주시의원"],
		electionTerm: 7,
		electionType: "governor",
		sido: "광주광역시",
	},

	// === 시·도의회의원선거 (council) 5명 ===
	{
		id: "local-6",
		name: "이민호",
		party: "dpk",
		partyName: "더불어민주당",
		region: "서울특별시",
		electionInfo: "제 8회 시·도의회의원선거",
		careers: ["전 강남구의회 의원", "변호사"],
		electionTerm: 8,
		electionType: "council",
		sido: "서울특별시",
		regionDetail: "강남구 제1선거구",
	},
	{
		id: "local-7",
		name: "장혜진",
		party: "ppp",
		partyName: "국민의힘",
		region: "서울특별시",
		electionInfo: "제 8회 시·도의회의원선거",
		careers: ["전 서초구의회 부의장", "세무사"],
		electionTerm: 8,
		electionType: "council",
		sido: "서울특별시",
		regionDetail: "서초구 제2선거구",
	},
	{
		id: "local-8",
		name: "윤재석",
		party: "dpk",
		partyName: "더불어민주당",
		region: "경기도",
		electionInfo: "제 8회 시·도의회의원선거",
		careers: ["전 수원시의원", "사회복지사"],
		electionTerm: 8,
		electionType: "council",
		sido: "경기도",
		regionDetail: "수원시 제3선거구",
	},
	{
		id: "local-9",
		name: "김태영",
		party: "ppp",
		partyName: "국민의힘",
		region: "부산광역시",
		electionInfo: "제 7회 시·도의회의원선거",
		careers: ["전 해운대구의원", "건축사"],
		electionTerm: 7,
		electionType: "council",
		sido: "부산광역시",
		regionDetail: "해운대구 제1선거구",
	},
	{
		id: "local-10",
		name: "오수빈",
		party: "reform",
		partyName: "개혁신당",
		region: "대전광역시",
		electionInfo: "제 7회 시·도의회의원선거",
		careers: ["IT 기업 대표", "전 대전시 자문위원"],
		electionTerm: 7,
		electionType: "council",
		sido: "대전광역시",
		regionDetail: "유성구 제1선거구",
	},

	// === 구·시·군의장선거 (mayor) 5명 ===
	{
		id: "local-11",
		name: "정수연",
		party: "reform",
		partyName: "개혁신당",
		region: "서울특별시",
		electionInfo: "제 8회 구·시·군의장선거",
		careers: ["전 강남구 부구청장", "행정학 박사"],
		electionTerm: 8,
		electionType: "mayor",
		sido: "서울특별시",
		regionDetail: "강남구",
	},
	{
		id: "local-12",
		name: "송민수",
		party: "dpk",
		partyName: "더불어민주당",
		region: "서울특별시",
		electionInfo: "제 8회 구·시·군의장선거",
		careers: ["전 종로구의원 3선", "교육행정 전문가"],
		electionTerm: 8,
		electionType: "mayor",
		sido: "서울특별시",
		regionDetail: "종로구",
	},
	{
		id: "local-13",
		name: "강은지",
		party: "ppp",
		partyName: "국민의힘",
		region: "경기도",
		electionInfo: "제 8회 구·시·군의장선거",
		careers: ["전 성남시 부시장", "법학박사"],
		electionTerm: 8,
		electionType: "mayor",
		sido: "경기도",
		regionDetail: "성남시",
	},
	{
		id: "local-14",
		name: "임동현",
		party: "dpk",
		partyName: "더불어민주당",
		region: "인천광역시",
		electionInfo: "제 7회 구·시·군의장선거",
		careers: ["전 남동구 부구청장", "도시계획 전문가"],
		electionTerm: 7,
		electionType: "mayor",
		sido: "인천광역시",
		regionDetail: "남동구",
	},
	{
		id: "local-15",
		name: "배서현",
		party: "other",
		partyName: "무소속",
		region: "제주특별자치도",
		electionInfo: "제 6회 구·시·군의장선거",
		careers: ["제주 관광업 대표", "전 제주시의원"],
		electionTerm: 6,
		electionType: "mayor",
		sido: "제주특별자치도",
		regionDetail: "제주시",
	},
]
```

- [ ] **Step 3: 타입 체크 확인**

Run: `npx tsc --noEmit`
Expected: PASS — Candidate 타입 확장 후 governor/council/mayor 값 허용

- [ ] **Step 4: 커밋**

```bash
git add src/features/pledges/data/local-election-data.ts src/features/pledges/data/mock-local.ts
git commit -m "feat(pledges): 지방선거 필터 옵션 및 mock 후보자 데이터 추가"
```

---

## Task 3: SegmentedControl 공통 컴포넌트

**Files:**
- Create: `src/components/ui/segmented-control.tsx`

- [ ] **Step 1: SegmentedControl 컴포넌트 생성**

`src/components/ui/segmented-control.tsx`:

```typescript
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SegmentedControlOption<T extends string> {
	value: T
	label: string
	icon?: ReactNode
}

interface SegmentedControlProps<T extends string> {
	options: SegmentedControlOption<T>[]
	value: T
	onChange: (value: T) => void
	className?: string
}

export function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
	className,
}: SegmentedControlProps<T>) {
	return (
		<div
			className={cn(
				"inline-flex rounded-lg bg-fill-normal p-[3px] gap-[2px]",
				className,
			)}
		>
			{options.map((option) => {
				const isActive = option.value === value
				return (
					<button
						key={option.value}
						type="button"
						onClick={() => onChange(option.value)}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-md px-3.5 min-h-11 py-1.5 text-label-4 transition-all",
							isActive
								? "bg-white font-semibold text-label-normal shadow-sm"
								: "bg-transparent font-medium text-label-alternative hover:text-label-neutral",
						)}
					>
						{option.icon && (
							<span className="flex-shrink-0">{option.icon}</span>
						)}
						{option.label}
					</button>
				)
			})}
		</div>
	)
}
```

- [ ] **Step 2: 타입 체크 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add src/components/ui/segmented-control.tsx
git commit -m "feat(ui): SegmentedControl 공통 뷰 토글 컴포넌트 추가"
```

---

## Task 4: CandidateGrid에 hideHeader prop 추가

**Files:**
- Modify: `src/features/pledges/components/CandidateGrid.tsx`

- [ ] **Step 1: Props 인터페이스에 `hideHeader` 추가**

```typescript
// 기존
interface CandidateGridProps {
	candidates: Candidate[]
}

// 변경
interface CandidateGridProps {
	candidates: Candidate[]
	hideHeader?: boolean
}
```

- [ ] **Step 2: 컴포넌트 시그니처와 렌더링 수정**

```typescript
// 기존
export function CandidateGrid({ candidates }: CandidateGridProps) {

// 변경
export function CandidateGrid({ candidates, hideHeader = false }: CandidateGridProps) {
```

헤더 부분을 조건부 렌더링:

```typescript
// 기존 (Lines 12-15)
<div className="flex items-center gap-1 text-body-3 font-medium text-label-alternative">
	<span>검색결과</span>
	<span>{candidates.length}건</span>
</div>

// 변경
{!hideHeader && (
	<div className="flex items-center gap-1 text-body-3 font-medium text-label-alternative">
		<span>검색결과</span>
		<span>{candidates.length}건</span>
	</div>
)}
```

- [ ] **Step 3: 타입 체크 확인**

Run: `npx tsc --noEmit`
Expected: PASS — 기존 사용처는 hideHeader를 전달하지 않으므로 default false 적용

- [ ] **Step 4: 커밋**

```bash
git add src/features/pledges/components/CandidateGrid.tsx
git commit -m "feat(pledges): CandidateGrid에 hideHeader prop 추가"
```

---

## Task 5: CandidateTable 컴포넌트

**Files:**
- Create: `src/features/pledges/components/CandidateTable.tsx`
- Modify: `src/features/pledges/components/index.ts`

- [ ] **Step 1: CandidateTable 컴포넌트 생성**

`src/features/pledges/components/CandidateTable.tsx`:

```typescript
import locationFillIcon from "@/assets/pledges/location-fill.svg"
import type { Candidate } from "@/features/pledges/data/mock-candidates"
import { PARTY_COLOR_MAP } from "@/features/pledges/data/mock-candidates"

interface CandidateTableProps {
	candidates: Candidate[]
}

export function CandidateTable({ candidates }: CandidateTableProps) {
	if (candidates.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-body-2 font-medium text-label-alternative">
					검색 결과가 없습니다
				</p>
			</div>
		)
	}

	return (
		<div className="overflow-hidden rounded-xl border border-line-neutral">
			<table className="w-full border-collapse">
				<thead>
					<tr className="h-11 bg-fill-normal text-label-4 font-semibold text-label-neutral">
						<th className="w-14 px-4 text-left" />
						<th className="w-[100px] px-4 text-left">이름</th>
						<th className="w-[120px] px-4 text-left">정당</th>
						<th className="w-[160px] px-4 text-left">지역</th>
						<th className="px-4 text-left">주요 경력</th>
						<th className="w-[180px] px-4 text-left">선거 정보</th>
						<th className="w-[60px] px-4 text-center">액션</th>
					</tr>
				</thead>
				<tbody>
					{candidates.map((candidate) => {
						const partyColor = PARTY_COLOR_MAP[candidate.party]
						const regionText = candidate.regionDetail
							? `${candidate.sido} ${candidate.regionDetail}`
							: candidate.sido ?? candidate.region

						return (
							<tr
								key={candidate.id}
								className="h-16 border-t border-line-neutral text-body-3 font-medium"
							>
								{/* 아바타 */}
								<td className="px-4">
									{candidate.photoUrl ? (
										<img
											src={candidate.photoUrl}
											alt={candidate.name}
											className="h-10 w-10 rounded-full object-cover"
										/>
									) : (
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-fill-normal text-body-3 font-semibold text-label-neutral">
											{candidate.name.charAt(0)}
										</div>
									)}
								</td>

								{/* 이름 */}
								<td className="px-4 font-semibold text-label-normal">
									{candidate.name}
								</td>

								{/* 정당 뱃지 */}
								<td className="px-4">
									<span
										className={`inline-block rounded-md px-2.5 py-1 text-label-4 font-bold ${partyColor.bg} ${partyColor.text}`}
									>
										{candidate.partyName}
									</span>
								</td>

								{/* 지역 */}
								<td className="px-4 text-label-normal">
									<span className="inline-flex items-center gap-1">
										<img
											src={locationFillIcon}
											alt=""
											className="h-3.5 w-3.5"
										/>
										{regionText}
									</span>
								</td>

								{/* 주요 경력 */}
								<td className="px-4 text-label-neutral">
									<span className="line-clamp-1">
										{candidate.careers[0] ?? ""}
									</span>
								</td>

								{/* 선거 정보 */}
								<td className="px-4 text-label-neutral">
									{candidate.electionInfo}
								</td>

								{/* 액션 (placeholder) */}
								<td className="px-4 text-center">
									<button
										type="button"
										className="inline-flex h-8 w-8 items-center justify-center rounded-md text-label-alternative hover:bg-fill-normal"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<circle cx="8" cy="3" r="1.2" fill="currentColor" />
											<circle cx="8" cy="8" r="1.2" fill="currentColor" />
											<circle cx="8" cy="13" r="1.2" fill="currentColor" />
										</svg>
									</button>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
```

- [ ] **Step 2: index.ts에 export 추가**

`src/features/pledges/components/index.ts`에 추가:

```typescript
export { CandidateTable } from "./CandidateTable"
```

- [ ] **Step 3: 타입 체크 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: 커밋**

```bash
git add src/features/pledges/components/CandidateTable.tsx src/features/pledges/components/index.ts
git commit -m "feat(pledges): CandidateTable 후보자 리스트 뷰 컴포넌트 추가"
```

---

## Task 6: LocalElectionPledgesPage + 라우트

**Files:**
- Create: `src/app/routes/LocalElectionPledgesPage.tsx`
- Modify: `src/app/router.tsx:10-11,35-36`

- [ ] **Step 1: 페이지 컴포넌트 생성**

`src/app/routes/LocalElectionPledgesPage.tsx`:

```typescript
import { useState } from "react"
import { useBreadcrumb } from "@/contexts/useNavigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SegmentedControl } from "@/components/ui/segmented-control"
import {
	CandidateGrid,
	CandidateTable,
	ElectionTermFilter,
	ElectionTypeFilter,
	RegionSidoFilter,
} from "@/features/pledges/components"
import {
	LOCAL_ELECTION_TERMS,
	LOCAL_ELECTION_TYPES,
	SIDO_LIST,
} from "@/features/pledges/data/local-election-data"
import { MOCK_LOCAL_CANDIDATES } from "@/features/pledges/data/mock-local"

// 뷰 모드 아이콘
function GridIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
			<rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
			<rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
			<rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
			<rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	)
}

function ListIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
			<rect x="1" y="2" width="14" height="2" rx="1" fill="currentColor" />
			<rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor" />
			<rect x="1" y="12" width="14" height="2" rx="1" fill="currentColor" />
		</svg>
	)
}

export function LocalElectionPledgesPage() {
	useBreadcrumb([{ label: "역대공약분석" }, { label: "지방선거" }])

	// 필터 상태
	const [selectedTerm, setSelectedTerm] = useState<number | null>(null)
	const [selectedElectionType, setSelectedElectionType] = useState<
		string | null
	>(null)
	const [selectedSido, setSelectedSido] = useState<string | null>(null)

	// 뷰 모드
	const [viewMode, setViewMode] = useState<"card" | "list">("card")

	// 계단식 핸들러
	const handleTermChange = (term: number | null) => {
		setSelectedTerm(term)
		setSelectedElectionType(null)
		setSelectedSido(null)
	}

	const handleElectionTypeChange = (type: string | null) => {
		setSelectedElectionType(type)
		setSelectedSido(null)
	}

	const handleSidoChange = (sido: string | null) => {
		setSelectedSido(sido)
	}

	// 필터링
	const filteredCandidates = MOCK_LOCAL_CANDIDATES.filter((c) => {
		if (selectedTerm !== null && c.electionTerm !== selectedTerm) return false
		if (
			selectedElectionType !== null &&
			c.electionType !== selectedElectionType
		)
			return false
		if (selectedSido !== null && c.sido !== selectedSido) return false
		return true
	})

	// 필터 요약 텍스트
	const filterParts: string[] = []
	if (selectedTerm !== null) {
		const term = LOCAL_ELECTION_TERMS.find((t) => t.value === selectedTerm)
		if (term) filterParts.push(term.label)
	}
	if (selectedElectionType !== null) {
		const type = LOCAL_ELECTION_TYPES.find(
			(t) => t.value === selectedElectionType,
		)
		if (type) filterParts.push(type.label)
	}
	if (selectedSido !== null) {
		filterParts.push(selectedSido)
	}
	const filterSummary =
		filterParts.length > 0 ? filterParts.join(" / ") : "전체"

	return (
		<div className="min-w-[1040px] space-y-6 p-10">
			{/* 헤딩 */}
			<div className="flex flex-col gap-1">
				<h1 className="text-heading-2 font-bold text-label-normal">
					지방선거
				</h1>
				<p className="text-body-2 font-medium text-label-alternative">
					지방선거에 출마한 후보자들의 공약을 분석합니다.
				</p>
			</div>

			{/* 필터 바 */}
			<div className="flex items-center gap-3">
				<ElectionTermFilter
					terms={LOCAL_ELECTION_TERMS}
					selectedTerm={selectedTerm}
					onTermChange={handleTermChange}
				/>
				<ElectionTypeFilter
					types={LOCAL_ELECTION_TYPES}
					selectedType={selectedElectionType}
					onTypeChange={handleElectionTypeChange}
					disabled={selectedTerm === null}
				/>
				<RegionSidoFilter
					sidos={SIDO_LIST}
					selectedSido={selectedSido}
					onSidoChange={handleSidoChange}
					disabled={selectedElectionType === null}
				/>
			</div>

			{/* 탭 */}
			<Tabs defaultValue="candidates">
				<TabsList variant="line">
					<TabsTrigger value="candidates" className="text-title-4 font-bold">
						후보자 목록
					</TabsTrigger>
					<TabsTrigger value="statistics" className="text-title-4 font-bold">
						통계분석
					</TabsTrigger>
				</TabsList>

				<TabsContent value="candidates" className="pt-4">
					{/* 결과 헤더 */}
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-title-4 font-bold text-label-normal">
								{filterSummary}
							</span>
							<span className="text-label-4 font-medium text-label-neutral">
								{filteredCandidates.length}건
							</span>
						</div>
						<SegmentedControl
							options={[
								{ value: "card" as const, label: "카드", icon: <GridIcon /> },
								{ value: "list" as const, label: "리스트", icon: <ListIcon /> },
							]}
							value={viewMode}
							onChange={setViewMode}
						/>
					</div>

					{/* 후보자 목록 */}
					{viewMode === "card" ? (
						<CandidateGrid
							candidates={filteredCandidates}
							hideHeader
						/>
					) : (
						<CandidateTable candidates={filteredCandidates} />
					)}
				</TabsContent>

				<TabsContent value="statistics" className="pt-4">
					<div className="flex items-center justify-center py-20">
						<p className="text-body-2 font-medium text-label-alternative">
							통계분석 기능은 준비 중입니다
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
```

- [ ] **Step 2: 라우터에 import 추가**

`src/app/router.tsx` 상단 import 영역 (Line 10-11 부근)에 추가:

```typescript
import { LocalElectionPledgesPage } from "@/app/routes/LocalElectionPledgesPage";
```

- [ ] **Step 3: 라우트 추가**

`src/app/router.tsx`에서 `/pledges/parliamentary` 라우트 다음, `/pledges/:type` 라우트 직전에 추가:

```typescript
{ path: "/pledges/local", element: <LocalElectionPledgesPage /> },
```

- [ ] **Step 4: 타입 체크 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: 개발 서버에서 확인**

Run: `pnpm run dev`
확인 사항:
1. `/pledges` 개요 페이지에서 "지방선거" 카드 클릭 → `/pledges/local`로 이동
2. 브레드크럼: "역대공약분석 > 지방선거" 표시
3. 필터 칩 3개 계단식 동작: 회차 → 선거종류 → 지역
4. 카드/리스트 뷰 토글 작동
5. 리스트 뷰에서 테이블 렌더링, 지역 상세도 차이 확인

- [ ] **Step 6: 커밋**

```bash
git add src/app/routes/LocalElectionPledgesPage.tsx src/app/router.tsx
git commit -m "feat(pledges): 지방선거 페이지 및 라우트 추가"
```

---

## Task 7: 문서 업데이트

**Files:**
- Modify: `docs/MODULE_MAP.md`
- Modify: `docs/architecture/pledges.md`

- [ ] **Step 1: MODULE_MAP.md에 신규 파일 추가**

pledges 모듈 섹션에 다음 파일들 추가:

```markdown
| `src/app/routes/LocalElectionPledgesPage.tsx` | 지방선거 페이지 |
| `src/components/ui/segmented-control.tsx` | 카드/리스트 뷰 토글 공통 컴포넌트 |
| `src/features/pledges/components/CandidateTable.tsx` | 후보자 리스트(테이블) 뷰 |
| `src/features/pledges/data/mock-local.ts` | 지방선거 mock 후보자 데이터 (15명) |
| `src/features/pledges/data/local-election-data.ts` | 지방선거 필터 옵션 데이터 |
```

- [ ] **Step 2: architecture/pledges.md 업데이트**

지방선거 페이지 섹션 추가:
- 페이지 구조 (3단 필터, 카드/리스트 토글)
- SegmentedControl 컴포넌트 설명
- CandidateTable 컴포넌트 설명
- 상태 관리 패턴 (viewMode 추가)

- [ ] **Step 3: 커밋**

```bash
git add -f docs/MODULE_MAP.md docs/architecture/pledges.md
git commit -m "docs: 지방선거 페이지 관련 문서 업데이트 (MODULE_MAP, architecture)"
```
