import { CardSection } from "@/features/dashboard/components/CardSection"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import { CircleInfoFill } from "@/components/icons"
import { PledgeDonutChart } from "./PledgeDonutChart"
import type { PledgeKeywordStat } from "../data/mock-candidate-detail"

interface CategoryDistributionCardProps {
  stats: PledgeKeywordStat[]
}

export function CategoryDistributionCard({ stats }: CategoryDistributionCardProps) {
  return (
    <CardSection>
      <CardSectionHeader
        title="카테고리 분포"
        trailingContent={
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full text-label-alternative hover:bg-fill-alt"
            aria-label="카테고리 분포 정보"
          >
            <CircleInfoFill className="size-5" />
          </button>
        }
      />
      <PledgeDonutChart stats={stats} />
    </CardSection>
  )
}
