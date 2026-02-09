import type { User } from "@/types/common";
import type { ApiResponse } from "@/types/api";

// Mock 사용자 데이터
const MOCK_USER: User = {
	id: "1",
	username: "test",
	name: "홍길동",
	email: "hong@example.com",
	phone: "010-1234-5678",
	role: "candidate",
	createdAt: new Date().toISOString(),
};

interface LoginRequest {
	username: string;
	password: string;
}

interface LoginResponse {
	user: User;
	token: string;
}

// Mock 지연 시뮬레이션
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(
	data: LoginRequest,
): Promise<ApiResponse<LoginResponse>> {
	// 네트워크 지연 시뮬레이션
	await delay(800);

	// Mock 로그인 검증
	if (data.username === "test" && data.password === "test1234") {
		const token = `mock_token_${Date.now()}`;
		return {
			success: true,
			data: {
				user: MOCK_USER,
				token,
			},
		};
	}

	// 로그인 실패
	return {
		success: false,
		error: {
			code: "INVALID_CREDENTIALS",
			message: "아이디 또는 비밀번호가 올바르지 않습니다",
		},
	};
}

export async function logout(): Promise<ApiResponse<void>> {
	await delay(300);
	return { success: true, data: undefined };
}

export async function getMe(): Promise<ApiResponse<User>> {
	await delay(500);

	const token = localStorage.getItem("auth_token");
	if (!token) {
		return {
			success: false,
			error: {
				code: "UNAUTHORIZED",
				message: "인증이 필요합니다",
			},
		};
	}

	return {
		success: true,
		data: MOCK_USER,
	};
}

// 아이디 중복 확인 (회원가입 Step 1)
export async function checkUsername(
	username: string,
): Promise<ApiResponse<{ available: boolean }>> {
	await delay(500);

	// Mock: username이 "test"이면 이미 사용 중
	const available = username !== "test";

	return {
		success: true,
		data: { available },
	};
}

// 인증번호 발송 (회원가입 Step 2)
export async function sendVerification(
	phone: string,
): Promise<ApiResponse<void>> {
	await delay(800);

	// Mock: 항상 성공
	console.log(`[Mock] 인증번호 발송: ${phone}`);

	return {
		success: true,
		data: undefined,
	};
}

// 인증번호 확인 (회원가입 Step 2)
export async function verifyPhone(
	phone: string,
	code: string,
): Promise<ApiResponse<void>> {
	await delay(500);

	// Mock: code가 "123456"이면 성공
	if (code === "123456") {
		console.log(`[Mock] 인증 성공: ${phone}`);
		return {
			success: true,
			data: undefined,
		};
	}

	return {
		success: false,
		error: {
			code: "INVALID_CODE",
			message: "인증번호가 올바르지 않습니다",
		},
	};
}

// 승인코드 검증 (회원가입 Step 3)
export async function verifyApprovalCode(
	code: string,
): Promise<ApiResponse<{ valid: boolean }>> {
	await delay(600);

	// Mock: "CAMP2026"으로 시작하면 유효
	const valid = code.startsWith("CAMP2026");

	if (valid) {
		console.log(`[Mock] 승인코드 유효: ${code}`);
		return {
			success: true,
			data: { valid: true },
		};
	}

	return {
		success: false,
		error: {
			code: "INVALID_APPROVAL_CODE",
			message: "유효하지 않은 승인코드입니다",
		},
	};
}

// 회원가입 요청 타입
interface SignupRequest {
	username: string;
	password: string;
	name: string;
	phone: string;
	approvalCode: string;
	role: "candidate" | "manager" | "accountant" | "staff";
	sidoId: string;
	constituencyId: string;
	additionalInfo?: string;
}

// 회원가입 응답 타입 (로그인과 동일한 형태로 토큰 즉시 발급)
interface SignupResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}

// 회원가입 (회원가입 Step 4 완료 후)
export async function signup(
	data: SignupRequest,
): Promise<ApiResponse<SignupResponse>> {
	await delay(1000);

	// Mock: 항상 성공
	console.log("[Mock] 회원가입 완료:", data);

	const newUser: User = {
		id: `user_${Date.now()}`,
		username: data.username,
		name: data.name,
		phone: data.phone,
		role: data.role,
		regionId: data.constituencyId,
		createdAt: new Date().toISOString(),
	};

	return {
		success: true,
		data: {
			accessToken: `mock_access_token_${Date.now()}`,
			refreshToken: `mock_refresh_token_${Date.now()}`,
			user: newUser,
		},
	};
}
