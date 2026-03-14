import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";

export async function POST(request: NextRequest) {
  try {
    const { taskTitle, taskDescription, taskType } = await request.json();

    const systemPrompt = `You are a study planner assistant. Generate a practical, actionable checklist of 4-8 todo items for a student to complete the following academic task. Each todo should be specific and concrete.

Return ONLY a valid JSON array of strings, no markdown or explanation.`;

    const userPrompt = `Task: ${taskTitle}
Type: ${taskType}
Description: ${taskDescription || "No additional description"}

Generate a step-by-step todo checklist for completing this task.`;

    const result = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    const cleaned = result
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    const todos = JSON.parse(cleaned);

    return NextResponse.json({ todos });
  } catch (error) {
    console.error("Generate todos error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate todos" },
      { status: 500 }
    );
  }
}
