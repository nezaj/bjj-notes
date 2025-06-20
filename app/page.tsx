"use client";

import { useState, useCallback } from "react";
import { init, id } from "@instantdb/react";
import schema from "../instant.schema";
import { Note } from "../types/notes";
import VoiceRecording from "../components/VoiceRecording";
import NoteSaver from "../components/NoteSaver";
import NotesList from "../components/NotesList";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const db = init({ appId: APP_ID, schema });

export default function App() {
  const [transcription, setTranscription] = useState("");

  // Query notes from InstantDB, ordered by timestamp descending
  const { isLoading, data, error } = db.useQuery({
    notes: {
      $: { order: { timestamp: "desc" } },
    },
  });

  const handleTranscriptionChange = useCallback((transcription: string) => {
    setTranscription(transcription);
  }, []);

  const handleSaveNote = useCallback(() => {
    if (transcription.trim()) {
      // Use InstantDB transaction to create a new note
      db.transact(
        db.tx.notes[id()].update({
          content: transcription.trim(),
          timestamp: Date.now(),
        })
      );
      // Clear the transcription after saving
      setTranscription("");
    }
  }, [transcription]);

  const handleDeleteNote = useCallback((noteId: string) => {
    // Use InstantDB transaction to delete the note
    db.transact(db.tx.notes[noteId].delete());
  }, []);

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-xl">Loading notes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-xl text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  // Get notes from InstantDB data and convert timestamp to Date
  const notes: Note[] = (data?.notes || []).map((note) => ({
    ...note,
    timestamp: new Date(note.timestamp),
  }));

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Voice Recorder</h1>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Recording Section */}
          <div>
            <VoiceRecording
              onTranscriptionChange={handleTranscriptionChange}
              transcription={transcription}
            />
            <div className="mt-4 flex justify-center">
              <NoteSaver
                transcription={transcription}
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
