import { ChevronDown } from "lucide-react"
import type { CandidatePledge } from "../data/mock-candidate-detail"

const CATEGORY_VARIANT_STYLES: Record<
	CandidatePledge["categoryVariant"],
	string
> = {
	red: "bg-red-100 text-red-700",
	orange: "bg-orange-100 text-orange-700",
	blue: "bg-blue-100 text-blue-700",
	green: "bg-green-100 text-green-700",
	purple: "bg-violet-100 text-violet-700",
}

interface PledgeRowProps {
	pledge: CandidatePledge
	isOpen: boolean
	onToggle: () => void
}

export function PledgeRow({ pledge, isOpen, onToggle }: PledgeRowProps) {
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
							className={`rounded-[6px] px-1.5 py-0.5 text-caption-1 font-semibold ${CATEGORY_VARIANT_STYLES[pledge.categoryVariant]}`}
						>
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
