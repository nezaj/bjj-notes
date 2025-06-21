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
      className="px-4 py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium text-base sm:text-lg transition-all w-full sm:w-auto
        bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Save Note
    </button>
  );
}
