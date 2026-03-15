"use client";

import { useEffect, useMemo } from "react";

const PARTICLE_COUNT = 32;
const MIN_DISTANCE = 60;
const MAX_DISTANCE = 160;
const DURATION_MS = 800;

/** Blue shades matching the quest panel glow */
const BLUES = [
  "rgb(59, 130, 246)",   // blue-500
  "rgb(96, 165, 250)",   // blue-400
  "rgb(147, 197, 253)",  // blue-300
  "rgb(59, 130, 246)",   // blue-500
];

interface BlueParticleBurstProps {
  onComplete?: () => void;
}

function randomIn(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Renders a blue particle burst from the center of its container. Parent must be position: relative. */
export function BlueParticleBurst({ onComplete }: BlueParticleBurstProps) {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.8;
      const distance = randomIn(MIN_DISTANCE, MAX_DISTANCE);
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      const size = randomIn(4, 10);
      const color = BLUES[Math.floor(Math.random() * BLUES.length)];
      return { id: i, endX, endY, size, color };
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), DURATION_MS);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-sm animate-particle-out"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`,
            ["--px-end-x" as string]: `${p.endX}px`,
            ["--px-end-y" as string]: `${p.endY}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
