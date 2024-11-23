import React, { useState, useEffect } from 'react';
import { NoteButton } from './NoteButton';
import { VolumeControl } from './VolumeControl';
import { PlayButton } from './PlayButton';
import { MUSIC_NOTES } from '../constants/musicNotes';
import { Keyboard } from 'lucide-react';

interface FrequencyControlProps {
  frequency: number;
  isPlaying: boolean;
  volume: number;
  onFrequencyChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onPlayToggle: () => void;
  restartSound: () => void;
}

const KEY_MAP = {
  's': 'Sa',
  'r': 'Re',
  'g': 'Ga',
  'm': 'Ma',
  'p': 'Pa',
  'd': 'Dha',
  'n': 'Ni',
  'S': 'Sa²',
} as const;

export function FrequencyControl({
  frequency,
  isPlaying,
  volume,
  onFrequencyChange,
  onVolumeChange,
  onPlayToggle,
  restartSound,
}: FrequencyControlProps) {
  const [noteInput, setNoteInput] = useState('');
  const [lastPlayedNote, setLastPlayedNote] = useState('');

  const handleNoteInput = (input: string) => {
    setNoteInput(input);
    const notes = input.split(/\s+/).filter(Boolean);
    const currentNote = notes[notes.length - 1];
    
    if (currentNote) {
      const noteObj = MUSIC_NOTES.find(n => 
        n.note.toLowerCase() === currentNote.toLowerCase()
      );
      
      if (noteObj) {
        const isRepeatedNote = currentNote.toLowerCase() === lastPlayedNote.toLowerCase();
        onFrequencyChange(noteObj.frequency);
        
        if (!isPlaying) {
          onPlayToggle();
        } else if (isRepeatedNote) {
          restartSound();
        }
        
        setLastPlayedNote(currentNote);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEY_MAP[e.key as keyof typeof KEY_MAP];
      if (note) {
        const noteObj = MUSIC_NOTES.find(n => n.note === note);
        if (noteObj) {
          const isRepeatedNote = note === lastPlayedNote;
          onFrequencyChange(noteObj.frequency);
          if (!isPlaying) {
            onPlayToggle();
          } else if (isRepeatedNote) {
            restartSound();
          }
          setLastPlayedNote(note);
          setNoteInput(prev => prev + (prev ? ' ' : '') + note);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFrequencyChange, onPlayToggle, restartSound, isPlaying, lastPlayedNote]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const cleanedText = pastedText.replace(/[^a-zA-Z\s²]/g, '');
    setNoteInput(noteInput + cleanedText);
    handleNoteInput(noteInput + cleanedText);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-2">
        {MUSIC_NOTES.map(({ note, frequency: noteFreq }) => (
          <NoteButton
            key={note}
            note={note}
            frequency={noteFreq}
            isSelected={frequency === noteFreq}
            onClick={() => {
              const isRepeatedNote = note === lastPlayedNote;
              onFrequencyChange(noteFreq);
              if (!isPlaying) {
                onPlayToggle();
              } else if (isRepeatedNote) {
                restartSound();
              }
              setLastPlayedNote(note);
              setNoteInput(prev => prev + (prev ? ' ' : '') + note);
            }}
          />
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="frequency" className="text-sm font-medium text-gray-700">
            Frequency
          </label>
          <span className="text-sm font-semibold text-blue-600">{frequency}Hz</span>
        </div>
        <input
          type="range"
          id="frequency"
          min="20"
          max="20000"
          value={frequency}
          onChange={(e) => onFrequencyChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>20Hz</span>
          <span>20kHz</span>
        </div>
      </div>

      <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
      
      <PlayButton isPlaying={isPlaying} onClick={onPlayToggle} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-white/80 text-sm text-gray-500">keyboard shortcuts</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
        {Object.entries(KEY_MAP).map(([key, note]) => (
          <div key={key} className="flex items-center justify-center gap-1 p-2 bg-gray-50 rounded-lg">
            <kbd className="px-2 py-1 bg-white rounded border shadow-sm">{key}</kbd>
            <span>{note}</span>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-white/80 text-sm text-gray-500">or type notes</span>
        </div>
      </div>

      <input
        type="text"
        value={noteInput}
        placeholder="Type or paste notes (e.g., Sa Re Sa Sa Ga)"
        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        onChange={(e) => handleNoteInput(e.target.value)}
        onPaste={handlePaste}
      />
    </div>
  );
}