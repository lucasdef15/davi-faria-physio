import { useTouchHover } from '@/components/motion/useTouchHover';

import { EVOLUTION_AREAS } from './results.data';

type EvolutionArea = (typeof EVOLUTION_AREAS)[number];

interface EvolutionAreaItemProps {
  area: EvolutionArea;
  number: string;
}

export default function EvolutionAreaItem({
  area: { description, indicators, title },
  number,
}: EvolutionAreaItemProps) {
  const { touchProps } = useTouchHover<HTMLLIElement>({
    duration: 1600,
  });

  return (
    <li
      {...touchProps}
      className="group relative flex overflow-hidden border-b border-white/8 last:border-b-0"
      data-reveal
    >
      <div
        aria-hidden="true"
        className={[
          'absolute inset-0',
          'bg-linear-to-r from-teal-400/[0.065] via-teal-400/[0.018] to-transparent',
          'opacity-0 transition-opacity duration-500 ease-out',
          'group-hover:opacity-100',
          'group-data-[touch-active=true]:opacity-100',
        ].join(' ')}
      />

      <div
        aria-hidden="true"
        className={[
          'absolute top-0 bottom-0 left-0 w-px',
          'origin-top scale-y-0',
          'bg-linear-to-b from-teal-300 via-teal-400/60 to-transparent',
          'transition-transform duration-500 ease-out',
          'group-hover:scale-y-100',
          'group-data-[touch-active=true]:scale-y-100',
        ].join(' ')}
      />

      <div
        aria-hidden="true"
        className={[
          'absolute top-1/2 right-8 size-24',
          '-translate-y-1/2 rounded-full',
          'bg-teal-300/[0.035] opacity-0 blur-3xl',
          'transition-opacity duration-500',
          'group-hover:opacity-100',
          'group-data-[touch-active=true]:opacity-100',
        ].join(' ')}
      />

      <div
        className={[
          'relative grid w-full grid-cols-[2.25rem_minmax(0,1fr)]',
          'gap-x-4 px-5 py-7',
          'sm:grid-cols-[2.75rem_minmax(0,1fr)]',
          'sm:gap-x-6 sm:px-8 sm:py-8',
          'lg:items-start lg:px-10 lg:py-9',
        ].join(' ')}
      >
        <div className="relative pt-1">
          <span
            className={[
              'font-mono text-[0.62rem] font-semibold',
              'tracking-[0.18em] text-slate-500',
              'transition-colors duration-300',
              'group-hover:text-teal-300/80',
              'group-data-[touch-active=true]:text-teal-300/80',
            ].join(' ')}
          >
            {number}
          </span>

          <span
            aria-hidden="true"
            className={[
              'absolute top-7 left-[0.1rem] h-0 w-px',
              'bg-linear-to-b from-teal-300/50 to-transparent',
              'transition-all duration-500 ease-out',
              'group-hover:h-8',
              'group-data-[touch-active=true]:h-8',
            ].join(' ')}
          />
        </div>

        <div className="min-w-0">
          <h3
            className={[
              'font-space-grotesk max-w-md',
              'text-lg leading-[1.2] font-semibold',
              'tracking-[-0.025em] text-white',
              'transition-transform duration-500 ease-out',
              'motion-safe:group-hover:translate-x-1',
              'motion-safe:group-data-[touch-active=true]:translate-x-1',
              'sm:text-xl',
              'lg:text-[1.35rem]',
            ].join(' ')}
          >
            {title}
          </h3>

          <p
            className={[
              'mt-3 max-w-xl text-sm leading-6 text-slate-300',
              'transition-colors duration-300',
              'group-hover:text-slate-200',
              'group-data-[touch-active=true]:text-slate-200',
              'sm:text-[0.95rem] sm:leading-7',
            ].join(' ')}
          >
            {description}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/6 pt-4">
            {indicators.map((indicator) => (
              <span
                className={[
                  'inline-flex items-center gap-2',
                  'text-[0.58rem] font-semibold tracking-[0.12em]',
                  'text-slate-500 uppercase',
                  'transition-colors duration-300',
                  'group-hover:text-slate-400',
                  'group-data-[touch-active=true]:text-slate-400',
                ].join(' ')}
                key={indicator}
              >
                <span
                  className={[
                    'size-1 rounded-full bg-teal-400/60',
                    'shadow-[0_0_0_3px_rgba(45,212,191,0.04)]',
                    'transition-shadow duration-300',
                    'group-hover:shadow-[0_0_0_4px_rgba(45,212,191,0.07)]',
                    'group-data-[touch-active=true]:shadow-[0_0_0_4px_rgba(45,212,191,0.07)]',
                  ].join(' ')}
                />

                {indicator}
              </span>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}
