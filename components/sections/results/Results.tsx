import Link from 'next/link';

import ResultsJourney from './ResultsJourney';
import ResultsMotionShell from './ResultsMotionShell';

export default function Results() {
  return (
    <section
      aria-labelledby="results-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f4fbfb_48%,#ffffff_100%)]"
      id="results"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-1/2 h-[28rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.11),transparent_68%)] blur-3xl"
      />

      <div className="site-container section-space relative">
        <ResultsMotionShell>
          <header className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-16">
            <div>
              <span className="section-eyebrow" data-results-eyebrow>
                Evolução funcional
              </span>

              <h2
                className="font-space-grotesk mt-6 max-w-[16ch] overflow-hidden text-[clamp(2.45rem,7.5vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.055em] text-slate-950 text-balance"
                id="results-title"
              >
                <span className="block" data-results-title-line>
                  Quando o corpo volta a responder,
                </span>
                <span
                  className="block bg-linear-to-r from-teal-700 via-cyan-600 to-sky-600 bg-clip-text text-transparent"
                  data-results-title-line
                >
                  a rotina começa a mudar.
                </span>
              </h2>
            </div>

            <div
              className="border-l border-slate-200 pl-5 sm:pl-6"
              data-results-summary
            >
              <span className="font-mono text-[0.64rem] font-semibold tracking-[0.18em] text-teal-700 uppercase">
                04 dimensões acompanhadas
              </span>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                A evolução é observada em capacidades que podem ser afetadas após internações,
                ventilação mecânica, AVC ou por condições respiratórias.
              </p>
            </div>
          </header>

          <ResultsJourney />

          <footer
            className="relative mx-auto mt-10 grid max-w-6xl gap-5 overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_24px_70px_-48px_rgba(15,118,110,0.4)] sm:p-6 xl:mt-0 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:rounded-t-none xl:rounded-b-[2.25rem] xl:border-t-0 xl:bg-white/92 xl:px-7 xl:py-6"
            data-results-footer
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-7 top-0 hidden h-px bg-linear-to-r from-teal-400/45 via-cyan-400/18 to-transparent xl:block"
            />

            <div data-results-disclaimer>
              <span className="mb-2 hidden font-mono text-[0.58rem] font-semibold tracking-[0.16em] text-teal-700 uppercase xl:block">
                Acompanhamento individual
              </span>

              <p className="max-w-3xl text-xs leading-6 text-slate-500 sm:text-sm">
                Os objetivos e a progressão são definidos após a avaliação e variam conforme o
                quadro clínico, as necessidades e a resposta individual de cada paciente.
              </p>
            </div>

            <Link
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(15,23,42,0.72)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-[0_20px_38px_-18px_rgba(15,118,110,0.6)] focus-visible:outline-teal-600 sm:w-fit"
              data-results-cta
              href="#contato"
            >
              <span>Conversar sobre sua recuperação</span>

              <svg
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </footer>
        </ResultsMotionShell>
      </div>
    </section>
  );
}
