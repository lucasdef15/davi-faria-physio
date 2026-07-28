'use client';

import { Check, Quote } from 'lucide-react';

import { useRevealAnimation } from '@/components/motion/useRevealAnimation';

import { TESTIMONIALS } from './testimonials.data';

export default function Testimonials() {
  const { containerRef } = useRevealAnimation<HTMLElement>({
    start: 'top 82%',
  });

  return (
    <section
      className="relative overflow-hidden bg-linear-to-b from-[#F8FCFD] via-[#F3FAFB] to-white"
      id="depoimentos"
      ref={containerRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-teal-200/20 blur-[140px]"
      />

      <div className="site-container section-space relative">
        <div className="mx-auto max-w-3xl text-center" data-reveal="default">
          <span className="section-eyebrow">Experiências de cuidado</span>

          <h2 className="section-title mx-auto mt-6">
            Quando respirar melhor também significa
            <span className="block bg-linear-to-r from-teal-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
              viver com mais confiança.
            </span>
          </h2>

          <p className="section-copy mx-auto mt-6">
            A evolução clínica ganha significado quando devolve tranquilidade, autonomia e presença
            para os momentos que importam.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12 lg:gap-5">
          {TESTIMONIALS.map((testimonial, index) => (
            <article
              className={[
                'group relative flex min-h-80 flex-col overflow-hidden',
                'rounded-[var(--radius-card)] border border-white/80',
                'bg-white/80 p-7 shadow-[var(--shadow-card)]',
                'backdrop-blur-xl',
                'transition-[transform,box-shadow,border-color] duration-300',
                'ease-[var(--ease-premium)]',
                'motion-safe:hover:-translate-y-1',
                'motion-safe:hover:shadow-[var(--shadow-card-hover)]',
                'sm:p-8',
                index === 0 ? 'lg:col-span-6' : 'lg:col-span-3',
              ].join(' ')}
              data-reveal="default"
              key={testimonial.initials}
            >
              <div
                aria-hidden="true"
                className="absolute top-0 right-0 size-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-teal-100/50 blur-3xl transition-transform duration-700 motion-safe:group-hover:scale-125"
              />

              <div className="relative flex items-center justify-between gap-4">
                <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-teal-500/10 bg-teal-500/[0.08] text-teal-600">
                  <Quote
                    aria-hidden="true"
                    className="size-4"
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                </span>

                <span className="text-[0.65rem] font-bold tracking-[0.16em] text-teal-700 uppercase">
                  {testimonial.context}
                </span>
              </div>

              <blockquote className="relative mt-8 flex-1">
                <p
                  className={[
                    'font-space-grotesk leading-relaxed font-medium',
                    'tracking-[-0.025em] text-slate-800',
                    index === 0 ? 'text-xl sm:text-2xl' : 'text-lg',
                  ].join(' ')}
                >
                  “{testimonial.quote}”
                </p>
              </blockquote>

              <div className="relative mt-8 flex items-end justify-between gap-4 border-t border-slate-200/70 pt-6">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{testimonial.initials}</p>

                  <p className="mt-1 text-xs text-slate-500">Paciente acompanhado</p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-right text-xs font-medium text-teal-700">
                  <Check aria-hidden="true" className="size-3.5" strokeWidth={2} />

                  {testimonial.result}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
