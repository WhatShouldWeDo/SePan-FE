import { CardSection } from "@/features/dashboard/components/CardSection"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import { Badge } from "@/components/ui/badge"
import { WantedCaretUp, WantedFillMessage } from "@/components/icons"
import { cn } from "@/lib/utils"
import type {
  PledgeMetricsData,
  MetricItem,
  MetricInsightItem,
} from "../data/mock-local-statistics"

const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  message: WantedFillMessage,
}

interface PledgeMetricsCardProps {
  data: PledgeMetricsData
}

export function PledgeMetricsCard({ data }: PledgeMetricsCardProps) {
  return (
    <CardSection>
      <CardSectionHeader
        title={data.title}
        description={data.description}
        trailingContent={
          <button
            type="button"
            className="rounded-xl border border-line-neutral px-5 py-3 text-label-3 font-semibold text-label-normal"
            onClick={() => {}}
          >
            버튼
          </button>
        }
      />

      <div className="flex flex-col gap-6">
        {/* 메트릭 2x2 그리드 */}
        <div className="flex flex-col gap-4 py-4">
          {Array.from(
            { length: Math.ceil(data.metrics.length / 2) },
            (_, rowIdx) => (
              <div key={rowIdx} className="flex gap-8">
                {data.metrics.slice(rowIdx * 2, rowIdx * 2 + 2).map((metric, colIdx) => (
                  <MetricCell key={colIdx} metric={metric} />
                ))}
              </div>
            ),
          )}
        </div>

        {/* 인사이트 행 목록 */}
        <div className="flex flex-col gap-2">
          {data.insights.map((insight, index) => (
            <InsightRow key={index} insight={insight} />
          ))}
        </div>
      </div>
    </CardSection>
  )
}

function MetricCell({ metric }: { metric: MetricItem }) {
  return (
    <div className="flex flex-1 flex-col gap-1 px-2">
      <span className="text-label-3 font-semibold text-label-alternative">
        {metric.label}
      </span>
      <div className="flex min-h-[31px] items-center gap-2">
        <span className="text-title-1 font-bold text-label-normal">
          {metric.value}
        </span>
        {metric.trailing.type === "badge" ? (
          <Badge className={cn("rounded-md", metric.trailing.className)}>
            {metric.trailing.text}
          </Badge>
        ) : (
          <span className="inline-flex items-center gap-1 pt-1 text-label-4 font-semibold text-status-negative">
            {metric.trailing.label}
            <WantedCaretUp
              className={cn("size-5", !metric.trailing.isPositive && "rotate-180")}
              aria-hidden="true"
            />
            {metric.trailing.value}
          </span>
        )}
      </div>
    </div>
  )
}

function InsightRow({ insight }: { insight: MetricInsightItem }) {
  const IconComponent = ICON_MAP[insight.iconName] ?? WantedFillMessage

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-fill-alt p-4">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          insight.iconBgColor,
        )}
      >
        <IconComponent className="size-8 text-white" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-label-4 font-semibold text-label-alternative">
          {insight.label}
        </span>
        <span className="truncate text-title-4 font-bold text-label-normal">
          {insight.value}
        </span>
      </div>
      <span className={cn("shrink-0 text-title-4 font-bold", insight.trailingColor)}>
        {insight.trailingText}
      </span>
    </div>
  )
}
