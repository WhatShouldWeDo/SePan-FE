import { ChevronDown } from "lucide-react"
import type { CandidatePledge } from "../data/mock-candidate-detail"
import { CATEGORIES } from "@/features/region/data/categories"

interface PledgeRowProps {
	pledge: CandidatePledge
	isOpen: boolean
	onToggle: () => void
}

export function PledgeRow({ pledge, isOpen, onToggle }: PledgeRowProps) {
	const categoryData = pledge.categoryId
		? CATEGORIES.find((c) => c.id === pledge.categoryId)
		: undefined

	// 아이콘 색상 기반으로 배지 스타일 생성
	const badgeColor = categoryData?.iconColor ?? "#6B7280"
	const badgeStyle = {
		color: badgeColor,
		backgroundColor: `${badgeColor}1A`, // 10% opacity (hex alpha)
	}

	return (
		<div className="border-b border-line-neutral">
			<button
				type="button"
				className="flex w-full items-center gap-3 px-2 py-4 text-left"
				onClick={onToggle}
			>
				<div className="flex flex-1 flex-col gap-1">
					<div className="flex items-center gap-2">
						<span className="text-label-3 font-semibold">
							{pledge.title}
						</span>
						<span
							className="inline-flex shrink-0 items-center gap-1 rounded-[6px] px-1.5 py-0.5 text-caption-1 font-semibold"
							style={badgeStyle}
						>
							{categoryData?.iconAsset && (
								<span
									className="relative inline-block size-3.5 shrink-0 overflow-hidden rounded-[3px]"
								>
									<span
										className="absolute inset-0"
										style={{
											backgroundColor: badgeColor,
											maskImage: `url('${categoryData.iconAsset}')`,
											maskMode: "luminance",
											maskSize: "11px 11px",
											maskPosition: "1.5px 1.5px",
											maskRepeat: "no-repeat",
											WebkitMaskImage: `url('${categoryData.iconAsset}')`,
											WebkitMaskSize: "11px 11px",
											WebkitMaskPosition: "1.5px 1.5px",
											WebkitMaskRepeat: "no-repeat",
										}}
									/>
								</span>
							)}
							{pledge.category}
						</span>
					</div>
					<p className="text-label-4 font-medium text-label-alternative">
						{pledge.description}
					</p>
				</div>

				<ChevronDown
					className={`size-5 shrink-0 text-label-alternative transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen && (
				<div className="px-2 pb-4">
					<div className="rounded-xl bg-fill-normal p-4">
						<p className="text-label-4 font-medium text-label-alternative">
							상세 공약 내용은 추후 디자인이 제공됩니다
						</p>
					</div>
				</div>
			)}
		</div>
	)
}
