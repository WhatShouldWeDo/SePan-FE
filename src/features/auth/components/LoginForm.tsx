import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { TextField } from "@/components/ui/text-field";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { useAuth } from "../hooks/useAuth";

export function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);
	const { login } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
	});

	const onSubmit = async (data: LoginFormData) => {
		setIsPending(true);
		setLoginError(null);

		const result = await login(data.username, data.password);

		setIsPending(false);

		if (!result.success) {
			setLoginError(result.error ?? "로그인에 실패했습니다");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			{/* 로그인 오류 표시 */}
			{loginError && (
				<div
					role="alert"
					className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
				>
					{loginError}
				</div>
			)}

			{/* 아이디 필드 */}
			<TextField
				label="아이디"
				placeholder="텍스트를 입력해주세요."
				autoComplete="username"
				required
				disabled={isPending}
				status={errors.username ? "error" : "default"}
				helperText={errors.username?.message}
				clearable={false}
				{...register("username")}
			/>

			{/* 비밀번호 필드 */}
			<div className="flex flex-col gap-2">
				<div className="relative">
					<TextField
						label="비밀번호"
						type={showPassword ? "text" : "password"}
						placeholder="텍스트를 입력해주세요."
						autoComplete="current-password"
						required
						disabled={isPending}
						status={errors.password ? "error" : "default"}
						helperText={errors.password?.message}
						clearable={false}
						{...register("password")}
					/>
					{/* Eye toggle - 입력 필드 우측에 절대 위치 */}
					<button
						type="button"
						className="absolute right-4 top-[42px] flex h-11 w-11 items-center justify-center text-label-alternative hover:text-label-neutral"
						onClick={() => setShowPassword((prev) => !prev)}
						tabIndex={-1}
						aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
					>
						{showPassword ? (
							<EyeOff className="size-5" />
						) : (
							<Eye className="size-5" />
						)}
					</button>
				</div>

				{/* 비밀번호를 잊으셨나요? */}
				<div className="flex justify-end">
					<button
						type="button"
						className="py-1 text-[18px] font-semibold leading-[1.3] text-label-alternative hover:text-label-neutral"
					>
						비밀번호를 잊으셨나요?
					</button>
				</div>
			</div>

			{/* 로그인 버튼 */}
			<button
				type="submit"
				disabled={isPending}
				className="flex w-full items-center justify-center rounded-xl bg-primary px-7 py-[15px] text-[18px] font-semibold leading-[1.3] text-white transition-colors hover:bg-primary-strong disabled:pointer-events-none disabled:opacity-50"
			>
				{isPending ? (
					<>
						<Spinner size="sm" className="mr-2" />
						로그인 중...
					</>
				) : (
					"로그인"
				)}
			</button>
		</form>
	);
}
