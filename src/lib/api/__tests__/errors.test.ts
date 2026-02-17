import { describe, it, expect } from "vitest";
import { parseApiError } from "../errors";
import { ApiClientError } from "../client";

describe("parseApiError", () => {
	it("ApiClientError에서 메시지를 추출한다", () => {
		const error = new ApiClientError("서버 에러", 500, "SERVER_ERROR");
		expect(parseApiError(error)).toBe("서버 에러");
	});

	it("ApiResponse (success: false)에서 에러 메시지를 추출한다", () => {
		const response = {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: "사용자를 찾을 수 없습니다",
			},
		};
		expect(parseApiError(response)).toBe("사용자를 찾을 수 없습니다");
	});

	it("유효성 검사 에러 시 첫 번째 필드의 첫 번째 메시지를 반환한다", () => {
		const response = {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "입력값 오류",
				errors: {
					username: ["아이디는 4자 이상이어야 합니다"],
					password: ["비밀번호는 8자 이상이어야 합니다"],
				},
			},
		};
		expect(parseApiError(response)).toBe("아이디는 4자 이상이어야 합니다");
	});

	it("일반 Error 객체에서 message를 추출한다", () => {
		const error = new Error("네트워크 오류");
		expect(parseApiError(error)).toBe("네트워크 오류");
	});

	it("알 수 없는 타입은 기본 메시지를 반환한다", () => {
		expect(parseApiError(null)).toBe("알 수 없는 오류가 발생했습니다");
		expect(parseApiError(42)).toBe("알 수 없는 오류가 발생했습니다");
		expect(parseApiError(undefined)).toBe("알 수 없는 오류가 발생했습니다");
	});
});
