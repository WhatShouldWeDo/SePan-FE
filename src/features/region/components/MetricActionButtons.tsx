// src/features/region/components/MetricActionButtons.tsx
import { Button } from "@/components/ui/button";

interface MetricActionButtonsProps {
	/** "분석 결과 보기"를 보여줄지 (preview 모드에서만 true) */
	showAnalysis: boolean;
	onAnalysisClick: () => void;
	onCompareClick: () => void;
}

export function MetricActionButtons({
	showAnalysis,
	onAnalysisClick,
	onCompareClick,
}: MetricActionButtonsProps) {
	return (
		<div className="flex gap-3">
			{showAnalysis && (
				<Button variant="default" size="lg" className="flex-1" onClick={onAnalysisClick}>
					분석 결과 보기
				</Button>
			)}
			<Button
				variant="outline"
				size="lg"
				className={showAnalysis ? "flex-1" : "w-full"}
				onClick={onCompareClick}
			>
				내 선거구와 비교분석 하기
			</Button>
		</div>
	);
}
