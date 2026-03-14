"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PixelContainer } from "@/components/PixelContainer";
import { addCourse } from "@/lib/hooks";
import { Plus, Trash2 } from "lucide-react";

interface CourseEntry {
  code: string;
  description: string;
}

interface AddCoursesProps {
  onComplete: () => void;
}

const SLOT_LABELS = [
  "Potion",
  "Spell Book",
  "Crystal Ball",
  "Scroll",
  "Cauldron",
  "Magic Wand",
];

export function AddCourses({ onComplete }: AddCoursesProps) {
  const [courses, setCourses] = useState<CourseEntry[]>([
    { code: "", description: "" },
  ]);
  const [saving, setSaving] = useState(false);

  const addRow = () => {
    if (courses.length >= 6) return;
    setCourses([...courses, { code: "", description: "" }]);
  };

  const removeRow = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateRow = (
    index: number,
    field: keyof CourseEntry,
    value: string
  ) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  const validCourses = courses.filter(
    (c) => c.code.trim() && c.description.trim()
  );

  const handleSave = async () => {
    if (validCourses.length === 0) return;
    setSaving(true);
    for (let i = 0; i < validCourses.length; i++) {
      await addCourse({
        code: validCourses[i].code.trim(),
        description: validCourses[i].description.trim(),
        slotIndex: i,
      });
    }
    onComplete();
  };

  return (
    <PixelContainer gold className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h2 className="font-pixel text-sm text-primary pixel-text-shadow">
          Your Courses
        </h2>
        <p className="font-pixel text-[8px] text-muted-foreground leading-relaxed">
          Add up to 6 courses (max). Each will be bound to a magical item in
          your hut.
        </p>
      </div>

      <div className="space-y-3">
        {courses.map((course, i) => (
          <div key={i} className="pixel-borders bg-background p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[8px] text-accent">
                {SLOT_LABELS[i] ?? `Slot ${i + 1}`}
              </span>
              {courses.length > 1 && (
                <button
                  onClick={() => removeRow(i)}
                  className="text-destructive hover:text-destructive/80 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={course.code}
                onChange={(e) => updateRow(i, "code", e.target.value)}
                placeholder="CS101"
                className="w-28 pixel-borders bg-muted font-pixel text-[10px]"
              />
              <Input
                value={course.description}
                onChange={(e) => updateRow(i, "description", e.target.value)}
                placeholder="Introduction to Computer Science"
                className="flex-1 pixel-borders bg-muted font-pixel text-[10px]"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        {courses.length < 6 && (
          <Button
            variant="secondary"
            onClick={addRow}
            className="font-pixel text-[10px] pixel-borders cursor-pointer"
          >
            <Plus size={14} className="mr-1" />
            Add Course
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={validCourses.length === 0 || saving}
          className="flex-1 font-pixel text-[10px] pixel-borders-gold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          {saving ? "Saving..." : `Continue with ${validCourses.length} course${validCourses.length !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </PixelContainer>
  );
}
