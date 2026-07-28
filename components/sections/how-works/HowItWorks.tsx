'use client';

import { useRevealAnimation } from '@/components/motion/useRevealAnimation';

import ApproachItem from './ApproachItem';
import { PILLARS } from './works.data';

export default function HowItWorks() {
  const { containerRef } = useRevealAnimation<HTMLElement>({
    start: 'top 84%',
  });

  return (
    <section
      aria-labelledby="clinical-approach-title"
      className="relative overflow-hidden border-y border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7fcfc_100%)]"
      id="abordagem"
      ref={containerRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 size-[32rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.09),transparent_68%)] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 size-[28rem] translate-x-1/2 translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.06),transparent_68%)] blur-3xl"
      />

      <div className="site-container section-space relative">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-20 xl:gap-28">
          <header className="lg:relative">
            <div className="lg:sticky lg:top-28" data-reveal="default">
              <span className="section-eyebrow">Abordagem clínica</span>

              <h2 className="section-title mt-6 max-w-lg" id="clinical-approach-title">
                Cada decisão parte do que
                <span className="block bg-linear-to-r from-teal-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
                  o paciente apresenta.
                </span>
              </h2>

              <p className="section-copy mt-6 max-w-lg">
                A avaliação orienta o plano, a resposta ao esforço define a progressão e o
                acompanhamento dá continuidade à recuperação no ambiente em que o paciente vive.
              </p>

              <div className="mt-8 flex max-w-md items-center gap-3">
                <span className="bg-primary/45 h-px w-8 shrink-0" />

                <p className="text-foreground-muted text-xs leading-5">
                  Da avaliação inicial à continuidade do cuidado em casa.
                </p>
              </div>
            </div>
          </header>

          <ol className="border-border/70 border-y" data-reveal="panel">
            {PILLARS.map((pillar, index) => {
              const number = String(index + 1).padStart(2, '0');

              return <ApproachItem key={pillar.id} number={number} pillar={pillar} />;
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
