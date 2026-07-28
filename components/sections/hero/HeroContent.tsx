export default function HeroContent() {
  return (
    <>
      <div
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-900/6 bg-white/70 px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm min-[360px]:px-4 sm:mb-9"
        data-hero-eyebrow
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-500" />
        </span>

        <span className="text-[10px] font-semibold tracking-[0.06em] text-slate-600 uppercase min-[360px]:text-[11px] min-[360px]:tracking-[0.12em] sm:text-xs">
          <span className="slect-none sm:hidden">Fisioterapia respiratória e funcional</span>

          <span className="slect-none hidden sm:inline">
            Fisioterapia cardiorrespiratória e funcional
          </span>
        </span>
      </div>

      <h1
        aria-label="Da alta hospitalar à retomada da rotina, seu cuidado continua."
        className="font-space-grotesk text-foreground max-w-[20ch] text-[2.35rem] leading-[1.03] font-semibold tracking-[-0.05em] text-balance select-none min-[360px]:text-[2.65rem] sm:text-6xl md:text-[4.4rem] lg:text-[4.85rem]"
        data-hero-heading
      >
        <span aria-hidden="true" className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
          <span className="block" data-hero-line>
            Da alta hospitalar
          </span>
        </span>

        <span aria-hidden="true" className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
          <span
            className="block bg-linear-to-r from-teal-600 via-teal-500 to-sky-500 bg-clip-text text-transparent"
            data-hero-line
          >
            à retomada da rotina,
          </span>
        </span>

        <span aria-hidden="true" className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
          <span className="block" data-hero-line>
            seu cuidado continua.
          </span>
        </span>
      </h1>

      <p
        className="slect-none text-foreground-muted mt-7 max-w-2xl text-base leading-7 text-pretty sm:text-lg sm:leading-8 md:mt-8 md:text-xl"
        data-hero-copy
      >
        Atendimento domiciliar para continuar a recuperação após internações, ventilação mecânica ou
        AVC, além do acompanhamento de condições respiratórias como DPOC e asma.
      </p>
    </>
  );
}
