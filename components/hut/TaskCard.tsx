"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateTask } from "@/lib/hooks";
import { TodoList } from "./TodoList";
import { ChevronDown, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import type { Task } from "@/lib/db";

const TYPE_COLORS: Record<string, string> = {
  assignment: "bg-blue-600/30 text-blue-300 border-blue-500/30",
  quiz: "bg-green-600/30 text-green-300 border-green-500/30",
  test: "bg-orange-600/30 text-orange-300 border-orange-500/30",
  exam: "bg-red-600/30 text-red-300 border-red-500/30",
  other: "bg-purple-600/30 text-purple-300 border-purple-500/30",
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleComplete = async () => {
    if (task.id) {
      await updateTask(task.id, { completed: !task.completed });
    }
  };

  return (
    <div
      className={`pixel-borders transition-colors ${
        task.completed ? "bg-muted/50 opacity-70" : "bg-background"
      }`}
    >
      <div className="flex items-center gap-2 p-3">
        <button onClick={toggleComplete} className="shrink-0 cursor-pointer">
          {task.completed ? (
            <CheckCircle2 size={16} className="text-green-400" />
          ) : (
            <Circle size={16} className="text-muted-foreground" />
          )}
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer"
        >
          {expanded ? (
            <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight size={14} className="shrink-0 text-muted-foreground" />
          )}

          <Badge
            variant="outline"
            className={`font-pixel text-[7px] shrink-0 ${TYPE_COLORS[task.type] || ""}`}
          >
            {task.type}
          </Badge>

          <span
            className={`font-pixel text-[8px] truncate ${
              task.completed ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {task.title}
          </span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {task.dueDate && (
            <span className="font-pixel text-[7px] text-muted-foreground">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {task.weight != null && (
            <span className="font-pixel text-[7px] text-primary">
              {task.weight}%
            </span>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-border space-y-3">
          {task.description && (
            <p className="font-pixel text-[8px] text-muted-foreground leading-relaxed">
              {task.description}
            </p>
          )}

          <TodoList taskId={task.id!} />

          {!task.completed && (
            <Button
              onClick={toggleComplete}
              className="w-full bg-green-700 text-white hover:bg-green-600"
              size="sm"
            >
              <CheckCircle2 size={12} className="mr-1" />
              Complete Quest
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
