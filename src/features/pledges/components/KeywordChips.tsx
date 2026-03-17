interface KeywordChipsProps {
	keywords: string[]
}

export function KeywordChips({ keywords }: KeywordChipsProps) {
	if (keywords.length === 0) return null

	return (
		<div className="flex flex-wrap items-center gap-2">
			{keywords.map((keyword) => (
				<span
					key={keyword}
					className="inline-flex items-center rounded-full bg-surface-primary px-[14px] py-2 font-medium text-label-alternative"
				>
					{keyword}
				</span>
			))}
		</div>
	)
}
