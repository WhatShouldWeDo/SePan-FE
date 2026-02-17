import { describe, it, expect } from "vitest";
import {
	interpolateOklch,
	getChoroplethColor,
} from "../choropleth-utils";

describe("interpolateOklch", () => {
	it("t=0이면 colorMin을 반환한다", () => {
		const result = interpolateOklch("0.95 0.02 250", "0.45 0.20 250", 0);
		expect(result).toBe("oklch(0.950 0.020 250.0)");
	});

	it("t=1이면 colorMax를 반환한다", () => {
		const result = interpolateOklch("0.95 0.02 250", "0.45 0.20 250", 1);
		expect(result).toBe("oklch(0.450 0.200 250.0)");
	});

	it("t=0.5이면 중간값을 반환한다", () => {
		const result = interpolateOklch("0.90 0.00 0", "0.50 0.10 100", 0.5);
		expect(result).toBe("oklch(0.700 0.050 50.0)");
	});

	it("t를 0~1 범위로 클램핑한다", () => {
		const min = interpolateOklch("0.95 0.02 250", "0.45 0.20 250", -1);
		const max = interpolateOklch("0.95 0.02 250", "0.45 0.20 250", 2);
		expect(min).toBe("oklch(0.950 0.020 250.0)");
		expect(max).toBe("oklch(0.450 0.200 250.0)");
	});
});

describe("getChoroplethColor", () => {
	const config = {
		colorMin: "0.95 0.02 250",
		colorMax: "0.45 0.20 250",
		legendTitle: "인구",
		legendUnit: "명",
	};

	it("데이터가 없는 코드에는 null을 반환한다", () => {
		const data = { values: { "11": 100 } };
		expect(getChoroplethColor("99", data, config)).toBeNull();
	});

	it("최솟값은 colorMin 근처 색상을 반환한다", () => {
		const data = { values: { "11": 0, "22": 100 } };
		const result = getChoroplethColor("11", data, config);
		expect(result).toBe("oklch(0.950 0.020 250.0)");
	});

	it("min === max이면 중간색을 반환한다", () => {
		const data = { values: { "11": 50 } };
		const result = getChoroplethColor("11", data, config);
		expect(result).toContain("oklch(");
	});
});
