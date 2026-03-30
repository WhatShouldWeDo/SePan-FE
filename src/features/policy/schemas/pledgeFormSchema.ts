import { z } from "zod";

export const pledgeFormSchema = z.object({
	title: z
		.string()
		.min(1, "공약 제목을 입력해주세요")
		.max(60, "60자 이내로 입력해주세요"),
	summary: z
		.string()
		.min(1, "요약내용을 입력해주세요")
		.max(200, "200자 이내로 입력해주세요"),
	regions: z
		.array(z.string())
		.min(1, "지역을 1개 이상 선택해주세요"),
	categoryIds: z
		.array(z.string())
		.min(1, "카테고리를 1개 이상 선택해주세요"),
	content: z
		.string()
		.max(2000, "2000자 이내로 입력해주세요"),
	status: z.enum(["drafting", "reviewing", "approved", "confirmed"]),
});

export type PledgeFormData = z.infer<typeof pledgeFormSchema>;
