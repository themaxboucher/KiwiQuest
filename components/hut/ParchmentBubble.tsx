"use client";

import { useTasksForCourse } from "@/lib/hooks";
import type { Course, Task } from "@/lib/db";

const TYPE_LABELS: Record<string, string> = {
  assignment: "Assignment",
  quiz: "Quiz",
  test: "Test",
  exam: "Exam",
  other: "Other",
};

interface ParchmentBubbleCourseProps {
  course: Course;
}

export function ParchmentBubbleCourse({ course }: ParchmentBubbleCourseProps) {
  const tasks = useTasksForCourse(course.id);
  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div
      className="absolute z-50 min-w-[220px] max-w-[280px] rounded-2xl p-0 overflow-hidden"
      style={{
        /* White rectangular curved-corner bubble, thick dark outline (pixel UI style) */
        background: "oklch(0.99 0.005 90)",
        border: "3px solid oklch(0.2 0.02 280)",
        boxShadow:
          "inset 2px 2px 0 0 oklch(0.97 0.01 80), 0 0 0 1px oklch(0.3 0.03 280)",
      }}
    >
      {/* Victorian parchment inner */}
      <div
        className="p-4 font-pixel text-[9px] text-foreground space-y-2 m-1 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.92 0.03 75) 0%, oklch(0.88 0.04 65) 100%)",
          border: "1px solid oklch(0.7 0.1 65)",
          boxShadow: "inset 0 0 24px oklch(0.85 0.04 65 / 0.25)",
        }}
      >
        <div className="border-b border-amber-800/40 pb-2">
          <p className="text-amber-900/90 font-semibold uppercase tracking-wider text-[10px]">
            Course
          </p>
          <p className="text-[11px] text-amber-950">{course.code}</p>
          {course.description && (
            <p className="text-amber-900/80 mt-1 leading-relaxed">
              {course.description}
            </p>
          )}
        </div>
        <div>
          <p className="text-amber-900/90 font-semibold uppercase tracking-wider text-[8px] mb-1">
            Quests
          </p>
          <div className="space-y-1">
            {tasks.length === 0 ? (
              <p className="text-amber-800/70 italic">No quests yet.</p>
            ) : (
              <>
                <p className="text-amber-800/80">
                  {completed} / {tasks.length} complete
                </p>
                {tasks.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 text-amber-900/90"
                  >
                    <span
                      className={
                        t.completed ? "text-amber-700 line-through" : ""
                      }
                    >
                      {t.title}
                    </span>
                    <span className="text-amber-700/70 text-[7px]">
                      {TYPE_LABELS[t.type] || t.type}
                    </span>
                  </div>
                ))}
                {tasks.length > 5 && (
                  <p className="text-amber-700/70 text-[7px]">
                    +{tasks.length - 5} more
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ParchmentBubbleTaskProps {
  task: Task;
}

export function ParchmentBubbleTask({ task }: ParchmentBubbleTaskProps) {
  return (
    <div
      className="absolute z-50 min-w-[200px] max-w-[260px] rounded-2xl p-0 overflow-hidden"
      style={{
        background: "oklch(0.99 0.005 90)",
        border: "3px solid oklch(0.2 0.02 280)",
        boxShadow:
          "inset 2px 2px 0 0 oklch(0.97 0.01 80), 0 0 0 1px oklch(0.3 0.03 280)",
      }}
    >
      <div
        className="p-4 font-pixel text-[9px] text-foreground space-y-2 m-1 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.92 0.03 75) 0%, oklch(0.88 0.04 65) 100%)",
          border: "1px solid oklch(0.7 0.1 65)",
          boxShadow: "inset 0 0 24px oklch(0.85 0.04 65 / 0.25)",
        }}
      >
        <div className="border-b border-amber-800/40 pb-2">
          <p className="text-amber-900/90 font-semibold uppercase tracking-wider text-[8px]">
            {TYPE_LABELS[task.type] || task.type}
          </p>
          <p className="text-[11px] text-amber-950">{task.title}</p>
        </div>
        {task.description && (
          <p className="text-amber-900/80 leading-relaxed">{task.description}</p>
        )}
        {(task.dueDate || task.weight != null) && (
          <div className="flex flex-wrap gap-2 text-amber-800/80 text-[8px]">
            {task.dueDate && (
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
            {task.weight != null && <span>Weight: {task.weight}%</span>}
          </div>
        )}
        <p className="text-amber-700/70 text-[8px]">
          {task.completed ? "Completed" : "In progress"}
        </p>
      </div>
    </div>
  );
}
