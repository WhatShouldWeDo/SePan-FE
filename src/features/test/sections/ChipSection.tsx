import { useState } from "react"
import { Chip } from "@/components/ui/chip"

export function ChipSection() {
	const [chipOpen, setChipOpen] = useState(false)
	const [chipActiveOpen, setChipActiveOpen] = useState(false)

	return (
		<section>
			<h2 className="text-heading-3 font-bold mb-4">Chip/Filter</h2>
			<div className="flex flex-col gap-6">
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">인터랙티브 (클릭하여 open 토글)</h3>
					<div className="flex items-center gap-3">
						<Chip label="지역" isOpen={chipOpen} onClick={() => setChipOpen(!chipOpen)} />
						<Chip label="서울특별시" state="active" isOpen={chipActiveOpen} onClick={() => setChipActiveOpen(!chipActiveOpen)} />
						<Chip label="지역" state="disabled" />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Outlined — state 매트릭스</h3>
					<div className="flex items-center gap-3">
						<Chip label="텍스트" state="default" />
						<Chip label="텍스트" state="active" />
						<Chip label="텍스트" state="disabled" />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Solid — state 매트릭스</h3>
					<div className="flex items-center gap-3">
						<Chip label="텍스트" variant="solid" state="default" />
						<Chip label="텍스트" variant="solid" state="active" />
						<Chip label="텍스트" variant="solid" state="disabled" />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Size 매트릭스</h3>
					<div className="flex items-end gap-3">
						<Chip label="텍스트" size="large" />
						<Chip label="텍스트" size="medium" />
						<Chip label="텍스트" size="small" />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">SubLabel / UnitLabel</h3>
					<div className="flex items-center gap-3">
						<Chip label="텍스트" subLabel="항목" state="active" />
						<Chip label="텍스트" unitLabel="1" state="active" />
						<Chip label="텍스트" subLabel="항목" unitLabel="3" state="active" />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Solid Active + UnitLabel</h3>
					<div className="flex items-center gap-3">
						<Chip label="텍스트" variant="solid" state="active" />
						<Chip label="텍스트" variant="solid" state="active" unitLabel="1" />
					</div>
				</div>
			</div>
		</section>
	)
}
