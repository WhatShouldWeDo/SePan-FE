import { useState } from "react";
import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SignupStepper } from "@/features/auth/components/SignupStepper";
import { SignupStep1 } from "@/features/auth/components/SignupStep1";
import { SignupStep2 } from "@/features/auth/components/SignupStep2";
import { SignupStep3Placeholder } from "@/features/auth/components/SignupStep3Placeholder";
import type {
	Step1FormData,
	Step2FormData,
	SignupFormData,
} from "@/features/auth/schemas/signupSchema";

const TOTAL_STEPS = 4;

export function SignupPage() {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<Partial<SignupFormData>>({});

	const handleStep1Complete = (data: Step1FormData) => {
		setFormData((prev) => ({ ...prev, ...data }));
		setCurrentStep(2);
	};

	const handleStep2Complete = (data: Step2FormData) => {
		setFormData((prev) => ({ ...prev, ...data }));
		setCurrentStep(3);
	};

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">회원가입</CardTitle>
				<CardDescription>새 계정을 만들어 서비스를 시작하세요</CardDescription>
			</CardHeader>
			<CardContent>
				<SignupStepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />

				{currentStep === 1 && (
					<SignupStep1
						defaultValues={formData}
						onComplete={handleStep1Complete}
					/>
				)}

				{currentStep === 2 && (
					<SignupStep2
						defaultValues={formData}
						onComplete={handleStep2Complete}
						onBack={() => setCurrentStep(1)}
					/>
				)}

				{currentStep === 3 && (
					<SignupStep3Placeholder onBack={() => setCurrentStep(2)} />
				)}

				{/* Step 4는 Day 6에서 구현 */}

				<div className="mt-6 text-center text-sm">
					이미 계정이 있으신가요?{" "}
					<Link to="/login" className="text-primary hover:underline">
						로그인
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
