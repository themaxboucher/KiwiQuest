"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNearestTask, useCourses, updateTask } from "@/lib/hooks";
import { SPRITE_BY_TYPE } from "@/lib/sprites";
import { TodoList } from "./TodoList";
import { BlueParticleBurst } from "./BlueParticleBurst";

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

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-6">
      <p className="font-pixel text-sm text-blue-200/80 text-center pixel-text-shadow">
        No upcoming quests in sight...
      </p>
    </div>
  );
}

function TaskPreview({
  task,
  onCompleteQuest,
}: {
  task: TaskPreviewTask;
  onCompleteQuest?: (task: TaskPreviewTask) => void;
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

      <ScrollArea className="max-h-[200px]">
        <TodoList taskId={task.id!} />
      </ScrollArea>

      <Button
        size="sm"
        onClick={() => (onCompleteQuest ? onCompleteQuest(task) : task.id && updateTask(task.id, { completed: true }))}
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
  const task = useNearestTask();

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
    [isExiting]
  );

  const showPopover = hovered || isExiting;
  const displayTask = isExiting && exitingTask ? exitingTask : task;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
          <TaskPreview task={displayTask} onCompleteQuest={handleCompleteQuest} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
