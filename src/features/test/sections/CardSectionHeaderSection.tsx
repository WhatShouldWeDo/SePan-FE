import { useState } from "react"
import { toast } from "@/lib/toast/toast"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Share, Download } from "lucide-react"

/** Segmented Control 데모 (TestPage 전용) */
function SegmentedControlDemo() {
	const [selected, setSelected] = useState(2) // "선거구" 기본 선택
	const items = ["시도", "시군구", "선거구", "행정동"]

	return (
		<div className="flex h-11 items-center rounded-[10px] bg-fill-normal p-[3px]">
			{items.map((label, i) => (
				<button
					key={label}
					type="button"
					onClick={() => setSelected(i)}
					className={`relative flex h-full items-center justify-center px-2.5 text-label-3 font-semibold transition-colors ${
						selected === i
							? "text-label-normal"
							: "text-label-neutral hover:text-label-normal"
					}`}
				>
					{selected === i && (
						<span className="absolute inset-0 rounded-lg bg-white shadow-[0_0_4px_rgba(0,0,0,0.08)]" />
					)}
					<span className="relative">{label}</span>
				</button>
			))}
		</div>
	)
}

export function CardSectionHeaderSection() {
	return (
		<>
			<section>
				<h2 className="text-heading-3 font-bold mb-4">CardSectionHeader</h2>
				<div className="flex flex-col gap-6 max-w-xl">
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">기본 (Title + Description + Button)</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								description="상세설명입니다"
								trailingContent={<Button variant="outline" size="sm">텍스트</Button>}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">설명 없이</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								trailingContent={<Button variant="outline" size="sm">텍스트</Button>}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">TextButton 변형 (호버해보세요)</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="강남구"
								titleVariant="textButton"
								onTitleClick={() => toast.info("지역 선택 클릭!")}
								description="상세설명입니다"
								trailingContent={<Button variant="outline" size="sm">텍스트</Button>}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Description 상단 배치</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								description="상세설명입니다"
								descriptionPosition="top"
								trailingContent={<Button variant="outline" size="sm">텍스트</Button>}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">TrailingContent 없이</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								description="상세설명입니다"
							/>
						</div>
					</div>
				</div>
			</section>

			<section>
				<h2 className="text-heading-3 font-bold mb-4">CardSectionHeader — TrailingContent 변형</h2>
				<div className="flex flex-col gap-6 max-w-xl">
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Chevron</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								description="상세설명입니다"
								trailingContent={<ChevronRight className="size-6 text-label-neutral" />}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Text (Primary 색상)</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								description="상세설명입니다"
								trailingContent={
									<span className="text-label-3 font-semibold text-primary">텍스트</span>
								}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Tab (Segmented Control)</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								description="상세설명입니다"
								trailingContent={<SegmentedControlDemo />}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Swiper (좌우 탐색)</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								description="상세설명입니다"
								trailingContent={
									<div className="flex items-center gap-1">
										<button type="button" className="flex items-center justify-center size-8 rounded-lg border border-line-neutral text-label-neutral hover:bg-fill-normal">
											<ChevronLeft className="size-5" />
										</button>
										<button type="button" className="flex items-center justify-center size-8 rounded-lg border border-line-neutral text-label-neutral hover:bg-fill-normal">
											<ChevronRight className="size-5" />
										</button>
									</div>
								}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Icon (공유)</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								description="상세설명입니다"
								trailingContent={
									<button type="button" className="flex items-center justify-center size-8 text-label-neutral hover:text-label-normal">
										<Share className="size-5" />
									</button>
								}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">TextButton 링크 (전체보기)</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								description="상세설명입니다"
								trailingContent={
									<button type="button" className="inline-flex items-center gap-0.5 text-body-2 font-medium text-label-alternative hover:text-label-normal">
										전체보기 <ChevronRight className="size-5" />
									</button>
								}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Button + Icon (다운로드)</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								description="상세설명입니다"
								trailingContent={
									<Button variant="outline" size="sm">
										다운로드 <Download className="size-4" />
									</Button>
								}
							/>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
