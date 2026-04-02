import { CardSection } from "@/features/dashboard/components/CardSection"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import { Banner } from "@/components/ui/banner"
import { Badge } from "@/components/ui/badge"
import {
  WantedCaretUp,
  WantedFillMessage,
  WantedFillMegaphone,
  WantedFillTriangleExclamation,
  CircleInfoFill,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import type { PledgeInsightData, PledgeInsightItem } from "../data/mock-local-statistics"

const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  message: WantedFillMessage,
  warning: WantedFillTriangleExclamation,
  megaphone: WantedFillMegaphone,
  info: CircleInfoFill,
}

interface PledgeInsightCardProps {
  data: PledgeInsightData
}

export function PledgeInsightCard({ data }: PledgeInsightCardProps) {
  return (
    <CardSection>
      <CardSectionHeader
        title="민원 현황"
        description="선거구 민원 인사이트"
        trailingContent={
          <button
            type="button"
            className="flex items-center gap-1 text-label-3 font-semibold text-label-normal"
            disabled
            title="준비 중"
          >
            바로가기
            <span aria-hidden="true">&gt;</span>
          </button>
        }
      />

      <div className="flex flex-col gap-4">
        <Banner
          variant="notice"
          action={
            <button
              type="button"
              className="whitespace-nowrap text-label-4 font-semibold text-primary"
              disabled
              title="준비 중"
            >
              {data.bannerActionLabel} &gt;
            </button>
          }
        >
          {data.bannerMessage}
        </Banner>

        <div className="grid grid-cols-2 gap-2">
          {data.items.map((item, index) => (
            <InsightGridItem key={index} item={item} />
          ))}
        </div>
      </div>
    </CardSection>
  )
}

function InsightGridItem({ item }: { item: PledgeInsightItem }) {
  const IconComponent = ICON_MAP[item.iconName] ?? WantedFillMessage

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line-neutral p-4">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          item.iconBgColor,
        )}
      >
        <IconComponent className="size-6 text-white" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-label-4 font-semibold text-label-alternative">
          {item.label}
        </span>
        <span className="truncate text-title-4 font-bold text-label-normal">
          {item.value}
        </span>
      </div>
      <div className="shrink-0">
        {item.trailing.type === "badge" ? (
          <Badge className={item.trailing.className}>{item.trailing.text}</Badge>
        ) : (
          <span className={cn("inline-flex items-center gap-0.5 text-label-4 font-semibold", item.trailing.isPositive ? "text-status-positive" : "text-status-negative")}>
            {item.trailing.label}
            <WantedCaretUp
              className={cn("size-4", !item.trailing.isPositive && "rotate-180")}
              aria-hidden="true"
            />
            {item.trailing.value}
          </span>
        )}
      </div>
    </div>
  )
}
