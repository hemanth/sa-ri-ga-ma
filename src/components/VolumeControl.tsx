import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor="volume" className="text-sm font-medium text-gray-700">
          Volume
        </label>
        <span className="text-sm font-semibold text-blue-600">{Math.round(volume * 100)}%</span>
      </div>
      <div className="flex items-center gap-2">
        <VolumeX className="w-4 h-4 text-gray-500" />
        <input
          type="range"
          id="volume"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-full"
        />
        <Volume2 className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
}