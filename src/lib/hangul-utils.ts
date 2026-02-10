/**
 * 한글 초성 추출/매칭 유틸리티
 *
 * @description
 * - 외부 라이브러리 없이 유니코드 한글 범위(AC00–D7AF)를 이용한 초성 추출
 * - "ㅅㅇ" → "서울" 매칭 지원
 */

/** 한글 초성 19개 (유니코드 순서) */
const CHOSUNG = [
	"ㄱ",
	"ㄲ",
	"ㄴ",
	"ㄷ",
	"ㄸ",
	"ㄹ",
	"ㅁ",
	"ㅂ",
	"ㅃ",
	"ㅅ",
	"ㅆ",
	"ㅇ",
	"ㅈ",
	"ㅉ",
	"ㅊ",
	"ㅋ",
	"ㅌ",
	"ㅍ",
	"ㅎ",
] as const;

/** 한글 음절 시작 코드포인트 */
const HANGUL_START = 0xac00;
/** 한글 음절 끝 코드포인트 */
const HANGUL_END = 0xd7af;
/** 중성 × 종성 = 21 × 28 = 588 */
const JUNGSUNG_JONGSUNG = 588;

/** 문자가 한글 음절(가~힣)인지 확인 */
function isHangulSyllable(char: string): boolean {
	const code = char.charCodeAt(0);
	return code >= HANGUL_START && code <= HANGUL_END;
}

/** 문자가 초성 자모(ㄱ~ㅎ)인지 확인 */
function isChosung(char: string): boolean {
	return CHOSUNG.includes(char as (typeof CHOSUNG)[number]);
}

/** 한글 음절에서 초성 추출 */
function getChosung(char: string): string {
	if (!isHangulSyllable(char)) return char;
	const index = Math.floor(
		(char.charCodeAt(0) - HANGUL_START) / JUNGSUNG_JONGSUNG,
	);
	return CHOSUNG[index];
}

/** 문자열의 각 한글 음절에서 초성만 추출 */
export function extractChosung(str: string): string {
	return Array.from(str).map(getChosung).join("");
}

/**
 * 쿼리가 초성 패턴인지 확인 (모든 문자가 초성 자모)
 * 공백은 무시
 */
export function isChosungQuery(query: string): boolean {
	const chars = query.replace(/\s/g, "");
	if (chars.length === 0) return false;
	return Array.from(chars).every(isChosung);
}

/**
 * 초성 패턴으로 문자열 매칭
 * @param text - 대상 문자열 (예: "서울특별시")
 * @param chosungQuery - 초성 쿼리 (예: "ㅅㅇ")
 * @returns 매칭 여부
 */
export function matchChosung(text: string, chosungQuery: string): boolean {
	const textChosung = extractChosung(text.replace(/\s/g, ""));
	const query = chosungQuery.replace(/\s/g, "");
	return textChosung.includes(query);
}
