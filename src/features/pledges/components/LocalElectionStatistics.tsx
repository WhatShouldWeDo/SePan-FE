import { MOCK_LOCAL_STATISTICS } from "../data/mock-local-statistics"
import { CategoryDistributionCard } from "./CategoryDistributionCard"
import { PledgeInsightCard } from "./PledgeInsightCard"
import { PledgeMetricsCard } from "./PledgeMetricsCard"
import { PartyPledgeComparisonCard } from "./PartyPledgeComparisonCard"

interface LocalElectionStatisticsProps {
  term: number | null
  electionType: string | null
  sido: string | null
}

export function LocalElectionStatistics({
  term: _term,
  electionType: _electionType,
  sido: _sido,
}: LocalElectionStatisticsProps) {
  // MVP: Mock 데이터 사용. 향후 API 연동 시 useLocalElectionStatistics(filters) 훅으로 전환.
  const data = MOCK_LOCAL_STATISTICS

  return (
    <div className="flex flex-col gap-4">
      {/* 섹션 1: 카테고리 분포 + 민원 인사이트 (나란히) */}
      <div className="flex gap-4">
        <div className="w-[36%] shrink-0">
          <CategoryDistributionCard stats={data.categoryDistribution} />
        </div>
        <div className="min-w-0 flex-1">
          <PledgeInsightCard data={data.pledgeInsight} />
        </div>
      </div>

      {/* 섹션 2: 주요 지표 */}
      <PledgeMetricsCard data={data.pledgeMetrics} />

      {/* 섹션 3: 정당별 공약 비교 */}
      <PartyPledgeComparisonCard data={data.partyComparison} />
    </div>
  )
}
