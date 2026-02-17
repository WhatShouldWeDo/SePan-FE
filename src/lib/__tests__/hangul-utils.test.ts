import { describe, it, expect } from "vitest";
import { extractChosung, isChosungQuery, matchChosung } from "../hangul-utils";

describe("extractChosung", () => {
	it("한글 음절에서 초성을 추출한다", () => {
		expect(extractChosung("서울")).toBe("ㅅㅇ");
		expect(extractChosung("대한민국")).toBe("ㄷㅎㅁㄱ");
	});

	it("비한글 문자는 그대로 반환한다", () => {
		expect(extractChosung("abc")).toBe("abc");
		expect(extractChosung("서울시 123")).toBe("ㅅㅇㅅ 123");
	});
});

describe("isChosungQuery", () => {
	it("초성만으로 이루어진 문자열이면 true", () => {
		expect(isChosungQuery("ㅅㅇ")).toBe(true);
		expect(isChosungQuery("ㄱㅁ")).toBe(true);
	});

	it("일반 한글이 포함되면 false", () => {
		expect(isChosungQuery("서울")).toBe(false);
		expect(isChosungQuery("ㅅ울")).toBe(false);
	});

	it("빈 문자열은 false", () => {
		expect(isChosungQuery("")).toBe(false);
	});
});

describe("matchChosung", () => {
	it("초성 패턴으로 지역명을 매칭한다", () => {
		expect(matchChosung("서울특별시", "ㅅㅇ")).toBe(true);
		expect(matchChosung("경기도", "ㄱㄱ")).toBe(true);
	});

	it("매칭되지 않으면 false를 반환한다", () => {
		expect(matchChosung("서울특별시", "ㅂㅈ")).toBe(false);
	});

	it("부분 매칭을 지원한다", () => {
		expect(matchChosung("서울특별시", "ㅌㅂ")).toBe(true);
	});
});
