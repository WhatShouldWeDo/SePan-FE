import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { step1Schema, type Step1FormData } from "../schemas/signupSchema";
import { checkUsername } from "../api";
import { cn } from "@/lib/utils";

interface SignupStep1Props {
	defaultValues?: Partial<Step1FormData>;
	onComplete: (data: Step1FormData) => void;
}

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export function SignupStep1({ defaultValues, onComplete }: SignupStep1Props) {
	const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>(
		defaultValues?.username ? "available" : "idle",
	);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		getValues,
		trigger,
	} = useForm<Step1FormData>({
		resolver: zodResolver(step1Schema),
		mode: "onBlur",
		defaultValues: {
			username: defaultValues?.username ?? "",
			password: defaultValues?.password ?? "",
			passwordConfirm: defaultValues?.passwordConfirm ?? "",
			name: defaultValues?.name ?? "",
		},
	});

	// 아이디 중복 체크 (blur 이벤트)
	const handleUsernameBlur = async () => {
		const username = getValues("username");

		// 필드 유효성 검증 먼저
		const isValid = await trigger("username");
		if (!isValid || !username) {
			setUsernameStatus("invalid");
			return;
		}

		setUsernameStatus("checking");

		const result = await checkUsername(username);
		if (result.success && result.data) {
			setUsernameStatus(result.data.available ? "available" : "taken");
		} else {
			setUsernameStatus("idle");
		}
	};

	const onSubmit = (data: Step1FormData) => {
		// 중복된 아이디면 제출 불가
		if (usernameStatus === "taken") {
			return;
		}
		onComplete(data);
	};

	const isUsernameDisabled =
		usernameStatus === "taken" || usernameStatus === "checking";

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			{/* 아이디 */}
			<div className="space-y-2">
				<Label htmlFor="username">아이디</Label>
				<div className="relative">
					<Input
						id="username"
						type="text"
						placeholder="영문, 숫자, 밑줄 4-20자"
						autoComplete="username"
						disabled={isSubmitting}
						aria-invalid={!!errors.username || usernameStatus === "taken"}
						aria-describedby="username-status"
						{...register("username", {
							onBlur: handleUsernameBlur,
						})}
						className={cn(
							usernameStatus === "available" && "border-green-500 pr-10",
							usernameStatus === "taken" && "border-destructive pr-10",
						)}
					/>
					{/* 상태 아이콘 */}
					{usernameStatus === "checking" && (
						<Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
					)}
					{usernameStatus === "available" && (
						<Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
					)}
					{usernameStatus === "taken" && (
						<X className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
					)}
				</div>
				{/* 에러 또는 상태 메시지 */}
				{errors.username ? (
					<p id="username-status" className="text-sm text-destructive">
						{errors.username.message}
					</p>
				) : usernameStatus === "available" ? (
					<p id="username-status" className="text-sm text-green-600">
						사용 가능한 아이디입니다
					</p>
				) : usernameStatus === "taken" ? (
					<p id="username-status" className="text-sm text-destructive">
						이미 사용 중인 아이디입니다
					</p>
				) : null}
			</div>

			{/* 비밀번호 */}
			<div className="space-y-2">
				<Label htmlFor="password">비밀번호</Label>
				<Input
					id="password"
					type="password"
					placeholder="영문+숫자 조합 8자 이상"
					autoComplete="new-password"
					disabled={isSubmitting}
					aria-invalid={!!errors.password}
					aria-describedby={errors.password ? "password-error" : undefined}
					{...register("password")}
				/>
				{errors.password && (
					<p id="password-error" className="text-sm text-destructive">
						{errors.password.message}
					</p>
				)}
			</div>

			{/* 비밀번호 확인 */}
			<div className="space-y-2">
				<Label htmlFor="passwordConfirm">비밀번호 확인</Label>
				<Input
					id="passwordConfirm"
					type="password"
					placeholder="비밀번호를 다시 입력하세요"
					autoComplete="new-password"
					disabled={isSubmitting}
					aria-invalid={!!errors.passwordConfirm}
					aria-describedby={
						errors.passwordConfirm ? "passwordConfirm-error" : undefined
					}
					{...register("passwordConfirm")}
				/>
				{errors.passwordConfirm && (
					<p id="passwordConfirm-error" className="text-sm text-destructive">
						{errors.passwordConfirm.message}
					</p>
				)}
			</div>

			{/* 이름 */}
			<div className="space-y-2">
				<Label htmlFor="name">이름</Label>
				<Input
					id="name"
					type="text"
					placeholder="한글 또는 영문 2-20자"
					autoComplete="name"
					disabled={isSubmitting}
					aria-invalid={!!errors.name}
					aria-describedby={errors.name ? "name-error" : undefined}
					{...register("name")}
				/>
				{errors.name && (
					<p id="name-error" className="text-sm text-destructive">
						{errors.name.message}
					</p>
				)}
			</div>

			{/* 다음 버튼 */}
			<Button
				type="submit"
				className="h-12 w-full text-base"
				disabled={isSubmitting || isUsernameDisabled}
			>
				{isSubmitting ? (
					<>
						<Spinner size="sm" className="mr-2" />
						처리 중...
					</>
				) : (
					"다음"
				)}
			</Button>
		</form>
	);
}
