import { useParams } from "react-router-dom"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, BarChart } from "@/components/charts"
import type { ChartData, ChartConfig } from "@/types/chart"

export function RegionResultPage() {
  const { regionId } = useParams()

  // Mock 데이터: 연도별 인구 추이
  const trendData: ChartData = [
    { year: '2019', population: 50000, nationalAvg: 48000 },
    { year: '2020', population: 51000, nationalAvg: 49000 },
    { year: '2021', population: 52000, nationalAvg: 50000 },
    { year: '2022', population: 53000, nationalAvg: 51000 },
    { year: '2023', population: 54000, nationalAvg: 52000 },
  ]

  const trendConfig: ChartConfig = {
    xKey: 'year',
    series: [
      { key: 'population', label: '우리 지역', color: '#3b82f6' },
      {
        key: 'nationalAvg',
        label: '전국 평균',
        color: '#10b981',
        strokeDasharray: '5 5', // 점선
      },
    ],
    xLabel: '연도',
    yLabel: '인구 (명)',
    height: 400,
  }

  const trendValueFormatter = (value: number | string | undefined) => {
    if (value === undefined) return ''
    return `${Number(value).toLocaleString()}명`
  }

  // Mock 데이터: 인접 지역 비교
  const comparisonData: ChartData = [
    { region: '우리 지역', 민원건수: 120, 예산: 500 },
    { region: 'A 지역', 민원건수: 100, 예산: 450 },
    { region: 'B 지역', 민원건수: 110, 예산: 480 },
    { region: 'C 지역', 민원건수: 130, 예산: 520 },
  ]

  const comparisonConfig: ChartConfig = {
    xKey: 'region',
    series: [
      { key: '민원건수', label: '민원 건수 (건)', color: '#3b82f6' },
      { key: '예산', label: '예산 (억원)', color: '#10b981' },
    ],
    xLabel: '지역',
    yLabel: '수치',
    height: 350,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">지역분석 결과</h1>
        <p className="text-muted-foreground">
          지역 ID: {regionId}
        </p>
      </div>

      {/* 연도별 추이 섹션 (LineChart) */}
      <Card>
        <CardHeader>
          <CardTitle>인구 추이</CardTitle>
          <CardDescription>
            최근 5년간 우리 지역의 인구 변화를 전국 평균과 비교합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={trendData}
            config={trendConfig}
            valueFormatter={trendValueFormatter}
          />
        </CardContent>
      </Card>

      {/* 인접 지역 비교 섹션 (BarChart) */}
      <Card>
        <CardHeader>
          <CardTitle>인접 지역 비교</CardTitle>
          <CardDescription>
            우리 지역과 인접 지역의 주요 지표를 비교합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={comparisonData}
            config={comparisonConfig}
          />
        </CardContent>
      </Card>

      {/* TODO: CurrentStatusSection 추가 */}
    </div>
  )
}
