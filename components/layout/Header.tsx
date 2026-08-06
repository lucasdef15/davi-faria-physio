import Link from 'next/link';

import { SITE_CONFIG } from '@/lib/site';

import LogoSVG from '../svg/LogoSVG';
import { NAV_LINKS } from './navLinks';

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.35rem] border border-slate-900/8 bg-white/95 px-4 py-2.5 shadow-[0_16px_45px_-28px_rgba(15,23,42,0.32)] sm:px-5">
        <Link aria-label="Davi Faria Physio — Início" className="relative z-10 shrink-0" href="#inicio">
          <LogoSVG className="h-9 w-auto text-slate-950 sm:h-10" name="DAVI FARIA" surname="PHYSIO" />
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              className="rounded-full px-3 py-2 text-[0.78rem] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
              href={link.href}
              key={link.href}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link className="button-primary min-h-10 px-4 py-2 text-xs" href="#contato">
            Agendar avaliação
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary
            aria-label="Abrir menu de navegação"
            className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-800 marker:content-none"
          >
            <svg aria-hidden="true" className="size-5 group-open:hidden" fill="none" viewBox="0 0 24 24">
              <path d="M5 8h14M5 12h14M5 16h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            </svg>
            <svg aria-hidden="true" className="hidden size-5 group-open:block" fill="none" viewBox="0 0 24 24">
              <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            </svg>
          </summary>

          <div className="absolute top-[calc(100%+0.65rem)] right-0 w-[min(19rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.35rem] border border-slate-900/8 bg-white p-2 shadow-[0_24px_65px_-30px_rgba(15,23,42,0.38)]">
            <nav aria-label="Navegação móvel">
              <ul className="space-y-0.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="flex min-h-11 items-center justify-between rounded-xl px-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                      href={link.href}
                    >
                      {link.name}
                      <span aria-hidden="true" className="text-slate-300">→</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-2 border-t border-slate-100 pt-2">
                <Link className="button-primary w-full" href="#contato">
                  Agendar avaliação
                </Link>
                <a
                  className="mt-1 flex min-h-10 items-center justify-center text-xs font-medium text-teal-700"
                  href={SITE_CONFIG.whatsapp.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Conversar pelo WhatsApp
                </a>
              </div>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
