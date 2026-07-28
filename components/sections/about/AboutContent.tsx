'use client';

import Link from 'next/link';

import { useRevealAnimation } from '@/components/motion/useRevealAnimation';
import Physiotherapist from '@/public/physiotherapist.png';

import { PHYSIOTHERAPIST } from './about.data';
import AboutImage from './AboutImage';

const PROFESSIONAL_REGISTRATION = {
  label: 'Registro profissional',
  number: 'CREFITO-3/442680-F',
  status: 'Ativo',
} as const;

const CARE_HIGHLIGHTS = [
  'Experiência em UTI',
  'Cuidado pós-alta',
  'Atendimento domiciliar',
] as const;

export default function AboutContent() {
  const { containerRef } = useRevealAnimation<HTMLElement>({
    start: 'top 84%',
  });

  return (
    <section className="relative isolate" ref={containerRef}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-1/2 -z-10 h-[34rem] w-[90%] max-w-6xl -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.10),transparent_68%)] blur-3xl sm:w-[80%]"
      />

      <div className="flex flex-col gap-20 sm:gap-24 lg:gap-32">
        <section
          aria-labelledby="specialist-title"
          className="grid items-center gap-12 sm:gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 xl:gap-24 2xl:gap-28"
        >
          <AboutImage
            alt="Fisioterapeuta Davi Faria, profissional com atuação hospitalar, cardiorrespiratória e domiciliar."
            data-reveal="media"
            description="Reabilitação cardiorrespiratória e funcional"
            eyebrow="Atuação especializada"
            icon={
              <svg
                aria-hidden="true"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M8 3v3" />
                <path d="M16 3v3" />
                <path d="M12 13v8" />
                <path d="M8 21h8" />
                <path d="M5 6h14" />
                <path d="M6 6v3a6 6 0 0 0 12 0V6" />
              </svg>
            }
            src={Physiotherapist}
            title="Dr. Davi Faria"
          />

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
            <div
              aria-hidden="true"
              className="border-primary/10 bg-primary/[0.03] absolute -top-8 -left-8 hidden size-24 rounded-full border lg:block"
            >
              <div className="border-primary/10 absolute inset-5 rounded-full border" />
            </div>

            <div className="relative">
              <div data-reveal>
                <span className="section-eyebrow mb-4 sm:mb-5">Sobre o fisioterapeuta</span>

                <h2
                  className="font-space-grotesk text-foreground max-w-2xl text-[clamp(2rem,7vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.045em]"
                  id="specialist-title"
                >
                  {PHYSIOTHERAPIST.name}
                </h2>

                <p className="text-primary mt-3 max-w-xl text-base leading-7 font-medium tracking-[-0.015em] sm:mt-4 sm:text-lg lg:text-xl">
                  {PHYSIOTHERAPIST.title}
                </p>

                <div
                  aria-label={`${PROFESSIONAL_REGISTRATION.label}: ${PROFESSIONAL_REGISTRATION.number}. Situação: ${PROFESSIONAL_REGISTRATION.status}.`}
                  className="border-primary/15 bg-primary/[0.035] mt-5 flex w-fit max-w-full flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border px-3.5 py-3 shadow-[0_12px_36px_-24px_rgba(15,118,110,0.45)] backdrop-blur-md sm:flex-nowrap sm:px-4"
                >
                  <span
                    aria-hidden="true"
                    className="border-primary/15 bg-background/80 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-sm"
                  >
                    <svg
                      className="size-[1.15rem]"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 3 5.5 5.8v5.1c0 4.3 2.7 8.2 6.5 10.1 3.8-1.9 6.5-5.8 6.5-10.1V5.8L12 3Z" />
                      <path d="m9.2 12 1.8 1.8 3.9-4" />
                    </svg>
                  </span>

                  <div className="min-w-0">
                    <span className="text-foreground-muted block text-[0.62rem] leading-4 font-semibold tracking-[0.12em] uppercase">
                      {PROFESSIONAL_REGISTRATION.label}
                    </span>

                    <strong className="font-space-grotesk text-foreground/80 mt-0.5 block text-sm font-semibold tracking-[-0.015em] sm:text-[0.95rem]">
                      {PROFESSIONAL_REGISTRATION.number}
                    </strong>
                  </div>

                  <span aria-hidden="true" className="bg-border/80 hidden h-8 w-px sm:block" />

                  <span className="text-foreground-muted inline-flex shrink-0 items-center gap-2 text-xs font-semibold">
                    <span className="relative flex size-2">
                      <span className="absolute inset-0 rounded-full bg-emerald-500/25" />
                      <span className="m-auto size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.10)]" />
                    </span>

                    {PROFESSIONAL_REGISTRATION.status}
                  </span>
                </div>

                <div className="from-primary/30 via-primary/10 mt-7 h-px w-full bg-gradient-to-r to-transparent sm:mt-8" />
              </div>

              <div data-reveal>
                <blockquote className="border-primary/30 text-foreground-muted relative mt-6 border-l pl-4 text-sm leading-7 sm:mt-8 sm:pl-6 sm:text-base sm:leading-8 xl:pl-8 xl:text-lg">
                  <span
                    aria-hidden="true"
                    className="text-primary/15 absolute -top-2 left-3 font-serif text-4xl leading-none sm:-top-3 sm:left-4 sm:text-5xl"
                  >
                    “
                  </span>

                  <p className="relative">{PHYSIOTHERAPIST.manifesto}</p>
                </blockquote>

                <div className="mt-7 grid grid-cols-1 gap-2.5 sm:mt-8 lg:grid-cols-3">
                  {CARE_HIGHLIGHTS.map((item) => (
                    <div
                      className="border-border/70 bg-background/60 flex items-center gap-2.5 rounded-xl border px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-md"
                      key={item}
                    >
                      <span
                        aria-hidden="true"
                        className="border-primary/15 bg-primary/[0.06] text-primary flex size-7 shrink-0 items-center justify-center rounded-lg"
                      >
                        <svg
                          className="size-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="m5 12 4 4L19 6" />
                        </svg>
                      </span>

                      <span className="text-foreground-muted text-xs leading-5 font-medium lg:text-[10px]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-5 sm:mt-9 md:flex-row md:items-center md:justify-between">
                  <p className="text-foreground-muted max-w-md text-sm leading-6">
                    Atendimento individual para pacientes que precisam dar continuidade à
                    recuperação respiratória e funcional após a alta hospitalar.
                  </p>

                  <Link
                    className="button-primary group/button w-full shrink-0 justify-center text-center sm:w-auto"
                    href="#contato"
                  >
                    <span>Conversar com o fisioterapeuta</span>

                    <svg
                      aria-hidden="true"
                      className="size-4 shrink-0 transition-transform duration-300 group-hover/button:translate-x-0.5"
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
            </div>
          </div>
        </section>

        <section
          aria-labelledby="care-manifesto-title"
          className="border-border/60 bg-background/65 relative mx-auto w-full max-w-5xl overflow-hidden rounded-[1.75rem] border px-5 py-10 text-center shadow-[0_24px_80px_-42px_rgba(15,23,42,0.25)] backdrop-blur-2xl sm:rounded-[2rem] sm:px-10 sm:py-12 lg:rounded-[2.5rem] lg:px-16 lg:py-14"
          data-reveal
        >
          <div
            aria-hidden="true"
            className="bg-primary/10 absolute top-0 left-1/2 h-32 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:w-2/3"
          />

          <div
            aria-hidden="true"
            className="via-primary/30 absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent sm:inset-x-16"
          />

          <div className="relative mx-auto max-w-3xl">
            <span className="text-primary mb-4 inline-flex max-w-full items-center justify-center gap-2 text-center text-[0.6rem] leading-4 font-bold tracking-[0.16em] uppercase sm:text-[0.65rem] sm:tracking-[0.2em]">
              <span className="bg-primary/40 h-px w-5 shrink-0 sm:w-7" />
              <span>Continuidade do cuidado</span>
              <span className="bg-primary/40 h-px w-5 shrink-0 sm:w-7" />
            </span>

            <h3
              className="font-montserrat text-foreground mx-auto max-w-3xl text-[clamp(1.75rem,4.5vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.035em] text-balance"
              id="care-manifesto-title"
            >
              Da internação ao retorno à rotina, cada etapa da{' '}
              <span className="text-primary">recuperação importa.</span>
            </h3>

            <p className="text-foreground-muted mx-auto mt-5 max-w-2xl text-sm leading-7 text-pretty sm:text-base">
              Após uma internação, ventilação mecânica, AVC ou um período de imobilidade, atividades
              simples podem se tornar desafiadoras. O atendimento domiciliar dá continuidade ao
              cuidado iniciado no hospital, auxiliando na recuperação respiratória, funcional e da
              autonomia.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
