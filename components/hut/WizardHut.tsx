"use client";

import { useState } from "react";
import Image from "next/image";
import { CrystalBallDialog } from "./CrystalBallDialog";

export function WizardHut() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pixelated"
        style={{
          backgroundImage: "url(/sprites/hut-background-day.png)",
        }}
      />

      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="absolute z-10 cursor-pointer transition-transform duration-200 focus-visible:outline-none hover:animate-glow-pulse"
        style={{ top: "58%", left: "50%", transform: "translateX(-50%)" }}
      >
        <Image
          src="/sprites/crystal_ball.png"
          alt="Crystal Ball"
          width={360}
          height={360}
          className="pixelated animate-glow-pulse"
        />
      </button>

      <CrystalBallDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
