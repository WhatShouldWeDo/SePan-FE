import { cn } from "@/lib/utils";

interface CardSectionProps {
	children: React.ReactNode;
	className?: string;
}

export function CardSection({ children, className }: CardSectionProps) {
	return (
		<section
			className={cn(
				"flex flex-col gap-8 rounded-3xl bg-white p-8 shadow-[0_0_4px_rgba(9,9,85,0.04)]",
				className,
			)}
		>
			{children}
		</section>
	);
}
