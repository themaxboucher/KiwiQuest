"use client";

import Image from "next/image";
import { NewQuest } from "./NewQuest";
import { HutActionButtons } from "./HutActionButtons";
import { KiwizardSprite } from "@/components/KiwizardSprite";

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
        className="absolute z-10"
        style={{ bottom: "19%", left: "21%" }}
      >
        <KiwizardSprite size={130} />
      </div>

      <div
        className="absolute z-10 cursor-pointer transition-transform duration-200 focus-visible:outline-none hover:animate-glow-pulse"
        style={{ top: "50%", left: "50%", transform: "translateX(-50%)" }}
      >
        <NewQuest>
          <Image
            src="/sprites/crystal_ball.png"
            alt="Crystal Ball"
            width={360}
            height={360}
            className="pixelated animate-glow-pulse"
          />
        </NewQuest>
      </div>
    </div>
  );
}
