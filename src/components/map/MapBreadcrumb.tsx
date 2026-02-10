import { ChevronRight } from "lucide-react";
import type { MapLevel } from "@/types/map";
import { getSidoFullName } from "@/lib/sido-utils";

interface MapBreadcrumbProps {
	level: MapLevel;
	selectedSido: string | null;
	onBackToNational: () => void;
}

/**
 * 지도 드릴다운 내비게이션 브레드크럼
 *
 * @description
 * - sido 레벨: "전국" (비활성 텍스트)
 * - constituency 레벨: "전국 > 서울특별시" (전국은 클릭 가능)
 * - 44px 최소 터치 타겟 (CLAUDE.md 4-1)
 * - text-base 16px 장년층 가독성
 */
export function MapBreadcrumb({
	level,
	selectedSido,
	onBackToNational,
}: MapBreadcrumbProps) {
	return (
		<nav
			aria-label="지도 탐색 경로"
			className="flex items-center gap-1 text-base"
		>
			{level === "sido" ? (
				<span className="inline-flex min-h-[44px] items-center px-2 font-medium text-muted-foreground">
					전국
				</span>
			) : (
				<>
					<button
						type="button"
						onClick={onBackToNational}
						className="inline-flex min-h-[44px] min-w-[44px] items-center rounded-md px-2 font-medium text-primary hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						전국
					</button>
					<ChevronRight
						className="h-4 w-4 shrink-0 text-muted-foreground"
						aria-hidden="true"
					/>
					<span className="inline-flex min-h-[44px] items-center px-2 font-medium text-foreground">
						{selectedSido ? getSidoFullName(selectedSido) : ""}
					</span>
				</>
			)}
		</nav>
	);
}
