import locationFillIcon from "@/assets/pledges/location-fill.svg"
import type { Candidate } from "@/features/pledges/data/mock-candidates"
import { PARTY_COLOR_MAP } from "@/features/pledges/data/mock-candidates"

interface CandidateCardProps {
	candidate: Candidate
}

export function CandidateCard({ candidate }: CandidateCardProps) {
	const partyColor = PARTY_COLOR_MAP[candidate.party]

	return (
		<div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]">
			{/* 프로필 사진 */}
			{candidate.photoUrl ? (
				<img
					src={candidate.photoUrl}
					alt={candidate.name}
					className="h-[137px] w-[110px] shrink-0 rounded-xl object-cover"
				/>
			) : (
				<div className="flex h-[137px] w-[110px] shrink-0 items-center justify-center rounded-xl bg-cool-neutral-5" />
			)}

			{/* 정보 영역 */}
			<div className="flex flex-1 flex-col gap-2">
				{/* Header: 이름 + 정당 배지 */}
				<div className="flex items-center gap-2">
					<span className="text-title-2 font-bold text-black">
						{candidate.name}
					</span>
					<span
						className={`rounded-md px-1.5 py-1 text-label-4 font-semibold ${partyColor.bg} ${partyColor.text}`}
					>
						{candidate.partyName}
					</span>
				</div>

				{/* Badges: 지역 + 선거정보 */}
				<div className="flex flex-wrap gap-1">
					<span className="inline-flex items-center gap-[3px] rounded-md bg-label-neutral/8 px-1.5 py-1 text-label-4 font-semibold text-label-neutral">
						<img
							src={locationFillIcon}
							alt=""
							className="size-3.5"
						/>
						{candidate.region}
					</span>
					<span className="inline-flex items-center rounded-md bg-label-neutral/8 px-1.5 py-1 text-label-4 font-semibold text-label-neutral">
						{candidate.electionInfo}
					</span>
				</div>

				{/* 경력 */}
				<div className="flex flex-col gap-1">
					{candidate.careers.map((career) => (
						<span
							key={career}
							className="text-label-4 font-medium text-label-alternative"
						>
							{career}
						</span>
					))}
				</div>
			</div>
		</div>
	)
}
