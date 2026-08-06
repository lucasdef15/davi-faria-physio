'use client';

import ResultCard from './carousel/ResultCard';
import ResultsCarouselControls from './carousel/ResultsCarouselControls';
import { useResultsCarousel } from './carousel/useResultsCarousel';
import { EVOLUTION_AREAS, EVOLUTION_DIMENSIONS } from './results.data';
import { RESULT_ACCENTS } from './results.styles';

export default function ResultsJourney() {
  const {
    activeIndex,
    endSpacer,
    finishMouseDrag,
    goToNext,
    goToPrevious,
    handleClickCapture,
    handlePointerDown,
    handlePointerLeave,
    handlePointerMove,
    scrollToSlide,
    trackRef,
  } = useResultsCarousel({ slideCount: EVOLUTION_AREAS.length });

  return (
    <div className="mx-auto mt-10 max-w-6xl sm:mt-12 lg:mt-14" data-results-journey>
      <ResultsCarouselControls
        activeIndex={activeIndex}
        areas={EVOLUTION_AREAS}
        onNext={goToNext}
        onPrevious={goToPrevious}
        onSelect={scrollToSlide}
      />

      <div
        className="relative xl:overflow-hidden xl:rounded-t-[2.25rem] xl:border xl:border-b-0 xl:border-slate-200/90 xl:bg-white/90 xl:shadow-[0_34px_90px_-56px_rgba(15,118,110,0.42)]"
        data-results-shell
      >
        <div
          className="hidden items-center justify-between border-b border-slate-200/80 px-7 py-4 xl:flex"
          data-results-topbar
        >
          <div className="flex items-center gap-3">
            <span className="size-1.5 rounded-full bg-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.10)]" />
            <span className="font-mono text-[0.62rem] font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Linha de recuperação funcional
            </span>
          </div>

          <span className="font-mono text-[0.58rem] tracking-[0.16em] text-slate-400 uppercase">
            Do suporte à autonomia
          </span>
        </div>

        <div
          className="relative hidden grid-cols-4 border-b border-slate-200/80 xl:grid"
          data-results-desktop-steps
        >
          <div
            aria-hidden="true"
            className="absolute top-[4.8rem] right-[12.5%] left-[12.5%] h-px bg-linear-to-r from-teal-500 via-cyan-500 via-55% to-blue-500 opacity-55"
            data-results-progress-line
          />

          {EVOLUTION_AREAS.map((area, index) => {
            const accent = RESULT_ACCENTS[index];
            const number = String(index + 1).padStart(2, '0');

            return (
              <div
                className="relative flex h-28 flex-col items-center border-r border-slate-200/70 pt-5 text-center last:border-r-0"
                data-results-step
                key={`desktop-step-${area.id}`}
              >
                <span className={`font-mono text-[0.66rem] font-semibold ${accent.number}`}>
                  {number}
                </span>
                <span className="mt-1 text-[0.58rem] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                  {EVOLUTION_DIMENSIONS[index]}
                </span>

                <span
                  aria-hidden="true"
                  className={`absolute top-[4.35rem] left-1/2 size-3 -translate-x-1/2 rounded-full border-2 border-white ${accent.node}`}
                  data-results-step-node
                />
              </div>
            );
          })}
        </div>

        <div
          className="-mx-5 cursor-grab touch-auto snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain scroll-smooth px-5 pb-5 select-none data-[dragging=true]:cursor-grabbing data-[dragging=true]:snap-none sm:-mx-8 sm:px-8 xl:mx-0 xl:cursor-auto xl:snap-none xl:overflow-visible xl:px-0 xl:pb-0 xl:select-auto [&::-webkit-scrollbar]:hidden"
          data-results-track
          onClickCapture={handleClickCapture}
          onPointerCancel={finishMouseDrag}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          onPointerUp={finishMouseDrag}
          ref={trackRef}
        >
          <ol className="flex w-max items-stretch gap-4 xl:grid xl:w-full xl:grid-cols-4 xl:gap-0">
            {EVOLUTION_AREAS.map((area, index) => (
              <ResultCard
                accent={RESULT_ACCENTS[index]}
                area={area}
                dimension={EVOLUTION_DIMENSIONS[index]}
                index={index}
                key={area.id}
                onSelect={scrollToSlide}
              />
            ))}

            <li aria-hidden="true" className="shrink-0 xl:hidden" style={{ width: endSpacer }} />
          </ol>
        </div>

        <div
          className="hidden items-center justify-between border-t border-slate-200/80 bg-[linear-gradient(90deg,rgba(240,253,250,0.78),rgba(255,255,255,0.92),rgba(239,246,255,0.78))] px-7 py-4 xl:flex"
          data-results-chain
        >
          <div className="flex items-center gap-2.5 text-[0.6rem] font-semibold tracking-[0.15em] text-slate-500 uppercase">
            <span>Respiração</span>
            <span aria-hidden="true" className="text-teal-500">
              →
            </span>
            <span>Esforço</span>
            <span aria-hidden="true" className="text-cyan-500">
              →
            </span>
            <span>Movimento</span>
            <span aria-hidden="true" className="text-sky-500">
              →
            </span>
            <span>Rotina</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[0.58rem] tracking-[0.15em] text-teal-700 uppercase">
            <span>Próximo passo</span>
            <span aria-hidden="true">↓</span>
          </div>
        </div>
      </div>

      <div
        className="mt-1 flex items-center justify-between text-[0.64rem] font-semibold tracking-[0.14em] text-slate-400 uppercase xl:hidden"
        data-results-mobile-hint
      >
        <span>Deslize para acompanhar</span>
        <span aria-hidden="true">→</span>
      </div>
    </div>
  );
}
