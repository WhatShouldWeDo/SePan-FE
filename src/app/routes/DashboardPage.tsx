import { useState, useEffect } from 'react'
import {
  DashboardCardSkeleton,
  ChartCardSkeleton,
  StatCardSkeleton,
} from '@/components/DashboardCardSkeleton'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { DdayBadge } from '@/components/DdayBadge'

export function DashboardPage() {
  // 로딩 상태 시뮬레이션 (실제로는 React Query useQuery의 isLoading 사용)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 2초 후 로딩 완료 (실제 데이터 fetch 시뮬레이션)
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground mt-2">
          캠프의 현재 상태를 한눈에 파악하세요
        </p>
      </div>

      {isLoading ? (
        // 로딩 중: Skeleton 표시
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <ChartCardSkeleton />
        </div>
      ) : (
        // 로딩 완료: 실제 콘텐츠 표시
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                선거일
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <DdayBadge electionDate="2026-04-01" />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                2026년 4월 1일
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                확정 공약
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12개</div>
              <p className="text-xs text-muted-foreground mt-1">
                작성중 5개
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                주요 민원 지역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">강남구</div>
              <p className="text-xs text-muted-foreground mt-1">
                교통 관련 +15%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>지역분석 요약</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                최근 분석 결과
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• 인구 증가율: 전국 평균 대비 +2.3%</p>
                <p>• 주요 민원: 교통 (35%), 환경 (28%)</p>
                <p>• 예산 집행률: 82%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>정책개발 현황</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                진행 상태
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• 확정: 12개</p>
                <p>• 작성중: 5개</p>
                <p>• AI 추천: 3개</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>지역 비교 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">차트 영역</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
