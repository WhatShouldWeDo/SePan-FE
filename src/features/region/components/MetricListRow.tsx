import { cn } from "@/lib/utils";
import { WantedCaretUp } from "@/components/icons";

/* ─── Types ─── */

interface DeltaInfo {
	/** 델타 라벨 (예: "전년대비", "전국평균 대비") */
	label: string;
	/** 델타 값 (예: "4.5%", "6.1세") */
	value: string;
	/** 방향: up = 증가, down = 감소 */
	direction: "up" | "down";
	/** 색상: blue = dpk(민주당), red = ppp(국민의힘) */
	color: "blue" | "red";
}

interface MetricListRowProps {
	/** 지표명 (예: "인구수", "중위연령") */
	label: string;
	/** 주요 값 (예: "207,018") */
	value: string;
	/** 단위 (예: "명", "세") — 없으면 단위 숨김 */
	unit?: string;
	/** 서브 뱃지 값 (예: "50.7%") — 초록 뱃지로 표시 */
	subValueBadge?: string;
	/** 우측 델타 정보 (최대 2개) */
	deltas?: DeltaInfo[];
	className?: string;
}

/* ─── Delta sub-component ─── */

const DELTA_COLOR = {
	blue: "text-party-dpk",
	red: "text-party-ppp",
} as const;

function DeltaDisplay({ label, value, direction, color }: DeltaInfo) {
	return (
		<div className="flex items-center gap-1 pt-2">
			<span
				className={cn(
					"text-label-4 font-semibold leading-[1.3]",
					DELTA_COLOR[color],
				)}
			>
				{label}
			</span>
			<div className="flex items-end">
				<WantedCaretUp
					className={cn(
						"size-4",
						DELTA_COLOR[color],
						direction === "down" && "rotate-180",
					)}
				/>
				<span
					className={cn(
						"text-label-4 font-semibold leading-[1.3]",
						DELTA_COLOR[color],
					)}
				>
					{value}
				</span>
			</div>
		</div>
	);
}

/* ─── MetricListRow ─── */

function MetricListRow({
	label,
	value,
	unit,
	subValueBadge,
	deltas,
	className,
}: MetricListRowProps) {
	return (
		<div className={cn("relative rounded-2xl", className)}>
			<div className="flex flex-col gap-1 py-3">
				{/* Label */}
				<span className="text-label-4 font-semibold leading-[1.3] text-label-alternative">
					{label}
				</span>

				{/* Body */}
				<div className="flex flex-wrap items-center justify-between gap-y-1">
					{/* Leading: value + unit + subValue badge */}
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-title-3 font-bold leading-[1.4] text-label-normal">
							{value}
							{unit && (
								<>
									{" "}
									<span>{unit}</span>
								</>
							)}
						</span>
						{subValueBadge && (
							<span className="relative mt-2 inline-flex items-center rounded-lg px-2 py-[5px] text-label-3 font-semibold leading-[1.3] text-status-positive">
								<span className="absolute inset-0 rounded-lg bg-status-positive opacity-[0.08]" />
								<span className="relative">{subValueBadge}</span>
							</span>
						)}
					</div>

					{/* Trailing: deltas */}
					{deltas && deltas.length > 0 && (
						<div className="flex flex-wrap items-center gap-4">
							{deltas.map((delta) => (
								<DeltaDisplay key={delta.label} {...delta} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export { MetricListRow, DeltaDisplay };
export type { MetricListRowProps, DeltaInfo };
