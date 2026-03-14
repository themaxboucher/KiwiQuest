"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkOnboarding() {
      const user = await db.user.get(1);
      if (user?.onboardingComplete) {
        router.replace("/hut");
      } else {
        router.replace("/onboarding");
      }
      setLoading(false);
    }
    checkOnboarding();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="font-pixel text-primary text-sm animate-pulse pixel-text-shadow">
          Loading...
        </div>
      </div>
    );
  }

  return null;
}
