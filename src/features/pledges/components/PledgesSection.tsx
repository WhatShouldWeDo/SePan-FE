import { useState } from "react"

import { CardSectionHeader } from "@/components/ui/card-section-header"
import { Chip } from "@/components/ui/chip"

import type { CandidateDetail } from "../data/mock-candidate-detail"
import { PledgeDonutChart } from "./PledgeDonutChart"
import { PledgeRow } from "./PledgeRow"

interface PledgesSectionProps {
	candidate: CandidateDetail
}

export function PledgesSection({ candidate }: PledgesSectionProps) {
	const [openPledges, setOpenPledges] = useState<Set<string>>(new Set())

	const pledges = candidate.pledges ?? []
	const stats = candidate.pledgeKeywordStats ?? []

	function togglePledge(id: string) {
		setOpenPledges((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	return (
		<div className="flex flex-col gap-8 rounded-[20px] bg-white p-8 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]">
			<CardSectionHeader title="공약" />

			{/* 선거 종류 필터 칩 */}
			<div className="flex">
				<Chip
					label={candidate.electionInfo}
					size="small"
					state="default"
					variant="solid"
				/>
			</div>

			{stats.length > 0 && <PledgeDonutChart stats={stats} />}

			{pledges.length > 0 ? (
				<div className="flex flex-col">
					{pledges.map((pledge) => (
						<PledgeRow
							key={pledge.id}
							pledge={pledge}
							isOpen={openPledges.has(pledge.id)}
							onToggle={() => togglePledge(pledge.id)}
						/>
					))}
				</div>
			) : (
				<p className="py-12 text-center text-body-2 font-medium text-label-alternative">
					등록된 데이터가 없습니다
				</p>
			)}
		</div>
	)
}
