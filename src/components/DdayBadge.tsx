import { Badge } from '@/components/ui/badge'

interface DdayBadgeProps {
  /**
   * 선거일 (Date 객체 또는 ISO 문자열)
   */
  electionDate: Date | string
  /**
   * 배지 크기 (기본값: lg)
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * D-day 배지 컴포넌트
 *
 * 선거일까지 남은 일수를 "D-N" 형식으로 표시합니다.
 * 30일 이하일 때는 destructive variant (빨강)로 표시됩니다.
 *
 * @example
 * ```tsx
 * <DdayBadge electionDate={new Date('2026-04-01')} />
 * // 출력: "선거일 D-45"
 *
 * <DdayBadge electionDate="2026-04-01" size="sm" />
 * // 출력: "선거일 D-45" (작은 크기)
 * ```
 */
export function DdayBadge({ electionDate, size = 'lg' }: DdayBadgeProps) {
  const today = new Date()
  const targetDate =
    typeof electionDate === 'string' ? new Date(electionDate) : electionDate

  // 날짜 차이 계산 (일 단위, 올림)
  const diffInMs = targetDate.getTime() - today.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  // 30일 이하일 때는 destructive (빨강), 그 외에는 default
  const variant = diffInDays <= 30 ? 'destructive' : 'default'

  // 음수일 경우 "D+N" 형식 (선거가 지난 경우)
  const dDayText = diffInDays >= 0 ? `D-${diffInDays}` : `D+${Math.abs(diffInDays)}`

  return (
    <Badge variant={variant} size={size} aria-label={`선거일까지 ${diffInDays}일`}>
      선거일 {dDayText}
    </Badge>
  )
}
