import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { login } from "../api/authApi";
import { useApiMutation } from "@/lib/api/hooks";

export function LoginForm() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
	});

	const { mutate: loginMutation, isPending } = useApiMutation({
		mutationFn: (data: LoginFormData) => login(data),
		onSuccess: (data) => {
			// 토큰 저장
			localStorage.setItem("auth_token", data.token);
			// 대시보드로 이동
			navigate("/");
		},
	});

	const onSubmit = (data: LoginFormData) => {
		loginMutation(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="username">아이디</Label>
				<Input
					id="username"
					type="text"
					placeholder="아이디를 입력하세요"
					autoComplete="username"
					disabled={isPending}
					aria-invalid={!!errors.username}
					aria-describedby={errors.username ? "username-error" : undefined}
					{...register("username")}
				/>
				{errors.username && (
					<p id="username-error" className="text-sm text-destructive">
						{errors.username.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">비밀번호</Label>
				<Input
					id="password"
					type="password"
					placeholder="비밀번호를 입력하세요"
					autoComplete="current-password"
					disabled={isPending}
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

			<Button
				type="submit"
				className="h-12 w-full text-base"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<Spinner size="sm" className="mr-2" />
						로그인 중...
					</>
				) : (
					"로그인"
				)}
			</Button>
		</form>
	);
}
