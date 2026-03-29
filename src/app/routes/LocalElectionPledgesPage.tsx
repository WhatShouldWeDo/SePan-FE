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
	LocalElectionStatistics,
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
							electionCategory="local"
						/>
					) : (
						<CandidateTable candidates={filteredCandidates} electionCategory="local" />
					)}
				</TabsContent>

				<TabsContent value="statistics" className="pt-4">
					<LocalElectionStatistics
						term={selectedTerm}
						electionType={selectedElectionType}
						sido={selectedSido}
					/>
				</TabsContent>
			</Tabs>
		</div>
	)
}
