"use client";

import { useState } from "react";
import { Note } from "../types/notes";

interface NoteSummarizerProps {
  notes: Note[];
}

export default function NoteSummarizer({ notes }: NoteSummarizerProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSummarize = async () => {
    if (notes.length === 0) {
      alert("No notes to summarize!");
      return;
    }

    setIsLoading(true);
    try {
      // Send only notes content
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: notes.map((note) => note.content),
        }),
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

  const handleCopySummary = async () => {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      alert("Failed to copy to clipboard. Please select and copy manually.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">AI Summary</h2>

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
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Summary:</h3>
            <button
              onClick={handleCopySummary}
              className={`px-3 py-1 text-sm rounded-md transition-all ${
                isCopied
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              {isCopied ? "✓ Copied!" : "📋 Copy"}
            </button>
          </div>
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
