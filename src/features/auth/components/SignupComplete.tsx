import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignupCompleteProps {
	userName: string;
}

const REDIRECT_DELAY = 3000; // 3초

export function SignupComplete({ userName }: SignupCompleteProps) {
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState(REDIRECT_DELAY / 1000);

	useEffect(() => {
		// 카운트다운
		const countdownInterval = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(countdownInterval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		// 자동 리다이렉트
		const redirectTimeout = setTimeout(() => {
			navigate("/");
		}, REDIRECT_DELAY);

		return () => {
			clearInterval(countdownInterval);
			clearTimeout(redirectTimeout);
		};
	}, [navigate]);

	const handleNavigate = () => {
		navigate("/");
	};

	return (
		<div className="flex flex-col items-center justify-center py-8 text-center">
			{/* 체크 아이콘 */}
			<div className="animate-in zoom-in-50 duration-500">
				<CheckCircle2 className="h-20 w-20 text-green-500" />
			</div>

			{/* 완료 메시지 */}
			<h2 className="mt-6 text-2xl font-bold">회원가입이 완료되었습니다!</h2>
			<p className="mt-2 text-lg text-muted-foreground">
				{userName}님, 환영합니다
			</p>

			{/* 리다이렉트 안내 */}
			<p className="mt-4 text-sm text-muted-foreground">
				{countdown > 0
					? `${countdown}초 후 대시보드로 이동합니다...`
					: "대시보드로 이동합니다..."}
			</p>

			{/* 대시보드 이동 버튼 */}
			<Button onClick={handleNavigate} className="mt-8 h-12 px-8 text-base">
				대시보드로 이동
			</Button>
		</div>
	);
}
