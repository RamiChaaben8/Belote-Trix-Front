"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CardData } from "@/types";
import { CardBackArtwork, CardFrontArtwork } from "@/components/CardArtwork";

interface Props {
  card?: CardData;
  hidden?: boolean;
  disabled?: boolean;
  highlight?: boolean;
  isWinning?: boolean;
  size?: "sm" | "md" | "lg";
  small?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  layoutId?: string;
  hideBottomRank?: boolean;
}

export function PlayingCard({
  card,
  hidden,
  disabled,
  highlight,
  isWinning,
  size = "md",
  small,
  onClick,
  className,
  style,
  layoutId,
  hideBottomRank,
}: Props) {
  const effectiveSize = small ? "sm" : size;
  // Card dimensions — md is pinned to w-[72px] h-[104px] for predictable geometry
  // CardFan's marginLeft: -36 (half of 72) must match this
  const sizeClasses =
    effectiveSize === "sm"
      ? "w-11 h-16 text-xs rounded-md"
      : effectiveSize === "lg"
      ? "w-20 h-28 sm:w-24 sm:h-36 text-lg sm:text-xl rounded-xl"
      : "w-[72px] h-[104px] text-sm rounded-lg";

  if (hidden || !card) {
    return (
      <div
        style={style}
        className={cn(
          sizeClasses,
          "card-back relative select-none overflow-hidden",
          className
        )}
        aria-label="hidden card"
      >
        <CardBackArtwork />
      </div>
    );
  }

  const cardContent = (
    <div
      style={style}
      data-testid={`card-${card.rank}${card.suit}`}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        sizeClasses,
        "playing-card relative select-none overflow-hidden transition-all duration-200",
        highlight && "ring-4 ring-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.9)] border-emerald-300",
        isWinning && "ring-4 ring-yellow-400 border-yellow-300 shadow-[0_0_35px_rgba(250,204,21,1)] animate-pulse",
        !highlight && !isWinning && "border-slate-300/90 shadow-md",
        onClick && !disabled && "cursor-pointer hover:shadow-2xl hover:border-emerald-400",
        disabled && onClick && "opacity-40 grayscale contrast-75 cursor-not-allowed",
        className
      )}
    >
      <CardFrontArtwork card={card} hideBottomRank={hideBottomRank} />
    </div>
  );

  if (layoutId) {
    return (
      <motion.div layoutId={layoutId} className="relative inline-block">
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}
