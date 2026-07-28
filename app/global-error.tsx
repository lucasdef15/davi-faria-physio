'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body className="m-0 bg-[#F8FCFD] font-sans text-slate-900">
        <main className="flex min-h-screen items-center px-5 py-16">
          <section className="mx-auto w-full max-w-xl rounded-[2rem] border border-slate-900/8 bg-white p-8 text-center shadow-[0_24px_70px_-42px_rgba(15,23,42,0.25)] sm:p-12">
            <p className="text-sm leading-7 text-slate-600">
              Ocorreu um problema ao abrir esta página.
            </p>
            <button
              className="mt-6 min-h-12 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white"
              onClick={reset}
              type="button"
            >
              Recarregar página
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
