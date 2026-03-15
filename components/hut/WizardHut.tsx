"use client";

import Image from "next/image";
import { CrystalBallHoverCard } from "./CrystalBallDialog";
import { HutActionButtons } from "./HutActionButtons";

export function WizardHut() {
  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pixelated"
        style={{
          backgroundImage: "url(/sprites/hut-background-day.png)",
        }}
      />

      <HutActionButtons />

      <div
        className="absolute z-10 cursor-pointer transition-transform duration-200 focus-visible:outline-none hover:animate-glow-pulse"
        style={{ top: "58%", left: "50%", transform: "translateX(-50%)" }}
      >
        <CrystalBallHoverCard>
          <Image
            src="/sprites/crystal_ball.png"
            alt="Crystal Ball"
            width={360}
            height={360}
            className="pixelated animate-glow-pulse"
          />
        </CrystalBallHoverCard>
      </div>
    </div>
  );
}
