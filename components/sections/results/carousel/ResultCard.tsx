import type { KeyboardEvent } from 'react';

import type { EvolutionArea } from '../results.data';
import type { ResultAccent } from '../results.styles';

import ResultSignature from '../signatures/ResultSignature';

interface ResultCardProps {
  accent: ResultAccent;
  area: EvolutionArea;
  dimension: string;
  index: number;
  onSelect: (index: number) => void;
}

export default function ResultCard({
  accent,
  area,
  dimension,
  index,
  onSelect,
}: ResultCardProps) {
  const number = String(index + 1).padStart(2, '0');

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(index);
    }
  };

  return (
    <li
      className={`w-[84vw] max-w-[23rem] shrink-0 snap-always [scroll-snap-stop:always] sm:w-[min(72vw,26rem)] lg:w-[28rem] xl:w-auto xl:max-w-none xl:border-r xl:border-slate-200/70 xl:last:border-r-0 ${
        index === 0 ? 'snap-start' : 'snap-center'
      }`}
      data-result-slide={index}
      data-results-card
    >
      <article
        aria-label={`Centralizar etapa ${number}: ${area.title}`}
        className={`group relative flex h-full min-h-[31rem] cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-slate-200/90 bg-linear-to-b ${accent.surface} p-6 text-left shadow-[0_24px_70px_-48px_rgba(15,118,110,0.48)] outline-none transition-[border-color,box-shadow] duration-300 focus-visible:border-teal-400 focus-visible:ring-2 focus-visible:ring-teal-500/25 focus-visible:ring-offset-3 sm:p-7 xl:min-h-[32rem] xl:cursor-default xl:rounded-none xl:border-0 xl:p-7 xl:shadow-none xl:focus-visible:ring-0 xl:focus-visible:ring-offset-0`}
        onClick={() => onSelect(index)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-linear-to-br ${accent.glow} blur-2xl xl:-top-24 xl:-right-24 xl:size-64 xl:opacity-70`}
        />

        <div className="relative flex items-center justify-between gap-4 xl:hidden">
          <span
            className={`font-mono text-[0.68rem] font-semibold tracking-[0.18em] ${accent.number}`}
          >
            {number}
          </span>

          <span className="text-[0.58rem] font-semibold tracking-[0.16em] text-slate-400 uppercase">
            {dimension}
          </span>
        </div>

        <div className="relative mt-12 xl:mt-1">
          <h3 className="font-space-grotesk max-w-[11ch] text-[2rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-slate-950 xl:text-[1.7rem]">
            {area.title}
          </h3>

          <p className="mt-5 text-sm leading-7 text-slate-600 xl:min-h-[8.75rem]">
            {area.description}
          </p>
        </div>

        <ResultSignature index={index} />

        <div className="relative mt-auto border-t border-slate-200/80 pt-5">
          <span className="text-[0.58rem] font-semibold tracking-[0.15em] text-slate-400 uppercase">
            Pontos observados
          </span>

          <div className="mt-3 flex flex-wrap gap-2">
            {area.indicators.map((indicator) => (
              <span
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[0.66rem] font-medium text-slate-600"
                key={indicator}
              >
                {indicator}
              </span>
            ))}
          </div>
        </div>
      </article>
    </li>
  );
}
