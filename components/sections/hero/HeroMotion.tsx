'use client';

import type { PropsWithChildren } from 'react';

import { useHeroAnimation } from '@/components/motion/useHeroAnimation';

export default function HeroMotion({ children }: PropsWithChildren) {
  const { containerRef } = useHeroAnimation();

  return (
    <section
      className="relative isolate flex min-h-screen min-h-[100svh] items-center justify-center overflow-hidden bg-linear-to-b from-[#F8FCFD] via-[#F3FAFB] to-[#F7FBFC]"
      data-hero-interaction-root
      id="inicio"
      ref={containerRef}
    >
      {children}
    </section>
  );
}
