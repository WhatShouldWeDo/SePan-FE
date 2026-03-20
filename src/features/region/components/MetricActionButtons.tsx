// src/features/region/components/MetricActionButtons.tsx
import { Button } from "@/components/ui/button";

interface MetricActionButtonsProps {
	/** "분석 결과 보기"를 보여줄지 (preview 모드에서만 true) */
	showAnalysis: boolean;
	onAnalysisClick: () => void;
}

export function MetricActionButtons({
	showAnalysis,
	onAnalysisClick,
}: MetricActionButtonsProps) {
	return (
		<div className="flex gap-3">
			{showAnalysis && (
				<Button variant="default" size="lg" className="w-full" onClick={onAnalysisClick}>
					<span className="truncate">분석 결과 보기</span>
				</Button>
			)}
		</div>
	);
}
