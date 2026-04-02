import { Button } from "@/components/ui/button";
import type { AiRecommendationDetail } from "@/features/policy/data/mock-policy";
import { RecommendationMeta, RecommendationInsightBoxes } from "./recommendation-shared";

interface RecommendationCardProps {
  recommendation: AiRecommendationDetail;
  onViewDetail: (id: string) => void;
  onAdopt: (id: string) => void;
}

export function RecommendationCard({
  recommendation,
  onViewDetail,
  onAdopt,
}: RecommendationCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[24px] border border-line-neutral bg-white p-8">
      <div className="flex items-start gap-5">
        <RecommendationMeta recommendation={recommendation} />
        <div className="flex shrink-0 items-center gap-3">
          <Button
            variant="outline"
            className="border-line-neutral"
            onClick={() => onViewDetail(recommendation.id)}
          >
            상세보기
          </Button>
          {!recommendation.isAdopted && (
            <Button onClick={() => onAdopt(recommendation.id)}>
              채택하기
            </Button>
          )}
        </div>
      </div>

      <RecommendationInsightBoxes recommendation={recommendation} />
    </div>
  );
}
