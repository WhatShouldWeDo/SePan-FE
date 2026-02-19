import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";

interface DashboardGreetingProps {
	userName: string;
	regionName: string;
	electionDate: Date | string;
}

export function DashboardGreeting({
	userName,
	regionName,
	electionDate,
}: DashboardGreetingProps) {
	const diffInDays = useMemo(() => {
		const target =
			typeof electionDate === "string"
				? new Date(electionDate)
				: electionDate;
		const today = new Date();
		return Math.ceil(
			(target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
		);
	}, [electionDate]);
	const dDayText = diffInDays >= 0 ? `D-${diffInDays}` : `D+${Math.abs(diffInDays)}`;

	return (
		<div className="flex items-end justify-between">
			<div className="flex flex-col gap-1">
				<p className="text-body-2 font-medium leading-[1.5] text-label-alternative">
					{regionName} 선거 캠프
				</p>
				<h1 className="text-heading-1 font-bold leading-[1.3] text-label-normal">
					환영합니다, {userName}님
				</h1>
			</div>
			<Badge
				variant={diffInDays <= 30 ? "destructive" : "default"}
				size="lg"
				aria-label={`선거일까지 ${diffInDays}일`}
			>
				선거일 {dDayText}
			</Badge>
		</div>
	);
}
