"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PixelContainer } from "@/components/PixelContainer";
import { useCourses, addTask } from "@/lib/hooks";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ParsedTask {
  courseCode: string;
  title: string;
  type: "assignment" | "quiz" | "test" | "exam" | "other";
  dueDate: string | null;
  description: string;
  weight: number | null;
}

interface UploadOutlinesProps {
  onComplete: () => void;
}

export function UploadOutlines({ onComplete }: UploadOutlinesProps) {
  const courses = useCourses();
  const [files, setFiles] = useState<File[]>([]);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskCount, setTaskCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const pdfFiles = Array.from(newFiles).filter(
      (f) => f.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...pdfFiles]);
    setError(null);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    []
  );

  const handleParse = async () => {
    if (files.length === 0) return;
    setParsing(true);
    setError(null);
    let totalTasks = 0;

    try {
      const coursesData = courses.map((c) => ({
        code: c.code,
        description: c.description,
      }));

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("courses", JSON.stringify(coursesData));

        const res = await fetch("/api/parse-outline", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to parse");
        }

        const { tasks } = (await res.json()) as { tasks: ParsedTask[] };

        for (const task of tasks) {
          const course = courses.find(
            (c) => c.code.toLowerCase() === task.courseCode.toLowerCase()
          );
          if (!course?.id) continue;

          await addTask({
            courseId: course.id,
            title: task.title,
            type: task.type,
            dueDate: task.dueDate ?? undefined,
            description: task.description,
            weight: task.weight ?? undefined,
            completed: false,
          });
          totalTasks++;
        }
      }

      setTaskCount(totalTasks);
      setParsed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse outlines");
    } finally {
      setParsing(false);
    }
  };

  return (
    <PixelContainer gold className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h2 className="font-pixel text-sm text-primary pixel-text-shadow">
          Course Outlines
        </h2>
        <p className="font-pixel text-[8px] text-muted-foreground leading-relaxed">
          Upload your course outline PDFs and our wizard will extract all quests
          (assignments, quizzes, tests).
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`pixel-borders flex flex-col items-center gap-3 p-8 transition-colors cursor-pointer ${
          dragOver ? "bg-accent/20 border-accent" : "bg-background"
        }`}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".pdf";
          input.multiple = true;
          input.onchange = () => handleFiles(input.files);
          input.click();
        }}
      >
        <Upload size={32} className="text-muted-foreground" />
        <p className="font-pixel text-[9px] text-muted-foreground">
          Drop PDFs here or click to browse
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 pixel-borders bg-background p-2"
            >
              <FileText size={14} className="text-accent shrink-0" />
              <span className="font-pixel text-[8px] text-foreground truncate">
                {file.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFiles(files.filter((_, j) => j !== i));
                }}
                className="ml-auto text-destructive hover:text-destructive/80 font-pixel text-[8px] cursor-pointer"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle size={14} />
          <span className="font-pixel text-[8px]">{error}</span>
        </div>
      )}

      {parsed && (
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle2 size={14} />
          <span className="font-pixel text-[8px]">
            Extracted {taskCount} quests from your outlines!
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {!parsed && (
          <Button
            onClick={handleParse}
            disabled={files.length === 0 || parsing}
            className="flex-1 font-pixel text-[10px] pixel-borders-gold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            {parsing ? (
              <>
                <Loader2 size={14} className="mr-1 animate-spin" />
                Parsing...
              </>
            ) : (
              "Extract Quests"
            )}
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onComplete}
          className="font-pixel text-[10px] pixel-borders cursor-pointer"
        >
          {parsed ? "Review Quests" : "Skip for now"}
        </Button>
      </div>
    </PixelContainer>
  );
}
