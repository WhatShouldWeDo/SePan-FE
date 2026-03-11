import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	WantedFillMessage,
	WantedFillTriangleExclamation,
	WantedFillMegaphone,
} from "@/components/icons";

import { Banner } from "@/components/ui/banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardSectionHeader } from "@/components/ui/card-section-header";
import {
	DashboardCardSkeleton,
	StatCardSkeleton,
} from "@/components/DashboardCardSkeleton";
import {
	CardSection,
	DashboardGreeting,
	SummaryCard,
	InsightListItem,
	InsightDelta,
	ScheduleListItem,
	WeekStrip,
} from "@/features/dashboard/components";

export function DashboardPage() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [currentDate] = useState(() => new Date());
	const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
	const [weekOffset, setWeekOffset] = useState(0);

	const displayedDate = useMemo(() => {
		const d = new Date(currentDate);
		d.setDate(d.getDate() + weekOffset * 7);
		return d;
	}, [currentDate, weekOffset]);

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 1500);
		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return (
			<div className="space-y-6 p-6">
				<div className="flex gap-4">
					<StatCardSkeleton />
					<StatCardSkeleton />
					<StatCardSkeleton />
				</div>
				<div className="flex gap-6">
					<div className="flex flex-[2.3] flex-col gap-6">
						<DashboardCardSkeleton />
						<DashboardCardSkeleton />
					</div>
					<div className="flex flex-1 flex-col gap-6">
						<DashboardCardSkeleton />
						<DashboardCardSkeleton />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* 인사말 */}
			<DashboardGreeting
				userName="김정현"
				regionName="서울 강남갑"
				electionDate="2026-06-03"
			/>

			{/* 요약 카드 3종 */}
			<div className="flex gap-4">
				<SummaryCard
					variant="schedule"
					title="오늘의 일정"
					value="3건"
					subtitle="이번 주 총 일정"
					subValue="12건"
				/>
				<SummaryCard
					variant="dday-blue"
					title="선거일까지"
					value="D-104"
					subtitle="예비후보 등록까지"
					subValue="D-60"
				/>
				<SummaryCard
					variant="dday-purple"
					title="공약 달성률"
					value="68%"
					subtitle="확정 공약"
					subValue="12개"
				/>
			</div>

			{/* 2-column 레이아웃 */}
			<div className="flex gap-6">
				{/* ── Left Column ── */}
				<div className="flex flex-[2.3] flex-col gap-6">
					{/* 지역분석 인사이트 */}
					<CardSection>
						<CardSectionHeader
							title="지역분석 인사이트"
							description="AI가 분석한 우리 지역의 핵심 데이터"
							trailingContent={
								<Button variant="outline" size="sm" onClick={() => navigate("/region")}>
									바로가기
								</Button>
							}
						/>
						<Banner variant="notice">
							강남구 인구 유입이 전월 대비 12% 증가했습니다. 청년층 정책 수요가 높아지고 있어요.
						</Banner>
						<div className="@container">
							<div className="grid grid-cols-1 gap-4 @lg:grid-cols-2">
								<InsightListItem
									icon={
										<WantedFillMessage className="size-8 text-white" />
									}
									iconBg="bg-party-dpk"
									label="최다 민원 지역"
									value="삼성동"
									trailing={
										<Badge
											size="sm"
											className="border-0 bg-party-dpk/8 text-party-dpk"
										>
											신규
										</Badge>
									}
								/>
								<InsightListItem
									icon={
										<WantedFillTriangleExclamation className="size-8 text-white" />
									}
									iconBg="bg-status-cautionary"
									label="주요 민원 유형"
									value="교통혼잡"
									trailing={
										<InsightDelta
											label="전년대비 +8.4%"
											isPositive
										/>
									}
								/>
								<InsightListItem
									icon={
										<WantedFillTriangleExclamation className="size-8 text-white" />
									}
									iconBg="bg-status-cautionary"
									label="주요 민원 유형"
									value="교통혼잡"
									trailing={
										<InsightDelta
											label="전년대비 +8.4%"
											isPositive
										/>
									}
								/>
								<InsightListItem
									icon={
										<WantedFillMegaphone className="size-8 text-white" />
									}
									iconBg="bg-party-ppp"
									label="민원 증가율"
									value="+14.5%"
									valueColor="text-status-negative"
									trailing={
										<Badge
											size="sm"
											className="border-0 bg-party-ppp/8 text-party-ppp"
										>
											상승
										</Badge>
									}
								/>
							</div>
						</div>
					</CardSection>

					{/* 정책개발 현황 */}
					<CardSection>
						<CardSectionHeader
							title="정책개발 현황"
							description="공약 관리 및 AI 추천 현황"
							trailingContent={
								<Button variant="outline" size="sm" onClick={() => navigate("/policy")}>
									바로가기
								</Button>
							}
						/>
						<Banner variant="notice">
							교통 분야 공약 3건이 검토 대기 중입니다. AI가 새로운 정책을 추천했어요.
						</Banner>
						<div className="@container">
							<div className="grid grid-cols-1 gap-4 @lg:grid-cols-2">
								<InsightListItem
									icon={
										<WantedFillMessage className="size-8 text-white" />
									}
									iconBg="bg-party-dpk"
									label="완료된 정책"
									value="버스정류장 신설 외 14건"
									trailing={
										<span className="text-title-2 font-bold text-party-dpk">
											15건
										</span>
									}
								/>
								<InsightListItem
									icon={
										<WantedFillTriangleExclamation className="size-8 text-white" />
									}
									iconBg="bg-status-cautionary"
									label="진행중 정책"
									value="도서관 짓기 외 5건"
									trailing={
										<Button size="sm">
											이어서 작성
										</Button>
									}
								/>
							</div>
						</div>
					</CardSection>
				</div>

				{/* ── Right Column ── */}
				<div className="flex flex-1 flex-col gap-6">
					{/* 일정 관리 1 */}
					<CardSection>
						<CardSectionHeader
							title="이번 주 일정"
							trailingContent={
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label="이전 주"
										onClick={() => setWeekOffset((prev) => prev - 1)}
									>
										<ChevronLeft className="size-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label="다음 주"
										onClick={() => setWeekOffset((prev) => prev + 1)}
									>
										<ChevronRight className="size-4" />
									</Button>
								</div>
							}
						/>
						<WeekStrip
							currentDate={displayedDate}
							selectedDate={selectedDate}
							onDateSelect={setSelectedDate}
						/>
						<div className="flex flex-col gap-4">
							<ScheduleListItem
								title="캠프 전략회의"
								datetime="오늘 14:00 – 15:30"
								isHighlighted
								badge={{
									text: "중요",
									color: "bg-status-negative/10 text-status-negative",
								}}
							/>
							<ScheduleListItem
								title="지역 간담회 준비"
								datetime="오늘 16:00 – 17:00"
								isHighlighted
							/>
							<ScheduleListItem
								title="공약 검토 미팅"
								datetime="내일 10:00 – 11:30"
								description="교통·환경 분야 공약 최종 검토"
							/>
						</div>
					</CardSection>

					{/* 다가오는 일정 */}
					<CardSection>
						<CardSectionHeader title="다가오는 일정" />
						<div className="flex flex-col gap-4">
							<ScheduleListItem
								title="주민 설명회"
								datetime="3월 5일 (수) 19:00"
								badge={{
									text: "D-14",
									color: "bg-primary/10 text-primary",
								}}
								description="강남구민회관 대강당"
							/>
							<ScheduleListItem
								title="정책 발표회"
								datetime="3월 12일 (수) 14:00"
								badge={{
									text: "D-21",
									color: "bg-primary/10 text-primary",
								}}
							/>
							<ScheduleListItem
								title="선거 캠프 킥오프"
								datetime="3월 20일 (목) 10:00"
								badge={{
									text: "D-29",
									color: "bg-status-cautionary/10 text-status-cautionary",
								}}
							/>
						</div>
					</CardSection>
				</div>
			</div>
		</div>
	);
}
