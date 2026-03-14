"use client";

import { cn } from "@/lib/utils";

export const ITEM_NAMES = [
  "Potion",
  "Spell Book",
  "Crystal Ball",
  "Scroll",
  "Cauldron",
  "Wand",
];

// Sprite sheet: 6 items in a row, ~1024px total width
const SPRITE_OFFSETS = [
  { x: 0, w: 130 },
  { x: 130, w: 170 },
  { x: 300, w: 160 },
  { x: 460, w: 160 },
  { x: 620, w: 170 },
  { x: 790, w: 180 },
];

interface HutItemProps {
  slotIndex: number;
  courseCode?: string;
  hasIncompleteTasks: boolean;
  allComplete: boolean;
  taskCount?: number;
  onClick: () => void;
  position: { top: string; left: string };
}

export function HutItem({
  slotIndex,
  courseCode,
  hasIncompleteTasks,
  allComplete,
  taskCount,
  onClick,
  position,
}: HutItemProps) {
  const sprite = SPRITE_OFFSETS[slotIndex];
  if (!sprite) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute flex flex-col items-center gap-1 group cursor-pointer transition-all duration-200 hover:scale-110 hover:-translate-y-1",
        hasIncompleteTasks && "animate-glow-pulse",
        !courseCode && "opacity-40 hover:opacity-60",
      )}
      style={{ top: position.top, left: position.left }}
      title={courseCode || ITEM_NAMES[slotIndex]}
    >
      <div
        className="relative w-16 h-16 sm:w-20 sm:h-20 pixelated"
        style={{
          backgroundImage: "url(/sprites/item-sprites.png)",
          backgroundSize: "1024px auto",
          backgroundPosition: `-${sprite.x}px center`,
          backgroundRepeat: "no-repeat",
        }}
      >
        {allComplete && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 pixel-borders flex items-center justify-center">
            <span className="font-pixel text-[8px] text-white">✓</span>
          </div>
        )}
        {!allComplete && taskCount != null && taskCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive pixel-borders flex items-center justify-center">
            <span className="font-pixel text-[7px] text-white">{taskCount}</span>
          </div>
        )}
      </div>
      {courseCode && (
        <span className="font-pixel text-[6px] sm:text-[7px] text-primary pixel-text-shadow bg-card/90 px-2 py-0.5 opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {courseCode}
        </span>
      )}
    </button>
  );
}
