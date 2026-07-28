'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center bg-[#F8FCFD] px-5 py-16 text-slate-900">
      <section className="mx-auto w-full max-w-xl rounded-[2rem] border border-slate-900/8 bg-white p-8 text-center shadow-[0_24px_70px_-42px_rgba(15,23,42,0.25)] sm:p-12">
        <span className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase">Davi Faria</span>
        <h1 className="font-space-grotesk mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Não foi possível concluir este carregamento.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          Seu conteúdo continua disponível. Tente carregar a página novamente para continuar.
        </p>
        <button
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
          onClick={reset}
          type="button"
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
