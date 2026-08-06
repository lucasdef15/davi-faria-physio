'use client';

import type { ReactNode } from 'react';

import { useRef } from 'react';

import { useResultsAnimation } from './useResultsAnimation';

interface ResultsMotionShellProps {
  children: ReactNode;
}

export default function ResultsMotionShell({ children }: ResultsMotionShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useResultsAnimation(rootRef);

  return (
    <div data-results-motion-root ref={rootRef}>
      {children}
    </div>
  );
}
