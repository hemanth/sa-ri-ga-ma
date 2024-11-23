import React from 'react';
import { useAudioGenerator } from './hooks/useAudioGenerator';
import { FrequencyControl } from './components/FrequencyControl';
import { Music } from 'lucide-react';

export default function App() {
  const {
    isPlaying,
    frequency,
    volume,
    setFrequency,
    setVolume,
    toggleSound,
    restartSound,
  } = useAudioGenerator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/20">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
            Indian Music Notes
          </h1>
        </div>

        <FrequencyControl
          frequency={frequency}
          isPlaying={isPlaying}
          volume={volume}
          onFrequencyChange={setFrequency}
          onVolumeChange={setVolume}
          onPlayToggle={toggleSound}
          restartSound={restartSound}
        />

        <p className="mt-6 text-sm text-gray-500 text-center">
          🎧 Use headphones for better experience
        </p>
      </div>
    </div>
  );
}