import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WantedMagicWand, CircleCheckFill } from "@/components/icons";
import {
  CATEGORIES,
  type CategoryItem,
} from "@/features/region/data/categories";
import type { AiRecommendationDetail } from "@/features/policy/data/mock-policy";

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
  const category = CATEGORIES.find(
    (c: CategoryItem) => c.id === recommendation.categoryId
  );

  return (
    <div className="flex flex-col gap-5 rounded-[24px] border border-line-neutral bg-white p-8">
      <div className="flex items-start gap-5">
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${category?.iconColor ?? "#888"}1A` }}
        >
          {category?.iconAsset && (
            <span
              className="inline-block size-8"
              style={{
                backgroundColor: category.iconColor,
                maskImage: `url('${category.iconAsset}')`,
                maskMode: "luminance",
                maskSize: "contain",
                maskPosition: "center",
                maskRepeat: "no-repeat",
                WebkitMaskImage: `url('${category.iconAsset}')`,
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
              }}
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-title-1 font-bold text-label-normal">
              {recommendation.title}
            </h3>
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
              const tagCategory = CATEGORIES.find(
                (c: CategoryItem) => c.id === tag.categoryId
              );
              return (
                <Badge
                  key={tag.categoryId}
                  size="lg"
                  className="rounded-[6px] border-0"
                  style={{
                    backgroundColor: `${tagCategory?.iconColor ?? "#888"}1A`,
                    color: tagCategory?.iconColor ?? "#888",
                  }}
                >
                  {tag.label}
                </Badge>
              );
            })}
          </div>
        </div>

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

      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3 rounded-2xl bg-primary/8 px-4 py-3">
          <WantedMagicWand className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-body-2 text-primary">{recommendation.aiInsight}</p>
        </div>
        <div className="flex items-start gap-3 rounded-2xl bg-fill-normal px-4 py-3">
          <CircleCheckFill className="mt-0.5 size-4 shrink-0 text-label-alternative" />
          <p className="text-body-2 text-label-normal">
            {recommendation.expectedEffect}
          </p>
        </div>
      </div>
    </div>
  );
}
