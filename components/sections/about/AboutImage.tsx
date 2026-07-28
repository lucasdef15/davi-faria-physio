'use client';

import Image, { type StaticImageData } from 'next/image';
import { type ReactNode } from 'react';

import { useTouchHover } from '@/components/motion/useTouchHover';
import { HighlightCard } from '@/components/ui/HighlightCard';

interface AboutImageProps {
  alt: string;
  description: string;
  eyebrow: string;
  icon: ReactNode;
  src: StaticImageData | string;
  title: string;
}

export default function AboutImage({
  alt,
  description,
  eyebrow,
  icon,
  src,
  title,
}: AboutImageProps) {
  const { touchProps } = useTouchHover<HTMLElement>({
    duration: 1600,
  });

  return (
    <figure {...touchProps} className="group relative isolate mx-auto w-full max-w-[32rem]">
      <div
        aria-hidden="true"
        className={[
          'pointer-events-none absolute -inset-12 -z-20',
          'scale-100 opacity-70 blur-3xl',
          'transition-all duration-1000 ease-out',

          'group-hover:opacity-100',
          'group-data-[touch-active=true]:opacity-100',

          'motion-safe:group-hover:scale-105',
          'motion-safe:group-data-[touch-active=true]:scale-105',
        ].join(' ')}
      >
        <div className="absolute top-0 left-1/4 size-56 rounded-full bg-cyan-300/20" />

        <div className="absolute right-0 bottom-12 size-64 rounded-full bg-teal-300/20" />

        <div className="absolute bottom-0 left-0 size-48 rounded-full bg-sky-200/20" />
      </div>

      <div
        aria-hidden="true"
        className={[
          'absolute -bottom-6 left-1/2 -z-10',
          'h-16 w-[78%] -translate-x-1/2',
          'rounded-[100%] bg-slate-900/15 blur-2xl',
          'transition-all duration-700 ease-out',

          'group-hover:w-[84%]',
          'group-hover:bg-teal-950/20',

          'group-data-[touch-active=true]:w-[84%]',
          'group-data-[touch-active=true]:bg-teal-950/20',
        ].join(' ')}
      />

      <div
        className={[
          'relative overflow-hidden rounded-[2rem] border',
          'border-white/70 bg-white/40 p-1.5',
          'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_70px_-28px_rgba(15,23,42,0.35)]',
          'backdrop-blur-2xl',
          'transition-all duration-700',
          'ease-[cubic-bezier(0.22,1,0.36,1)]',

          'group-hover:border-white/90',
          'group-hover:shadow-[0_2px_3px_rgba(15,23,42,0.04),0_36px_90px_-30px_rgba(13,148,136,0.32)]',

          'group-data-[touch-active=true]:border-white/90',
          'group-data-[touch-active=true]:shadow-[0_2px_3px_rgba(15,23,42,0.04),0_36px_90px_-30px_rgba(13,148,136,0.32)]',

          'motion-safe:group-hover:-translate-y-1.5',
          'motion-safe:group-data-[touch-active=true]:-translate-y-1.5',

          'sm:rounded-[2.5rem]',
        ].join(' ')}
      >
        <div className="relative aspect-4/5 overflow-hidden rounded-[1.65rem] bg-slate-100 ring-1 ring-slate-950/5 sm:rounded-[2.1rem]">
          <Image
            alt={alt}
            className={[
              'object-cover',
              'transition-transform duration-[1400ms]',
              'ease-[cubic-bezier(0.22,1,0.36,1)]',

              'motion-safe:group-hover:scale-[1.035]',
              'motion-safe:group-data-[touch-active=true]:scale-[1.035]',
            ].join(' ')}
            fill
            sizes="(max-width: 640px) 92vw, 512px"
            src={src}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/5 to-white/15"
          />

          <div
            aria-hidden="true"
            className={[
              'absolute inset-0',
              'bg-[radial-gradient(circle_at_75%_18%,rgba(153,246,228,0.18),transparent_38%)]',
              'opacity-60',
              'transition-opacity duration-700',

              'group-hover:opacity-100',
              'group-data-[touch-active=true]:opacity-100',
            ].join(' ')}
          />

          <div
            aria-hidden="true"
            className={[
              'absolute -top-1/3 -left-1/2',
              'h-[80%] w-[140%] rotate-[-12deg]',
              'bg-gradient-to-b from-white/30 via-white/5 to-transparent',
              'blur-xl',
              'transition-transform duration-[1600ms]',
              'ease-[cubic-bezier(0.22,1,0.36,1)]',

              'motion-safe:group-hover:translate-x-[22%]',
              'motion-safe:group-data-[touch-active=true]:translate-x-[22%]',
            ].join(' ')}
          />

          <div
            aria-hidden="true"
            className="absolute inset-px rounded-[inherit] ring-1 ring-white/25 ring-inset"
          />

          <figcaption
            className={[
              'absolute right-3 bottom-3 left-3 z-10',
              'transition-transform duration-700',
              'ease-[cubic-bezier(0.22,1,0.36,1)]',

              'motion-safe:group-hover:-translate-y-1',
              'motion-safe:group-data-[touch-active=true]:-translate-y-1',

              'sm:right-5 sm:bottom-5 sm:left-5',
            ].join(' ')}
          >
            <div className="rounded-[1.35rem] border border-white/55 bg-white/78 p-1 shadow-[0_16px_50px_-20px_rgba(15,23,42,0.45)] backdrop-blur-2xl backdrop-saturate-150">
              <HighlightCard
                description={description}
                eyebrow={eyebrow}
                icon={icon}
                title={title}
              />
            </div>
          </figcaption>

          <div
            aria-hidden="true"
            className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border border-white/40 bg-slate-950/20 px-2.5 py-1.5 text-white shadow-sm backdrop-blur-xl"
          >
            <span className="size-1.5 rounded-full bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.9)]" />

            <span className="h-px w-4 bg-white/50" />
          </div>
        </div>
      </div>
    </figure>
  );
}
