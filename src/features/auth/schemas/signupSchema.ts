import { z } from "zod";

// Step 1: 기본 정보 스키마
export const step1Schema = z
	.object({
		username: z
			.string()
			.min(1, "아이디를 입력해주세요")
			.min(4, "아이디는 4자 이상이어야 합니다")
			.max(20, "아이디는 20자 이하여야 합니다")
			.regex(
				/^[a-zA-Z0-9_]+$/,
				"아이디는 영문, 숫자, 밑줄(_)만 사용할 수 있습니다",
			),
		password: z
			.string()
			.min(1, "비밀번호를 입력해주세요")
			.min(8, "비밀번호는 8자 이상이어야 합니다")
			.regex(
				/^(?=.*[a-zA-Z])(?=.*[0-9]).+$/,
				"비밀번호는 영문과 숫자를 모두 포함해야 합니다",
			),
		passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
		name: z
			.string()
			.min(1, "이름을 입력해주세요")
			.min(2, "이름은 2자 이상이어야 합니다")
			.max(20, "이름은 20자 이하여야 합니다")
			.regex(/^[가-힣a-zA-Z]+$/, "이름은 한글 또는 영문만 사용할 수 있습니다"),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "비밀번호가 일치하지 않습니다",
		path: ["passwordConfirm"],
	});

export type Step1FormData = z.infer<typeof step1Schema>;

// Step 2: 휴대폰 인증 스키마
export const step2Schema = z.object({
	phone: z
		.string()
		.min(1, "휴대폰 번호를 입력해주세요")
		.regex(
			/^010-\d{4}-\d{4}$/,
			"올바른 휴대폰 번호 형식이 아닙니다 (010-XXXX-XXXX)",
		),
	verificationCode: z
		.string()
		.min(1, "인증번호를 입력해주세요")
		.length(6, "인증번호는 6자리입니다")
		.regex(/^\d+$/, "인증번호는 숫자만 입력해주세요"),
});

export type Step2FormData = z.infer<typeof step2Schema>;

// Step 3: 승인코드 입력 스키마
export const step3Schema = z.object({
	approvalCode: z
		.string()
		.min(1, "승인코드를 입력해주세요")
		.min(8, "승인코드는 8자 이상입니다")
		.max(20, "승인코드는 20자 이하입니다")
		.regex(/^[A-Z0-9]+$/, "영문 대문자와 숫자만 사용할 수 있습니다"),
});

export type Step3FormData = z.infer<typeof step3Schema>;

// Step 4: 역할/지역 선택 스키마
export const step4Schema = z.object({
	role: z.enum(
		["candidate", "manager", "accountant", "staff"],
		"역할을 선택해주세요",
	),
	sidoId: z.string().min(1, "시/도를 선택해주세요"),
	constituencyId: z.string().min(1, "선거구를 선택해주세요"),
	additionalInfo: z.string().optional(),
});

export type Step4FormData = z.infer<typeof step4Schema>;

// 전체 회원가입 데이터 타입
export interface SignupFormData {
	// Step 1
	username: string;
	password: string;
	passwordConfirm: string;
	name: string;
	// Step 2
	phone: string;
	verificationCode: string;
	// Step 3
	approvalCode: string;
	// Step 4
	role: "candidate" | "manager" | "accountant" | "staff";
	sidoId: string;
	constituencyId: string;
	additionalInfo?: string;
}
