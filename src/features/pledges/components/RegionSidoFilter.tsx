import { useEffect, useRef, useState } from "react"
import { Chip } from "@/components/ui/chip"

interface RegionSidoFilterProps {
	sidos: string[]
	selectedSido: string | null
	onSidoChange: (sido: string | null) => void
	disabled?: boolean
}

export function RegionSidoFilter({
	sidos,
	selectedSido,
	onSidoChange,
	disabled = false,
}: RegionSidoFilterProps) {
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

	const chipLabel = selectedSido ?? "지역"

	function handleSelect(sido: string) {
		onSidoChange(sido)
		setIsOpen(false)
	}

	return (
		<div ref={containerRef} className="relative inline-block">
			<Chip
				label={chipLabel}
				size="medium"
				state={disabled ? "disabled" : selectedSido !== null ? "active" : "default"}
				isOpen={isOpen}
				onClick={() => !disabled && setIsOpen((prev) => !prev)}
			/>

			{isOpen && (
				<div className="absolute top-full left-0 z-10 mt-2 min-w-[520px] rounded-xl bg-white p-4 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.12)]">
					<div className="mb-3 text-label-4 font-medium text-label-alternative">
						시/도
					</div>
					<div className="grid grid-cols-5 gap-2">
						{sidos.map((sido) => (
							<button
								key={sido}
								type="button"
								className={`rounded-lg px-3 py-2 text-center text-label-3 font-medium transition-colors ${
									selectedSido === sido
										? "bg-primary text-white"
										: "bg-fill-normal text-label-normal hover:bg-fill-strong"
								}`}
								onClick={() => handleSelect(sido)}
							>
								{sido}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
