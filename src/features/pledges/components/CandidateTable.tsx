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
