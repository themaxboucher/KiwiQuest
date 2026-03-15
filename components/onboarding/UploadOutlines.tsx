"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addCourse, addTask, clearAllData } from "@/lib/hooks";
import { parseOutline } from "@/lib/actions/parseOutline";
import { AlertCircle, ChevronRight } from "lucide-react";
import Image from "next/image";
import { KiwizardSprite } from "@/components/KiwizardSprite";

const TYPEWRITER_MS = 30;

export function PostParseMessage({ onComplete }: { onComplete: () => void }) {
  const fullText =
    "Heavy indeed is your burden. Come now and take residence in my humble abode. There you will find a crystal ball. This ball will show you your quests, beasts and monsters to be slain warned of in the outlines. Complete the quests and forever you name shall live in glory!";
  const [displayedLength, setDisplayedLength] = useState(0);
  const isDone = displayedLength >= fullText.length;

  useEffect(() => {
    if (displayedLength >= fullText.length) return;
    const t = setTimeout(() => {
      setDisplayedLength((n) => Math.min(n + 1, fullText.length));
    }, TYPEWRITER_MS);
    return () => clearTimeout(t);
  }, [displayedLength, fullText.length]);

  const displayedText = fullText.slice(0, displayedLength);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-center items-center gap-12">
        <KiwizardSprite size={900} />
        <div
          className="p-4 w-full min-h-[120px] cursor-pointer"
          onClick={!isDone ? () => setDisplayedLength(fullText.length) : undefined}
        >
          <p className="min-w-xl max-w-2xl min-h-full font-pixel text-white leading-loose">
            {displayedText}
            {!isDone && (
              <span className="animate-typewriter-cursor inline-block ml-0.5 w-2 h-3 bg-primary align-middle" />
            )}
          </p>
          {isDone && (
            <button
              type="button"
              onClick={onComplete}
              className="mt-4 flex items-center gap-1 text-white/80 hover:text-primary transition-colors cursor-pointer font-pixel text-[10px]"
              aria-label="Continue"
            >
              Next
              <ChevronRight size={24} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface UploadOutlinesProps {
  onComplete: () => void;
}

const PARCHMENT_POSITIONS: {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}[] = [
  { top: "5%", left: "16%" },
  { top: "-2%", left: "34%" },
  { top: "-2%", left: "52%" },
  { top: "5%", left: "70%" },
  { top: "18%", left: "0%" },
  { top: "18%", left: "86%" },
];


export function UploadOutlines({ onComplete }: UploadOutlinesProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [ellipsisCount, setEllipsisCount] = useState(0);

  useEffect(() => {
    if (!parsing) {
      setEllipsisCount(0);
      return;
    }
    const id = setInterval(() => {
      setEllipsisCount((c) => (c + 1) % 4);
    }, 400);
    return () => clearInterval(id);
  }, [parsing]);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const pdfFiles = Array.from(newFiles).filter(
      (f) => f.type === "application/pdf",
    );
    setFiles((prev) => [...prev, ...pdfFiles]);
    setError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleCastSpell = async () => {
    if (files.length === 0) return;
    setParsing(true);
    setError(null);

    try {
      await clearAllData();

      const createdCourses: { id: number; code: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const code =
          file.name.replace(/\.pdf$/i, "").split("-")[0].trim() || `Course ${i + 1}`;
        const id = (await addCourse({
          code,
          description: "",
          slotIndex: i,
        })) as number;
        createdCourses.push({ id, code });
      }

      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex];
        const { id: courseId, code: courseCode } = createdCourses[fileIndex];
        const coursesData = [{ code: courseCode, description: "" }];

        const formData = new FormData();
        formData.append("file", file);
        formData.append("courses", JSON.stringify(coursesData));

        const { tasks } = await parseOutline(formData);

        for (const task of tasks) {
          await addTask({
            courseId,
            title: task.title,
            type: task.type,
            dueDate: task.dueDate ?? undefined,
            description: task.description,
            weight: task.weight ?? undefined,
            completed: false,
          });
        }
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse outlines");
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-pixel text-white leading-relaxed">
          Upload your course outlines.
        </h2>
        <p className="font-pixel text-[10px] text-white/90">
          Drag and drop your PDF files on the table or click to upload.
        </p>
      </div>

      <div className="relative">
        <div
          role="button"
          tabIndex={0}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".pdf";
              input.multiple = true;
              input.onchange = () => handleFiles(input.files);
              input.click();
            }
          }}
          aria-label="Place course outline documents on the enchantment table"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            !hovered ? "animate-float" : "scale-105"
          } ${
            dragOver
              ? "drop-shadow-[0_0_16px_rgba(200,170,80,0.5)] scale-[1.02]"
              : ""
          } ${parsing ? "animate-glow-pulse animate-float" : ""}`}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".pdf";
            input.multiple = true;
            input.onchange = () => handleFiles(input.files);
            input.click();
          }}
        >
          <div className="relative w-[460px] h-[276px] sm:w-[500px] sm:h-[300px] ">
            <Image
              src="/sprites/enchantment-table.png"
              alt=""
              fill
              className="object-contain pixelated pointer-events-none"
            />
          </div>
        </div>

        {files.length > 0 &&
          files.map((file, i) => (
            <div
              key={i}
              className={`absolute flex flex-col items-center animate-float ${parsing ? "animate-glow-pulse" : ""}`}
              style={{
                ...PARCHMENT_POSITIONS[i % PARCHMENT_POSITIONS.length],
                animationDelay: `${i * 0.4}s`,
              }}
            >
              <div className="relative">
                <Image
                  src="/sprites/parchment.png"
                  alt=""
                  width={72}
                  height={88}
                  className="pixelated pointer-events-none"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles(files.filter((_, j) => j !== i));
                  }}
                  className="absolute -top-1 -right-3 w-4 h-4 flex items-center justify-center rounded-full bg-destructive/80 text-white font-pixel text-[8px] cursor-pointer hover:bg-destructive transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </div>
              <span className="font-pixel text-[8px] text-white/90 truncate max-w-[80px] text-center mt-1">
                {file.name.replace(/\.pdf$/i, "")}
              </span>
            </div>
          ))}

        {error && (
          <div className="flex items-center justify-center gap-2 text-destructive mt-2">
            <AlertCircle size={14} />
            <span className="font-pixel text-[8px]">{error}</span>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <Button
          onClick={handleCastSpell}
          disabled={files.length === 0 || parsing}
          className="w-fit"
        >
          {parsing ? `Deciphering${".".repeat(ellipsisCount)}` : "Decipher"}
        </Button>
      )}
    </div>
  );
}
