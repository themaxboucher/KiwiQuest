"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useCourses,
  useAllTasks,
  deleteTask,
  addTask,
  completeOnboarding,
} from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, ChevronRight, Check, X } from "lucide-react";
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
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    type: "assignment" as Task["type"],
  });
  const [finishing, setFinishing] = useState(false);
  const topCardRef = useRef<{
    swipe: (dir: string) => Promise<void>;
    restoreCard: () => Promise<void>;
  } | null>(null);

  const tasksByCourse = courses.map((course) => ({
    course,
    tasks: tasks.filter((t) => t.courseId === course.id),
  }));

  const currentCourseData = tasksByCourse[currentCourseIndex];
  const currentCourse = currentCourseData?.course;
  const currentTasks = currentCourseData?.tasks ?? [];
  const isLastCourse = currentCourseIndex >= courses.length - 1;
  const hasMoreCourses = courses.length > 1;

  const handleSwipe = useCallback((direction: string, task: Task) => {
    if (direction === "left" && task.id) {
      deleteTask(task.id);
    }
    // right = keep, nothing to do
  }, []);

  const handleCardLeftScreen = useCallback(
    (direction: string, task: Task) => {
      handleSwipe(direction, task);
    },
    [handleSwipe]
  );

  const goNextCourse = useCallback(() => {
    if (currentCourseIndex < courses.length - 1) {
      setCurrentCourseIndex((i) => i + 1);
    }
  }, [currentCourseIndex, courses.length]);

  const handleAddTask = async () => {
    if (!currentCourse?.id || !newTask.title.trim()) return;
    await addTask({
      courseId: currentCourse.id,
      title: newTask.title.trim(),
      type: newTask.type,
      description: "",
      completed: false,
    });
    setNewTask({ title: "", type: "assignment" });
    setAdding(false);
  };

  const handleFinish = async () => {
    setFinishing(true);
    await completeOnboarding();
    router.replace("/hut");
  };

  // Keyboard: Arrow right = keep, Arrow left = delete
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (currentTasks.length === 0) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        topCardRef.current?.swipe("right");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        topCardRef.current?.swipe("left");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentTasks.length]);

  // No courses at all
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h2 className="font-pixel text-2xl text-primary pixel-text-shadow">
            Confirm Your Quests
          </h2>
          <p className="font-pixel text-[10px] text-white/70">
            No courses yet. Go back and add courses first.
          </p>
        </div>
      </div>
    );
  }

  // All courses done — show summary and Continue
  if (currentCourseIndex >= courses.length) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h2 className="font-pixel text-2xl text-primary pixel-text-shadow">
            All set!
          </h2>
          <p className="font-pixel text-[10px] text-white/70">
            You’ve reviewed all quests. Continue to your hut.
          </p>
        </div>
        <Button onClick={handleFinish} disabled={finishing} className="w-fit">
          Continue
        </Button>
      </div>
    );
  }

  const courseCode = currentCourse?.code ?? "";
  const questCount = currentTasks.length;

  return (
    <div className="flex flex-col items-center gap-6 max-h-[85vh] overflow-y-auto">
      <div className="text-center space-y-2">
        <h2 className="font-pixel text-2xl text-primary pixel-text-shadow">
          Confirm Your Quests
        </h2>
        <p className="font-pixel text-[10px] text-white/70">
          Swipe right to keep, left to remove. Course by course.
        </p>
      </div>

      {/* Course header + progress */}
      <div className="w-full max-w-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-pixel text-sm text-accent">{courseCode}</h3>
            <span className="font-pixel text-[10px] text-white/50">
              {questCount} quest{questCount !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="font-pixel text-[8px] text-white/40">
            Course {currentCourseIndex + 1} of {courses.length}
          </span>
        </div>

        {adding ? (
          <div className="flex gap-2 pixel-borders bg-black/40 p-2">
            <select
              value={newTask.type}
              onChange={(e) =>
                setNewTask({ ...newTask, type: e.target.value as Task["type"] })
              }
              className="pixel-borders bg-black/50 font-pixel text-[8px] px-2 py-1 text-white"
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
                e.key === "Enter" && handleAddTask()
              }
              placeholder="Task title..."
              className="flex-1 pixel-borders bg-black/30 font-pixel text-[8px] text-white placeholder:text-white/30 border-none"
              autoFocus
            />
            <Button size="sm" onClick={handleAddTask}>
              Add
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-white/50 hover:text-white/80 font-pixel text-[8px] py-1 cursor-pointer"
          >
            <Plus size={12} />
            Add quest
          </button>
        )}
      </div>

      {/* Card stack */}
      <div className="relative w-full max-w-sm flex flex-col items-center">
        <div
          className="relative w-full"
          style={{ minHeight: "220px" }}
        >
          {currentTasks.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center pixel-borders bg-black/30 rounded-lg py-8">
              <Sparkles className="text-white/40 mb-2" size={28} />
              <p className="font-pixel text-[10px] text-white/50 text-center px-4">
                No quests in this course. Add one above or go to next course.
              </p>
            </div>
          ) : (
            currentTasks.map((task, index) => (
              <div
                key={task.id}
                className="absolute w-full top-0 left-0"
                style={{
                  zIndex: currentTasks.length - index,
                  transform:
                    index === 0
                      ? undefined
                      : `scale(${1 - index * 0.04}) translateY(${index * 8}px)`,
                  pointerEvents: index === 0 ? "auto" : "none",
                }}
              >
                <TinderCard
                  ref={index === 0 ? (topCardRef as React.Ref<{ swipe: (dir?: string) => Promise<void>; restoreCard: () => Promise<void> }>) : undefined}
                  onSwipe={(dir) => handleSwipe(dir, task)}
                  onCardLeftScreen={(dir) => handleCardLeftScreen(dir, task)}
                  preventSwipe={["up", "down"]}
                  className="w-full cursor-grab active:cursor-grabbing"
                >
                  <div className="pixel-borders bg-black rounded-lg p-4 shadow-lg border-2 border-white/10">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={`font-pixel text-[7px] shrink-0 rounded-sm uppercase ${
                          TYPE_COLORS[task.type] || ""
                        }`}
                      >
                        {task.type}
                      </Badge>
                      {task.weight != null && (
                        <span className="font-pixel text-[7px] text-primary">
                          {task.weight}%
                        </span>
                      )}
                    </div>
                    <p className="font-pixel text-sm text-white/95 leading-snug mb-3">
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <p className="font-pixel text-[8px] text-white/50">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex justify-between mt-3 pt-2 border-t border-white/10">
                      <span className="font-pixel text-[8px] text-destructive/90 flex items-center gap-1">
                        <X size={12} /> Swipe left to remove
                      </span>
                      <span className="font-pixel text-[8px] text-green-400/90 flex items-center gap-1">
                        Keep <Check size={12} />
                      </span>
                    </div>
                  </div>
                </TinderCard>
              </div>
            ))
          )}
        </div>

        <p className="font-pixel text-[8px] text-white/40 mt-2">
          ← Swipe left to remove · Swipe right to keep →
        </p>
      </div>

      {/* Next course / Continue to summary (when no cards left in current course) */}
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {(currentTasks.length === 0 || questCount === 0) && (
          <Button
            onClick={goNextCourse}
            variant="outline"
            className="w-full"
          >
            {isLastCourse ? "Continue to summary" : "Next course"}
            <ChevronRight size={14} className="ml-1" />
          </Button>
        )}
      </div>

      {/* When there are still cards, show Next course below for users who want to skip */}
      {currentTasks.length > 0 && hasMoreCourses && (
        <button
          onClick={goNextCourse}
          className="font-pixel text-[8px] text-white/40 hover:text-white/60 cursor-pointer"
        >
          Skip to next course →
        </button>
      )}
    </div>
  );
}
