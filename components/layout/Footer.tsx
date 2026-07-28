import type { ReactNode } from 'react';

import { ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';

import { SITE_CONFIG } from '@/lib/site';

import LogoSVG from '../svg/LogoSVG';
import { NAV_LINKS } from './navLinks';

interface ContactLinkProps {
  href: string;
  label: string;
  value: string;
}

interface FooterLinkProps {
  children: ReactNode;
  href: string;
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#06111c]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-16rem] bottom-[-20rem] size-[32rem] rounded-full bg-sky-400/[0.045] blur-[150px]"
      />

      <div className="site-container relative">
        <div className="border-t border-white/[0.08] pt-10 pb-8 sm:pt-12 sm:pb-9 lg:pt-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.65fr)_minmax(0,0.85fr)] lg:gap-14 xl:gap-20">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link
                aria-label="Davi Faria Physio — Página inicial"
                className="inline-flex"
                href="#inicio"
              >
                <LogoSVG
                  className="h-9 w-auto sm:h-10"
                  fill="#fff"
                  name="DAVI FARIA"
                  surname="PHYSIO"
                />
              </Link>

              <p className="mt-6 max-w-md text-sm leading-7 text-slate-400 sm:text-[0.95rem]">
                Fisioterapia cardiorrespiratória e funcional para pacientes que precisam continuar
                sua recuperação após a alta hospitalar, com atendimento domiciliar em Mococa.
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                <MapPin
                  aria-hidden="true"
                  className="size-3.5 text-teal-300/70"
                  strokeWidth={1.7}
                />

                <span>{SITE_CONFIG.contact.location}</span>
              </div>
            </div>

            <nav aria-label="Navegação do rodapé">
              <h2 className="text-[0.62rem] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Navegação
              </h2>

              <ul className="mt-5 space-y-3 text-sm text-slate-400">
                {NAV_LINKS.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-[0.62rem] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Contato
              </h2>

              <div className="mt-5 space-y-4">
                <ContactLink
                  href={SITE_CONFIG.whatsapp.href}
                  label="WhatsApp"
                  value={SITE_CONFIG.contact.phoneDisplay}
                />

                <ContactLink
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  label="E-mail"
                  value={SITE_CONFIG.contact.email}
                />
              </div>

              <Link
                className={[
                  'group mt-7 inline-flex items-center gap-2',
                  'text-sm font-medium text-white',
                  'transition-colors duration-300',
                  'hover:text-teal-200',
                ].join(' ')}
                href={SITE_CONFIG.agenda.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                Ver horários disponíveis
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-white/[0.07] pt-6 text-xs leading-5 text-slate-500 sm:mt-14 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <p>© 2026 Davi Faria Physio. Todos os direitos reservados.</p>

            <p className="sm:text-right">
              Presença digital desenvolvida pela{' '}
              <span className="font-medium text-slate-400">Alkor Labs</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactLink({ href, label, value }: ContactLinkProps) {
  const external = href.startsWith('http');

  return (
    <a
      className="group block"
      href={href}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      <span className="block text-[0.58rem] font-semibold tracking-[0.15em] text-slate-600 uppercase">
        {label}
      </span>

      <span className="mt-1 block text-sm break-words text-slate-300 transition-colors duration-300 group-hover:text-white">
        {value}
      </span>
    </a>
  );
}

function FooterLink({ children, href }: FooterLinkProps) {
  return (
    <Link
      className={[
        'group relative inline-flex py-0.5',
        'transition-colors duration-300',
        'hover:text-white',
      ].join(' ')}
      href={href}
    >
      {children}

      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-0 bg-linear-to-r from-teal-400 to-sky-400 transition-[width] duration-300 group-hover:w-full"
      />
    </Link>
  );
}
