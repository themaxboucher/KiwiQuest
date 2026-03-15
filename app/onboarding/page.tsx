"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { MascotGreeting } from "@/components/onboarding/MascotGreeting";
import { UploadOutlines, PostParseMessage } from "@/components/onboarding/UploadOutlines";
import { AudioToggleButton } from "@/components/AudioToggleButton";
import { completeOnboarding } from "@/lib/hooks";

const TOTAL_STEPS = 7;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [playerName, setPlayerName] = useState("");

  const handleFinalComplete = () => {
    completeOnboarding();
    router.push("/hut");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Full-screen pixelated fantasy background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pixelated"
        style={{ backgroundImage: "url(/sprites/onboarding-bg-day.png)" }}
      />

      {/* Dim overlay so content is readable */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Audio toggle — top right */}
      <div className="absolute top-4 right-4 z-20">
        <AudioToggleButton />
      </div>

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

      {/* Step content — overlayed directly on the background. No key so Kiwi stays mounted when only paragraph changes (steps 1–4). */}
      <div className="relative z-10 w-full max-w-220 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {step === 0 && (
          <WelcomeStep
            onComplete={(name) => {
              setPlayerName(name);
              setStep(1);
            }}
          />
        )}
        {step >= 1 && step <= 4 && (
          <MascotGreeting
            paragraphIndex={step - 1}
            name={playerName}
            onNext={() => setStep(step + 1)}
          />
        )}
        {step === 5 && (
          <UploadOutlines onComplete={() => setStep(6)} />
        )}
        {step === 6 && (
          <PostParseMessage onComplete={handleFinalComplete} />
        )}
      </div>
    </div>
  );
}
