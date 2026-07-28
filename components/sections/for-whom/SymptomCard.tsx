import type { Symptom } from './symptoms';

interface SymptomCardProps {
  active: boolean;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onLeave: () => void;
  onPeek: (id: string) => void;
  onSelect: (id: string) => void;
  selected: boolean;
  symptom: Symptom;
}

export default function SymptomCard({
  active,
  index,
  isFirst,
  isLast,
  onLeave,
  onPeek,
  onSelect,
  selected,
  symptom,
}: SymptomCardProps) {
  const [r, g, b] = symptom.profile.primary;
  const rgb = `${r}, ${g}, ${b}`;
  const number = String(index + 1).padStart(2, '0');

  return (
    <button
      aria-label={`${symptom.title}. ${symptom.description}`}
      aria-pressed={selected}
      className={[
        'group relative flex min-h-[92px] w-[86%] max-w-[20rem]',
        'shrink-0 snap-center flex-col justify-between overflow-hidden',
        '[scroll-snap-stop:always]',
        isFirst ? 'ml-[7%] min-[420px]:ml-[11%] sm:ml-0' : '',
        isLast ? 'mr-[7%] min-[420px]:mr-[11%] sm:mr-0' : '',
        'rounded-[1.1rem] border px-4 py-3.5 text-left',
        'transition-all duration-500 ease-out outline-none',
        'focus-visible:ring-2 focus-visible:ring-white/70',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-[#07131f]',
        'min-[420px]:w-[78%]',
        'sm:min-h-[88px] sm:w-full sm:max-w-none',
        'sm:px-4 sm:py-3.5',
        'motion-safe:hover:-translate-y-px',
      ].join(' ')}
      data-horizontal-scroll-item
      data-scroll-id={symptom.id}
      onBlur={onLeave}
      onClick={(event) => {
        if (window.matchMedia('(max-width: 639px)').matches) {
          event.currentTarget.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }

        onSelect(symptom.id);
      }}
      onFocus={() => onPeek(symptom.id)}
      onMouseEnter={() => onPeek(symptom.id)}
      onMouseLeave={onLeave}
      style={{
        background: active
          ? `linear-gradient(
              135deg,
              rgba(${rgb}, 0.15),
              rgba(255, 255, 255, 0.07)
            )`
          : 'rgba(255, 255, 255, 0.032)',
        borderColor: active ? `rgba(${rgb}, 0.42)` : 'rgba(255, 255, 255, 0.08)',
        boxShadow: active
          ? `inset 0 1px rgba(255, 255, 255, 0.08),
             0 18px 38px -26px rgba(${rgb}, 0.72)`
          : 'inset 0 1px rgba(255, 255, 255, 0.025)',
      }}
      type="button"
    >
      <div className="flex w-full items-center justify-between gap-4">
        <span
          className={[
            'font-mono text-[0.62rem] font-semibold tracking-[0.18em]',
            'transition-colors duration-500',
            active ? 'text-white/75' : 'text-slate-500',
          ].join(' ')}
        >
          {number}
        </span>

        <span
          className="truncate text-[0.58rem] font-semibold tracking-[0.14em] uppercase transition-all duration-500"
          style={{
            color: active ? `rgb(${rgb})` : 'rgb(100 116 139)',
          }}
        >
          {symptom.short}
        </span>
      </div>

      <div className="mt-4 flex w-full items-end justify-between gap-4">
        <span
          className={[
            'block max-w-[18rem] min-w-0',
            'text-[13px] leading-[1.35] font-medium',
            'transition-colors duration-500',
            'sm:text-sm',
            active ? 'text-white' : 'text-slate-300',
          ].join(' ')}
        >
          {symptom.title}
        </span>

        <svg
          aria-hidden="true"
          className="mb-0.5 size-3.5 shrink-0 transition-all duration-500"
          fill="none"
          style={{
            color: active ? `rgb(${rgb})` : 'rgb(100 116 139)',
            transform: active ? 'translateX(2px)' : 'translateX(0)',
          }}
          viewBox="0 0 12 12"
        >
          <path
            d="M3.5 2.5 7 6 3.5 9.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-y-4 left-0 w-px rounded-full transition-opacity duration-500"
        style={{
          background: `rgb(${rgb})`,
          opacity: active ? 1 : 0,
        }}
      />

      <span
        aria-hidden="true"
        className="absolute right-4 bottom-0 left-4 h-px origin-left transition-transform duration-500"
        style={{
          background: `linear-gradient(
            90deg,
            rgba(${rgb}, 0.75),
            rgba(${rgb}, 0)
          )`,
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />
    </button>
  );
}
