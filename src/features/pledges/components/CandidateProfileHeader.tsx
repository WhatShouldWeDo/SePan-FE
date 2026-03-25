import locationFillIcon from "@/assets/pledges/location-fill.svg"
import type { CandidateDetail } from "@/features/pledges/data/mock-candidate-detail"
import { PARTY_COLOR_MAP } from "@/features/pledges/data/mock-candidates"

/* ─── SNS Icons (24×24, fill="currentColor") ─── */

type SocialPlatform = "instagram" | "facebook" | "linkedin"

const SOCIAL_PATHS: Record<SocialPlatform, string> = {
	instagram:
		"M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm4.25 3a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.75-.88a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0Z",
	facebook:
		"M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z",
	linkedin:
		"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125ZM6.866 20.452H3.81V9h3.056v11.452Z",
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-label={platform}
		>
			<path d={SOCIAL_PATHS[platform]} />
		</svg>
	)
}

/* ─── Component ─── */

interface CandidateProfileHeaderProps {
	candidate: CandidateDetail
}

export function CandidateProfileHeader({
	candidate,
}: CandidateProfileHeaderProps) {
	const partyColor = PARTY_COLOR_MAP[candidate.party]

	return (
		<div className="flex items-center gap-6 overflow-clip rounded-3xl bg-white py-8 pr-6">
			{/* 프로필 사진 */}
			{candidate.photoUrl ? (
				<img
					src={candidate.photoUrl}
					alt={candidate.name}
					className="h-[175px] w-[140px] rounded-2xl object-cover"
				/>
			) : (
				<div className="h-[175px] w-[140px] shrink-0 rounded-2xl bg-cool-neutral-5" />
			)}

			{/* 정보 영역 */}
			<div className="flex flex-col gap-3">
				{/* Row 1: 이름 + 정당 배지 + SNS 아이콘 */}
				<div className="flex items-center gap-2">
					<span className="text-heading-3 font-bold text-black">
						{candidate.name}
					</span>
					<span
						className={`rounded-[6px] px-1.5 py-1 text-label-4 font-semibold ${partyColor.bg} ${partyColor.text}`}
					>
						{candidate.partyName}
					</span>

					{/* SNS 아이콘 */}
					{candidate.socialLinks && candidate.socialLinks.length > 0 && (
						<div className="flex items-center gap-1 text-label-neutral">
							{candidate.socialLinks.map((link) => (
								<a
									key={link.type}
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={link.type}
								>
									<SocialIcon platform={link.type} />
								</a>
							))}
						</div>
					)}
				</div>

				{/* Row 2: 지역 배지 + 선거정보 배지 */}
				<div className="flex flex-wrap gap-1">
					{candidate.region && (
						<span className="inline-flex items-center gap-[3px] rounded-[6px] bg-label-neutral/8 px-1.5 py-1 text-label-4 font-semibold text-label-neutral">
							<img
								src={locationFillIcon}
								alt=""
								className="size-3.5"
							/>
							{candidate.region}
						</span>
					)}
					{candidate.electionInfo && (
						<span className="inline-flex items-center rounded-[6px] bg-label-neutral/8 px-1.5 py-1 text-label-4 font-semibold text-label-neutral">
							{candidate.electionInfo}
						</span>
					)}
				</div>

				{/* Row 3: 경력 요약 (최대 3줄) */}
				{candidate.careers && candidate.careers.length > 0 && (
					<div className="flex flex-col gap-1">
						{candidate.careers.slice(0, 3).map((career) => (
							<span
								key={career}
								className="text-label-4 font-medium text-label-alternative"
							>
								{career}
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
