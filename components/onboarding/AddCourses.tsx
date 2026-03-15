"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addCourse } from "@/lib/hooks";
import { Plus, X } from "lucide-react";
import Image from "next/image";

interface CourseEntry {
  code: string;
}

interface AddCoursesProps {
  onComplete: () => void;
}

export function AddCourses({ onComplete }: AddCoursesProps) {
  const [courses, setCourses] = useState<CourseEntry[]>([{ code: "" }]);
  const [saving, setSaving] = useState(false);

  const addRow = () => {
    if (courses.length >= 6) return;
    setCourses([...courses, { code: "" }]);
  };

  const removeRow = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, value: string) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], code: value };
    setCourses(updated);
  };

  const validCourses = courses.filter((c) => c.code.trim());

  const handleSave = async () => {
    if (validCourses.length === 0) return;
    setSaving(true);
    for (let i = 0; i < validCourses.length; i++) {
      await addCourse({
        code: validCourses[i].code.trim(),
        description: "",
        slotIndex: i,
      });
    }
    onComplete();
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center space-y-2">
        <h2 className="font-pixel text-2xl text-primary pixel-text-shadow">
          Your Courses
        </h2>
        <p className="font-pixel text-white text-[12px] leading-relaxed">
          Add up to 6 courses.
        </p>
      </div>
      <div className="flex justify-center items-center gap-12">
        <div className="space-y-3">
          {courses.map((course, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={course.code}
                onChange={(e) => updateRow(i, e.target.value)}
                placeholder="e.g. MATH 101"
                className="w-full uppercase pixel-borders bg-black/30 font-pixel text-[10px] text-white placeholder:text-white/30 border-none"
              />
              {courses.length > 1 && (
                <button
                  onClick={() => removeRow(i)}
                  className="hover:cursor-pointer shrink-0"
                  aria-label="Remove course"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          {courses.length < 6 && (
            <Button
              variant="secondary"
              size="xs"
              onClick={addRow}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              <Plus size={14} className="mr-1" />
              Add Course
            </Button>
          )}
        </div>
        <Image
          src="/sprites/kiwi-wizard.png"
          alt="Kiwi the Wise"
          width={200}
          height={200}
          className="pixelated animate-float drop-shadow-[0_0_12px_rgba(200,170,80,0.4)]"
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={validCourses.length === 0 || saving}
        className="w-fit"
      >
        {saving ? "Saving..." : "Continue"}
      </Button>
    </div>
  );
}
