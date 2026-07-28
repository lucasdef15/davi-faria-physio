'use client';

import Link from 'next/link';

import { useRevealAnimation } from '@/components/motion/useRevealAnimation';

import { PRACTICE_AREAS } from './specialties.data';
import SpecialtiesCard from './SpecialtiesCard';

export default function Specialties() {
  const { containerRef } = useRevealAnimation<HTMLElement>({
    start: 'top 84%',
  });

  return (
    <section
      aria-labelledby="practice-areas-title"
      className="relative overflow-hidden bg-linear-to-b from-[#EDF8FA] via-[#F4FAFB] to-[#F8FCFD]"
      id="especialidades"
      ref={containerRef}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-12rem] right-[-14rem] size-[34rem] rounded-full bg-teal-300/10 blur-[150px]" />

        <div className="absolute bottom-[-15rem] left-[-16rem] size-[38rem] rounded-full bg-sky-300/10 blur-[170px]" />

        <div className="absolute top-0 left-1/2 h-px w-full max-w-5xl -translate-x-1/2 bg-linear-to-r from-transparent via-teal-500/15 to-transparent" />
      </div>

      <div className="site-container section-space relative z-10">
        <header className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.75fr)] lg:items-end lg:gap-16">
          <div data-reveal="default">
            <span className="section-eyebrow">Áreas de atuação</span>

            <h2 className="section-title mt-6 max-w-3xl" id="practice-areas-title">
              Cuidado respiratório e funcional em diferentes{' '}
              <span className="block bg-linear-to-r from-teal-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
                momentos da recuperação.
              </span>
            </h2>
          </div>

          <p className="section-copy max-w-2xl lg:justify-self-end" data-reveal="default">
            O atendimento acompanha pacientes após internações e em condições que afetam a
            respiração, o movimento e a autonomia, com continuidade no domicílio quando necessário.
          </p>
        </header>

        <ol
          className="mt-12 grid grid-cols-1 gap-3 px-0 py-1 sm:mt-14 sm:grid-cols-2 sm:gap-4 md:px-5 md:py-2.5 lg:grid-cols-3 lg:gap-5"
          data-reveal="panel"
        >
          {PRACTICE_AREAS.map(({ description, featured, id, title }, index) => {
            const number = String(index + 1).padStart(2, '0');

            return (
              <SpecialtiesCard
                description={description}
                featured={featured}
                key={id + index}
                number={number}
                title={title}
              />
            );
          })}
        </ol>

        <div
          className="border-border/70 mx-auto mt-12 grid max-w-6xl gap-6 border-t pt-8 sm:mt-14 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
          data-reveal="default"
        >
          <p className="text-foreground-muted max-w-2xl text-sm leading-6">
            <strong className="text-foreground font-medium">
              Cada caso exige uma avaliação individual.
            </strong>{' '}
            Converse com o fisioterapeuta para compreender se o acompanhamento é indicado para o seu
            momento.
          </p>

          <Link className="button-primary w-full justify-center sm:w-fit" href="#contato">
            Conversar com o fisioterapeuta
            <svg
              aria-hidden="true"
              className="size-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
