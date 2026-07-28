import { useTouchHover } from '@/components/motion/useTouchHover';

import { PILLARS } from './works.data';

interface ApproachItemProps {
  number: string;
  pillar: Pillar;
}

type Pillar = (typeof PILLARS)[number];

export default function ApproachItem({ number, pillar }: ApproachItemProps) {
  const { touchProps } = useTouchHover<HTMLLIElement>({
    duration: 1600,
  });

  return (
    <li
      {...touchProps}
      className={[
        'group relative overflow-hidden',
        'border-border/70 border-b last:border-b-0',
      ].join(' ')}
      data-reveal="default"
    >
      <div
        aria-hidden="true"
        className={[
          'from-primary/[0.045] absolute inset-0',
          'bg-gradient-to-r to-transparent',
          'opacity-0 transition-opacity duration-500',

          'group-hover:opacity-100',
          'group-data-[touch-active=true]:opacity-100',
        ].join(' ')}
      />

      <div
        className={[
          'relative grid grid-cols-[2.5rem_minmax(0,1fr)]',
          'gap-x-4 py-7',

          'transition-transform duration-500',
          'ease-[var(--ease-premium)]',

          'sm:grid-cols-[3rem_minmax(0,1fr)]',
          'sm:gap-x-6 sm:py-9',

          'lg:grid-cols-[3.5rem_minmax(0,0.8fr)_minmax(0,1.2fr)]',
          'lg:items-start lg:gap-x-7 lg:py-10',
        ].join(' ')}
      >
        <span
          className={[
            'row-span-2 pt-1',
            'font-mono text-[0.65rem] font-semibold',
            'tracking-[0.18em] text-slate-300',
            'transition-colors duration-300',

            'group-hover:text-primary/70',
            'group-data-[touch-active=true]:text-primary/70',

            'lg:row-span-1',
          ].join(' ')}
        >
          {number}
        </span>

        <h3
          className={[
            'font-space-grotesk text-foreground',
            'max-w-sm text-lg leading-[1.2] font-semibold',
            'tracking-[-0.025em]',
            'transition-transform duration-500',
            'ease-[var(--ease-premium)]',

            'motion-safe:group-hover:translate-x-1',
            'motion-safe:group-data-[touch-active=true]:translate-x-1',

            'sm:text-xl',
          ].join(' ')}
        >
          {pillar.title}
        </h3>

        <p
          className={[
            'text-foreground-muted mt-3 max-w-xl',
            'text-sm leading-6',
            'transition-colors duration-500',

            'group-hover:text-slate-600',
            'group-data-[touch-active=true]:text-slate-600',

            'lg:mt-0 lg:pr-5',
          ].join(' ')}
        >
          {pillar.description}
        </p>
      </div>

      <div
        aria-hidden="true"
        className={[
          'bg-primary absolute bottom-0 left-0 h-px w-0',
          'transition-[width] duration-500 ease-out',

          'motion-safe:group-hover:w-24',
          'motion-safe:group-data-[touch-active=true]:w-24',
        ].join(' ')}
      />

      <div
        aria-hidden="true"
        className={[
          'bg-primary/[0.06] pointer-events-none',
          'absolute top-1/2 right-0 size-40',
          'translate-x-1/2 -translate-y-1/2 rounded-full',
          'scale-75 opacity-0 blur-3xl',
          'transition-all duration-700',

          'group-hover:scale-100 group-hover:opacity-100',
          'group-data-[touch-active=true]:scale-100',
          'group-data-[touch-active=true]:opacity-100',
        ].join(' ')}
      />
    </li>
  );
}
