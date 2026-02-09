import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { step4Schema, type Step4FormData } from "../schemas/signupSchema";
import {
	getSidoList,
	getConstituenciesBySido,
	type Sido,
	type Constituency,
} from "../data/mockConstituencies";

interface SignupStep4Props {
	defaultValues?: Partial<Step4FormData>;
	onComplete: (data: Step4FormData) => void;
	onBack: () => void;
}

// 역할 옵션
const ROLE_OPTIONS = [
	{
		value: "candidate",
		label: "후보자",
		description: "선거에 출마하는 본인",
	},
	{
		value: "manager",
		label: "선거사무장",
		description: "캠프 총괄 운영자",
	},
	{
		value: "accountant",
		label: "회계책임자",
		description: "선거 자금 관리",
	},
	{
		value: "staff",
		label: "선거사무원",
		description: "실무 담당자",
	},
] as const;

export function SignupStep4({
	defaultValues,
	onComplete,
	onBack,
}: SignupStep4Props) {
	const sidoList: Sido[] = getSidoList();

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<Step4FormData>({
		resolver: zodResolver(step4Schema),
		mode: "onBlur",
		defaultValues: {
			role: defaultValues?.role ?? undefined,
			sidoId: defaultValues?.sidoId ?? "",
			constituencyId: defaultValues?.constituencyId ?? "",
			additionalInfo: defaultValues?.additionalInfo ?? "",
		},
	});

	const selectedSidoId = watch("sidoId");
	const constituencyList: Constituency[] = selectedSidoId
		? getConstituenciesBySido(selectedSidoId)
		: [];

	// 시도 변경 시 선거구 초기화
	useEffect(() => {
		if (selectedSidoId && selectedSidoId !== defaultValues?.sidoId) {
			setValue("constituencyId", "");
		}
	}, [selectedSidoId, defaultValues?.sidoId, setValue]);

	const onSubmit = (data: Step4FormData) => {
		onComplete(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* 역할 선택 */}
			<div className="space-y-3">
				<Label className="text-base font-medium">역할 선택</Label>
				<Controller
					name="role"
					control={control}
					render={({ field }) => (
						<RadioGroup
							value={field.value}
							onValueChange={field.onChange}
							className="grid gap-3"
						>
							{ROLE_OPTIONS.map((option) => (
								<label
									key={option.value}
									htmlFor={`role-${option.value}`}
									className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-4 hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
								>
									<RadioGroupItem
										value={option.value}
										id={`role-${option.value}`}
									/>
									<div className="flex-1">
										<div className="font-medium">{option.label}</div>
										<div className="text-sm text-muted-foreground">
											{option.description}
										</div>
									</div>
								</label>
							))}
						</RadioGroup>
					)}
				/>
				{errors.role && (
					<p className="text-sm text-destructive">{errors.role.message}</p>
				)}
			</div>

			{/* 지역 선택 (Cascading) */}
			<div className="space-y-4">
				<Label className="text-base font-medium">선거구 선택</Label>

				{/* 시/도 선택 */}
				<div className="space-y-2">
					<Label htmlFor="sidoId" className="text-sm">
						시/도
					</Label>
					<Controller
						name="sidoId"
						control={control}
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger
									id="sidoId"
									className="h-12 w-full text-base"
									aria-invalid={!!errors.sidoId}
								>
									<SelectValue placeholder="시/도를 선택하세요" />
								</SelectTrigger>
								<SelectContent>
									{sidoList.map((sido) => (
										<SelectItem
											key={sido.id}
											value={sido.id}
											className="py-3 text-base"
										>
											{sido.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					{errors.sidoId && (
						<p className="text-sm text-destructive">{errors.sidoId.message}</p>
					)}
				</div>

				{/* 선거구 선택 */}
				<div className="space-y-2">
					<Label htmlFor="constituencyId" className="text-sm">
						선거구
					</Label>
					<Controller
						name="constituencyId"
						control={control}
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={field.onChange}
								disabled={!selectedSidoId}
							>
								<SelectTrigger
									id="constituencyId"
									className="h-12 w-full text-base"
									aria-invalid={!!errors.constituencyId}
								>
									<SelectValue
										placeholder={
											selectedSidoId
												? "선거구를 선택하세요"
												: "먼저 시/도를 선택하세요"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{constituencyList.map((constituency) => (
										<SelectItem
											key={constituency.id}
											value={constituency.id}
											className="py-3 text-base"
										>
											{constituency.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					{errors.constituencyId && (
						<p className="text-sm text-destructive">
							{errors.constituencyId.message}
						</p>
					)}
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
							처리 중...
						</>
					) : (
						"가입 완료"
					)}
				</Button>
			</div>
		</form>
	);
}
