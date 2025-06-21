import { Note } from "../types/notes";

interface NotesListProps {
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
}

export default function NotesList({ notes, onDeleteNote }: NotesListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold">
        Saved Notes ({notes.length}):
      </h2>
      <div className="space-y-3 sm:space-y-4 max-h-[350px] sm:max-h-[400px] overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-gray-500 italic text-sm sm:text-base">
            No notes saved yet.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-3 sm:p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-1 sm:space-y-0">
                <div className="text-xs sm:text-sm text-gray-500">
                  {note.timestamp.toLocaleString()}
                </div>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors self-start sm:self-auto"
                  title="Delete note"
                >
                  Delete
                </button>
              </div>
              <div className="text-gray-800 text-sm sm:text-base leading-relaxed">
                {note.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
