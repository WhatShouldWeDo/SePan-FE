import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignupStep3PlaceholderProps {
	onBack: () => void;
}

export function SignupStep3Placeholder({
	onBack,
}: SignupStep3PlaceholderProps) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<Construction className="h-16 w-16 text-muted-foreground/50" />
			<h3 className="mt-4 text-lg font-medium">승인코드 입력</h3>
			<p className="mt-2 text-muted-foreground">
				이 단계는 준비 중입니다.
				<br />
				Day 6에서 구현 예정입니다.
			</p>

			<Button
				type="button"
				variant="outline"
				onClick={onBack}
				className="mt-8 h-12 min-w-[120px] text-base"
			>
				이전
			</Button>
		</div>
	);
}
