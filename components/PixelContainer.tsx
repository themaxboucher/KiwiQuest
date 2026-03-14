"use client";

import { cn } from "@/lib/utils";

interface PixelContainerProps {
  children: React.ReactNode;
  className?: string;
  gold?: boolean;
}

export function PixelContainer({
  children,
  className,
  gold = false,
}: PixelContainerProps) {
  return (
    <div
      className={cn(
        "bg-card p-6",
        gold ? "pixel-borders-gold" : "pixel-borders",
        className
      )}
    >
      {children}
    </div>
  );
}
