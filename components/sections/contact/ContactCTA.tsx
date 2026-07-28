'use client';

import { ArrowRight, CalendarCheck, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';

import { useRevealAnimation } from '@/components/motion/useRevealAnimation';
import { SITE_CONFIG } from '@/lib/site';

const CONTACT_DETAILS = [
  {
    label: 'Modalidade',
    value: 'Atendimento domiciliar',
  },
  {
    label: 'Localização',
    value: SITE_CONFIG.contact.location,
  },
  {
    label: 'Registro',
    value: 'CREFITO ativo',
  },
] as const;

export default function ContactCTA() {
  const { containerRef } = useRevealAnimation<HTMLElement>({
    start: 'top 84%',
  });

  return (
    <section
      aria-labelledby="contact-title"
      className="relative scroll-mt-24 overflow-hidden bg-[#06111c]"
      id="contato"
      ref={containerRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_94%)] bg-size-[52px_52px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-56 left-1/2 h-[38rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.22),transparent_68%)] blur-[90px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-18rem] bottom-[-20rem] size-[38rem] rounded-full bg-sky-400/8 blur-[150px]"
      />

      <div className="site-container section-space relative">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-end lg:gap-16 xl:gap-24">
            <header data-reveal="default">
              <span className="inline-flex items-center gap-3 text-[0.62rem] font-semibold tracking-[0.2em] text-teal-300 uppercase">
                <span className="h-px w-7 bg-teal-300/50" />
                Próximo passo
              </span>

              <h2
                className="font-space-grotesk mt-6 max-w-3xl text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.01] font-semibold tracking-[-0.05em] text-balance text-white"
                id="contact-title"
              >
                Sua recuperação pode começar com uma{' '}
                <span className="block bg-linear-to-r from-teal-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
                  conversa tranquila.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8 lg:text-lg">
                Converse com o fisioterapeuta para explicar seu momento, esclarecer dúvidas e
                compreender quais podem ser os próximos passos do acompanhamento.
              </p>
            </header>

            <div
              className="border-t border-white/10 pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10 xl:pl-12"
              data-reveal="default"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-teal-300/15 bg-teal-300/[0.07] text-teal-300">
                  <CalendarCheck aria-hidden="true" className="size-4.5" strokeWidth={1.7} />
                </span>

                <div>
                  <span className="block text-[0.6rem] font-semibold tracking-[0.17em] text-slate-500 uppercase">
                    Avaliação inicial
                  </span>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
                    Um primeiro contato para compreender as necessidades e verificar a
                    disponibilidade do atendimento.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  className={[
                    'group inline-flex min-h-12 w-full items-center justify-center gap-2',
                    'rounded-full bg-white px-6 py-3',
                    'text-sm font-semibold text-slate-950',
                    'shadow-[0_18px_45px_-22px_rgba(255,255,255,0.48)]',
                    'transition-all duration-300',
                    'hover:-translate-y-0.5 hover:bg-teal-50',
                    'focus-visible:outline-2 focus-visible:outline-offset-4',
                    'focus-visible:outline-white',
                  ].join(' ')}
                  href={SITE_CONFIG.agenda.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Agendar avaliação
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.8}
                  />
                </Link>

                <Link
                  className={[
                    'group inline-flex min-h-12 w-full items-center justify-center gap-2',
                    'rounded-full border border-white/14 bg-white/[0.045] px-6 py-3',
                    'text-sm font-medium text-white',
                    'transition-all duration-300',
                    'hover:-translate-y-0.5 hover:border-teal-300/30',
                    'hover:bg-teal-300/[0.07] hover:text-teal-100',
                    'focus-visible:outline-2 focus-visible:outline-offset-4',
                    'focus-visible:outline-teal-300',
                  ].join(' ')}
                  href={SITE_CONFIG.whatsapp.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.8} />
                  Conversar pelo WhatsApp
                </Link>
              </div>

              <p className="mt-4 text-center text-xs text-slate-500">
                {SITE_CONFIG.contact.phoneDisplay}
              </p>
            </div>
          </div>

          <div className="mt-12 grid border-y border-white/8 sm:grid-cols-3 lg:mt-16">
            {CONTACT_DETAILS.map(({ label, value }, index) => (
              <div
                className={[
                  'flex items-center justify-between gap-5 py-5',
                  'sm:flex-col sm:items-start sm:justify-center sm:px-7',
                  'sm:py-6',
                  index > 0 ? 'border-t border-white/8 sm:border-t-0 sm:border-l' : '',
                ].join(' ')}
                data-reveal="default"
                key={label}
              >
                <span className="text-[0.58rem] font-semibold tracking-[0.17em] text-slate-500 uppercase">
                  {label}
                </span>

                <span className="flex items-center gap-2 text-right text-sm font-medium text-slate-200 sm:text-left">
                  {label === 'Localização' && (
                    <MapPin
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-teal-300/75"
                      strokeWidth={1.7}
                    />
                  )}

                  {value}
                </span>
              </div>
            ))}
          </div>

          <p
            className="mx-auto mt-6 max-w-2xl text-center text-xs leading-5 text-slate-500"
            data-reveal="default"
          >
            O contato inicial não substitui uma avaliação profissional. A indicação e a condução do
            acompanhamento dependem das necessidades identificadas em cada caso.
          </p>
        </div>
      </div>
    </section>
  );
}
