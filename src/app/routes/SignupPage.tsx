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
import { SignupStep3 } from "@/features/auth/components/SignupStep3";
import { SignupStep4 } from "@/features/auth/components/SignupStep4";
import { SignupComplete } from "@/features/auth/components/SignupComplete";
import { signup } from "@/features/auth/api/authApi";
import type {
	Step1FormData,
	Step2FormData,
	Step3FormData,
	Step4FormData,
	SignupFormData,
} from "@/features/auth/schemas/signupSchema";

const TOTAL_STEPS = 4;

export function SignupPage() {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<Partial<SignupFormData>>({});
	const [isComplete, setIsComplete] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const handleStep1Complete = (data: Step1FormData) => {
		setFormData((prev) => ({ ...prev, ...data }));
		setCurrentStep(2);
	};

	const handleStep2Complete = (data: Step2FormData) => {
		setFormData((prev) => ({ ...prev, ...data }));
		setCurrentStep(3);
	};

	const handleStep3Complete = (data: Step3FormData) => {
		setFormData((prev) => ({ ...prev, ...data }));
		setCurrentStep(4);
	};

	const handleStep4Complete = async (data: Step4FormData) => {
		setIsSubmitting(true);
		setSubmitError(null);

		// 전체 데이터 조합
		const finalData: SignupFormData = {
			...formData,
			...data,
		} as SignupFormData;

		// 회원가입 API 호출
		const result = await signup({
			username: finalData.username,
			password: finalData.password,
			name: finalData.name,
			phone: finalData.phone,
			approvalCode: finalData.approvalCode,
			role: finalData.role,
			sidoId: finalData.sidoId,
			constituencyId: finalData.constituencyId,
			additionalInfo: finalData.additionalInfo,
		});

		setIsSubmitting(false);

		if (result.success) {
			// 토큰 저장 (자동 로그인)
			localStorage.setItem("auth_token", result.data.accessToken);
			localStorage.setItem("refresh_token", result.data.refreshToken);

			// 완료 화면으로 전환
			setIsComplete(true);
		} else {
			setSubmitError(result.error.message ?? "회원가입에 실패했습니다");
		}
	};

	// 가입 완료 화면
	if (isComplete) {
		return (
			<Card>
				<CardContent className="pt-6">
					<SignupComplete userName={formData.name ?? "회원"} />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">회원가입</CardTitle>
				<CardDescription>새 계정을 만들어 서비스를 시작하세요</CardDescription>
			</CardHeader>
			<CardContent>
				<SignupStepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />

				{/* 제출 오류 표시 */}
				{submitError && (
					<div
						role="alert"
						className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
					>
						{submitError}
					</div>
				)}

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
					<SignupStep3
						defaultValues={formData}
						onComplete={handleStep3Complete}
						onBack={() => setCurrentStep(2)}
					/>
				)}

				{currentStep === 4 && (
					<SignupStep4
						defaultValues={formData}
						onComplete={handleStep4Complete}
						onBack={() => setCurrentStep(3)}
					/>
				)}

				{/* isSubmitting 상태일 때 오버레이 (Step 4 제출 중) */}
				{isSubmitting && (
					<div className="absolute inset-0 flex items-center justify-center bg-background/80">
						<div className="text-center flex flex-col items-center justify-center">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
							<p className="mt-2 text-sm text-muted-foreground">
								회원가입 처리 중...
							</p>
						</div>
					</div>
				)}

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
