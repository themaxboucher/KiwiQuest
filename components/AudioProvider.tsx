"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";

interface AudioContextValue {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  playing: boolean;
}

const AudioContext = createContext<AudioContextValue>({
  play: () => {},
  pause: () => {},
  toggle: () => {},
  playing: false,
});

export function useAudio() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    audioRef.current?.play();
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setPlaying(true);
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, []);

  return (
    <AudioContext value={{ play, pause, toggle, playing }}>
      <audio ref={audioRef} src="/audio/theme-song.mp3" loop preload="auto" />
      {children}
    </AudioContext>
  );
}
