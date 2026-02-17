import type { User } from "@/types/common";
import type { ApiResponse } from "@/types/api";
import type {
	LoginRequest,
	LoginResponse,
	SignupRequest,
	SignupResponse,
} from "./types";

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

// Mock 지연 시뮬레이션
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(
	data: LoginRequest,
): Promise<ApiResponse<LoginResponse>> {
	await delay(800);

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

export async function checkUsername(
	username: string,
): Promise<ApiResponse<{ available: boolean }>> {
	await delay(500);

	const available = username !== "test";

	return {
		success: true,
		data: { available },
	};
}

export async function sendVerification(
	_phone: string,
): Promise<ApiResponse<void>> {
	await delay(800);

	return {
		success: true,
		data: undefined,
	};
}

export async function verifyPhone(
	_phone: string,
	code: string,
): Promise<ApiResponse<void>> {
	await delay(500);

	if (code === "123456") {
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

export async function verifyApprovalCode(
	code: string,
): Promise<ApiResponse<{ valid: boolean }>> {
	await delay(600);

	const valid = code.startsWith("CAMP2026");

	if (valid) {
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

export async function signup(
	data: SignupRequest,
): Promise<ApiResponse<SignupResponse>> {
	await delay(1000);

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
