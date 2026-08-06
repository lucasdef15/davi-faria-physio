import type { EvolutionArea } from '../results.data';

interface ResultsCarouselControlsProps {
  activeIndex: number;
  areas: readonly EvolutionArea[];
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
}

export default function ResultsCarouselControls({
  activeIndex,
  areas,
  onNext,
  onPrevious,
  onSelect,
}: ResultsCarouselControlsProps) {
  return (
    <div
      className="mb-5 flex items-center justify-between gap-4 xl:hidden"
      data-results-mobile-controls
    >
      <div className="flex shrink-0 items-baseline gap-2">
        <span className="font-mono text-lg font-semibold tracking-[-0.04em] text-slate-950">
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <span className="font-mono text-[0.65rem] tracking-[0.16em] text-slate-400 uppercase">
          / {String(areas.length).padStart(2, '0')}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
        <div className="flex items-center gap-1.5">
          {areas.map((area, index) => (
            <button
              aria-current={activeIndex === index ? 'step' : undefined}
              aria-label={`Ver ${area.title}`}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                activeIndex === index ? 'w-9 bg-teal-600' : 'w-4 bg-slate-200'
              }`}
              key={area.id}
              onClick={() => onSelect(index)}
              type="button"
            />
          ))}
        </div>

        <div className="hidden items-center gap-1 sm:flex">
          <NavigationButton
            direction="previous"
            disabled={activeIndex === 0}
            onClick={onPrevious}
          />
          <NavigationButton
            direction="next"
            disabled={activeIndex === areas.length - 1}
            onClick={onNext}
          />
        </div>
      </div>
    </div>
  );
}

interface NavigationButtonProps {
  direction: 'next' | 'previous';
  disabled: boolean;
  onClick: () => void;
}

function NavigationButton({ direction, disabled, onClick }: NavigationButtonProps) {
  const isPrevious = direction === 'previous';

  return (
    <button
      aria-label={isPrevious ? 'Ver resultado anterior' : 'Ver próximo resultado'}
      className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-[border-color,color,transform,opacity] duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d={isPrevious ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
      </svg>
    </button>
  );
}
