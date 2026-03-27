import { ChevronRight } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Cell,
} from "recharts";

import { CardSectionHeader } from "@/components/ui/card-section-header";
import { PressOverlay } from "@/components/ui/press-overlay";
import type { BenchmarkCategory } from "@/features/policy/data/mock-policy";

interface BenchmarkSectionProps {
	data: BenchmarkCategory[];
}

const MAX_VALUE = 120;

export function BenchmarkSection({ data }: BenchmarkSectionProps) {
	const chartData = data.map((d) => ({
		...d,
		background: MAX_VALUE - d.value,
	}));

	return (
		<div className="flex flex-1 flex-col gap-4 rounded-[24px] border border-line-neutral bg-white px-8 pb-6 pt-8">
			{/* 헤더 */}
			<CardSectionHeader
				title="역대 공약 벤치마킹"
				description={`지난 4년간 우리 지역구 당선자들의 공약 트렌드와\n이행률이 높았던 성공 사례를 분석해보세요.`}
			/>

			{/* 바 차트 */}
			<div className="pb-4">
				<ResponsiveContainer width="100%" height={136}>
					<BarChart data={chartData} barCategoryGap="12%">
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 12, fill: "#374151" }}
						/>
						<YAxis hide domain={[0, MAX_VALUE]} />
						{/* 데이터 바 (하단) — radius 없음, 상단은 background 바가 담당 */}
						<Bar
							dataKey="value"
							stackId="stack"
							isAnimationActive={false}
						>
							{chartData.map((entry) => (
								<Cell
									key={entry.name}
									fill={
										entry.isHighlighted
											? "url(#highlightGradient)"
											: "url(#normalGradient)"
									}
									stroke={
										entry.isHighlighted
											? "#2388ff"
											: "#8dc1ff"
									}
									strokeWidth={
										entry.isHighlighted ? 1 : 0.6
									}
								/>
							))}
						</Bar>
						{/* 배경 바 (상단) — top radius만 적용 */}
						<Bar
							dataKey="background"
							stackId="stack"
							radius={[8, 8, 0, 0]}
							fill="#e3efff"
							fillOpacity={0.51}
							isAnimationActive={false}
						/>
						<defs>
							<linearGradient
								id="normalGradient"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop offset="0%" stopColor="#c3ddff" />
								<stop offset="100%" stopColor="#8dc1ff" />
							</linearGradient>
							<linearGradient
								id="highlightGradient"
								x1="0.3"
								y1="0"
								x2="0.7"
								y2="1"
							>
								<stop offset="2%" stopColor="#4e9fff" />
								<stop offset="98%" stopColor="#2388ff" />
							</linearGradient>
						</defs>
					</BarChart>
				</ResponsiveContainer>
			</div>

			{/* 하단 링크 */}
			<div className="flex flex-col gap-5">
				<div className="h-px bg-line-neutral" />
				<button
					type="button"
					className="group relative inline-flex items-center gap-1 self-start rounded-3xl py-1"
				>
					<span className="text-label-2 font-semibold text-primary">
						역대 공약 분석하기
					</span>
					<ChevronRight className="size-5 text-primary" />
					<PressOverlay className="-inset-x-[7px] inset-y-0 rounded-lg" />
				</button>
			</div>
		</div>
	);
}
