"use client";

import { useState, useCallback } from "react";
import { init, id, User } from "@instantdb/react";
import schema from "../instant.schema";
import { Note } from "../types/notes";
import VoiceRecording from "../components/VoiceRecording";
import NoteSaver from "../components/NoteSaver";
import NotesList from "../components/NotesList";
import NoteSummarizer from "../components/NoteSummarizer";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const db = init({ appId: APP_ID, schema });

export default function App() {
  const { isLoading, user, error } = db.useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-xl text-red-600">
          Authentication Error: {error.message}
        </div>
      </div>
    );
  }

  if (user) {
    return <Main user={user} />;
  }

  return <Login />;
}

function Main({ user }: { user: User }) {
  const [transcription, setTranscription] = useState("");

  // Query notes from InstantDB, ordered by timestamp descending
  // Only fetch notes that belong to the current user
  const { isLoading, data, error } = db.useQuery({
    notes: {
      $: {
        where: { ownerId: user.id },
        order: { timestamp: "desc" },
      },
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
          ownerId: user.id,
        })
      );
      // Clear the transcription after saving
      setTranscription("");
    }
  }, [transcription, user.id]);

  const handleDeleteNote = useCallback((noteId: string) => {
    // Use InstantDB transaction to delete the note
    db.transact(db.tx.notes[noteId].delete());
  }, []);

  const handleSignOut = () => {
    db.auth.signOut();
  };

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
    <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header with user info and logout */}
      <div className="w-full max-w-7xl mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            BJJ Voice Notes
          </h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-sm sm:text-base text-gray-600 truncate">
              Welcome, {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 text-white font-medium text-sm sm:text-base rounded hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Voice Recording Section */}
          <div className="space-y-4">
            <VoiceRecording
              onTranscriptionChange={handleTranscriptionChange}
              transcription={transcription}
            />
            <div className="flex justify-center">
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

          {/* AI Summary Section */}
          <div className="lg:col-span-2 xl:col-span-1">
            <NoteSummarizer notes={notes} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [sentEmail, setSentEmail] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              BJJ Voice Notes
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Record and organize your BJJ training notes
            </p>
          </div>

          {!sentEmail ? (
            <EmailStep onSendEmail={setSentEmail} />
          ) : (
            <CodeStep sentEmail={sentEmail} />
          )}
        </div>
      </div>
    </div>
  );
}

function EmailStep({ onSendEmail }: { onSendEmail: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await db.auth.sendMagicCode({ email });
      onSendEmail(email);
    } catch (err: any) {
      alert("Error sending code: " + (err.body?.message || err.message));
      onSendEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign In</h2>
        <p className="text-gray-600 text-sm">
          Enter your email and we&apos;ll send you a verification code.
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="your@email.com"
          required
          autoFocus
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Sending..." : "Send Verification Code"}
      </button>
    </form>
  );
}

function CodeStep({ sentEmail }: { sentEmail: string }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await db.auth.signInWithMagicCode({ email: sentEmail, code });
    } catch (err: any) {
      alert("Invalid code: " + (err.body?.message || err.message));
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-gray-600 text-sm">
          We sent a code to <strong>{sentEmail}</strong>
        </p>
      </div>

      <div>
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Verification Code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter 6-digit code"
          required
          autoFocus
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>
    </form>
  );
}
