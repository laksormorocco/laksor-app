"use client";
import { useExchangeRate } from "@/hooks/useExchangeRate";

interface PriceDisplayProps {
  mad: number;
  size?: "sm" | "md" | "lg" | "xl";
  showMad?: boolean;
  className?: string;
}

export default function PriceDisplay({ mad, size = "md", showMad = true, className = "" }: PriceDisplayProps) {
  const { convert, currency } = useExchangeRate();

  const sizeClass = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  }[size];

  const isMad = currency.code === "MAD";

  return (
    <span className={"font-display font-bold text-bronze-500 " + sizeClass + " " + className}>
      {convert(mad)}
      {!isMad && showMad && (
        <span className="font-sans text-[10px] font-normal text-charcoal-400 ml-1">
          (~{mad} MAD)
        </span>
      )}
    </span>
  );
}
