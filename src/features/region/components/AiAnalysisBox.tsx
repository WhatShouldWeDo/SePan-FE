import { WantedMagicWand } from "@/components/icons";
import { cn } from "@/lib/utils";

interface AiAnalysisBoxProps {
	/** AI 분석 라벨 (예: "기본 분석 결과") */
	label?: string;
	/** 분석 텍스트 */
	text: string;
	className?: string;
}

function AiAnalysisBox({
	label = "기본 분석 결과",
	text,
	className,
}: AiAnalysisBoxProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-3 rounded-2xl bg-primary-alpha-5 px-6 py-6",
				className,
			)}
		>
			{/* Label */}
			<div className="flex items-center gap-2">
				<WantedMagicWand className="size-6 text-primary" />
				<span className="text-label-3 font-semibold leading-[1.3] text-primary">
					{label}
				</span>
			</div>

			{/* Content */}
			<p className="text-body-1 font-medium leading-[1.5] text-label-normal">
				{text}
			</p>
		</div>
	);
}

export { AiAnalysisBox };
export type { AiAnalysisBoxProps };
