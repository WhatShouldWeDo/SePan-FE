/**
 * Custom Icons
 *
 * Figma에서 내보낸 커스텀 아이콘 컴포넌트들을 여기서 re-export 합니다.
 * 기본 아이콘은 lucide-react를 사용하고, Figma에만 있는 커스텀 아이콘만 이 폴더에 추가합니다.
 *
 * 아이콘 추가 방법:
 * 1. SVG 파일을 design-tokens/icons/ 에 배치
 * 2. pnpm run icons:generate 실행
 * 3. 생성된 컴포넌트를 이 파일에서 export
 *
 * 사용 예시:
 * import { CircleCheckFill } from "@/components/icons"
 * import { LucideIcon } from "lucide-react"  // 기본 아이콘
 */

export { CircleCheckFill } from "./CircleCheckFill"
export { CircleExclamationFill } from "./CircleExclamationFill"
export { CircleCloseFill } from "./CircleCloseFill"
export { TriangleWarningFill } from "./TriangleWarningFill"
