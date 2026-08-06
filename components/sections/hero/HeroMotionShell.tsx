'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';

import { useHeroAnimation } from './useHeroAnimation';

interface HeroMotionShellProps {
  children: ReactNode;
}

export default function HeroMotionShell({ children }: HeroMotionShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useHeroAnimation(rootRef);

  return (
    <div data-hero-motion-root ref={rootRef}>
      {children}
    </div>
  );
}
