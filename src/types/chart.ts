// 차트 공통 타입 정의

/**
 * 차트 데이터 포인트
 * @description 차트에 전달할 단일 데이터 포인트
 * @example { name: '2023', value: 100, value2: 120 }
 */
export interface ChartDataPoint {
  /** x축 값 (문자열 또는 숫자) */
  [key: string]: string | number
}

/**
 * 차트 데이터 배열
 * @description 차트에 전달할 데이터 배열
 */
export type ChartData = ChartDataPoint[]

/**
 * 차트 시리즈 설정
 * @description 각 데이터 키(y축)의 표시 설정
 */
export interface ChartSeriesConfig {
  /** 데이터 키 (ChartDataPoint의 key와 매칭) */
  key: string
  /** 범례에 표시할 이름 */
  label: string
  /** 색상 (Tailwind color class 또는 hex) */
  color?: string
  /** 라인 스타일 (LineChart 전용, 예: "5 5"로 점선) */
  strokeDasharray?: string
}

/**
 * 차트 공통 설정
 * @description 모든 차트 컴포넌트에서 사용하는 공통 설정
 */
export interface ChartConfig {
  /** x축 데이터 키 */
  xKey: string
  /** y축 데이터 키 배열 */
  series: ChartSeriesConfig[]
  /** x축 레이블 */
  xLabel?: string
  /** y축 레이블 */
  yLabel?: string
  /** 높이 (픽셀, 기본값: 400) */
  height?: number
  /** 툴팁 표시 여부 (기본값: true) */
  showTooltip?: boolean
  /** 범례 표시 여부 (기본값: true) */
  showLegend?: boolean
  /** 그리드 표시 여부 (기본값: true) */
  showGrid?: boolean
  /** 반응형 여부 (기본값: true) */
  responsive?: boolean
}

/**
 * 차트 포맷 유틸리티 타입
 * @description 차트 값을 포맷팅하는 함수 타입
 * @example (value) => `${Number(value).toLocaleString()}명`
 */
export type ChartFormatter = (value: number | string | undefined) => string
