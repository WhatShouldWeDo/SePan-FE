import type { CandidateNews } from "../data/mock-candidate-detail"

interface NewsRowProps {
	news: CandidateNews
}

export function NewsRow({ news }: NewsRowProps) {
	return (
		<div className="flex items-center gap-3">
			{news.thumbnailUrl ? (
				<img
					src={news.thumbnailUrl}
					alt=""
					className="h-[60px] w-[80px] rounded-[10px] border border-line-neutral object-cover"
				/>
			) : (
				<div className="h-[60px] w-[80px] shrink-0 rounded-[10px] border border-line-neutral bg-fill-normal" />
			)}

			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<p className="truncate text-label-3 font-semibold text-label-normal">
					{news.title}
				</p>
				<span className="text-caption-2 font-medium text-label-neutral">
					{news.timeAgo} &middot; {news.source}
				</span>
			</div>
		</div>
	)
}
