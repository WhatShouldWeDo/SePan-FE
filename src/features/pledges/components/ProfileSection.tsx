import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { CardSectionHeader } from "@/components/ui/card-section-header"
import type {
	CandidateDetail,
	HistoryItem,
} from "@/features/pledges/data/mock-candidate-detail"

/* ─── Sub-components ─── */

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-start gap-4">
			<span className="w-[72px] shrink-0 text-label-4 font-medium text-label-alternative">
				{label}
			</span>
			<span className="text-label-4 font-semibold text-label-normal">
				{value}
			</span>
		</div>
	)
}

function HistoryList({ items }: { items: HistoryItem[] }) {
	return (
		<div className="flex flex-col gap-3">
			{items.map((item, idx) => (
				<div key={idx} className="flex items-start gap-4">
					<span className="w-[100px] shrink-0 text-label-4 font-medium text-label-alternative">
						{item.period}
					</span>
					<span className="text-label-4 font-semibold text-label-normal">
						{item.description}
					</span>
				</div>
			))}
		</div>
	)
}

/* ─── ProfileSection ─── */

const INITIAL_CAREER_COUNT = 4

interface ProfileSectionProps {
	candidate: CandidateDetail
}

function ProfileSection({ candidate }: ProfileSectionProps) {
	const [showAllCareers, setShowAllCareers] = useState<boolean>(false)

	const {
		birthDate,
		age,
		address,
		job,
		aides,
		educationHistory,
		careerHistory,
	} = candidate

	/* 기본정보 rows — 값이 없는 항목 스킵 */
	const infoRows: { label: string; value: string }[] = []

	if (birthDate) {
		const birthValue = age ? `${birthDate} (${age}세)` : birthDate
		infoRows.push({ label: "출생", value: birthValue })
	}
	if (address) {
		infoRows.push({ label: "거주지", value: address })
	}
	if (job) {
		infoRows.push({ label: "직업", value: job })
	}
	if (aides && aides.length > 0) {
		infoRows.push({ label: "보좌관", value: aides.join(", ") })
	}

	/* 경력 — 더보기 토글 */
	const visibleCareers =
		showAllCareers || !careerHistory
			? careerHistory
			: careerHistory.slice(0, INITIAL_CAREER_COUNT)

	const hasMoreCareers =
		!!careerHistory && careerHistory.length > INITIAL_CAREER_COUNT

	return (
		<div className="rounded-[20px] bg-white p-8 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]">
			<div className="flex flex-col gap-8">
				<CardSectionHeader title="프로필" />

				{/* 기본정보 */}
				{infoRows.length > 0 && (
					<div className="flex flex-col gap-4">
						<h4 className="text-title-4 font-bold">기본정보</h4>
						<div className="flex flex-col gap-3">
							{infoRows.map((row) => (
								<InfoRow
									key={row.label}
									label={row.label}
									value={row.value}
								/>
							))}
						</div>
					</div>
				)}

				{/* 학력 */}
				{educationHistory && educationHistory.length > 0 && (
					<div className="flex flex-col gap-4">
						<h4 className="text-title-4 font-bold">학력</h4>
						<HistoryList items={educationHistory} />
					</div>
				)}

				{/* 경력 */}
				{visibleCareers && visibleCareers.length > 0 && (
					<div className="flex flex-col gap-4">
						<h4 className="text-title-4 font-bold">경력</h4>
						<HistoryList items={visibleCareers} />

						{hasMoreCareers && (
							<button
								type="button"
								onClick={() => setShowAllCareers((prev) => !prev)}
								className="mx-auto flex items-center gap-1 text-label-4 font-semibold text-label-alternative"
							>
								<span>{showAllCareers ? "접기" : "더보기"}</span>
								<ChevronDown
									className={`size-4 transition-transform ${
										showAllCareers ? "rotate-180" : ""
									}`}
								/>
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export { ProfileSection }
export type { ProfileSectionProps }
