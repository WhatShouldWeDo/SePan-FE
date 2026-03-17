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
					className="inline-flex items-center rounded-lg border border-line-neutral px-2.5 py-1.5 text-label-4 font-medium text-label-normal"
				>
					{keyword}
				</span>
			))}
		</div>
	)
}
