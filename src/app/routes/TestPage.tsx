import { CardSectionHeaderSection } from "@/features/test/sections/CardSectionHeaderSection"
import { ChipSection } from "@/features/test/sections/ChipSection"
import { ChipTagSection } from "@/features/test/sections/ChipTagSection"
import { FormControlsSection } from "@/features/test/sections/FormControlsSection"
import { CategoryNavSection } from "@/features/test/sections/CategoryNavSection"
import { BannerSection } from "@/features/test/sections/BannerSection"
import { ToastSection } from "@/features/test/sections/ToastSection"
import { SelectCellSection } from "@/features/test/sections/SelectCellSection"

const TestPage = () => {
	return (
		<div className="flex flex-col gap-8 p-8">
			<CardSectionHeaderSection />

			<hr className="border-line-neutral" />
			<ChipSection />

			<hr className="border-line-neutral" />
			<ChipTagSection />

			<hr className="border-line-neutral" />
			<FormControlsSection />

			<hr className="border-line-neutral" />
			<CategoryNavSection />

			<hr className="border-line-neutral" />
			<SelectCellSection />

			<BannerSection />
			<ToastSection />
		</div>
	);
};

export default TestPage;
