import type { LegendItem } from "@/types/map";

interface MapLegendProps {
	/** 범례 제목 */
	title: string;
	/** 범례 항목들 */
	items: LegendItem[];
}

/**
 * Choropleth 지도 범례 컴포넌트
 *
 * @description
 * - 지도 우하단에 오버레이로 표시
 * - 색상 블록 + 라벨 구조
 * - min-h 44px 텍스트 가독성 (CLAUDE.md 4-1)
 * - Phase 3-C
 */
export function MapLegend({ title, items }: MapLegendProps) {
	if (items.length === 0) return null;

	return (
		<div className="rounded-lg border border-border bg-background/90 px-3 py-2 shadow-sm backdrop-blur-sm">
			<p className="mb-1.5 text-sm font-medium text-foreground">
				{title}
			</p>
			<div className="flex flex-col gap-1">
				{items.map((item) => (
					<div
						key={item.label}
						className="flex items-center gap-2"
					>
						<span
							className="inline-block h-3.5 w-5 shrink-0 rounded-sm border border-border/50"
							style={{ backgroundColor: item.color }}
							aria-hidden="true"
						/>
						<span className="text-xs text-muted-foreground">
							{item.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
