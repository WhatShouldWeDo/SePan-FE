import type { ElectionTerm } from "@/features/pledges/data/mock-candidates"
import type { ElectionType } from "@/features/pledges/data/region-data"
import { SIDO_LIST } from "@/features/pledges/data/region-data"

// MVP 범위: 3회차
export const LOCAL_ELECTION_TERMS: ElectionTerm[] = [
	{ value: 8, label: "제 8회" },
	{ value: 7, label: "제 7회" },
	{ value: 6, label: "제 6회" },
]

export const LOCAL_ELECTION_TYPES: ElectionType[] = [
	{ value: "governor", label: "시·도지사선거" },
	{ value: "council", label: "시·도의회의원선거" },
	{ value: "mayor", label: "구·시·군의장선거" },
]

// re-export for convenience
export { SIDO_LIST }
