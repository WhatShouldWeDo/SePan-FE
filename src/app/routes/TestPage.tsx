import React from "react";
import { DatePicker } from "@/components/ui/date-picker";

const TestPage = () => {
	return (
		<div>
			<div className="flex flex-col gap-4">
				<DatePicker mode="single" />
				<DatePicker mode="range" />
				<DatePicker mode="single" />
				<DatePicker mode="range" />
			</div>
		</div>
	);
};

export default TestPage;
