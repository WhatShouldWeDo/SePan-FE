import type { Candidate } from "@/features/pledges/data/mock-candidates"
import { CandidateCard } from "@/features/pledges/components/CandidateCard"

interface CandidateGridProps {
	candidates: Candidate[]
	hideHeader?: boolean
	electionCategory?: string
}

export function CandidateGrid({ candidates, hideHeader = false, electionCategory }: CandidateGridProps) {
	return (
		<div className="flex flex-col gap-[13px]">
			{/* 검색결과 헤더 */}
			{!hideHeader && (
				<div className="flex items-center gap-1 text-body-3 font-medium text-label-alternative">
					<span>검색결과</span>
					<span>{candidates.length}건</span>
				</div>
			)}

			{/* 카드 그리드 또는 빈 상태 */}
			{candidates.length > 0 ? (
				<div className="grid grid-cols-2 gap-4">
					{candidates.map((candidate) => (
						<CandidateCard
							key={candidate.id}
							candidate={candidate}
							electionCategory={electionCategory}
						/>
					))}
				</div>
			) : (
				<div className="flex items-center justify-center py-20">
					<p className="text-body-2 font-medium text-label-alternative">
						검색 결과가 없습니다
					</p>
				</div>
			)}
		</div>
	)
}
