import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { notes } = await request.json();

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return NextResponse.json(
        { error: "Notes array is required" },
        { status: 400 }
      );
    }

    // Construct the prompt on the server
    const notesContent = notes
      .map((noteContent, index) => `Note ${index + 1}: ${noteContent}`)
      .join("\n\n");

    const prompt = `Rewrite the content as concise first-person notes. Use the same information but make it sound like personal notes or thoughts.
Keep the original meaning and details. Don't add extra commentary or interpretation. Don't expand on what wasn't explicitly stated.
Write in first person ("I") but keep it direct and to the point.
Do not include any prefacing statements like "Here's a summary" or "Here are the notes." Start directly with the content.
${notesContent}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const summary =
      response.content[0]?.type === "text" ? response.content[0].text : null;

    if (!summary) {
      throw new Error("No summary generated");
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
