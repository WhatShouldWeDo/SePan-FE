export type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "./types";

// 환경 변수에 따라 Mock/실제 API 전환
// VITE_USE_MOCK이 설정되지 않았거나 'true'이면 Mock 사용 (개발 기본값)
const useMock = import.meta.env.VITE_USE_MOCK !== "false";

const api = useMock
	? await import("./authApi.mock")
	: await import("./authApi");

export const {
	login,
	logout,
	getMe,
	checkUsername,
	sendVerification,
	verifyPhone,
	verifyApprovalCode,
	signup,
} = api;
