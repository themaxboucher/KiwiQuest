"use client";

import { useState } from "react";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { MascotGreeting } from "@/components/onboarding/MascotGreeting";
import { AddCourses } from "@/components/onboarding/AddCourses";
import { UploadOutlines } from "@/components/onboarding/UploadOutlines";
import { ConfirmTasks } from "@/components/onboarding/ConfirmTasks";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [playerName, setPlayerName] = useState("");

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Full-screen pixelated fantasy background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pixelated"
        style={{ backgroundImage: "url(/sprites/onboarding-bg-day.png)" }}
      />

      {/* Dim overlay so content is readable */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Step indicator — click to navigate to any step */}
      <div className="absolute top-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setStep(i)}
            aria-label={`Go to step ${i + 1} of ${TOTAL_STEPS}`}
            className={`h-2 w-8 transition-all duration-300 cursor-pointer hover:opacity-90 ${
              i <= step
                ? "bg-primary pixel-borders-gold"
                : "bg-black/40 pixel-borders"
            }`}
          />
        ))}
      </div>

      {/* Step content — overlayed directly on the background */}
      <div
        className="relative z-10 w-full max-w-180 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
        key={step}
      >
        {step === 0 && (
          <WelcomeStep
            onComplete={(name) => {
              setPlayerName(name);
              next();
            }}
          />
        )}
        {step === 1 && <MascotGreeting name={playerName} onContinue={next} />}
        {step === 2 && <AddCourses onComplete={next} />}
        {step === 3 && <UploadOutlines onComplete={next} />}
        {step === 4 && <ConfirmTasks />}
      </div>
    </div>
  );
}
