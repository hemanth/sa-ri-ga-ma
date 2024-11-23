import React from 'react';

interface NoteButtonProps {
  note: string;
  frequency: number;
  isSelected: boolean;
  onClick: () => void;
}

export function NoteButton({ note, frequency, isSelected, onClick }: NoteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg font-medium transition-all duration-200 
        ${isSelected 
          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
        }`}
    >
      <div>{note}</div>
      <div className="text-xs opacity-75">{frequency}Hz</div>
    </button>
  );
}