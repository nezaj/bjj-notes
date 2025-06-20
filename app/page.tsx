"use client";

import { useState, useCallback } from "react";
import { init } from "@instantdb/react";
import schema from "../instant.schema";
import { Note } from "../types/notes";
import VoiceRecording from "../components/VoiceRecording";
import NoteSaver from "../components/NoteSaver";
import NotesList from "../components/NotesList";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const db = init({ appId: APP_ID, schema });

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentTranscription, setCurrentTranscription] = useState("");

  const handleTranscriptionChange = useCallback((transcription: string) => {
    setCurrentTranscription(transcription);
  }, []);

  const handleSaveNote = useCallback(() => {
    if (currentTranscription.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: currentTranscription.trim(),
        timestamp: new Date(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  }, [currentTranscription]);

  const handleDeleteNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Voice Recorder</h1>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Recording Section */}
          <div>
            <VoiceRecording onTranscriptionChange={handleTranscriptionChange} />
            <div className="mt-4 flex justify-center">
              <NoteSaver
                transcription={currentTranscription}
                onSaveNote={handleSaveNote}
              />
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <NotesList notes={notes} onDeleteNote={handleDeleteNote} />
          </div>
        </div>
      </div>
    </div>
  );
}
