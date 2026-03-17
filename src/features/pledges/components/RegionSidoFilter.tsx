import { useEffect, useRef, useState } from "react"
import { Chip } from "@/components/ui/chip"

const COLS = 5
const BTN_W = 150
const GAP = 8

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

	const gridWidth = COLS * BTN_W + (COLS - 1) * GAP

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
				<div className="absolute top-full left-0 z-10 mt-2 rounded-xl bg-white p-5 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.12)]">
					<div className="mb-3 text-label-4 font-medium text-label-alternative">
						시/도
					</div>
					<div
						className="grid gap-2"
						style={{
							gridTemplateColumns: `repeat(${COLS}, 1fr)`,
							width: `${gridWidth}px`,
						}}
					>
						{sidos.map((sido) => (
							<button
								key={sido}
								type="button"
								className={`whitespace-nowrap rounded-lg py-3 text-center text-label-3 font-medium transition-colors ${
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
