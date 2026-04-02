import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CategoryIcon } from "@/components/ui/category-icon";
import { WantedMagicWand, CircleCheckFill } from "@/components/icons";
import {
  CATEGORIES,
  type CategoryItem,
} from "@/features/region/data/categories";
import type { AiRecommendationDetail } from "@/features/policy/data/mock-policy";

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
  const category = recommendation
    ? CATEGORIES.find((c: CategoryItem) => c.id === recommendation.categoryId)
    : null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {recommendation && (
        <DialogContent className="flex max-h-[85vh] flex-col gap-6 overflow-y-auto p-8 sm:max-w-2xl">
          <DialogHeader className="flex-row items-start gap-5">
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-[12px]"
              style={{ backgroundColor: `${category?.iconColor ?? "#888"}1A` }}
            >
              {category?.iconAsset && (
                <CategoryIcon
                  iconUrl={category.iconAsset}
                  color={category.iconColor}
                  size="md"
                  className="size-8"
                />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-title-1 font-bold text-label-normal">
                  {recommendation.title}
                </DialogTitle>
                <Badge size="lg" className="shrink-0 rounded-[6px] border-0 bg-primary/8 text-primary">
                  <WantedMagicWand className="mr-1 size-3.5" />
                  {recommendation.matchRate}% Match
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="lg" className="rounded-[6px] border-0 bg-primary/8 text-primary">
                  <MapPin className="mr-1 size-3" />
                  {recommendation.region}
                </Badge>
                {recommendation.tags.map((tag) => {
                  const tagCat = CATEGORIES.find(
                    (c: CategoryItem) => c.id === tag.categoryId
                  );
                  return (
                    <Badge
                      key={tag.categoryId}
                      size="lg"
                      className="rounded-[6px] border-0"
                      style={{
                        backgroundColor: `${tagCat?.iconColor ?? "#888"}1A`,
                        color: tagCat?.iconColor ?? "#888",
                      }}
                    >
                      {tag.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </DialogHeader>

          <DialogDescription className="sr-only">
            추천 공약 상세 정보
          </DialogDescription>

          <p className="text-body-1 leading-relaxed text-label-normal">
            {recommendation.description}
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 rounded-[12px] bg-primary/8 px-4 py-3">
              <WantedMagicWand className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-body-2 text-primary">
                {recommendation.aiInsight}
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-[12px] bg-fill-normal px-4 py-3">
              <CircleCheckFill className="mt-0.5 size-4 shrink-0 text-label-alternative" />
              <p className="text-body-2 text-label-normal">
                {recommendation.expectedEffect}
              </p>
            </div>
          </div>

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
