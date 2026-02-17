import type { User } from "@/types/common";

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	user: User;
	token: string;
}

export interface SignupRequest {
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

export interface SignupResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}
