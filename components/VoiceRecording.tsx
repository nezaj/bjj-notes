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

  const handleTranscriptionEdit = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onTranscriptionChange(event.target.value);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-center">
        <button
          onClick={toggleRecording}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium text-base sm:text-lg transition-all w-full sm:w-auto
            ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Current Transcription:
        </h2>
        <textarea
          value={transcription}
          onChange={handleTranscriptionEdit}
          placeholder="Your speech will appear here... You can also type or edit manually."
          className="w-full min-h-[150px] sm:min-h-[200px] p-3 sm:p-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-sm sm:text-base"
        />
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          💡 You can manually edit the text above while recording or after
          stopping
        </p>
      </div>
    </div>
  );
}
