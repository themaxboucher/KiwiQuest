"use server";

import { callOpenRouter } from "@/lib/openrouter";
import { PDFParse } from "pdf-parse";

export interface ParsedTask {
  courseCode: string;
  title: string;
  type: "assignment" | "lab" | "quiz" | "midterm" | "final";
  dueDate: string | null;
  description: string;
  weight: number | null;
}

const SYSTEM_PROMPT = `You are a course outline parser. Extract all assignments, labs, quizzes, midterms, finals, and other graded deliverables from the provided course outline text.

IMPORTANT: When the outline lists a category as a single aggregate entry (e.g. "Assignments: 30%", "Labs: 20%") without enumerating each one individually, you MUST expand it into 12 separate numbered items. For example:
- "Assignments: 30%" becomes Assignment 1, Assignment 2, … Assignment 12 — each worth 30/12 = 2.5%.
- "Labs: 20%" becomes Lab 1, Lab 2, … Lab 12 — each worth 20/12 ≈ 1.67%.
If the outline explicitly lists the individual items with their own titles or due dates, use those instead.
Midterms and finals should NOT be expanded — keep them as single entries.

Return a JSON array of task objects. Each task must have:
- "courseCode": string (e.g. "CS101")
- "title": string (e.g. "Assignment 1", "Lab 5", "Midterm")
- "type": one of "assignment", "lab", "quiz", "midterm", or "final"
- "dueDate": string in ISO format (YYYY-MM-DD) or null if not specified
- "description": string — a short, fun fantasy-themed flavor description of the task as a monster encounter. Use the following creature mapping:
  * assignments → Orcs
  * quizzes → Trolls
  * labs → Slime Monsters
  * midterms → Dark Knights
  * finals → Dragons
  Write 1 sentences in a dramatic fantasy tone describing the creature and the threat it poses. Each description should be unique and creative. For example: "A hulking orc scout sharpens its blade in the shadows, eager to ambush any kiwi that strays from the path." or "This ancient dragon hoards knowledge and flames — only the bravest kiwi can hope to survive its wrath."
- "weight": number (percentage weight of this individual item) or null if not specified
- "completed": false (always false for newly parsed tasks)

Return ONLY a valid JSON array, no markdown or explanation.`;

export async function parseOutline(
  formData: FormData
): Promise<{ tasks: ParsedTask[] }> {
  try {
    const file = formData.get("file") as File | null;
    const coursesJson = formData.get("courses") as string | null;

    if (!file || !coursesJson) {
      throw new Error("Missing file or courses data");
    }

    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const parser = new PDFParse({ data });
    const textResult = await parser.getText();
    const pdfText = textResult.text;
    await parser.destroy();

    const result = await callOpenRouter([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: pdfText.slice(0, 15000) },
    ]);

    const cleaned = result
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    const tasks = JSON.parse(cleaned) as ParsedTask[];

    return { tasks };
  } catch (error) {
    console.error("Parse outline error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to parse outline"
    );
  }
}
