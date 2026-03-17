import { useEffect, useRef, useState } from "react"
import { Chip } from "@/components/ui/chip"
import type { ElectionTerm } from "@/features/pledges/data/mock-candidates"

interface ElectionTermFilterProps {
	terms: ElectionTerm[]
	selectedTerm: number | null
	onTermChange: (term: number | null) => void
}

export function ElectionTermFilter({
	terms,
	selectedTerm,
	onTermChange,
}: ElectionTermFilterProps) {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	// 외부 클릭 시 닫기
	useEffect(() => {
		if (!isOpen) return

		function handleClickOutside(e: PointerEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener("pointerdown", handleClickOutside)
		return () =>
			document.removeEventListener("pointerdown", handleClickOutside)
	}, [isOpen])

	// Escape 키로 닫기
	useEffect(() => {
		if (!isOpen) return

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") setIsOpen(false)
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [isOpen])

	const selectedLabel =
		terms.find((t) => t.value === selectedTerm)?.label ?? "선거회차"

	function handleSelect(value: number | null) {
		onTermChange(value)
		setIsOpen(false)
	}

	return (
		<div ref={containerRef} className="relative inline-block">
			<Chip
				label={selectedLabel}
				size="medium"
				state={selectedTerm !== null ? "active" : "default"}
				isOpen={isOpen}
				onClick={() => setIsOpen((prev) => !prev)}
			/>

			{isOpen && (
				<div className="absolute top-full left-0 z-10 mt-2 min-w-[140px] rounded-xl bg-white py-2 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.12)]">
					<button
						type="button"
						className={`w-full px-4 py-2.5 text-left text-label-3 font-medium transition-colors hover:bg-fill-normal ${
							selectedTerm === null
								? "font-semibold text-primary"
								: "text-label-normal"
						}`}
						onClick={() => handleSelect(null)}
					>
						전체
					</button>
					{terms.map((term) => (
						<button
							key={term.value}
							type="button"
							className={`w-full px-4 py-2.5 text-left text-label-3 font-medium transition-colors hover:bg-fill-normal ${
								selectedTerm === term.value
									? "font-semibold text-primary"
									: "text-label-normal"
							}`}
							onClick={() => handleSelect(term.value)}
						>
							{term.label}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
