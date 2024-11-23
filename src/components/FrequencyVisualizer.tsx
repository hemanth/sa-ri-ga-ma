import React, { useEffect, useRef } from 'react';

interface FrequencyVisualizerProps {
  audioContext: AudioContext | null;
  oscillator: OscillatorNode | null;
}

export function FrequencyVisualizer({ audioContext, oscillator }: FrequencyVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!audioContext || !oscillator || !canvasRef.current) return;

    const analyzer = audioContext.createAnalyser();
    oscillator.connect(analyzer);
    analyzer.fftSize = 2048;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      analyzer.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgb(13, 17, 23)';
      ctx.fillRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#60A5FA';
      ctx.beginPath();

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioContext, oscillator]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-40 rounded-lg bg-gray-900"
      width={800}
      height={160}
    />
  );
}