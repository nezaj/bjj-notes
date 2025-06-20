import { useState, useEffect, useRef } from "react";
import type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from "../types/speech";

export function useSpeechRecognition(
  onTranscriptionUpdate: (transcription: string) => void
) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined") {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        const recognition = new SpeechRecognitionConstructor();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let transcript = "";
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          onTranscriptionUpdate(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        console.error("Speech recognition not supported in this browser");
      }
    }
  }, [onTranscriptionUpdate]);

  const toggleRecording = () => {
    if (recognitionRef.current) {
      if (isRecording) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
        onTranscriptionUpdate(""); // Clear transcription when starting new recording
      }
      setIsRecording(!isRecording);
    } else {
      alert("Speech recognition is not supported in your browser");
    }
  };

  return {
    isRecording,
    toggleRecording,
  };
}
