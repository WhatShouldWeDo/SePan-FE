import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { login } from "../api";
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
			<TextField
				label="아이디"
				placeholder="아이디를 입력하세요"
				autoComplete="username"
				disabled={isPending}
				status={errors.username ? "error" : "default"}
				helperText={errors.username?.message}
				clearable={false}
				{...register("username")}
			/>

			<TextField
				label="비밀번호"
				type="password"
				placeholder="비밀번호를 입력하세요"
				autoComplete="current-password"
				disabled={isPending}
				status={errors.password ? "error" : "default"}
				helperText={errors.password?.message}
				clearable={false}
			  {...register("password")}
			/>

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
