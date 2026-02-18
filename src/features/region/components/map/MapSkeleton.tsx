import { Skeleton } from "@/components/ui/skeleton";

interface MapSkeletonProps {
	width: number;
	height: number;
}

/**
 * 지도 로딩 스켈레톤
 * @description 지도 영역 크기에 맞춰 Skeleton을 표시한다.
 *   DashboardCardSkeleton 패턴과 동일.
 */
export function MapSkeleton({ width, height }: MapSkeletonProps) {
	return <Skeleton className="rounded-lg" style={{ width, height }} />;
}
