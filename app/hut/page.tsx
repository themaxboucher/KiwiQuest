"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { WizardHut } from "@/components/hut/WizardHut";
import { TopBar } from "@/components/hut/TopBar";

export default function HutPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function check() {
      const user = await db.user.get(1);
      if (!user?.onboardingComplete) {
        router.replace("/onboarding");
        return;
      }
      setReady(true);
    }
    check();
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="font-pixel text-primary text-sm animate-pulse pixel-text-shadow">
          Entering the hut...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      <TopBar />
      <WizardHut />
    </div>
  );
}
