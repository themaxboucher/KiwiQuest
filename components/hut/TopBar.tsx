"use client";

import { useUser, useAllTasks } from "@/lib/hooks";
import { KiwizardSprite } from "@/components/KiwizardSprite";

export function TopBar() {
  const user = useUser();
  const tasks = useAllTasks();
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // XP: each completed task is 100 XP
  const xp = completed * 100;
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-4 px-4 py-2 bg-card/90 backdrop-blur-sm pixel-borders">
      <KiwizardSprite size={32} className="drop-shadow-none" />

      <div className="flex flex-col gap-0.5">
        <span className="font-pixel text-[8px] text-primary pixel-text-shadow">
          {user?.name || "Adventurer"}
        </span>
        <span className="font-pixel text-[6px] text-muted-foreground">
          Level {level} Wizard
        </span>
      </div>

      {/* XP Bar */}
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="flex justify-between">
          <span className="font-pixel text-[6px] text-accent">XP</span>
          <span className="font-pixel text-[6px] text-muted-foreground">
            {xpInLevel}/500
          </span>
        </div>
        <div className="h-2 pixel-borders bg-muted overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-700"
            style={{ width: `${(xpInLevel / 500) * 100}%` }}
          />
        </div>
      </div>

      {/* Quest progress */}
      <div className="flex flex-col items-end gap-0.5">
        <span className="font-pixel text-[6px] text-muted-foreground">
          Quests
        </span>
        <div className="flex items-center gap-1">
          <div className="w-16 h-2 pixel-borders bg-muted overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="font-pixel text-[7px] text-foreground">
            {completed}/{total}
          </span>
        </div>
      </div>
    </div>
  );
}
