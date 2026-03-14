"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PixelContainer } from "@/components/PixelContainer";
import {
  useCourses,
  useAllTasks,
  deleteTask,
  addTask,
  completeOnboarding,
} from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Sparkles } from "lucide-react";
import type { Task } from "@/lib/db";

const TYPE_COLORS: Record<string, string> = {
  assignment: "bg-blue-600/30 text-blue-300 border-blue-500/30",
  quiz: "bg-green-600/30 text-green-300 border-green-500/30",
  test: "bg-orange-600/30 text-orange-300 border-orange-500/30",
  exam: "bg-red-600/30 text-red-300 border-red-500/30",
  other: "bg-purple-600/30 text-purple-300 border-purple-500/30",
};

export function ConfirmTasks() {
  const router = useRouter();
  const courses = useCourses();
  const tasks = useAllTasks();
  const [adding, setAdding] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({ title: "", type: "assignment" as Task["type"] });
  const [finishing, setFinishing] = useState(false);

  const tasksByCourse = courses.map((course) => ({
    course,
    tasks: tasks.filter((t) => t.courseId === course.id),
  }));

  const handleAddTask = async (courseId: number) => {
    if (!newTask.title.trim()) return;
    await addTask({
      courseId,
      title: newTask.title.trim(),
      type: newTask.type,
      description: "",
      completed: false,
    });
    setNewTask({ title: "", type: "assignment" });
    setAdding(null);
  };

  const handleFinish = async () => {
    setFinishing(true);
    await completeOnboarding();
    router.replace("/hut");
  };

  return (
    <PixelContainer gold className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
      <div className="text-center space-y-2">
        <h2 className="font-pixel text-sm text-primary pixel-text-shadow">
          Confirm Your Quests
        </h2>
        <p className="font-pixel text-[8px] text-muted-foreground leading-relaxed">
          Review the extracted tasks. You can edit, delete, or add new ones.
        </p>
      </div>

      {tasksByCourse.map(({ course, tasks: courseTasks }) => (
        <div key={course.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-pixel text-[10px] text-accent">
              {course.code}
            </h3>
            <span className="font-pixel text-[8px] text-muted-foreground">
              ({courseTasks.length} quests)
            </span>
          </div>

          <div className="space-y-1">
            {courseTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 pixel-borders bg-background px-3 py-2"
              >
                <Badge
                  variant="outline"
                  className={`font-pixel text-[7px] shrink-0 ${TYPE_COLORS[task.type] || ""}`}
                >
                  {task.type}
                </Badge>
                <span className="font-pixel text-[8px] text-foreground flex-1 truncate">
                  {task.title}
                </span>
                {task.dueDate && (
                  <span className="font-pixel text-[7px] text-muted-foreground shrink-0">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                {task.weight != null && (
                  <span className="font-pixel text-[7px] text-primary shrink-0">
                    {task.weight}%
                  </span>
                )}
                <button
                  onClick={() => task.id && deleteTask(task.id)}
                  className="text-destructive hover:text-destructive/80 shrink-0 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}

            {adding === course.id ? (
              <div className="flex gap-2 pixel-borders bg-background p-2">
                <select
                  value={newTask.type}
                  onChange={(e) =>
                    setNewTask({ ...newTask, type: e.target.value as Task["type"] })
                  }
                  className="pixel-borders bg-muted font-pixel text-[8px] px-2 py-1 text-foreground"
                >
                  <option value="assignment">Assignment</option>
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="exam">Exam</option>
                  <option value="other">Other</option>
                </select>
                <Input
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddTask(course.id!)
                  }
                  placeholder="Task title..."
                  className="flex-1 pixel-borders bg-muted font-pixel text-[8px]"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={() => handleAddTask(course.id!)}
                  className="font-pixel text-[8px] pixel-borders-gold bg-primary text-primary-foreground cursor-pointer"
                >
                  Add
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setAdding(course.id!)}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-pixel text-[8px] py-1 cursor-pointer"
              >
                <Plus size={12} />
                Add quest
              </button>
            )}
          </div>
        </div>
      ))}

      {tasks.length === 0 && (
        <div className="text-center py-8">
          <Sparkles className="mx-auto mb-2 text-muted-foreground" size={24} />
          <p className="font-pixel text-[8px] text-muted-foreground">
            No quests yet. Add some manually or go back and upload outlines.
          </p>
        </div>
      )}

      <Button
        onClick={handleFinish}
        disabled={finishing}
        className="w-full font-pixel text-[10px] pixel-borders-gold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
      >
        {finishing ? "Entering the hut..." : "Confirm & Enter the Hut"}
      </Button>
    </PixelContainer>
  );
}
