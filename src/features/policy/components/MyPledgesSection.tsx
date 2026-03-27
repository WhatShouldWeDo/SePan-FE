import {
	ChevronRight,
	Calendar,
	Pencil,
	Clock,
	CircleCheck,
} from "lucide-react";

import { CardSectionHeader } from "@/components/ui/card-section-header";
import { SummaryCard } from "@/components/ui/summary-card";
import { PressOverlay } from "@/components/ui/press-overlay";
import { PledgeRow } from "./PledgeRow";
import type { PledgeSummary, MyPledge } from "@/features/policy/data/mock-policy";

interface MyPledgesSectionProps {
	summary: PledgeSummary;
	pledges: MyPledge[];
}

const TABLE_COLUMNS = [
	{ label: "분야", width: "w-[140px] shrink-0" },
	{ label: "공약", width: "min-w-0 flex-1" },
	{ label: "지역", width: "w-[180px] shrink-0" },
	{ label: "생성일", width: "w-[180px] shrink-0" },
	{ label: "편집", width: "w-[84px] shrink-0" },
];

export function MyPledgesSection({ summary, pledges }: MyPledgesSectionProps) {
	return (
		<div className="flex flex-col">
			{/* 섹션 헤더 */}
			<CardSectionHeader title="나의 공약 관리" />

			{/* 요약 카드 4개 */}
			<div className="mt-6 flex gap-3">
				<SummaryCard
					label="전체공약"
					value={`${summary.total}건`}
					icon={<Calendar className="size-6" />}
				/>
				<SummaryCard
					label="작성중"
					value={`${summary.drafting}건`}
					icon={<Pencil className="size-6" />}
					valueClassName="text-status-cautionary"
				/>
				<SummaryCard
					label="검토중"
					value={`${summary.reviewing}건`}
					icon={<Clock className="size-6" />}
					valueClassName="text-status-positive"
				/>
				<SummaryCard
					label="확정됨"
					value={`${summary.confirmed}건`}
					icon={<CircleCheck className="size-6" />}
					valueClassName="text-primary"
				/>
			</div>

			{/* 테이블 */}
			<div className="mt-6">
				{/* 테이블 헤더 */}
				<div className="flex items-center rounded-t-lg bg-cool-neutral-5 px-5 py-3 backdrop-blur-[32px]">
					{TABLE_COLUMNS.map((col) => (
						<div
							key={col.label}
							className={`text-label-4 font-semibold text-label-neutral ${col.width}`}
						>
							{col.label}
						</div>
					))}
				</div>

				{/* 테이블 바디 */}
				<div>
					{pledges.map((pledge) => (
						<PledgeRow
							key={pledge.id}
							category={pledge.category}
							categoryId={pledge.categoryId}
							title={pledge.title}
							description={pledge.description}
							region={pledge.region}
							createdAt={pledge.createdAt}
						/>
					))}
				</div>
			</div>

			{/* 하단 링크 */}
			<div className="flex flex-col gap-5">
				<div className="h-px bg-line-neutral" />
				<div className="flex justify-center">
					<button
						type="button"
						className="group relative inline-flex items-center gap-1 rounded-3xl py-1"
					>
						<span className="text-label-2 font-semibold text-primary">
							나의 공약 더보기
						</span>
						<ChevronRight className="size-5 text-primary" />
						<PressOverlay className="-inset-x-[4px] inset-y-0 rounded-lg" />
					</button>
				</div>
			</div>
		</div>
	);
}
