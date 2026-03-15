"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNearestTask, useCourses, updateTask } from "@/lib/hooks";
import { SPRITE_BY_TYPE } from "@/lib/sprites";
import { BlueParticleBurst } from "./BlueParticleBurst";

const FOCUS_DURATIONS = [25, 60, 90] as const;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const EXIT_DURATION_MS = 700;
type TaskPreviewTask = NonNullable<ReturnType<typeof useNearestTask>>;

function getRelativeDate(dateStr: string) {
  const now = new Date();
  const due = new Date(dateStr + "T00:00:00");
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round(
    (due.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24),
  );

  let label: string;
  if (diffDays < 0) label = `${Math.abs(diffDays)}d overdue`;
  else if (diffDays === 0) label = "due today";
  else if (diffDays === 1) label = "due tomorrow";
  else label = `due in ${diffDays} days`;

  return { label, urgent: diffDays <= 1 };
}

interface NewQuestProps {
  children: React.ReactNode;
}

function FocusTimerButtons({
  onStartTimer,
  label = "Focus timer",
}: {
  onStartTimer: (minutes: number) => void;
  label?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="font-pixel text-[10px] text-blue-200/80 uppercase">
        {label}
      </p>
      <div className="flex gap-2">
        {FOCUS_DURATIONS.map((min) => (
          <Button
            key={min}
            size="sm"
            variant="secondary"
            onClick={() => onStartTimer(min)}
            className="flex-1 font-pixel text-[10px] pixel-borders"
          >
            {min} min
          </Button>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  onStartTimer,
}: {
  onStartTimer: (minutes: number) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-4">
      <p className="font-pixel text-sm text-blue-200/80 text-center pixel-text-shadow">
        No upcoming quests in sight...
      </p>
      <div className="w-full">
        <FocusTimerButtons
          onStartTimer={onStartTimer}
          label="Start a focus session"
        />
      </div>
    </div>
  );
}

function TaskPreview({
  task,
  onCompleteQuest,
  onStartTimer,
}: {
  task: TaskPreviewTask;
  onCompleteQuest?: (task: TaskPreviewTask) => void;
  onStartTimer: (minutes: number) => void;
}) {
  const courses = useCourses();
  const course = courses.find((c) => c.id === task.courseId);

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center gap-3">
        <Image
          src={SPRITE_BY_TYPE[task.type]}
          alt={task.type}
          width={110}
          height={110}
          className="pixelated shrink-0"
        />

        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="font-pixel text-sm text-white uppercase truncate">
            {task.title}
          </p>

          <div className="flex items-center gap-1.5">
            {course && (
              <Badge
                variant="outline"
                className="font-pixel text-[8px] rounded-sm bg-primary/30 text-primary border-primary/30"
              >
                {course.code}
              </Badge>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              {task.dueDate &&
                (() => {
                  const { label, urgent } = getRelativeDate(task.dueDate);
                  return (
                    <Badge
                      className={`font-pixel text-[8px] rounded-sm gap-2 uppercase ${
                        urgent
                          ? "bg-red-800/50 text-red-200 border-red-500/40"
                          : "bg-blue-800/40 text-blue-200/80 border-blue-500/30"
                      }`}
                    >
                      <Calendar className="size-3" />
                      {label}
                    </Badge>
                  );
                })()}
            </div>
          </div>
        </div>
      </div>

      {task.description && (
        <p className="font-pixel text-[10px] text-blue-100/90 leading-relaxed line-clamp-5">
          {task.description}
        </p>
      )}

      <FocusTimerButtons onStartTimer={onStartTimer} />

      <Button
        size="sm"
        onClick={() =>
          onCompleteQuest
            ? onCompleteQuest(task)
            : task.id && updateTask(task.id, { completed: true })
        }
        className="w-full"
      >
        Complete Quest
      </Button>
    </div>
  );
}

export function NewQuest({ children }: NewQuestProps) {
  const [hovered, setHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitingTask, setExitingTask] = useState<TaskPreviewTask | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [, setTick] = useState(0);
  const task = useNearestTask();

  const handleStartTimer = useCallback((minutes: number) => {
    setEndTime(Date.now() + minutes * 60 * 1000);
  }, []);

  useEffect(() => {
    if (endTime === null) return;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      if (remaining <= 0) {
        setEndTime(null);
        return;
      }
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const handleCompleteQuest = useCallback(
    (completedTask: TaskPreviewTask) => {
      if (isExiting || !completedTask.id) return;
      setExitingTask(completedTask);
      setShowParticles(true);
      setIsExiting(true);
      setTimeout(() => {
        updateTask(completedTask.id!, { completed: true });
        setIsExiting(false);
        setExitingTask(null);
      }, EXIT_DURATION_MS);
    },
    [isExiting],
  );

  const showPopover = hovered || isExiting;
  const displayTask = isExiting && exitingTask ? exitingTask : task;
  const remainingSeconds =
    endTime !== null
      ? Math.max(0, Math.floor((endTime - Date.now()) / 1000))
      : 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {endTime !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-99 w-screen h-screen min-w-full min-h-screen flex flex-col items-center justify-center gap-6 bg-blue-950/40 backdrop-blur-lg"
            aria-modal
            aria-label="Focus timer"
          >
            <p
              className="font-pixel text-9xl text-white pixel-text-shadow tabular-nums"
              aria-live="polite"
            >
              {formatTime(remainingSeconds)}
            </p>
            <button onClick={() => setEndTime(null)} className="font-pixel cursor-pointer">
              Cancel
            </button>
          </div>,
          document.body
        )}

      <div className="relative">
        {children}
        {showParticles && (
          <BlueParticleBurst onComplete={() => setShowParticles(false)} />
        )}
      </div>

      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 w-120 rounded-2xl bg-blue-950/60 backdrop-blur-md p-6 shadow-[0_0_60px_20px_rgba(23,37,84,0.7),0_0_100px_40px_rgba(23,37,84,0.4)] transition-all duration-200 ${
          isExiting ? "animate-quest-exit" : "animate-glow-blue"
        } ${
          showPopover
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        {displayTask ? (
          <TaskPreview
            task={displayTask}
            onCompleteQuest={handleCompleteQuest}
            onStartTimer={handleStartTimer}
          />
        ) : (
          <EmptyState onStartTimer={handleStartTimer} />
        )}
      </div>
    </div>
  );
}
