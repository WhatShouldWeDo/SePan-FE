import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignupStepperProps {
	currentStep: number;
	totalSteps?: number;
}

const STEP_LABELS = ["기본 정보", "휴대폰 인증", "승인코드", "역할 선택"];

export function SignupStepper({
	currentStep,
	totalSteps = 4,
}: SignupStepperProps) {
	return (
		<div className="w-full flex justify-center mb-8">
			<div className="flex items-center w-full gap-2">
				{Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
					const isCompleted = step < currentStep;
					const isCurrent = step === currentStep;

					return (
						<div
							key={step}
							className={cn(
								"flex",
								step < totalSteps && "flex-1",
								"items-center gap-2",
							)}
						>
							{/* Step 아이콘 */}
							<div className="relative flex flex-col items-center">
								<div
									className={cn(
										"flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
										isCompleted &&
											"border-primary bg-primary text-primary-foreground",
										isCurrent && "border-primary bg-primary/10 text-primary",
										!isCompleted &&
											!isCurrent &&
											"border-muted-foreground/30 text-muted-foreground/50",
									)}
								>
									{isCompleted ? (
										<Check className="h-5 w-5" />
									) : (
										<span>{step}</span>
									)}
								</div>
								{/* Step 라벨 */}
								<span
									className={cn(
										"absolute bottom-[-20px] text-xs font-medium whitespace-nowrap",
										isCurrent && "text-primary",
										isCompleted && "text-foreground",
										!isCompleted && !isCurrent && "text-muted-foreground/50",
									)}
								>
									{STEP_LABELS[step - 1]}
								</span>
							</div>

							{/* 연결선 (마지막 Step 제외) */}
							{step < totalSteps && (
								<div
									className={cn(
										"h-0.5 flex-1",
										step < currentStep
											? "bg-primary"
											: "bg-muted-foreground/30",
									)}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
