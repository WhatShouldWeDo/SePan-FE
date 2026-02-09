import { Badge } from '@/components/ui/badge'

/**
 * 공약 상태 타입
 *
 * - `draft`: 작성중
 * - `confirmed`: 확정 (최종 승인됨)
 * - `published`: 발표됨 (외부 공개)
 */
export type PolicyStatus = 'draft' | 'confirmed' | 'published'

interface PolicyStatusBadgeProps {
  /**
   * 공약 상태
   */
  status: PolicyStatus
  /**
   * 배지 크기 (기본값: md)
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * 공약 상태 배지 컴포넌트
 *
 * 공약의 진행 상태를 시각적으로 표시합니다.
 *
 * @example
 * ```tsx
 * <PolicyStatusBadge status="draft" />
 * // 출력: "작성중" (회색)
 *
 * <PolicyStatusBadge status="confirmed" />
 * // 출력: "확정" (파랑)
 *
 * <PolicyStatusBadge status="published" size="lg" />
 * // 출력: "발표" (외곽선, 큰 크기)
 * ```
 */
export function PolicyStatusBadge({ status, size = 'md' }: PolicyStatusBadgeProps) {
  const config: Record<
    PolicyStatus,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  > = {
    draft: { label: '작성중', variant: 'secondary' },
    confirmed: { label: '확정', variant: 'default' },
    published: { label: '발표', variant: 'outline' },
  }

  const { label, variant } = config[status]

  return (
    <Badge variant={variant} size={size} aria-label={`공약 상태: ${label}`}>
      {label}
    </Badge>
  )
}
