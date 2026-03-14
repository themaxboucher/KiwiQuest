"use client";

import { useState, useRef, useEffect } from "react";
import { ParchmentBubbleCourse } from "./ParchmentBubble";
import type { Course } from "@/lib/db";

interface ParchmentPileProps {
  course: Course;
  position: { top: string; left: string };
  onClick?: () => void;
}

export function ParchmentPile({ course, position, onClick }: ParchmentPileProps) {
  const [hover, setHover] = useState(false);
  const pileRef = useRef<HTMLButtonElement>(null);
  const [bubblePlace, setBubblePlace] = useState<"left" | "right">("right");

  useEffect(() => {
    if (!pileRef.current || !hover) return;
    const rect = pileRef.current.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    setBubblePlace(spaceRight >= spaceLeft ? "right" : "left");
  }, [hover]);

  return (
    <div
      className="absolute z-10 group"
      style={{ top: position.top, left: position.left }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        ref={pileRef}
        type="button"
        onClick={onClick}
        className="relative w-11 h-14 cursor-pointer transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        title={course.code}
        aria-label={`Parchment pile: ${course.code}`}
      >
        {/* Pile of scrolls - pixel style stacked parchments */}
        <div
          className="absolute inset-0 rounded-sm pixel-borders"
          style={{
            background: "linear-gradient(180deg, oklch(0.82 0.06 75), oklch(0.75 0.07 65))",
            boxShadow: "2px 2px 0 oklch(0.2 0.02 280)",
          }}
        >
          <div className="absolute bottom-1 left-1 right-1 h-2 rounded-sm bg-amber-900/20" />
          <div className="absolute bottom-3 left-2 right-2 h-2 rounded-sm bg-amber-900/15 w-4/5" />
          <div className="absolute bottom-5 left-1.5 right-1.5 h-2 rounded-sm bg-amber-900/10 w-[70%]" />
        </div>
        <span className="sr-only">{course.code}</span>
      </button>

      {hover && (
        <div
          className="pointer-events-none"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            ...(bubblePlace === "right"
              ? { left: "calc(100% + 8px)" }
              : { right: "calc(100% + 8px)" }),
          }}
        >
          <ParchmentBubbleCourse course={course} />
        </div>
      )}
    </div>
  );
}
