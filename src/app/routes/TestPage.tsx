import { useState } from "react"
import { toast } from "@/lib/toast/toast"
import { Toast } from "@/components/ui/toast"
import { Banner } from "@/components/ui/banner"
import { CategoryNav } from "@/components/ui/category-nav"
import { CATEGORIES, SUBCATEGORIES } from "@/features/region/data/categories"
import { Checkbox, type CheckboxState } from "@/components/ui/checkbox"
import { Radio } from "@/components/ui/radio"
import { Switch } from "@/components/ui/switch"
import { Check } from "@/components/ui/check"
import { CheckMultiple } from "@/components/ui/check-multiple"
import { Chip } from "@/components/ui/chip"
import { ChipTag } from "@/components/ui/chip-tag"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import { Button } from "@/components/ui/button"
import { X, Check as CheckIcon, ChevronRight, ChevronLeft, Share, Download } from "lucide-react"

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

const TestPage = () => {
	return (
		<div className="flex flex-col gap-8 p-8">
			{/* ── Header/CardSectionHeader 컴포넌트 테스트 ── */}
			<section>
				<h2 className="text-heading-3 font-bold mb-4">CardSectionHeader</h2>
				<div className="flex flex-col gap-6 max-w-xl">
					{/* 기본: 제목 + 설명 + 버튼 */}
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

					{/* 설명 없이 */}
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">설명 없이</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								trailingContent={<Button variant="outline" size="sm">텍스트</Button>}
							/>
						</div>
					</div>

					{/* TextButton 변형 */}
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

					{/* Description 상단 배치 */}
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

					{/* TrailingContent 없이 */}
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

			{/* TrailingContent 슬롯 변형 */}
			<section>
				<h2 className="text-heading-3 font-bold mb-4">CardSectionHeader — TrailingContent 변형</h2>
				<div className="flex flex-col gap-6 max-w-xl">
					{/* Chevron */}
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

					{/* Text (Primary) */}
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

					{/* Tab (Segmented Control) */}
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Tab (Segmented Control)</h3>
						<div className="rounded-xl border border-line-neutral p-4">
							<CardSectionHeader
								title="타이틀영역"
								description="상세설명입니다"
								trailingContent={
									<SegmentedControlDemo />
								}
							/>
						</div>
					</div>

					{/* Swiper (좌우 탐색) */}
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

					{/* Icon (공유) */}
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

					{/* TextButton 링크 (전체보기) */}
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

					{/* Button + Icon (다운로드) */}
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

			<hr className="border-line-neutral" />

			{/* ── Chip/Filter 컴포넌트 테스트 ── */}
			<section>
				<h2 className="text-heading-3 font-bold mb-4">Chip/Filter</h2>
				<div className="flex flex-col gap-6">
					{/* 인터랙티브 */}
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">인터랙티브 (클릭하여 open 토글)</h3>
						<div className="flex items-center gap-3">
							<Chip label="지역" isOpen={chipOpen} onClick={() => setChipOpen(!chipOpen)} />
							<Chip label="서울특별시" state="active" isOpen={chipActiveOpen} onClick={() => setChipActiveOpen(!chipActiveOpen)} />
							<Chip label="지역" state="disabled" />
						</div>
					</div>
					{/* State × Variant: Outlined */}
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Outlined — state 매트릭스</h3>
						<div className="flex items-center gap-3">
							<Chip label="텍스트" state="default" />
							<Chip label="텍스트" state="active" />
							<Chip label="텍스트" state="disabled" />
						</div>
					</div>
					{/* State × Variant: Solid */}
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Solid — state 매트릭스</h3>
						<div className="flex items-center gap-3">
							<Chip label="텍스트" variant="solid" state="default" />
							<Chip label="텍스트" variant="solid" state="active" />
							<Chip label="텍스트" variant="solid" state="disabled" />
						</div>
					</div>
					{/* Size 매트릭스 */}
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Size 매트릭스</h3>
						<div className="flex items-end gap-3">
							<Chip label="텍스트" size="large" />
							<Chip label="텍스트" size="medium" />
							<Chip label="텍스트" size="small" />
						</div>
					</div>
					{/* SubLabel + UnitLabel */}
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">SubLabel / UnitLabel</h3>
						<div className="flex items-center gap-3">
							<Chip label="텍스트" subLabel="항목" state="active" />
							<Chip label="텍스트" unitLabel="1" state="active" />
							<Chip label="텍스트" subLabel="항목" unitLabel="3" state="active" />
						</div>
					</div>
					{/* hasUnitLabel + Solid */}
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Solid Active + UnitLabel</h3>
						<div className="flex items-center gap-3">
							<Chip label="텍스트" variant="solid" state="active" />
							<Chip label="텍스트" variant="solid" state="active" unitLabel="1" />
						</div>
					</div>
				</div>
			</section>

			<hr className="border-line-neutral" />
			<ChipSection />

			<hr className="border-line-neutral" />
			<ChipTagSection />

			<hr className="border-line-neutral" />
			<FormControlsSection />

			<hr className="border-line-neutral" />
			<CategoryNavSection />

			<hr className="border-line-neutral" />
			<SelectCellSection />

			<BannerSection />
			<ToastSection />
		</div>
	);
};

export default TestPage;
