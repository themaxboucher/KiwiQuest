import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";
import { PDFParse } from "pdf-parse";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const coursesJson = formData.get("courses") as string | null;

    if (!file || !coursesJson) {
      return NextResponse.json(
        { error: "Missing file or courses data" },
        { status: 400 }
      );
    }

    const courses = JSON.parse(coursesJson) as {
      code: string;
      description: string;
    }[];

    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const parser = new PDFParse({ data });
    const textResult = await parser.getText();
    const pdfText = textResult.text;
    await parser.destroy();

    const courseList = courses
      .map((c) => `- ${c.code}: ${c.description}`)
      .join("\n");

    const systemPrompt = `You are a course outline parser. Extract all assignments, labs, quizzes, midterms, finals, and other graded deliverables from the provided course outline text.

The student is taking these courses:
${courseList}

Return a JSON array of task objects. Each task must have:
- "courseCode": string (must match one of the course codes listed above)
- "title": string (name of the deliverable)
- "type": one of "assignment", "lab", "quiz", "midterm", or "final"
- "dueDate": string in ISO format (YYYY-MM-DD) or null if not specified
- "description": string (brief description of the task)
- "weight": number (percentage weight) or null if not specified

Return ONLY a valid JSON array, no markdown or explanation.`;

    const result = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: pdfText.slice(0, 15000) },
    ]);

    const cleaned = result
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    const tasks = JSON.parse(cleaned);

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Parse outline error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to parse outline" },
      { status: 500 }
    );
  }
}
