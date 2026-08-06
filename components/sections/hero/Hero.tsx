import Image from 'next/image';
import Link from 'next/link';

import Physiotherapist from '@/public/physiotherapist.png';

import HeroMotionShell from './HeroMotionShell';

const INDICATORS = ['Atendimento domiciliar', 'Recuperação pós-hospitalar', 'Mococa e região'] as const;
const CONTINUITY_STAGES = ['Alta', 'Casa', 'Rotina'] as const;

export default function Hero() {
  return (
    <HeroMotionShell>
      <section
        className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#f8fcfd_0%,#f1f9fa_66%,#f8fcfd_100%)] pt-[5.25rem] sm:pt-[5.75rem]"
        id="inicio"
      >
        <div aria-hidden="true" className="hero-orbit hero-orbit-a" data-hero-ambient />
        <div aria-hidden="true" className="hero-orbit hero-orbit-b" data-hero-ambient />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[14%] right-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,.12),rgba(56,189,248,.035)_48%,transparent_72%)]"
          data-hero-ambient
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] bottom-[-9rem] h-[18rem] w-[28rem] rounded-full bg-[radial-gradient(ellipse,rgba(20,184,166,.09),transparent_68%)]"
          data-hero-ambient
        />

        <div className="site-container relative z-10 grid min-h-[calc(100svh-5.25rem)] items-center gap-10 py-[clamp(2rem,5svh,4rem)] sm:min-h-[calc(100svh-5.75rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(23rem,.8fr)] lg:gap-10 lg:py-[clamp(1.5rem,4svh,3.5rem)] xl:gap-16">
          <div className="mx-auto w-full max-w-[46rem] text-center lg:mx-0 lg:text-left">
            <div
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-900/8 bg-white px-3.5 py-2 shadow-sm"
              data-hero-eyebrow
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-teal-500" />
              <span className="text-[0.64rem] font-semibold tracking-[0.115em] text-slate-600 uppercase sm:text-[0.7rem]">
                Fisioterapia cardiorrespiratória e funcional
              </span>
            </div>

            <h1 className="font-space-grotesk mt-5 text-[clamp(2.75rem,12vw,4.15rem)] leading-[0.96] font-semibold tracking-[-0.06em] text-slate-950 sm:mt-6 sm:text-[clamp(3.45rem,8vw,4.7rem)] lg:text-[clamp(3.1rem,4.9vw,4.7rem)]">
              <span className="block" data-hero-title-line>
                Da alta hospitalar à
              </span>
              <span
                className="block bg-linear-to-r from-teal-700 via-teal-500 to-sky-500 bg-clip-text text-transparent"
                data-hero-title-line
              >
                retomada da rotina,
              </span>
              <span className="block" data-hero-title-line>
                seu cuidado continua.
              </span>
            </h1>

            <p
              className="mx-auto mt-5 max-w-[40rem] text-[0.98rem] leading-7 text-slate-600 sm:mt-6 sm:text-[1.05rem] sm:leading-8 lg:mx-0 lg:max-w-[38rem]"
              data-hero-summary
            >
              Atendimento domiciliar para continuar a recuperação após internações, ventilação mecânica ou AVC,
              além do acompanhamento de condições respiratórias como DPOC e asma.
            </p>

            <div
              className="mt-6 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
              data-hero-actions
            >
              <Link className="button-primary group w-full sm:w-auto" href="#contato">
                Conversar com o fisioterapeuta
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <Link className="button-secondary w-full sm:w-auto" href="#para-quem">
                Para quem é o atendimento
              </Link>
            </div>

            <ul className="mx-auto mt-6 grid max-w-2xl gap-1.5 text-[0.82rem] leading-5 text-slate-600 sm:grid-cols-3 sm:gap-0 lg:mx-0">
              {INDICATORS.map((label, index) => (
                <li
                  className={`flex items-center justify-center gap-2 px-2.5 py-2 lg:justify-start ${index > 0 ? 'sm:border-l sm:border-slate-200' : ''}`}
                  data-hero-indicator
                  key={label}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-4 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[0.58rem] font-bold text-teal-700"
                  >
                    ✓
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="relative mx-auto w-full max-w-[31rem] lg:mx-0 lg:justify-self-end"
            data-hero-visual
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[3rem] border border-teal-900/7 bg-white/28 sm:-inset-5 sm:rounded-[3.4rem]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 -right-10 -z-20 size-44 rounded-full bg-teal-300/16 blur-3xl sm:size-56"
            />

            <figure
              className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-[0_34px_90px_-40px_rgba(15,23,42,.34)] sm:rounded-[2.5rem]"
              data-hero-photo
            >
              <div className="overflow-hidden rounded-[1.6rem] border border-slate-900/6 bg-white sm:rounded-[2.05rem]">
                <div className="relative h-[clamp(26rem,56svh,35rem)] overflow-hidden bg-slate-100 sm:h-[clamp(29rem,58svh,37rem)] lg:h-[clamp(25rem,52svh,34rem)]">
                  <div className="absolute inset-0" data-hero-photo-image>
                    <Image
                      alt="Fisioterapeuta Davi Faria, profissional com atuação hospitalar, cardiorrespiratória e domiciliar."
                      className="object-cover object-center"
                      fill
                      priority
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 31rem, 31rem"
                      src={Physiotherapist}
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-slate-950/22 to-transparent"
                  />
                </div>

                <figcaption
                  className="relative border-t border-slate-900/6 bg-white px-4 py-4 text-slate-950 sm:px-5 sm:py-5 lg:px-[clamp(1rem,2svh,1.25rem)] lg:py-[clamp(0.9rem,1.8svh,1.15rem)]"
                  data-hero-panel
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-[0.57rem] font-semibold tracking-[0.15em] text-teal-700 uppercase sm:text-[0.61rem]">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-teal-500" />
                      Cuidado pós-hospitalar
                    </span>
                    <span className="shrink-0 rounded-full border border-teal-700/12 bg-teal-50 px-2.5 py-1 text-[0.52rem] font-semibold tracking-[0.11em] text-teal-800 uppercase sm:text-[0.56rem]">
                      CREFITO ativo
                    </span>
                  </div>

                  <div className="mt-3 sm:mt-3.5">
                    <h2 className="font-space-grotesk text-xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-[1.35rem]">
                      Dr. Davi Faria
                    </h2>
                    <p className="mt-1 max-w-[25rem] text-[0.78rem] leading-5.5 text-slate-600 sm:text-[0.84rem] sm:leading-6">
                      Fisioterapia cardiorrespiratória e funcional para dar continuidade ao cuidado com segurança,
                      proximidade e direção.
                    </p>
                  </div>

                  <div
                    aria-label="Continuidade do cuidado da alta hospitalar à retomada da rotina"
                    className="relative mt-4 border-t border-slate-200 pt-4"
                    data-hero-route
                  >
                    <div
                      aria-hidden="true"
                      className="absolute top-[1.3rem] right-[12%] left-[12%] h-px origin-left bg-linear-to-r from-teal-500 via-teal-400 to-sky-400"
                      data-hero-route-line
                    />

                    <ol className="relative grid grid-cols-3 gap-2">
                      {CONTINUITY_STAGES.map((stage, index) => (
                        <li
                          className="flex flex-col items-center text-center"
                          data-hero-route-stage
                          key={stage}
                        >
                          <span
                            aria-hidden="true"
                            className={`relative z-10 size-2.5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(15,118,110,.14)] ${
                              index === 2 ? 'bg-sky-400' : 'bg-teal-500'
                            }`}
                          />
                          <span className="mt-2 text-[0.55rem] font-semibold tracking-[0.13em] text-slate-400 uppercase">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="mt-0.5 text-[0.7rem] font-semibold text-slate-700 sm:text-[0.76rem]">
                            {stage}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </figcaption>
              </div>
            </figure>
          </div>
        </div>
      </section>
    </HeroMotionShell>
  );
}
