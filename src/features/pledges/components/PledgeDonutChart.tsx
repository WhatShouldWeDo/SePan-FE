import { PieChart, Pie, Cell, Tooltip } from "recharts"
import type { PledgeKeywordStat } from "../data/mock-candidate-detail"

interface PledgeDonutChartProps {
	stats: PledgeKeywordStat[]
}

/* ─── 커스텀 Tooltip (피그마: 흰색 배경 + border + 하단 beak) ─── */

function CustomTooltip({
	active,
	payload,
}: {
	active?: boolean
	payload?: Array<{ value: number }>
}) {
	if (!active || !payload?.length) return null

	return (
		<div className="relative">
			<div className="rounded border border-cool-neutral-17 bg-white px-2 py-3 text-[15px] font-semibold leading-[22px] text-label-normal shadow-[0px_1px_4px_0px_rgba(25,33,61,0.08)]">
				{payload[0].value}%
			</div>
			{/* Beak (하단 삼각형) */}
			<div className="flex justify-center">
				<div className="size-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-cool-neutral-17" />
			</div>
		</div>
	)
}

/* ─── 중앙 카테고리 아이콘 (피그마: 40x40 분홍 배경 + 하트 아이콘) ─── */

function CategoryIcon() {
	return (
		<div className="flex size-10 items-center justify-center rounded-[7.5px] bg-[rgba(253,0,177,0.08)]">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
					fill="#FD00B1"
				/>
			</svg>
		</div>
	)
}

export function PledgeDonutChart({ stats }: PledgeDonutChartProps) {
	const topKeyword = stats.reduce(
		(max, s) => (s.percentage > max.percentage ? s : max),
		stats[0],
	)

	return (
		<div className="flex flex-col items-center gap-6">
			{/* Chart */}
			<div className="relative size-[240px]">
				<PieChart width={240} height={240}>
					<Pie
						data={stats}
						dataKey="percentage"
						nameKey="keyword"
						cx="50%"
						cy="50%"
						innerRadius={80}
						outerRadius={120}
						paddingAngle={0}
						strokeWidth={6}
						stroke="white"
						animationDuration={300}
					>
						{stats.map((stat) => (
							<Cell key={stat.keyword} fill={stat.color} />
						))}
					</Pie>
					<Tooltip content={<CustomTooltip />} />
				</PieChart>

				{/* Center label: 아이콘 + 키워드 + 퍼센트 */}
				<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5">
					<CategoryIcon />
					<div className="flex flex-col items-center">
						<span className="text-title-3 font-bold text-label-strong">
							{topKeyword.keyword}
						</span>
						<span className="text-label-4 font-semibold text-label-alternative">
							{topKeyword.percentage}%
						</span>
					</div>
				</div>
			</div>

			{/* Legend: 세로 배열 (dot 위, 텍스트 아래) */}
			<div className="flex items-start justify-center gap-6 px-8">
				{stats.map((stat) => (
					<div
						key={stat.keyword}
						className="flex flex-col items-center gap-1.5"
					>
						<span
							className="size-2.5 rounded-full"
							style={{ backgroundColor: stat.color }}
						/>
						<span className="text-caption-2 font-medium text-label-alternative">
							{stat.keyword}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
