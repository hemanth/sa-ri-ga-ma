import React from 'react';
import { Play, Square } from 'lucide-react';

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

export function PlayButton({ isPlaying, onClick }: PlayButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
        isPlaying
          ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
          : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
      }`}
    >
      {isPlaying ? (
        <>
          <Square className="w-4 h-4" /> Stop
        </>
      ) : (
        <>
          <Play className="w-4 h-4" /> Play
        </>
      )}
    </button>
  );
}