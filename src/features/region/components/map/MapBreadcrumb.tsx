import { ChevronRight } from "lucide-react";
import type { MapLevel } from "@/types/map";
import { getSidoFullName } from "@/features/region/lib/sido-utils";

interface MapBreadcrumbProps {
	level: MapLevel;
	selectedSido: string | null;
	selectedCityName: string | null;
	selectedGuName: string | null;
	onBackToNational: () => void;
	onBackToSido: () => void;
	onBackToSigun: () => void;
}

const btnClass =
	"inline-flex min-h-[44px] min-w-[44px] items-center rounded-md px-2 font-medium text-primary hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";
const textClass =
	"inline-flex min-h-[44px] items-center px-2 font-medium text-foreground";
const mutedTextClass =
	"inline-flex min-h-[44px] items-center px-2 font-medium text-muted-foreground";

function Separator() {
	return (
		<ChevronRight
			className="h-4 w-4 shrink-0 text-muted-foreground"
			aria-hidden="true"
		/>
	);
}

/**
 * 지도 드릴다운 내비게이션 브레드크럼 (4단계)
 *
 * @description
 * - sido: "전국"
 * - sigun: "전국 > 경기도"
 * - gu: "전국 > 경기도 > 수원시"
 * - eupMyeonDong (4단계): "전국 > 경기도 > 수원시 > 장안구"
 * - eupMyeonDong (3단계): "전국 > 경기도 > 파주시" (selectedGuName === null)
 * - 44px 최소 터치 타겟, text-base 16px 장년층 가독성
 */
export function MapBreadcrumb({
	level,
	selectedSido,
	selectedCityName,
	selectedGuName,
	onBackToNational,
	onBackToSido,
	onBackToSigun,
}: MapBreadcrumbProps) {
	const sidoFullName = selectedSido ? getSidoFullName(selectedSido) : "";

	return (
		<nav
			aria-label="지도 탐색 경로"
			className="flex items-center gap-1 text-base"
		>
			{level === "sido" ? (
				<span className={mutedTextClass}>전국</span>
			) : (
				<>
					{/* 전국 버튼 */}
					<button
						type="button"
						onClick={onBackToNational}
						className={btnClass}
					>
						전국
					</button>
					<Separator />

					{level === "sigun" ? (
						/* 시군 레벨: 시도명은 비활성 */
						<span className={textClass}>{sidoFullName}</span>
					) : level === "gu" ? (
						/* 구 레벨: 시도 → 클릭 가능, 시 이름은 비활성 */
						<>
							<button
								type="button"
								onClick={onBackToSido}
								className={btnClass}
							>
								{sidoFullName}
							</button>
							<Separator />
							<span className={textClass}>
								{selectedCityName ?? ""}
							</span>
						</>
					) : (
						/* eupMyeonDong 레벨 */
						<>
							<button
								type="button"
								onClick={onBackToSido}
								className={btnClass}
							>
								{sidoFullName}
							</button>
							<Separator />

							{selectedGuName ? (
								/* 4단계: 시도 > 시 > 구(현재) */
								<>
									<button
										type="button"
										onClick={onBackToSigun}
										className={btnClass}
									>
										{selectedCityName ?? ""}
									</button>
									<Separator />
									<span className={textClass}>
										{selectedGuName}
									</span>
								</>
							) : (
								/* 3단계: 시도 > 시군구(현재) */
								<span className={textClass}>
									{selectedCityName ?? ""}
								</span>
							)}
						</>
					)}
				</>
			)}
		</nav>
	);
}
