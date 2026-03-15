"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Scroll, Calendar, Weight } from "lucide-react";
import { AudioToggleButton } from "@/components/AudioToggleButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCourses, useTasksForCourse } from "@/lib/hooks";
import { SPRITE_BY_TYPE } from "@/lib/sprites";

function TaskList({ courseId }: { courseId: number }) {
  const tasks = useTasksForCourse(courseId);

  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="font-pixel text-[8px] text-amber-800/50">
          No quests found for this course.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 rounded-lg bg-amber-900/10 px-3 py-2"
        >
          <Image
            src={SPRITE_BY_TYPE[task.type]}
            alt={task.type}
            width={100}
            height={100}
            className="pixelated shrink-0"
          />
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <p className="font-pixel text-[10px] text-amber-950 truncate min-w-0 max-w-[16rem]">
                {task.title}
              </p>
              {task.completed && (
                <Badge className="font-pixel text-[8px] rounded-sm bg-green-700/20 text-green-800 border-green-700/30">
                  Done
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {task.dueDate && (
                <Badge
                  variant="outline"
                  className="font-pixel text-[8px] rounded-sm bg-amber-800/10 border-amber-700/30 text-amber-900/70 gap-1"
                >
                  <Calendar className="size-2.5" />
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Badge>
              )}
              {task.weight != null && (
                <Badge
                  variant="outline"
                  className="font-pixel text-[8px] rounded-sm bg-amber-800/10 border-amber-700/30 text-amber-900/70 gap-1"
                >
                  <Weight className="size-2.5" />
                  {task.weight}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScrollDialogContent() {
  const courses = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (courses.length > 0 && selectedCourseId === undefined) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-pixel font-bold uppercase text-xl text-primary pixel-text-shadow">
          QUEST LOG
        </DialogTitle>
        <DialogDescription className="font-pixel text-[10px] text-amber-800/70">
          Your quests and the beasts that guard them.
        </DialogDescription>
      </DialogHeader>

      {courses.length === 0 ? (
        <div className="py-8 text-center">
          <p className="font-pixel text-[8px] text-amber-800/50">
            No courses yet. Upload your outlines first.
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1" role="tablist">
            {courses.map((course) => (
              <button
                key={course.id}
                role="tab"
                aria-selected={course.id === selectedCourseId}
                onClick={() => setSelectedCourseId(course.id)}
                className={`shrink-0 font-pixel text-[8px] px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  course.id === selectedCourseId
                    ? "bg-amber-900/20 text-amber-950"
                    : "text-amber-800/50 hover:text-amber-800/80 hover:bg-amber-900/10"
                }`}
              >
                {course.code}
              </button>
            ))}
          </div>

          <ScrollArea className="max-h-[50vh] -mx-4 px-4">
            {selectedCourseId !== undefined && (
              <TaskList courseId={selectedCourseId} />
            )}
          </ScrollArea>
        </>
      )}
    </>
  );
}

export function HutActionButtons() {
  return (
    <div className="absolute top-4 right-4 z-20 flex gap-2">
      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              className="size-12 rounded-full bg-card/60 backdrop-blur-sm text-primary hover:bg-card/80"
            />
          }
        >
          <Scroll className="size-5" />
          <span className="sr-only">Open scroll</span>
        </DialogTrigger>

        <DialogContent className="pixel-borders-gold border-none bg-[#f5e6c8] shadow-[inset_0_0_40px_rgba(139,109,56,0.15)] sm:max-w-lg">
          <ScrollDialogContent />
        </DialogContent>
      </Dialog>

      <AudioToggleButton />
    </div>
  );
}
