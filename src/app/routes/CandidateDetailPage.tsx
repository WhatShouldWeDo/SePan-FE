import { useRef } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"

import { useBreadcrumb } from "@/contexts/useNavigation"
import {
	getCandidateDetail,
	ELECTION_TYPE_LABEL_MAP,
} from "@/features/pledges/data/mock-candidate-detail"
import { CandidateProfileHeader } from "@/features/pledges/components/CandidateProfileHeader"
import { SectionAnchorNav } from "@/features/pledges/components/SectionAnchorNav"
import { ProfileSection } from "@/features/pledges/components/ProfileSection"
import { PledgesSection } from "@/features/pledges/components/PledgesSection"
import { NewsSection } from "@/features/pledges/components/NewsSection"

export function CandidateDetailPage() {
	const navigate = useNavigate()
	const { electionType, candidateId } = useParams<{
		electionType: string
		candidateId: string
	}>()

	const candidate = getCandidateDetail(candidateId ?? "")
	const electionLabel = ELECTION_TYPE_LABEL_MAP[electionType ?? ""] ?? "선거"

	/* ─── Hooks (must be called before early return) ─── */

	useBreadcrumb([
		{ label: "역대공약분석" },
		{ label: electionLabel },
		{ label: candidate?.name ?? "" },
	])

	const profileRef = useRef<HTMLDivElement>(null)
	const pledgesRef = useRef<HTMLDivElement>(null)
	const newsRef = useRef<HTMLDivElement>(null)

	/* ─── Early return ─── */

	if (!candidate) {
		return <Navigate to="/pledges" replace />
	}

	/* ─── Section nav data ─── */

	const sections = [
		{ id: "profile", label: "프로필", ref: profileRef },
		{ id: "pledges", label: "공약", ref: pledgesRef },
		{ id: "news", label: "관련뉴스", ref: newsRef },
	]

	return (
		<div className="min-w-[1040px]">
			{/* 상단 영역: 흰색 배경 (뒤로가기 + 프로필 헤더 + 앵커 탭) */}
			<div className="bg-white">
				<div className="space-y-4 px-20 py-4">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="inline-flex items-center gap-1 text-title-4 font-bold text-label-alternative"
					>
						<ChevronLeft className="size-5" />
						공약목록
					</button>

					<CandidateProfileHeader candidate={candidate} />
				</div>
				<div className="px-20">
					<SectionAnchorNav sections={sections} />
				</div>
			</div>

			{/* 하단 영역: cool-neutral-5 배경 (섹션 콘텐츠) */}
			<div className="bg-cool-neutral-5">
				<div className="space-y-4 px-20 py-4">
					<div id="profile" ref={profileRef}>
						<ProfileSection candidate={candidate} />
					</div>

					<div id="pledges" ref={pledgesRef}>
						<PledgesSection candidate={candidate} />
					</div>

					<div id="news" ref={newsRef}>
						<NewsSection news={candidate.news ?? []} />
					</div>
				</div>
			</div>
		</div>
	)
}
