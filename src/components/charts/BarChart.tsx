import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartCardSkeleton } from '@/components/DashboardCardSkeleton'
import type { ChartData, ChartConfig, ChartFormatter } from '@/types/chart'
import { getChartColor } from '@/lib/chart-theme'

export interface BarChartProps {
  /** 차트 데이터 */
  data: ChartData
  /** 차트 설정 */
  config: ChartConfig
  /** 수평 방향 여부 (기본값: false - 수직) */
  horizontal?: boolean
  /** 로딩 상태 */
  isLoading?: boolean
  /** 값 포맷 함수 (툴팁, 축 레이블) */
  valueFormatter?: ChartFormatter
  /** 커스텀 className */
  className?: string
}

/**
 * BarChart 컴포넌트
 *
 * @description
 * Recharts를 래핑한 바 차트 컴포넌트
 * - 수평/수직 방향 전환 지원
 * - 다중 바 지원 (그룹 비교)
 * - 툴팁, 범례, 그리드 자동 표시
 * - 반응형 컨테이너
 * - 로딩/에러 상태 처리
 *
 * @example
 * ```tsx
 * const data = [
 *   { region: '우리 지역', value1: 120, value2: 500 },
 *   { region: 'A 지역', value1: 100, value2: 450 },
 * ]
 *
 * const config = {
 *   xKey: 'region',
 *   series: [
 *     { key: 'value1', label: '민원 건수', color: '#3b82f6' },
 *     { key: 'value2', label: '예산', color: '#10b981' },
 *   ],
 *   xLabel: '지역',
 *   yLabel: '수치',
 * }
 *
 * <BarChart data={data} config={config} />
 * <BarChart data={data} config={config} horizontal={true} />
 * ```
 */
export function BarChart({
  data,
  config,
  horizontal = false,
  isLoading = false,
  valueFormatter,
  className,
}: BarChartProps) {
  // 로딩 상태
  if (isLoading) {
    return <ChartCardSkeleton />
  }

  // 빈 데이터 처리
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        데이터가 없습니다
      </div>
    )
  }

  const {
    xKey,
    series,
    xLabel,
    yLabel,
    height = 400,
    showTooltip = true,
    showLegend = true,
    showGrid = true,
  } = config

  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <RechartsBarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'}>
        {/* 그리드 */}
        {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}

        {/* 축 (수평/수직 모드에 따라 역할 전환) */}
        {horizontal ? (
          <>
            {/* 수평 모드: X축=숫자, Y축=카테고리 */}
            <XAxis
              type="number"
              tick={{ fontSize: 14 }}
              tickFormatter={valueFormatter}
              label={yLabel ? { value: yLabel, position: 'insideBottom', offset: -5 } : undefined}
            />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={{ fontSize: 14 }}
              label={xLabel ? { value: xLabel, angle: -90, position: 'insideLeft' } : undefined}
            />
          </>
        ) : (
          <>
            {/* 수직 모드: X축=카테고리, Y축=숫자 */}
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 14 }}
              label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -5 } : undefined}
            />
            <YAxis
              tick={{ fontSize: 14 }}
              tickFormatter={valueFormatter}
              label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft' } : undefined}
            />
          </>
        )}

        {/* 툴팁 */}
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
            }}
            formatter={valueFormatter}
          />
        )}

        {/* 범례 */}
        {showLegend && <Legend wrapperStyle={{ fontSize: '14px' }} />}

        {/* 바 시리즈 */}
        {series.map((s, idx) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={s.color || getChartColor(idx)}
            radius={[4, 4, 0, 0]} // 상단 모서리 둥글게
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
