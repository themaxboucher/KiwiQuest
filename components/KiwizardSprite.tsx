import Image from "next/image";
import { cn } from "@/lib/utils";

interface KiwizardSpriteProps {
  size?: number;
  className?: string;
}

export function KiwizardSprite({ size = 900, className }: KiwizardSpriteProps) {
  return (
    <Image
      src="/sprites/kiwizard.webp"
      alt="Kiwi the Wise"
      width={size}
      height={size}
      className={cn(
        "pixelated drop-shadow-[0_0_12px_rgba(200,170,80,0.4)] pointer-events-none",
        className
      )}
    />
  );
}
