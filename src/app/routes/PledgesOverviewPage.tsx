import { Link } from "react-router-dom"
import { useBreadcrumb } from "@/contexts/useNavigation"
import electionIcon from "@/assets/pledges/election-icon.png"
import locationFillIcon from "@/assets/pledges/location-fill.svg"

/* ─── Types ─── */

interface ElectionTypeItem {
	to: string
	title: string
	description: string
}

interface QuickStartItem {
	title: string
	subtitle: string
	region: string
	party: string
	partyColorClass: string
	partyBgClass: string
}

/* ─── Data ─── */

const ELECTION_TYPES: ElectionTypeItem[] = [
	{
		to: "/pledges/presidential",
		title: "대통령 선거",
		description: "대통령 선거",
	},
	{
		to: "/pledges/parliamentary",
		title: "국회의원선거",
		description: "국회의원 선거",
	},
	{ to: "/pledges/local", title: "지방선거", description: "지방 선거" },
]

const QUICK_START_ITEMS: QuickStartItem[] = [
	{
		title: "제 22대",
		subtitle: "국회의원 선거",
		region: "강남구 갑",
		party: "더불어민주당",
		partyColorClass: "text-party-dpk",
		partyBgClass: "bg-party-dpk/8",
	},
	{
		title: "제 21대",
		subtitle: "비례대표 국회의원 선거",
		region: "강남구 전체",
		party: "국민의힘",
		partyColorClass: "text-party-ppp",
		partyBgClass: "bg-party-ppp/8",
	},
	{
		title: "제 8회",
		subtitle: "시·도지사 선거",
		region: "서울특별시",
		party: "더불어민주당",
		partyColorClass: "text-party-dpk",
		partyBgClass: "bg-party-dpk/8",
	},
]

/* ─── ElectionTypeCard ─── */

function ElectionTypeCard({ to, title, description }: ElectionTypeItem) {
	return (
		<Link
			to={to}
			className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)] transition-shadow hover:shadow-[0px_4px_40px_0px_rgba(8,31,116,0.12)]"
		>
			{/* 상단 아이콘 영역 */}
			<div className="flex items-center justify-center bg-[rgba(181,29,82,0.08)] px-6 py-8">
				<img
					src={electionIcon}
					alt=""
					className="size-12 rounded-[18px]"
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

/* ─── QuickStartCard ─── */

function QuickStartCard({
	title,
	subtitle,
	region,
	party,
	partyColorClass,
	partyBgClass,
}: QuickStartItem) {
	return (
		<div className="flex flex-1 items-center gap-4 rounded-3xl bg-white p-6 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]">
			{/* 좌측 아이콘 */}
			<div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[rgba(181,29,82,0.08)]">
				<img
					src={electionIcon}
					alt=""
					className="size-12 rounded-[18px]"
				/>
			</div>
			{/* 우측 정보 */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-1">
					<span className="text-title-3 font-bold text-label-normal">
						{title}
					</span>
					<span className="text-title-3 font-bold text-label-normal">
						{subtitle}
					</span>
				</div>
				<div className="flex items-center gap-2">
					{/* 지역구 배지 */}
					<span className="inline-flex items-center gap-1 rounded-md bg-primary/8 px-1.5 py-1 text-label-4 font-semibold text-primary">
						<img src={locationFillIcon} alt="" className="size-3.5" />
						{region}
					</span>
					{/* 정당 배지 */}
					<span
						className={`inline-flex items-center rounded-md px-1.5 py-1 text-label-4 font-semibold ${partyColorClass} ${partyBgClass}`}
					>
						{party}
					</span>
				</div>
			</div>
		</div>
	)
}

/* ─── Page ─── */

export function PledgesOverviewPage() {
	useBreadcrumb([{ label: "역대공약분석" }])

	return (
		<div className="space-y-10 p-10">
			{/* 타이틀 */}
			<h1 className="text-heading-2 font-bold text-label-normal">
				역대공약분석
			</h1>

			{/* 선거 유형 카드 */}
			<div className="grid grid-cols-3 gap-6">
				{ELECTION_TYPES.map((item) => (
					<ElectionTypeCard key={item.to} {...item} />
				))}
			</div>

			{/* 빠른시작 */}
			<section className="space-y-4">
				<div>
					<h2 className="text-title-2 font-bold text-label-normal">
						빠른시작
					</h2>
					<p className="text-body-2 text-label-alternative">
						최근 검색한 역대공약분석
					</p>
				</div>
				<div className="grid grid-cols-3 gap-6">
					{QUICK_START_ITEMS.map((item) => (
						<QuickStartCard
							key={`${item.title}-${item.subtitle}`}
							{...item}
						/>
					))}
				</div>
			</section>
		</div>
	)
}
