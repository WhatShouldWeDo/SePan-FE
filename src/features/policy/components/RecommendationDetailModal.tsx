import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { AiRecommendationDetail } from "@/features/policy/data/mock-policy";
import { RecommendationMeta, RecommendationInsightBoxes } from "./recommendation-shared";

interface RecommendationDetailModalProps {
  recommendation: AiRecommendationDetail | null;
  open: boolean;
  onClose: () => void;
  onAdopt: (id: string) => void;
}

export function RecommendationDetailModal({
  recommendation,
  open,
  onClose,
  onAdopt,
}: RecommendationDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {recommendation && (
        <DialogContent className="flex max-h-[85vh] flex-col gap-6 overflow-y-auto p-8 sm:max-w-2xl">
          <DialogHeader className="flex-row items-start gap-5">
            <RecommendationMeta
              recommendation={recommendation}
              titleElement={
                <DialogTitle className="text-title-1 font-bold text-label-normal">
                  {recommendation.title}
                </DialogTitle>
              }
            />
          </DialogHeader>

          <DialogDescription className="sr-only">
            추천 공약 상세 정보
          </DialogDescription>

          <p className="text-body-1 leading-relaxed text-label-normal">
            {recommendation.description}
          </p>

          <RecommendationInsightBoxes recommendation={recommendation} />

          <DialogFooter>
            {recommendation.isAdopted ? (
              <Button disabled>채택 완료</Button>
            ) : (
              <Button onClick={() => onAdopt(recommendation.id)}>
                채택하기
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
