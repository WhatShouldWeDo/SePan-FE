import { useState } from "react"
import { useBreadcrumb } from "@/contexts/useNavigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CandidateGrid, ElectionTermFilter } from "@/features/pledges/components"
import {
	ELECTION_TERMS,
	MOCK_CANDIDATES,
} from "@/features/pledges/data/mock-candidates"

export function PresidentialPledgesPage() {
	useBreadcrumb([{ label: "역대공약분석" }, { label: "대통령선거" }])

	const [selectedTerm, setSelectedTerm] = useState<number | null>(null)

	const filteredCandidates =
		selectedTerm === null
			? MOCK_CANDIDATES
			: MOCK_CANDIDATES.filter((c) => c.electionTerm === selectedTerm)

	return (
		<div className="min-w-[1040px] space-y-6 p-10">
			{/* 헤딩 */}
			<div className="flex flex-col gap-1">
				<h1 className="text-heading-2 font-bold text-label-normal">
					대통령선거
				</h1>
				<p className="text-body-2 font-medium text-label-alternative">
					대통령선거에 대한 설명이 제시됩니다.
				</p>
			</div>

			{/* 선거회차 필터 */}
			<ElectionTermFilter
				terms={ELECTION_TERMS}
				selectedTerm={selectedTerm}
				onTermChange={setSelectedTerm}
			/>

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
					<CandidateGrid candidates={filteredCandidates} electionCategory="presidential" />
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
