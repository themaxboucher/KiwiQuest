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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Starfield background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/30"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
              animation: `glow-pulse ${2 + (i % 3)}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Step indicator */}
      <div className="absolute top-6 left-1/2 flex -translate-x-1/2 gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-8 transition-all duration-300 ${
              i <= step
                ? "bg-primary pixel-borders-gold"
                : "bg-muted pixel-borders"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500" key={step}>
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
