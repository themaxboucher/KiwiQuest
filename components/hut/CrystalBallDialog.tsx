"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNearestTask } from "@/lib/hooks";
import { SPRITE_BY_TYPE } from "@/lib/sprites";
import { TodoList } from "./TodoList";

interface CrystalBallHoverCardProps {
  children: React.ReactNode;
}

export function CrystalBallHoverCard({ children }: CrystalBallHoverCardProps) {
  const task = useNearestTask();

  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent
        side="top"
        sideOffset={12}
        className="bg-blue-950/60 backdrop-blur-md ring-0 animate-glow-blue rounded-2xl shadow-[0_0_60px_20px_rgba(23,37,84,0.7),0_0_100px_40px_rgba(23,37,84,0.4)] w-96"
      >
        {!task ? (
          <div className="flex items-center justify-center py-6">
            <p className="font-pixel text-sm text-blue-200/80 text-center pixel-text-shadow">
              No upcoming quests in sight...
            </p>
          </div>
        ) : (
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
                <p className="font-pixel text-sm text-blue-100 truncate">
                  {task.title}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge className="font-pixel text-[8px] rounded-sm bg-blue-800/40 text-blue-200/80 border-blue-500/30 capitalize">
                    {task.type}
                  </Badge>
                  {task.dueDate && (
                    <Badge className="font-pixel text-[8px] rounded-sm bg-blue-800/40 text-blue-200/80 border-blue-500/30 gap-1">
                      <Calendar className="size-3" />
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <ScrollArea className="max-h-[200px]">
              <TodoList
                taskId={task.id!}
                taskTitle={task.title}
                taskDescription={task.description}
                taskType={task.type}
              />
            </ScrollArea>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
