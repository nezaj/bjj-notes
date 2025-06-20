"use client";

import React from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

interface VoiceRecordingProps {
  onTranscriptionChange: (transcription: string) => void;
  transcription: string;
}

export default function VoiceRecording({
  onTranscriptionChange,
  transcription,
}: VoiceRecordingProps) {
  const { isRecording, toggleRecording } = useSpeechRecognition(
    onTranscriptionChange
  );

  return (
    <div>
      <button
        onClick={toggleRecording}
        className={`px-6 py-3 rounded-full text-white font-medium text-lg transition-all
          ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Current Transcription:</h2>
        <div className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg bg-gray-50">
          {transcription || "Your speech will appear here..."}
        </div>
      </div>
    </div>
  );
}
