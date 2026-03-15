"use client";

import { Volume2, VolumeOff } from "lucide-react";
import { useAudio } from "@/components/AudioProvider";
import { Button } from "@/components/ui/button";

export function AudioToggleButton() {
  const { toggle, playing } = useAudio();

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="size-12 rounded-full bg-card/60 backdrop-blur-sm text-primary hover:bg-card/80"
      onClick={toggle}
    >
      {playing ? <Volume2 className="size-5" /> : <VolumeOff className="size-5" />}
      <span className="sr-only">{playing ? "Pause music" : "Play music"}</span>
    </Button>
  );
}
