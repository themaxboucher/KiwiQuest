"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTasksForCourse } from "@/lib/hooks";
import { TaskCard } from "./TaskCard";
import type { Course } from "@/lib/db";

const ITEM_NAMES = [
  "Potion",
  "Spell Book",
  "Crystal Ball",
  "Scroll",
  "Cauldron",
  "Wand",
];

interface CourseDialogProps {
  course: Course;
  open: boolean;
  onClose: () => void;
}

export function CourseDialog({ course, open, onClose }: CourseDialogProps) {
  const tasks = useTasksForCourse(course.id);
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="pixel-borders-gold bg-card border-none max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-pixel text-sm text-primary pixel-text-shadow flex items-center gap-2">
            <span>{ITEM_NAMES[course.slotIndex]}</span>
            <span className="text-muted-foreground">|</span>
            <span>{course.code}</span>
          </DialogTitle>
          <p className="font-pixel text-[8px] text-muted-foreground">
            {course.description || course.code}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 h-2 pixel-borders bg-muted overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width:
                    tasks.length > 0
                      ? `${(completedCount / tasks.length) * 100}%`
                      : "0%",
                }}
              />
            </div>
            <span className="font-pixel text-[8px] text-muted-foreground">
              {completedCount}/{tasks.length}
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-2 pb-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-pixel text-[8px] text-muted-foreground">
                  No quests assigned to this course yet.
                </p>
              </div>
            ) : (
              tasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
