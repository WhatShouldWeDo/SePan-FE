import { useEffect, useRef, useState } from "react"
import { Chip } from "@/components/ui/chip"
import type { ElectionType } from "@/features/pledges/data/region-data"

interface ElectionTypeFilterProps {
	types: ElectionType[]
	selectedType: string | null
	onTypeChange: (type: string | null) => void
	disabled?: boolean
}

export function ElectionTypeFilter({
	types,
	selectedType,
	onTypeChange,
	disabled = false,
}: ElectionTypeFilterProps) {
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

	const selectedLabel =
		types.find((t) => t.value === selectedType)?.label ?? "선거종류"

	function handleSelect(value: string | null) {
		onTypeChange(value)
		setIsOpen(false)
	}

	return (
		<div ref={containerRef} className="relative inline-block">
			<Chip
				label={selectedLabel}
				size="medium"
				state={disabled ? "disabled" : selectedType !== null ? "active" : "default"}
				isOpen={isOpen}
				onClick={() => !disabled && setIsOpen((prev) => !prev)}
			/>

			{isOpen && (
				<div className="absolute top-full left-0 z-10 mt-2 min-w-[200px] rounded-xl bg-white py-2 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.12)]">
					<div className="px-4 py-2 text-label-4 font-medium text-label-alternative">
						선거종류
					</div>
					{types.map((type) => (
						<button
							key={type.value}
							type="button"
							className={`w-full px-4 py-2.5 text-left text-label-3 font-medium transition-colors hover:bg-fill-normal ${
								selectedType === type.value
									? "font-semibold text-primary"
									: "text-label-normal"
							}`}
							onClick={() => handleSelect(type.value)}
						>
							{type.label}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
