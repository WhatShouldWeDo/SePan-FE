import { Chip } from "@/components/ui/chip"
import { useDropdown } from "@/hooks/useDropdown"

const MAX_COLS = 5
const BTN_W = 130
const GAP = 8

interface RegionSigunguFilterProps {
	sigungus: string[]
	selectedSigungu: string[]
	onSigunguChange: (sigungu: string[]) => void
	disabled?: boolean
}

export function RegionSigunguFilter({
	sigungus,
	selectedSigungu,
	onSigunguChange,
	disabled = false,
}: RegionSigunguFilterProps) {
	const { isOpen, toggle, containerRef } = useDropdown()

	function getChipLabel(): string {
		if (selectedSigungu.length === 0) return "시/군/구"
		if (selectedSigungu.length === 1) return selectedSigungu[0]
		return `${selectedSigungu[0]} 외 ${selectedSigungu.length - 1}개`
	}

	function handleSelectAll() {
		onSigunguChange([])
	}

	function handleToggle(sigungu: string) {
		if (selectedSigungu.includes(sigungu)) {
			onSigunguChange(selectedSigungu.filter((s) => s !== sigungu))
		} else {
			if (selectedSigungu.length >= 3) return
			onSigunguChange([...selectedSigungu, sigungu])
		}
	}

	const isAllSelected = selectedSigungu.length === 0
	const itemCount = sigungus.length + 1 // +1 for "전체"
	const cols = Math.min(MAX_COLS, itemCount)
	const gridWidth = cols * BTN_W + (cols - 1) * GAP

	return (
		<div ref={containerRef} className="relative inline-block">
			<Chip
				label={getChipLabel()}
				size="medium"
				state={disabled ? "disabled" : selectedSigungu.length > 0 ? "active" : "default"}
				isOpen={isOpen}
				onClick={() => !disabled && toggle()}
			/>

			{isOpen && (
				<div className="absolute top-full left-0 z-10 mt-2 max-h-[320px] overflow-y-auto rounded-xl bg-white p-4 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.12)]">
					<div className="mb-3 text-label-4 font-medium text-label-alternative">
						시/군/구
					</div>
					<div
						className="grid gap-2"
						style={{
							gridTemplateColumns: `repeat(${cols}, 1fr)`,
							width: `${gridWidth}px`,
						}}
					>
						<button
							type="button"
							className={`whitespace-nowrap rounded-lg py-3 text-center text-label-3 font-medium transition-colors ${
								isAllSelected
									? "bg-primary text-white"
									: "bg-fill-normal text-label-normal hover:bg-fill-strong"
							}`}
							onClick={handleSelectAll}
						>
							전체
						</button>
						{sigungus.map((sigungu) => (
							<button
								key={sigungu}
								type="button"
								className={`whitespace-nowrap rounded-lg py-3 text-center text-label-3 font-medium transition-colors ${
									selectedSigungu.includes(sigungu)
										? "bg-primary text-white"
										: "bg-fill-normal text-label-normal hover:bg-fill-strong"
								}`}
								onClick={() => handleToggle(sigungu)}
							>
								{sigungu}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
