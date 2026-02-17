/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
	CircleCheckFill,
	CircleCloseFill,
	CircleInfoFill,
	MegaphoneFill,
	TriangleWarningFill,
} from "@/components/icons";

const bannerVariants = cva(
	"flex items-start gap-1.5 rounded-xl px-[14px] py-3",
	{
		variants: {
			variant: {
				info: "bg-fill-normal",
				notice: "bg-primary/10",
				warning: "bg-status-cautionary-bg",
				error: "bg-status-negative-bg",
				success: "bg-status-positive-bg",
			},
		},
		defaultVariants: {
			variant: "info",
		},
	},
);

const iconMap = {
	info: CircleInfoFill,
	notice: MegaphoneFill,
	warning: TriangleWarningFill,
	error: CircleCloseFill,
	success: CircleCheckFill,
} as const;

const textColorMap = {
	info: "text-label-neutral",
	notice: "text-primary",
	warning: "text-status-cautionary",
	error: "text-status-negative",
	success: "text-status-positive",
} as const;

function Banner({
	variant = "info",
	icon = true,
	action,
	className,
	children,
	...props
}: React.ComponentProps<"div"> &
	VariantProps<typeof bannerVariants> & {
		/** 아이콘 표시 여부 (기본: true) */
		icon?: boolean;
		/** 우측 액션 슬롯 (텍스트 버튼 등) */
		action?: React.ReactNode;
	}) {
	const Icon = iconMap[variant!];
	const colorClass = textColorMap[variant!];

	return (
		<div
			role="status"
			className={cn(bannerVariants({ variant }), className)}
			{...props}
		>
			{icon && (
				<Icon
					className={cn("size-6 shrink-0", colorClass)}
					aria-hidden="true"
				/>
			)}
			<div className="flex flex-1 items-start gap-2">
				<p
					className={cn(
						"flex-1 whitespace-pre-wrap px-1 py-0.5 text-label-3 font-semibold leading-[1.3]",
						colorClass,
					)}
				>
					{children}
				</p>
				{action && (
					<div className="flex shrink-0 items-center justify-center">
						{action}
					</div>
				)}
			</div>
		</div>
	);
}

export { Banner, bannerVariants };
