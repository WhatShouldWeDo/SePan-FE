import { Link } from "react-router-dom"
import { useBreadcrumb } from "@/contexts/useNavigation"
import agingIcon from "@/assets/category-icons/aging.png"
import locationFillIcon from "@/assets/pledges/location-fill.svg"

/* ─── Types ─── */

interface ElectionTypeItem {
	to: string
	title: string
	description: string
	image: string
}

/* ─── Data ─── */

const ELECTION_TYPES: ElectionTypeItem[] = [
	{
		to: "/pledges/presidential",
		title: "대통령 선거",
		description: "대통령 선거",
		image: "/image/presidental.png",
	},
	{
		to: "/pledges/parliamentary",
		title: "국회의원선거",
		description: "국회의원 선거",
		image: "/image/gukhwae.png",
	},
	{
		to: "/pledges/local",
		title: "지방선거",
		description: "지방 선거",
		image: "/image/vote.png",
	},
]

/* ─── ElectionTypeCard ─── */

function ElectionTypeCard({ to, title, description, image }: ElectionTypeItem) {
	return (
		<Link
			to={to}
			className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)] transition-shadow hover:shadow-[0px_4px_40px_0px_rgba(8,31,116,0.12)]"
		>
			{/* 상단 이미지 영역 */}
			<div className="h-40 overflow-hidden">
				<img
					src={image}
					alt={title}
					className="h-full w-full object-cover"
				/>
			</div>
			{/* 하단 텍스트 영역 */}
			<div className="flex flex-col items-center gap-1 px-6 py-5">
				<span className="text-title-3 font-bold text-label-normal">
					{title}
				</span>
				<span className="text-body-3 text-label-alternative">
					{description}
				</span>
			</div>
		</Link>
	)
}

/* ─── Page ─── */

export function PledgesOverviewPage() {
	useBreadcrumb([{ label: "역대공약분석" }])

	return (
		<div className="py-8 px-20">
			{/* 타이틀 */}
			<div className="flex flex-col gap-1 pb-30">
				<h1 className="text-heading-2 font-bold text-label-normal">
					역대공약분석
				</h1>
				<p className="text-body-3 font-medium text-label-alternative">선거 지역 정당을 선택해 후보자 공약을 찾아보세요</p>
			</div>
			{/* 서브타이틀 */}
			<p
				className="bg-clip-text text-center text-title-1 font-bold text-transparent pb-16"
				style={{
					backgroundImage:
						"linear-gradient(107.48deg, #5cfcff, #6b5cff 47.92%, #5cffa3), linear-gradient(#5736f5, #5736f5)",
				}}
			>
				역대 후보자들의 선거공약을 분석해보세요
			</p>

			{/* 선거 유형 카드 */}
			<div className="grid grid-cols-3 gap-6">
				{ELECTION_TYPES.map((item) => (
					<ElectionTypeCard key={item.to} {...item} />
				))}
			</div>

			</div>
	)
}
