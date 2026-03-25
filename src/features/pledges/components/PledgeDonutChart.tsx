import { PieChart, Pie, Cell, Tooltip } from "recharts"
import type { PledgeKeywordStat } from "../data/mock-candidate-detail"

interface PledgeDonutChartProps {
	stats: PledgeKeywordStat[]
}

function CustomTooltip({
	active,
	payload,
}: {
	active?: boolean
	payload?: Array<{ value: number }>
}) {
	if (!active || !payload?.length) return null

	return (
		<div className="rounded-lg bg-surface-inverse px-3 py-1.5 text-caption-1 font-semibold text-label-inverse shadow-md">
			{payload[0].value}%
		</div>
	)
}

export function PledgeDonutChart({ stats }: PledgeDonutChartProps) {
	const topKeyword = stats.reduce((max, s) =>
		s.percentage > max.percentage ? s : max,
	)

	return (
		<div className="flex flex-col items-center gap-6">
			{/* Chart */}
			<div className="relative">
				<PieChart width={240} height={240}>
					<Pie
						data={stats}
						dataKey="percentage"
						nameKey="keyword"
						cx="50%"
						cy="50%"
						innerRadius={55}
						outerRadius={120}
						strokeWidth={0}
						animationDuration={300}
					>
						{stats.map((stat) => (
							<Cell key={stat.keyword} fill={stat.color} />
						))}
					</Pie>
					<Tooltip content={<CustomTooltip />} />
				</PieChart>

				{/* Center label */}
				<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-heading-3 font-bold">
						{topKeyword.keyword}
					</span>
					<span className="text-label-4 font-medium text-label-alternative">
						{topKeyword.percentage}%
					</span>
				</div>
			</div>

			{/* Legend */}
			<div className="flex flex-wrap items-center justify-center gap-4">
				{stats.map((stat) => (
					<div
						key={stat.keyword}
						className="flex items-center gap-1.5"
					>
						<span
							className="size-2.5 rounded-full"
							style={{ backgroundColor: stat.color }}
						/>
						<span className="text-caption-2 font-medium text-label-neutral">
							{stat.keyword} {stat.percentage}%
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
