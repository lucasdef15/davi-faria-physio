export default function HeroActions() {
  return (
    <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row">
      <a className="button-primary group w-full sm:w-auto" data-hero-action href="#contato">
        Conversar com o fisioterapeuta
        <svg
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      <a className="button-secondary w-full sm:w-auto" data-hero-action href="#para-quem">
        Para quem é o atendimento
      </a>
    </div>
  );
}
