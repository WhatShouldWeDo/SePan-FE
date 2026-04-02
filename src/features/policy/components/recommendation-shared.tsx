// 공유 서브컴포넌트: RecommendationCard와 RecommendationDetailModal에서 공통 사용
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/ui/category-icon";
import { WantedMagicWand, CircleCheckFill } from "@/components/icons";
import {
  CATEGORIES,
  type CategoryItem,
} from "@/features/region/data/categories";
import type { AiRecommendationDetail } from "@/features/policy/data/mock-policy";

/** 카테고리 아이콘 + 제목 + Match 뱃지 + 지역/태그 뱃지 */
export function RecommendationMeta({
  recommendation,
  titleElement,
}: {
  recommendation: AiRecommendationDetail;
  /** Card는 <h3>, Modal은 <DialogTitle>로 감싸야 하므로 외부에서 전달 */
  titleElement?: React.ReactNode;
}) {
  const category = CATEGORIES.find(
    (c: CategoryItem) => c.id === recommendation.categoryId,
  );

  return (
    <div className="flex items-start gap-5">
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
          {titleElement ?? (
            <h3 className="text-title-1 font-bold text-label-normal">
              {recommendation.title}
            </h3>
          )}
          <Badge
            size="lg"
            className="shrink-0 rounded-[6px] border-0 bg-primary/8 text-primary"
          >
            <WantedMagicWand className="mr-1 size-3.5" />
            {recommendation.matchRate}% Match
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            size="lg"
            className="rounded-[6px] border-0 bg-primary/8 text-primary"
          >
            <MapPin className="mr-1 size-3" />
            {recommendation.region}
          </Badge>
          {recommendation.tags.map((tag) => {
            const tagCategory = CATEGORIES.find(
              (c: CategoryItem) => c.id === tag.categoryId,
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
    </div>
  );
}

/** AI 인사이트 + 기대 효과 박스 */
export function RecommendationInsightBoxes({
  recommendation,
}: {
  recommendation: AiRecommendationDetail;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3 rounded-[12px] bg-primary/8 px-4 py-3">
        <WantedMagicWand className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-body-2 text-primary">{recommendation.aiInsight}</p>
      </div>
      <div className="flex items-start gap-3 rounded-[12px] bg-fill-normal px-4 py-3">
        <CircleCheckFill className="mt-0.5 size-4 shrink-0 text-label-alternative" />
        <p className="text-body-2 text-label-normal">
          {recommendation.expectedEffect}
        </p>
      </div>
    </div>
  );
}
