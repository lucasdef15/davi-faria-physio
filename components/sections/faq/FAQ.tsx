'use client';

import { ArrowRight, Plus } from 'lucide-react';

import { useRevealAnimation } from '@/components/motion/useRevealAnimation';

import { FAQ_ITEMS } from './faq.data';

export default function FAQ() {
  const { containerRef } = useRevealAnimation<HTMLElement>({
    start: 'top 84%',
  });

  return (
    <section
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-white"
      id="faq"
      ref={containerRef}
    >
      <div className="site-container section-space">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20 xl:gap-28">
          <div className="lg:sticky lg:top-32" data-reveal="default">
            <span className="section-eyebrow">Dúvidas frequentes</span>

            <h2 className="section-title mt-6 max-w-[13ch]" id="faq-title">
              Clareza também faz{' '}
              <span className="block bg-linear-to-r from-teal-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
                parte do cuidado.
              </span>
            </h2>

            <p className="section-copy mt-6 max-w-md">
              Encontre respostas para as dúvidas mais comuns antes de iniciar seu acompanhamento.
              Para orientações sobre o seu caso, converse diretamente com o fisioterapeuta.
            </p>

            <a
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition-colors duration-300 hover:text-teal-600"
              href="#contato"
            >
              Ainda tenho uma dúvida
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </a>
          </div>

          <div className="divide-y divide-slate-200/80 border-y border-slate-200/80">
            {FAQ_ITEMS.map((item, index) => {
              const number = String(index + 1).padStart(2, '0');

              return (
                <details className="group" data-reveal="default" key={item.question} name="faq">
                  <summary
                    className={[
                      'flex cursor-pointer list-none items-center justify-between',
                      'gap-4 py-6 text-left marker:content-none',
                      'focus-visible:outline-2 focus-visible:outline-offset-4',
                      'focus-visible:outline-teal-500',
                      'sm:gap-6 sm:py-7',
                    ].join(' ')}
                  >
                    <span className="flex min-w-0 items-start gap-4 sm:gap-5">
                      <span className="mt-1 shrink-0 font-mono text-[0.65rem] font-semibold tracking-[0.14em] text-teal-600">
                        {number}
                      </span>

                      <span className="font-space-grotesk min-w-0 text-lg leading-snug font-semibold tracking-[-0.02em] text-slate-900 sm:text-xl">
                        {item.question}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={[
                        'flex size-9 shrink-0 items-center justify-center',
                        'rounded-full border border-slate-200 bg-slate-50',
                        'text-slate-500',
                        'transition-all duration-300',
                        'group-hover:border-teal-200 group-hover:text-teal-700',
                        'group-open:rotate-45 group-open:border-teal-200',
                        'group-open:bg-teal-50 group-open:text-teal-700',
                        'motion-reduce:transition-none',
                      ].join(' ')}
                    >
                      <Plus className="size-4" strokeWidth={1.75} />
                    </span>
                  </summary>

                  <div className="grid grid-cols-[2.35rem_minmax(0,1fr)] pb-7 sm:grid-cols-[3.15rem_minmax(0,1fr)]">
                    <p className="col-start-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
