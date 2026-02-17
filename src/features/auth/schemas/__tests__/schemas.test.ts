import { describe, it, expect } from "vitest";
import { loginSchema } from "../loginSchema";
import { step1Schema, step2Schema, step3Schema } from "../signupSchema";

describe("loginSchema", () => {
	it("올바른 입력을 통과시킨다", () => {
		const result = loginSchema.safeParse({
			username: "testuser",
			password: "password123",
		});
		expect(result.success).toBe(true);
	});

	it("짧은 아이디를 거부한다", () => {
		const result = loginSchema.safeParse({
			username: "ab",
			password: "password123",
		});
		expect(result.success).toBe(false);
	});

	it("빈 비밀번호를 거부한다", () => {
		const result = loginSchema.safeParse({
			username: "testuser",
			password: "",
		});
		expect(result.success).toBe(false);
	});
});

describe("step1Schema (회원가입 기본 정보)", () => {
	const validData = {
		username: "newuser",
		password: "pass1234",
		passwordConfirm: "pass1234",
		name: "홍길동",
	};

	it("올바른 입력을 통과시킨다", () => {
		const result = step1Schema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("비밀번호 불일치를 거부한다", () => {
		const result = step1Schema.safeParse({
			...validData,
			passwordConfirm: "different",
		});
		expect(result.success).toBe(false);
	});

	it("영문/숫자 미포함 비밀번호를 거부한다", () => {
		const result = step1Schema.safeParse({
			...validData,
			password: "onlyletters",
			passwordConfirm: "onlyletters",
		});
		expect(result.success).toBe(false);
	});
});

describe("step2Schema (휴대폰 인증)", () => {
	it("올바른 전화번호 형식을 통과시킨다", () => {
		const result = step2Schema.safeParse({
			phone: "010-1234-5678",
			verificationCode: "123456",
		});
		expect(result.success).toBe(true);
	});

	it("잘못된 전화번호 형식을 거부한다", () => {
		const result = step2Schema.safeParse({
			phone: "01012345678",
			verificationCode: "123456",
		});
		expect(result.success).toBe(false);
	});

	it("6자리가 아닌 인증번호를 거부한다", () => {
		const result = step2Schema.safeParse({
			phone: "010-1234-5678",
			verificationCode: "1234",
		});
		expect(result.success).toBe(false);
	});
});

describe("step3Schema (승인코드)", () => {
	it("영문 대문자+숫자 조합을 통과시킨다", () => {
		const result = step3Schema.safeParse({
			approvalCode: "CAMP2026A",
		});
		expect(result.success).toBe(true);
	});

	it("소문자를 거부한다", () => {
		const result = step3Schema.safeParse({
			approvalCode: "camp2026a",
		});
		expect(result.success).toBe(false);
	});
});
