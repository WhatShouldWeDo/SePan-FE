import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { step2Schema, type Step2FormData } from "../schemas/signupSchema";
import { sendVerification, verifyPhone } from "../api";
import { useApiMutation } from "@/lib/api/hooks";

interface SignupStep2Props {
	defaultValues?: Partial<Step2FormData>;
	onComplete: (data: Step2FormData) => void;
	onBack: () => void;
}

const TIMER_DURATION = 180; // 3분 (초)

export function SignupStep2({
	defaultValues,
	onComplete,
	onBack,
}: SignupStep2Props) {
	const [isCodeSent, setIsCodeSent] = useState(false);
	const [timer, setTimer] = useState(0);

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		trigger,
	} = useForm<Step2FormData>({
		resolver: zodResolver(step2Schema),
		mode: "onBlur",
		defaultValues: {
			phone: defaultValues?.phone ?? "",
			verificationCode: defaultValues?.verificationCode ?? "",
		},
	});

	// 인증번호 발송 Mutation
	const { mutate: sendCode, isPending: isSending } = useApiMutation({
		mutationFn: (phone: string) => sendVerification(phone),
		onSuccess: () => {
			setIsCodeSent(true);
			setTimer(TIMER_DURATION);
		},
	});

	// 인증번호 확인 Mutation
	const { mutate: verifyCode, isPending: isVerifying } = useApiMutation({
		mutationFn: (data: Step2FormData) =>
			verifyPhone(data.phone, data.verificationCode),
		onSuccess: (_, variables) => {
			onComplete(variables);
		},
	});

	// 타이머 카운트다운
	useEffect(() => {
		if (timer <= 0) return;

		const interval = setInterval(() => {
			setTimer((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [timer]);

	// 타이머 포맷 (MM:SS)
	const formatTime = useCallback((seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}, []);

	// 인증번호 발송
	const handleSendCode = async () => {
		const phone = getValues("phone");

		// 휴대폰 번호 형식 검증
		const isValid = await trigger("phone");
		if (!isValid) return;

		sendCode(phone);
	};

	// 폼 제출 (인증번호 확인)
	const onSubmit = (data: Step2FormData) => {
		verifyCode(data);
	};

	const isTimerExpired = isCodeSent && timer <= 0;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			{/* 휴대폰 번호 */}
			<div className="space-y-2">
				<Label htmlFor="phone">휴대폰 번호</Label>
				<div className="flex gap-2">
					<Input
						id="phone"
						type="tel"
						placeholder="010-XXXX-XXXX"
						autoComplete="tel"
						disabled={isVerifying || isCodeSent}
						aria-invalid={!!errors.phone}
						aria-describedby={errors.phone ? "phone-error" : undefined}
						className="flex-1"
						{...register("phone")}
					/>
					<Button
						type="button"
						variant={isCodeSent ? "outline" : "default"}
						onClick={handleSendCode}
						disabled={isSending || (isCodeSent && timer > 0)}
						className="h-10 min-w-[120px]"
					>
						{isSending ? (
							<>
								<Spinner size="sm" className="mr-2" />
								발송 중...
							</>
						) : isCodeSent && timer > 0 ? (
							formatTime(timer)
						) : isTimerExpired ? (
							"재발송"
						) : (
							"인증번호 발송"
						)}
					</Button>
				</div>
				{errors.phone && (
					<p id="phone-error" className="text-sm text-destructive">
						{errors.phone.message}
					</p>
				)}
			</div>

			{/* 인증번호 입력 (발송 후에만 표시) */}
			{isCodeSent && (
				<div className="space-y-2">
					<Label htmlFor="verificationCode">인증번호</Label>
					<Input
						id="verificationCode"
						type="text"
						inputMode="numeric"
						placeholder="6자리 인증번호"
						maxLength={6}
						disabled={isVerifying || isTimerExpired}
						aria-invalid={!!errors.verificationCode}
						aria-describedby={
							errors.verificationCode ? "verificationCode-error" : undefined
						}
						{...register("verificationCode")}
					/>
					{errors.verificationCode && (
						<p id="verificationCode-error" className="text-sm text-destructive">
							{errors.verificationCode.message}
						</p>
					)}
					{isTimerExpired && (
						<p className="text-sm text-destructive">
							인증 시간이 만료되었습니다. 재발송 버튼을 눌러주세요.
						</p>
					)}
					<p className="text-sm text-muted-foreground">
						테스트: 인증번호 123456 입력
					</p>
				</div>
			)}

			{/* 버튼 영역 */}
			<div className="flex gap-3 pt-2">
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					disabled={isVerifying}
					className="h-12 flex-1 text-base"
				>
					이전
				</Button>
				<Button
					type="submit"
					disabled={isVerifying || !isCodeSent || isTimerExpired}
					className="h-12 flex-1 text-base"
				>
					{isVerifying ? (
						<>
							<Spinner size="sm" className="mr-2" />
							확인 중...
						</>
					) : (
						"다음"
					)}
				</Button>
			</div>
		</form>
	);
}
