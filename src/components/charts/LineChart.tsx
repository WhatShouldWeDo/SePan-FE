import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartCardSkeleton } from '@/components/DashboardCardSkeleton'
import type { ChartData, ChartConfig, ChartFormatter } from '@/types/chart'

export interface LineChartProps {
  /** 차트 데이터 */
  data: ChartData
  /** 차트 설정 */
  config: ChartConfig
  /** 로딩 상태 */
  isLoading?: boolean
  /** 값 포맷 함수 (툴팁, 축 레이블) */
  valueFormatter?: ChartFormatter
  /** 커스텀 className */
  className?: string
}

/**
 * LineChart 컴포넌트
 *
 * @description
 * Recharts를 래핑한 라인 차트 컴포넌트
 * - 다중 라인 지원
 * - 툴팁, 범례, 그리드 자동 표시
 * - 반응형 컨테이너
 * - 로딩/에러 상태 처리
 *
 * @example
 * ```tsx
 * const data = [
 *   { year: '2023', value: 100, avg: 90 },
 *   { year: '2024', value: 120, avg: 95 },
 * ]
 *
 * const config = {
 *   xKey: 'year',
 *   series: [
 *     { key: 'value', label: '우리 지역', color: 'hsl(var(--primary))' },
 *     { key: 'avg', label: '평균', strokeDasharray: '5 5' },
 *   ],
 *   xLabel: '연도',
 *   yLabel: '인구 (명)',
 * }
 *
 * <LineChart data={data} config={config} />
 * ```
 */
export function LineChart({
  data,
  config,
  isLoading = false,
  valueFormatter,
  className,
}: LineChartProps) {
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
      <RechartsLineChart data={data}>
        {/* 그리드 */}
        {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}

        {/* X축 */}
        <XAxis
          dataKey={xKey}
          label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -5 } : undefined}
          tick={{ fontSize: 14 }}
        />

        {/* Y축 */}
        <YAxis
          label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft' } : undefined}
          tick={{ fontSize: 14 }}
          tickFormatter={valueFormatter}
        />

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

        {/* 라인 시리즈 */}
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color || 'hsl(var(--primary))'}
            strokeWidth={2}
            strokeDasharray={s.strokeDasharray}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
