import { useState } from "react"
import { useBreadcrumb } from "@/contexts/useNavigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	CandidateGrid,
	ElectionTermFilter,
	ElectionTypeFilter,
	RegionSidoFilter,
	RegionSigunguFilter,
	KeywordChips,
} from "@/features/pledges/components"
import {
	PARLIAMENTARY_ELECTION_TERMS,
	ELECTION_TYPES,
	SIDO_LIST,
	SIGUNGU_MAP,
	KEYWORD_MAP,
} from "@/features/pledges/data/region-data"
import { MOCK_PARLIAMENTARY_CANDIDATES } from "@/features/pledges/data/mock-parliamentary"

export function ParliamentaryPledgesPage() {
	useBreadcrumb([{ label: "역대공약분석" }, { label: "국회의원선거" }])

	// ─── 필터 상태 ───
	const [selectedTerm, setSelectedTerm] = useState<number | null>(null)
	const [selectedElectionType, setSelectedElectionType] = useState<string | null>(null)
	const [selectedSido, setSelectedSido] = useState<string | null>(null)
	const [selectedSigungu, setSelectedSigungu] = useState<string[]>([])

	// ─── 캐스케이딩 리셋 핸들러 ───
	function handleTermChange(term: number | null) {
		setSelectedTerm(term)
		setSelectedElectionType(null)
		setSelectedSido(null)
		setSelectedSigungu([])
	}

	function handleElectionTypeChange(type: string | null) {
		setSelectedElectionType(type)
		setSelectedSido(null)
		setSelectedSigungu([])
	}

	function handleSidoChange(sido: string | null) {
		setSelectedSido(sido)
		setSelectedSigungu([])
	}

	// ─── 필터링 로직 ───
	const filteredCandidates = MOCK_PARLIAMENTARY_CANDIDATES.filter((c) => {
		if (selectedTerm !== null && c.electionTerm !== selectedTerm) return false
		if (selectedElectionType !== null && c.electionType !== selectedElectionType) return false
		if (selectedSido !== null && c.sido !== selectedSido) return false
		if (selectedSigungu.length > 0 && !selectedSigungu.includes(c.sigungu ?? "")) return false
		return true
	})

	// ─── 파생 데이터 ───
	const sigungus = selectedSido ? (SIGUNGU_MAP[selectedSido] ?? []) : []
	const keywords = selectedSido ? (KEYWORD_MAP[selectedSido] ?? []) : []

	// 시/군/구 선택 시 해당 지역구명을 키워드에 추가
	const selectedRegionNames = selectedSigungu.length > 0
		? filteredCandidates
				.filter((c) => selectedSigungu.includes(c.sigungu ?? ""))
				.map((c) => c.region)
				.filter((v, i, a) => a.indexOf(v) === i)
		: []
	const allKeywords = [...keywords, ...selectedRegionNames]

	return (
		<div className="min-w-[1040px] space-y-6 p-10">
			{/* 헤딩 */}
			<div className="flex flex-col gap-1">
				<h1 className="text-heading-2 font-bold text-label-normal">
					국회의원 선거
				</h1>
				<p className="text-body-2 font-medium text-label-alternative">
					국회의원 선거에 대한 설명이 제시됩니다.
				</p>
			</div>

			{/* 필터 바 */}
			<div className="flex items-center gap-3">
				<ElectionTermFilter
					terms={PARLIAMENTARY_ELECTION_TERMS}
					selectedTerm={selectedTerm}
					onTermChange={handleTermChange}
				/>
				<ElectionTypeFilter
					types={ELECTION_TYPES}
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
				{selectedSido !== null && (
					<RegionSigunguFilter
						sigungus={sigungus}
						selectedSigungu={selectedSigungu}
						onSigunguChange={setSelectedSigungu}
					/>
				)}
			</div>

			{/* 키워드 칩 */}
			{selectedSido !== null && <KeywordChips keywords={allKeywords} />}

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
					<CandidateGrid candidates={filteredCandidates} electionCategory="parliamentary" />
				</TabsContent>

				<TabsContent value="statistics" className="pt-4">
					<div className="flex items-center justify-center py-20">
						<p className="text-body-2 font-medium text-label-alternative">
							준비 중입니다
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
