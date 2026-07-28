'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

interface ScrollBadgeProps {
  className?: string;
  text?: string;
}

export default function ScrollBadge({ className = '', text = 'Explore' }: ScrollBadgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const label = container.querySelector('[data-scroll-label]');
      const line = container.querySelector('[data-scroll-line]');
      const indicator = container.querySelector('[data-scroll-indicator]');

      if (prefersReducedMotion) {
        gsap.set([label, line, indicator], {
          clearProps: 'transform',
          opacity: 1,
        });

        return;
      }

      gsap
        .timeline({
          defaults: {
            ease: 'power3.out',
          },
          delay: 0.7,
        })
        .fromTo(
          label,
          {
            opacity: 0,
            y: 8,
          },
          {
            duration: 0.8,
            opacity: 1,
            y: 0,
          },
        )
        .fromTo(
          line,
          {
            opacity: 0,
          },
          {
            duration: 0.8,
            opacity: 1,
          },
          '-=0.5',
        )
        .fromTo(
          indicator,
          {
            opacity: 0,
          },
          {
            duration: 0.5,
            opacity: 1,
          },
          '-=0.3',
        );

      gsap.fromTo(
        indicator,
        {
          y: 1,
        },
        {
          duration: 1.35,
          ease: 'sine.inOut',
          repeat: -1,
          y: 23,
          yoyo: true,
        },
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className={[
        'pointer-events-none absolute inset-x-0 bottom-6 z-10',
        'hidden justify-center sm:flex',
        className,
      ].join(' ')}
      data-hero-scroll
      ref={containerRef}
    >
      <div className="flex flex-col items-center">
        <span
          className="mb-3 text-[10px] font-medium tracking-[0.3em] text-slate-500/80 uppercase"
          data-scroll-label
        >
          {text}
        </span>

        <div
          aria-hidden="true"
          className="relative h-9 w-px overflow-hidden bg-linear-to-b from-[#c9c1b4] via-[#d8d1c6] to-[#c9c1b4]/20"
          data-scroll-line
        >
          <span
            className="absolute top-0 left-1/2 h-3 w-[2px] -translate-x-1/2 rounded-full bg-linear-to-b from-teal-500 to-sky-400 shadow-[0_0_7px_rgba(20,184,166,0.35)]"
            data-scroll-indicator
          />
        </div>
      </div>
    </div>
  );
}
