// 차트 테마 색상 정의

/**
 * 차트 기본 색상 팔레트
 * @description shadcn/ui 테마와 조화로운 색상 (oklch 포맷 사용)
 */
export const chartColors = {
  primary: 'oklch(var(--primary))',
  secondary: 'oklch(var(--secondary))',
  destructive: 'oklch(var(--destructive))',
  // 차트 전용 색상 (다중 시리즈용) - CSS 변수 활용
  chart1: 'oklch(var(--chart-1))',
  chart2: 'oklch(var(--chart-2))',
  chart3: 'oklch(var(--chart-3))',
  chart4: 'oklch(var(--chart-4))',
  chart5: 'oklch(var(--chart-5))',
} as const

/**
 * 차트 색상 배열 (순서대로 할당)
 * @description 다중 시리즈 차트에서 순서대로 색상 할당
 */
export const chartColorArray = [
  chartColors.chart1,
  chartColors.chart2,
  chartColors.chart3,
  chartColors.chart4,
  chartColors.chart5,
]

/**
 * 인덱스로 차트 색상 가져오기
 * @param index 색상 인덱스 (0부터 시작)
 * @returns CSS 색상 값 (순환 방식으로 반환)
 * @example getChartColor(0) // 'oklch(var(--chart-1))'
 * @example getChartColor(5) // 'oklch(var(--chart-1))' (순환)
 */
export function getChartColor(index: number): string {
  return chartColorArray[index % chartColorArray.length]
}
