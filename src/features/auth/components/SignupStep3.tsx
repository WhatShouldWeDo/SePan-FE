import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { step3Schema, type Step3FormData } from "../schemas/signupSchema";
import { verifyApprovalCode } from "../api/authApi";

interface SignupStep3Props {
	defaultValues?: Partial<Step3FormData>;
	onComplete: (data: Step3FormData) => void;
	onBack: () => void;
}

export function SignupStep3({
	defaultValues,
	onComplete,
	onBack,
}: SignupStep3Props) {
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<Step3FormData>({
		resolver: zodResolver(step3Schema),
		mode: "onBlur",
		defaultValues: {
			approvalCode: defaultValues?.approvalCode ?? "",
		},
	});

	const approvalCodeValue = watch("approvalCode");

	// 입력 시 대문자로 자동 변환
	const handleApprovalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const upperCaseValue = e.target.value.toUpperCase();
		setValue("approvalCode", upperCaseValue, { shouldValidate: true });
	};

	// 폼 제출 (승인코드 검증)
	const onSubmit = async (data: Step3FormData) => {
		setServerError(null);

		const result = await verifyApprovalCode(data.approvalCode);

		if (result.success) {
			if (result.data.valid) {
				onComplete(data);
			} else {
				setServerError("승인코드가 유효하지 않습니다");
			}
		} else {
			setServerError(result.error.message ?? "승인코드 검증에 실패했습니다");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			{serverError && (
				<div
					role="alert"
					className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
				>
					{serverError}
				</div>
			)}

			{/* 안내 문구 */}
			<div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
				<p>관리자로부터 받은 승인코드를 입력해주세요.</p>
				<p className="mt-1">영문 대문자와 숫자만 사용할 수 있습니다.</p>
			</div>

			{/* 승인코드 입력 */}
			<div className="space-y-2">
				<Label htmlFor="approvalCode">승인코드</Label>
				<Input
					id="approvalCode"
					type="text"
					placeholder="예: CAMP2026ABC"
					maxLength={20}
					disabled={isSubmitting}
					aria-invalid={!!errors.approvalCode}
					aria-describedby={
						errors.approvalCode ? "approvalCode-error" : undefined
					}
					className="text-base uppercase"
					{...register("approvalCode")}
					value={approvalCodeValue}
					onChange={handleApprovalCodeChange}
				/>
				{errors.approvalCode && (
					<p id="approvalCode-error" className="text-sm text-destructive">
						{errors.approvalCode.message}
					</p>
				)}
				<p className="text-sm text-muted-foreground">
					테스트: CAMP2026으로 시작하는 코드 입력 (예: CAMP2026ABC)
				</p>
			</div>

			{/* 도움말 박스 */}
			<div className="flex items-start gap-2 rounded-md border border-border p-3 text-sm">
				<Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
				<div className="text-muted-foreground">
					<p>승인코드가 없으신가요?</p>
					<p>선거캠프 관리자에게 문의하여 승인코드를 발급받으세요.</p>
				</div>
			</div>

			{/* 버튼 영역 */}
			<div className="flex gap-3 pt-2">
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					disabled={isSubmitting}
					className="h-12 flex-1 text-base"
				>
					이전
				</Button>
				<Button
					type="submit"
					disabled={isSubmitting}
					className="h-12 flex-1 text-base"
				>
					{isSubmitting ? (
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
