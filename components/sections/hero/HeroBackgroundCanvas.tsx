'use client';

import { useRef } from 'react';

import { useBackgroundCanvas } from '@/hooks/useBackgroundCanvas';

export default function HeroBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useBackgroundCanvas({
    canvasRef,
    desktopFps: 30,
    interactionRootSelector: '#inicio',
    mobileFps: 18,
  });

  return (
    <canvas
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.86] contain-strict sm:opacity-75"
      data-hero-canvas
      ref={canvasRef}
    />
  );
}
