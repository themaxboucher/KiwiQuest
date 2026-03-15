"use client";

import { useState } from "react";
import { useCourses, useAllTasks } from "@/lib/hooks";
import { HutItem } from "./HutItem";
import { ParchmentPile } from "./ParchmentPile";
import { CourseDialog } from "./CourseDialog";
import type { Course } from "@/lib/db";
import Image from "next/image";

const ITEM_POSITIONS = [
  { top: "58%", left: "3%" },
  { top: "25%", left: "6%" },
  { top: "45%", left: "36%" },
  { top: "35%", left: "55%" },
  { top: "42%", left: "75%" },
  { top: "58%", left: "85%" },
];

export function WizardHut() {
  const courses = useCourses();
  const allTasks = useAllTasks();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="relative w-full h-full">
      {/* Hut background - daytime, hut center, castle right, forest left */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pixelated"
        style={{
          backgroundImage: "url(/sprites/hut-background-day.png)",
        }}
      />

      {/* Light overlay for readability over new daytime background */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Parchment piles: hover shows Victorian-style bubble with course/assignment details */}
      {courses.map((course) => (
        <ParchmentPile
          key={course.id}
          course={course}
          position={ITEM_POSITIONS[course.slotIndex]}
          onClick={() => setSelectedCourse(course)}
        />
      ))}

      {/* Empty slots - keep item placeholders */}
      {Array.from({ length: 6 })
        .map((_, i) => i)
        .filter((i) => !courses.find((c) => c.slotIndex === i))
        .map((slotIndex) => (
          <HutItem
            key={`empty-${slotIndex}`}
            slotIndex={slotIndex}
            hasIncompleteTasks={false}
            allComplete={false}
            onClick={() => {}}
            position={ITEM_POSITIONS[slotIndex]}
          />
        ))}

      {/* Kiwi mascot in the bottom center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <Image
          src="/sprites/kiwi-wizard.png"
          alt="Kiwi the Wise"
          width={80}
          height={80}
          className="pixelated animate-float"
        />
      </div>

      {/* Course dialog */}
      {selectedCourse && (
        <CourseDialog
          course={selectedCourse}
          open={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
