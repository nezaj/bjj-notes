interface NoteSaverProps {
  transcription: string;
  onSaveNote: () => void;
}

export default function NoteSaver({
  transcription,
  onSaveNote,
}: NoteSaverProps) {
  return (
    <button
      onClick={onSaveNote}
      disabled={!transcription.trim()}
      className="px-6 py-3 rounded-full text-white font-medium text-lg transition-all
        bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Save Note
    </button>
  );
}
