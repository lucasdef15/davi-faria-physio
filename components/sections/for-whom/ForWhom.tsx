'use client';

import type { CSSProperties } from 'react';

import { useCallback, useEffect, useRef } from 'react';

import { useRevealAnimation } from '@/components/motion/useRevealAnimation';
import { useActiveSymptom } from '@/hooks/useActiveSymptom';
import { useBreathingAnimation } from '@/hooks/useBreathingAnimation';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';

import BreathingIllustration from './BreathingIllustration';
import SymptomCard from './SymptomCard';
import { SYMPTOMS } from './symptoms';

export default function ForWhom() {
  const stageRef = useRef<HTMLDivElement>(null);
  const symptomsRef = useRef<HTMLDivElement>(null);

  const { containerRef } = useRevealAnimation<HTMLElement>({
    start: 'top 84%',
  });

  const { active, clearHover, clearSelection, hasSelection, hover, isActive, isSelected, select } =
    useActiveSymptom(SYMPTOMS);

  const selectedId = SYMPTOMS.find((symptom) => isSelected(symptom.id))?.id ?? null;
  const selectedIdRef = useRef<null | string>(selectedId);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const handleSelect = useCallback(
    (id: string) => {
      selectedIdRef.current = selectedIdRef.current === id ? null : id;
      select(id);
    },
    [select],
  );

  const handleActiveCardChange = useCallback(
    (id: string) => {
      if (selectedIdRef.current === id) return;

      selectedIdRef.current = id;
      select(id);
    },
    [select],
  );

  const horizontalScroll = useHorizontalScroll(symptomsRef, {
    onActiveChange: handleActiveCardChange,
  });

  useEffect(() => {
    const clearWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearSelection();
      }
    };

    document.addEventListener('keydown', clearWithEscape);

    return () => {
      document.removeEventListener('keydown', clearWithEscape);
    };
  }, [clearSelection]);

  useBreathingAnimation(stageRef, active.profile);

  const [r, g, b] = active.profile.primary;
  const [r2, g2, b2] = active.profile.secondary;

  const accent = `${r}, ${g}, ${b}`;

  const panelStyle = {
    '--fw-accent': accent,
    '--fw-accent-secondary': `${r2}, ${g2}, ${b2}`,
  } as CSSProperties;

  return (
    <section
      aria-labelledby="for-whom-title"
      className="relative overflow-hidden bg-linear-to-b from-[#f7fbfc] via-white to-[#f5fafb]"
      id="para-quem"
      ref={containerRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,.1),transparent_62%)]"
      />

      <div className="site-container section-space relative z-10">
        <header
          className="flex w-full flex-col items-center justify-center text-center"
          data-reveal="default"
        >
          <span className="section-eyebrow">Para quem é o atendimento</span>

          <h2 className="section-title mt-5" id="for-whom-title">
            O que você sente
            <span className="block bg-linear-to-r from-teal-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
              ajuda a orientar o cuidado.
            </span>
          </h2>

          <p className="section-copy mx-auto mt-6 max-w-2xl">
            Falta de ar, cansaço, perda de força ou o período após uma internação podem afetar a
            rotina de maneiras diferentes. Explore as situações abaixo e entenda onde o
            acompanhamento pode ajudar.
          </p>
        </header>

        <div
          className="fw-console relative mt-10 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07131f] shadow-[0_42px_100px_-42px_rgba(2,15,27,.72)] sm:mt-12 sm:rounded-[2rem] md:mt-16 md:rounded-[2.5rem]"
          data-reveal="panel"
          style={panelStyle}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_85%)] bg-size-[48px_48px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 right-[-10%] h-[34rem] w-[34rem] rounded-full blur-[120px] transition-colors duration-700"
            style={{
              background: `rgba(${accent}, .2)`,
            }}
          />

          <div className="relative flex min-h-14 items-center justify-between border-b border-white/8 px-4 py-3.5 sm:px-7 sm:py-4 lg:px-9">
            <div className="flex items-center gap-3">
              <span className="relative flex size-2.5">
                <span
                  className="absolute inline-flex size-full animate-ping rounded-full opacity-50"
                  style={{
                    background: `rgb(${accent})`,
                  }}
                />

                <span
                  className="relative inline-flex size-2.5 rounded-full"
                  style={{
                    background: `rgb(${accent})`,
                  }}
                />
              </span>

              <span className="text-[9px] font-semibold tracking-[0.17em] text-slate-300 uppercase sm:text-[10px] sm:tracking-[0.2em]">
                Leitura funcional ilustrativa
              </span>
            </div>

            <span className="hidden text-[10px] tracking-[0.14em] text-slate-400 uppercase sm:block">
              Selecione uma situação
            </span>
          </div>

          <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(310px,0.82fr)_minmax(0,1.55fr)]">
            <div className="order-2 min-w-0 border-t border-white/8 p-4 sm:p-6 lg:order-none lg:border-t-0 lg:border-r lg:p-7 xl:p-9">
              <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
                <p className="max-w-sm text-sm leading-relaxed text-slate-400">
                  Escolha a situação que mais se aproxima do seu momento.
                </p>

                <span className="hidden shrink-0 text-[9px] font-medium tracking-[0.14em] text-slate-500 uppercase sm:block lg:hidden">
                  Arraste para explorar
                </span>
              </div>

              <div
                aria-label="Situações que podem receber acompanhamento fisioterapêutico"
                className={[
                  'flex cursor-grab snap-x snap-mandatory gap-2',
                  'touch-pan-x overflow-x-auto pb-2 select-none',
                  '[scrollbar-width:none] overscroll-x-contain scroll-smooth',
                  'data-[dragging=true]:cursor-grabbing',
                  'data-[dragging=true]:snap-none',
                  'sm:grid sm:cursor-auto sm:snap-none sm:grid-cols-2',
                  'sm:overflow-visible sm:pb-0 sm:select-auto',
                  'lg:grid-cols-1',
                  '[&::-webkit-scrollbar]:hidden',
                ].join(' ')}
                ref={symptomsRef}
                role="group"
                {...horizontalScroll}
              >
                {SYMPTOMS.map((symptom, index) => (
                  <SymptomCard
                    active={isActive(symptom.id)}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === SYMPTOMS.length - 1}
                    key={symptom.id}
                    onLeave={clearHover}
                    onPeek={hover}
                    onSelect={handleSelect}
                    selected={isSelected(symptom.id)}
                    symptom={symptom}
                  />
                ))}
              </div>
            </div>

            <div className="relative order-1 flex min-h-[440px] min-w-0 flex-col overflow-hidden min-[390px]:min-h-[470px] sm:min-h-[560px] lg:order-none lg:min-h-0">
              <div className="relative min-h-0 flex-1">
                <div className="absolute top-5 left-5 z-10 sm:top-8 sm:left-8">
                  <span className="text-[9px] font-semibold tracking-[0.16em] text-slate-400 uppercase sm:text-[10px] sm:tracking-[0.18em]">
                    {hasSelection ? 'Situação selecionada' : 'Situação em exploração'}
                  </span>

                  <div className="mt-2 flex items-center gap-2.5">
                    <span
                      className="h-px w-6 transition-colors duration-500 sm:w-7"
                      style={{
                        background: `rgb(${accent})`,
                      }}
                    />

                    <span className="text-xs font-medium text-white sm:text-sm">
                      {active.short}
                    </span>
                  </div>
                </div>

                <BreathingIllustration
                  className="pointer-events-none absolute inset-0"
                  stageRef={stageRef}
                />

                <div className="pointer-events-none absolute right-3 bottom-3 left-3 sm:right-8 sm:bottom-7 sm:left-8">
                  <div
                    className="fw-rise overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#0a1927]/82 shadow-[0_18px_50px_rgba(0,0,0,.28)] backdrop-blur-xl sm:rounded-2xl"
                    key={active.id}
                  >
                    <div className="px-4 py-3.5 sm:px-6 sm:py-5">
                      <p className="max-w-xl text-xs leading-5 text-slate-300 min-[390px]:text-sm min-[390px]:leading-relaxed sm:text-[15px]">
                        {active.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 border-t border-white/8">
                      <Readout label="Ritmo" value={active.readout.rhythm} />

                      <Readout label="Expansão" value={active.readout.expansion} />

                      <Readout label="Foco inicial" value={active.readout.focus} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside
          className="mx-auto mt-6 flex max-w-2xl items-start gap-3 px-1 text-xs leading-relaxed text-slate-500 sm:mt-8 sm:items-center"
          data-reveal="default"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-teal-100 bg-teal-50 text-teal-600">
            <svg
              aria-hidden="true"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 3l7 3v6c0 4.4-3 7.5-7 9-4-1.5-7-4.6-7-9V6l7-3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </span>

          <p>
            Esta experiência é ilustrativa e não substitui uma avaliação. O atendimento profissional
            é o que permite compreender o quadro e definir uma condução adequada.
          </p>
        </aside>
      </div>
    </section>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-r border-white/8 px-2 py-3 last:border-r-0 min-[390px]:px-3 sm:px-5 sm:py-3.5">
      <span className="block text-[7px] leading-none font-semibold tracking-[0.1em] text-slate-400 uppercase min-[390px]:text-[8px] sm:text-[9px] sm:tracking-[0.13em]">
        {label}
      </span>

      <span className="mt-1.5 block text-[8px] leading-snug font-medium text-slate-200 min-[390px]:text-[9px] sm:text-xs">
        {value}
      </span>
    </div>
  );
}
