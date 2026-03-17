import { useEffect, useRef, useState } from "react"
import { Chip } from "@/components/ui/chip"

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
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!isOpen) return
		function handleClickOutside(e: PointerEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener("pointerdown", handleClickOutside)
		return () => document.removeEventListener("pointerdown", handleClickOutside)
	}, [isOpen])

	useEffect(() => {
		if (!isOpen) return
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") setIsOpen(false)
		}
		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [isOpen])

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

	return (
		<div ref={containerRef} className="relative inline-block">
			<Chip
				label={getChipLabel()}
				size="medium"
				state={disabled ? "disabled" : selectedSigungu.length > 0 ? "active" : "default"}
				isOpen={isOpen}
				onClick={() => !disabled && setIsOpen((prev) => !prev)}
			/>

			{isOpen && (
				<div className="absolute top-full left-0 z-10 mt-2 min-w-[520px] max-h-[320px] overflow-y-auto rounded-xl bg-white p-4 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.12)]">
					<div className="mb-3 text-label-4 font-medium text-label-alternative">
						시/군/구
					</div>
					<div className="grid grid-cols-5 gap-2">
						<button
							type="button"
							className={`rounded-lg px-3 py-2 text-center text-label-3 font-medium transition-colors ${
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
								className={`rounded-lg px-3 py-2 text-center text-label-3 font-medium transition-colors ${
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
