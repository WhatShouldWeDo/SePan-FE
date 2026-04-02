import { cn } from "@/lib/utils";

interface CategoryIconProps {
  iconUrl: string;
  color: string;
  size?: "sm" | "md";
  className?: string;
}

export function CategoryIcon({
  iconUrl,
  color,
  size = "sm",
  className,
}: CategoryIconProps) {
  const sizeConfig =
    size === "sm"
      ? {
          dimension: "w-[14px] h-[14px]",
          maskSize: "11px 11px",
          maskPosition: "1.5px 1.5px",
        }
      : {
          dimension: "w-5 h-5",
          maskSize: "contain",
          maskPosition: "center",
        };

  return (
    <span
      className={cn(sizeConfig.dimension, "inline-block shrink-0", className)}
      style={{
        backgroundColor: color,
        maskImage: `url('${iconUrl}')`,
        WebkitMaskImage: `url('${iconUrl}')`,
        maskSize: sizeConfig.maskSize,
        WebkitMaskSize: sizeConfig.maskSize,
        maskPosition: sizeConfig.maskPosition,
        WebkitMaskPosition: sizeConfig.maskPosition,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
