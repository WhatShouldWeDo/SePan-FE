import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { CardSectionHeader } from "@/components/ui/card-section-header"
import { CircleInfoFill } from "@/components/icons"

import type { CandidateNews } from "../data/mock-candidate-detail"
import { NewsRow } from "./NewsRow"

const PAGE_SIZE = 4

interface NewsSectionProps {
	news: CandidateNews[]
}

export function NewsSection({ news }: NewsSectionProps) {
	const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE)

	const visibleNews = news.slice(0, visibleCount)
	const hasMore = visibleCount < news.length

	return (
		<div className="flex flex-col gap-6 rounded-[20px] bg-white p-8 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]">
			<CardSectionHeader
				title="관련 뉴스 이슈"
				trailingContent={
					<CircleInfoFill className="size-6 text-label-alternative" />
				}
			/>

			{news.length === 0 ? (
				<p className="text-label-4 font-medium text-label-alternative">
					등록된 데이터가 없습니다
				</p>
			) : (
				<div className="flex flex-col gap-3">
					{visibleNews.map((item) => (
						<NewsRow key={item.id} news={item} />
					))}
				</div>
			)}

			{hasMore && (
				<button
					type="button"
					className="flex items-center justify-center gap-1 text-label-4 font-semibold text-label-alternative"
					onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
				>
					더보기
					<ChevronDown className="size-4" />
				</button>
			)}
		</div>
	)
}
