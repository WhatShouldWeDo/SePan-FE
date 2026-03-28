import { MapPin } from "lucide-react";

import {
  CATEGORIES,
  type CategoryItem,
} from "@/features/region/data/categories";

interface RegionInfoBarProps {
  name: string;
  updatedAt: string;
  characteristics: { categoryId: string; label: string }[];
}

export function RegionInfoBar({
  name,
  updatedAt,
  characteristics,
}: RegionInfoBarProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[24px] bg-cool-neutral-5 p-8">
      {/* 선거구명 + 업데이트 시간 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-primary" />
          <span className="text-title-2 font-bold text-primary">{name}</span>
        </div>
        <span className="text-label-3 font-semibold text-label-alternative">
          {updatedAt} 업데이트
        </span>
      </div>

      {/* 지역 특성 뱃지 */}
      <div className="flex flex-wrap gap-3">
        {characteristics.map((char) => {
          const category = CATEGORIES.find(
            (c: CategoryItem) => c.id === char.categoryId
          );
          return (
            <div
              key={char.categoryId}
              className="flex items-center gap-2 rounded-[8px] px-3 py-2"
              style={{ backgroundColor: `${category?.iconColor ?? "#888"}1A` }}
            >
              {category?.iconAsset && (
                <span
                  className="inline-block size-4 shrink-0"
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
              <span className="text-label-4 font-medium text-label-normal">
                {char.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
