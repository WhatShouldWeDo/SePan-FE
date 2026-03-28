import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardSectionHeader } from "@/components/ui/card-section-header";
import { PressOverlay } from "@/components/ui/press-overlay";
import { WantedMagicWand } from "@/components/icons";
import type { AiRecommendation } from "@/features/policy/data/mock-policy";

interface AiRecommendationSectionProps {
	recommendations: AiRecommendation[];
	updateCount?: number;
}

export function AiRecommendationSection({
	recommendations,
	updateCount = 3,
}: AiRecommendationSectionProps) {
	const navigate = useNavigate();
	return (
		<div className="flex flex-1 flex-col gap-4 rounded-[24px] border border-line-neutral bg-white px-8 pb-6 pt-8">
			{/* 헤더 */}
			<CardSectionHeader
				title="AI 공약 추천"
				description={`강남구의 '소상공인' 및 '교통' 이슈 데이터를 분석하여\n승리 가능성이 높은 공약 ${updateCount}건을 도출했습니다.`}
				trailingContent={
					<Badge
						className="rounded-[6px] border-0 bg-status-cautionary/8 text-status-cautionary"
						size="lg"
					>
						업데이트 {updateCount}건
					</Badge>
				}
			/>

			{/* 추천 공약 목록 */}
			<div className="flex flex-col">
				{recommendations.map((item) => (
					<div
						key={item.id}
						className="group relative flex items-center gap-5 py-5"
					>
						<WantedMagicWand className="size-6 shrink-0 text-label-alternative" />
						<span className="flex-1 text-title-2 font-bold text-label-normal">
							{item.title}
						</span>
						<Badge
							className="rounded-[6px] border-0 bg-primary/8 text-primary"
							size="lg"
						>
							{item.matchRate}% Match
						</Badge>
						<PressOverlay className="-inset-x-5 inset-y-0 rounded-[20px]" />
					</div>
				))}
			</div>

			{/* 하단 링크 */}
			<div className="mt-auto flex flex-col gap-5">
				<div className="h-px bg-line-neutral" />
				<button
					type="button"
					className="group relative inline-flex items-center gap-1 self-start rounded-3xl py-1"
					onClick={() => navigate("/policy/recommendations")}
				>
					<span className="text-label-2 font-semibold text-primary">
						추천 공약 전체보기
					</span>
					<ChevronRight className="size-5 text-primary" />
					<PressOverlay className="-inset-x-[7px] inset-y-0 rounded-lg" />
				</button>
			</div>
		</div>
	);
}
