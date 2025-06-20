import { Note } from "../types/notes";

interface NotesListProps {
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
}

export default function NotesList({ notes, onDeleteNote }: NotesListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        Saved Notes ({notes.length}):
      </h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-gray-500 italic">No notes saved yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-500">
                  {note.timestamp.toLocaleString()}
                </div>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  title="Delete note"
                >
                  Delete
                </button>
              </div>
              <div className="text-gray-800">{note.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
