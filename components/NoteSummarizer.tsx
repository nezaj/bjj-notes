"use client";

import { useState } from "react";
import { Note } from "../types/notes";

interface NoteSummarizerProps {
  notes: Note[];
}

export default function NoteSummarizer({ notes }: NoteSummarizerProps) {
  const [promptInstructions, setPromptInstructions] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (notes.length === 0) {
      alert("No notes to summarize!");
      return;
    }

    setIsLoading(true);
    try {
      // Combine all notes content
      const notesContent = notes
        .map((note, index) => `Note ${index + 1}: ${note.content}`)
        .join("\n\n");

      // Create the prompt
      const basePrompt = `Please summarize the following notes:\n\n${notesContent}`;
      const finalPrompt = promptInstructions.trim()
        ? `${basePrompt}\n\nAdditional instructions: ${promptInstructions}`
        : basePrompt;

      // Call the API route
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">AI Summary</h2>

      {/* Prompt Instructions Input */}
      <div>
        <label
          htmlFor="promptInstructions"
          className="block text-sm font-medium mb-2"
        >
          Additional Instructions (optional)
        </label>
        <input
          id="promptInstructions"
          type="text"
          value={promptInstructions}
          onChange={(e) => setPromptInstructions(e.target.value)}
          placeholder="e.g., be concise, be funny, focus on key points..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Summarize Button */}
      <button
        onClick={handleSummarize}
        disabled={isLoading || notes.length === 0}
        className="w-full px-6 py-3 rounded-lg text-white font-medium text-lg transition-all
          bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Generating Summary..." : "Summarize Notes"}
      </button>

      {/* Summary Display */}
      {summary && (
        <div>
          <h3 className="text-lg font-medium mb-2">Summary:</h3>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="whitespace-pre-wrap">{summary}</p>
          </div>
        </div>
      )}

      {/* Notes count indicator */}
      <p className="text-sm text-gray-500">
        {notes.length} note{notes.length !== 1 ? "s" : ""} available to
        summarize
      </p>
    </div>
  );
}
