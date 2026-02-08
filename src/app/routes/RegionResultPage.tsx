import { useParams } from "react-router-dom"

export function RegionResultPage() {
  const { regionId } = useParams()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">지역분석 결과</h1>
      <p className="text-muted-foreground">
        지역 ID: {regionId}
      </p>
      {/* TODO: CurrentStatusSection, TrendChart, AdjacentComparisonSection 추가 */}
    </div>
  )
}
