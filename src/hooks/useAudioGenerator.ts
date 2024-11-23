import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudioGenerator() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isInitializedRef = useRef(false);
  const lastNoteTimeRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440);
  const [volume, setVolume] = useState(0.5);

  const cleanupAudio = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    }
    isInitializedRef.current = false;
  }, []);

  const initAudio = useCallback(() => {
    if (isInitializedRef.current) {
      cleanupAudio();
    }

    try {
      audioContextRef.current = new AudioContext();
      oscillatorRef.current = audioContextRef.current.createOscillator();
      gainNodeRef.current = audioContextRef.current.createGain();

      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);

      oscillatorRef.current.frequency.value = frequency;
      gainNodeRef.current.gain.value = volume;

      oscillatorRef.current.start();
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      cleanupAudio();
    }
  }, [frequency, volume, cleanupAudio]);

  const toggleSound = useCallback(() => {
    if (isPlaying) {
      cleanupAudio();
      setIsPlaying(false);
    } else {
      initAudio();
      setIsPlaying(true);
    }
  }, [isPlaying, initAudio, cleanupAudio]);

  const restartSound = useCallback(() => {
    const now = Date.now();
    if (now - lastNoteTimeRef.current > 50) {
      cleanupAudio();
      initAudio();
      lastNoteTimeRef.current = now;
    }
  }, [initAudio, cleanupAudio]);

  useEffect(() => {
    if (oscillatorRef.current && isInitializedRef.current) {
      oscillatorRef.current.frequency.value = frequency;
    }
  }, [frequency]);

  useEffect(() => {
    if (gainNodeRef.current && isInitializedRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    isPlaying,
    frequency,
    volume,
    setFrequency,
    setVolume,
    toggleSound,
    restartSound,
  };
}