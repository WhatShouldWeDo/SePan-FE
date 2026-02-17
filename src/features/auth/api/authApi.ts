import type { User } from "@/types/common";
import type { ApiResponse } from "@/types/api";
import { api } from "@/lib/api/client";
import type {
	LoginRequest,
	LoginResponse,
	SignupRequest,
	SignupResponse,
} from "./types";

export async function login(
	data: LoginRequest,
): Promise<ApiResponse<LoginResponse>> {
	return api.post<ApiResponse<LoginResponse>>("/auth/login", data);
}

export async function logout(): Promise<ApiResponse<void>> {
	return api.post<ApiResponse<void>>("/auth/logout");
}

export async function getMe(): Promise<ApiResponse<User>> {
	return api.get<ApiResponse<User>>("/auth/me");
}

export async function checkUsername(
	username: string,
): Promise<ApiResponse<{ available: boolean }>> {
	return api.get<ApiResponse<{ available: boolean }>>(
		`/auth/check-username?username=${encodeURIComponent(username)}`,
	);
}

export async function sendVerification(
	phone: string,
): Promise<ApiResponse<void>> {
	return api.post<ApiResponse<void>>("/auth/send-verification", { phone });
}

export async function verifyPhone(
	phone: string,
	code: string,
): Promise<ApiResponse<void>> {
	return api.post<ApiResponse<void>>("/auth/verify-phone", { phone, code });
}

export async function verifyApprovalCode(
	code: string,
): Promise<ApiResponse<{ valid: boolean }>> {
	return api.post<ApiResponse<{ valid: boolean }>>(
		"/auth/verify-approval-code",
		{ code },
	);
}

export async function signup(
	data: SignupRequest,
): Promise<ApiResponse<SignupResponse>> {
	return api.post<ApiResponse<SignupResponse>>("/auth/signup", data);
}
