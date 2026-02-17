import { ChipTag } from "@/components/ui/chip-tag"
import { X, Check as CheckIcon } from "lucide-react"

export function ChipTagSection() {
	return (
		<section>
			<h2 className="text-heading-3 font-bold mb-4">ChipTag (Round / Square)</h2>
			<div className="flex flex-col gap-6">
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Round — Outlined (state 매트릭스)</h3>
					<div className="flex items-center gap-3">
						<ChipTag label="텍스트" variant="outlined" state="default" />
						<ChipTag label="텍스트" variant="outlined" state="active" />
						<ChipTag label="텍스트" variant="outlined" state="disabled" />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Round — FullOutlined (state 매트릭스)</h3>
					<div className="flex items-center gap-3">
						<ChipTag label="텍스트" variant="fullOutlined" state="default" />
						<ChipTag label="텍스트" variant="fullOutlined" state="active" />
						<ChipTag label="텍스트" variant="fullOutlined" state="disabled" />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Round — Solid (state 매트릭스)</h3>
					<div className="flex items-center gap-3">
						<ChipTag label="텍스트" variant="solid" state="default" />
						<ChipTag label="텍스트" variant="solid" state="active" />
						<ChipTag label="텍스트" variant="solid" state="disabled" />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Round — Size 매트릭스</h3>
					<div className="flex items-end gap-3">
						<ChipTag label="텍스트" size="small" />
						<ChipTag label="텍스트" size="large" />
						<ChipTag label="텍스트" size="xlarge" />
					</div>
				</div>

				<hr className="border-line-alt" />

				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Square — Outlined (state 매트릭스)</h3>
					<div className="flex items-center gap-3">
						<ChipTag label="텍스트" shape="square" variant="outlined" state="default" />
						<ChipTag label="텍스트" shape="square" variant="outlined" state="active" />
						<ChipTag label="텍스트" shape="square" variant="outlined" state="disabled" />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Square — FullOutlined (state 매트릭스)</h3>
					<div className="flex items-center gap-3">
						<ChipTag label="텍스트" shape="square" variant="fullOutlined" state="default" />
						<ChipTag label="텍스트" shape="square" variant="fullOutlined" state="active" />
						<ChipTag label="텍스트" shape="square" variant="fullOutlined" state="disabled" />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Square — Solid (state 매트릭스)</h3>
					<div className="flex items-center gap-3">
						<ChipTag label="텍스트" shape="square" variant="solid" state="default" />
						<ChipTag label="텍스트" shape="square" variant="solid" state="active" />
						<ChipTag label="텍스트" shape="square" variant="solid" state="disabled" />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">Square — Size 매트릭스</h3>
					<div className="flex items-end gap-3">
						<ChipTag label="텍스트" shape="square" size="small" />
						<ChipTag label="텍스트" shape="square" size="large" />
					</div>
				</div>

				<hr className="border-line-alt" />

				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">아이콘 조합 (Round)</h3>
					<div className="flex items-center gap-3">
						<ChipTag label="Leading" leadingIcon={<CheckIcon className="w-full h-full" />} />
						<ChipTag label="Trailing" trailingIcon={<X className="w-full h-full" />} />
						<ChipTag label="Both" leadingIcon={<CheckIcon className="w-full h-full" />} trailingIcon={<X className="w-full h-full" />} />
					</div>
				</div>
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">아이콘 + Active (variant별)</h3>
					<div className="flex items-center gap-3">
						<ChipTag label="Outlined" state="active" variant="outlined" leadingIcon={<CheckIcon className="w-full h-full" />} />
						<ChipTag label="FullOutlined" state="active" variant="fullOutlined" leadingIcon={<CheckIcon className="w-full h-full" />} />
						<ChipTag label="Solid" state="active" variant="solid" leadingIcon={<CheckIcon className="w-full h-full" />} />
					</div>
				</div>
			</div>
		</section>
	)
}
