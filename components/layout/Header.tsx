'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

import LogoSVG from '../svg/LogoSVG';
import MobileHeader from './MobileHeader';
import { NAV_LINKS } from './navLinks';

const HEADER_OFFSET = 96;

export default function Header() {
  const [isCompact, setIsCompact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useBodyScrollLock(isMenuOpen);

  useEffect(() => {
    let frameId = 0;

    const updateHeader = () => {
      frameId = 0;
      setIsCompact(window.scrollY > 24);
    };

    const handleScroll = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(updateHeader);
      }
    };

    updateHeader();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', handleDesktopChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleDesktopChange);
    };
  }, [isMenuOpen]);

  const navigateToSection = useCallback((href: string) => {
    setIsMenuOpen(false);

    if (!href.startsWith('#')) {
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target = document.querySelector<HTMLElement>(href);

        if (!target) {
          return;
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const top =
          href === '#inicio'
            ? 0
            : Math.max(0, target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);

        if (window.location.hash !== href) {
          window.history.pushState(null, '', href);
        }

        window.scrollTo({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          left: 0,
          top,
        });
      });
    });
  }, []);

  function handleNavigation(event: MouseEvent<HTMLAnchorElement>, href: string): void {
    if (!href.startsWith('#')) {
      setIsMenuOpen(false);
      return;
    }

    event.preventDefault();
    navigateToSection(href);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2.5 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[92rem]">
        <div
          className={`relative rounded-[1.4rem] border backdrop-blur-2xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow,transform] duration-500 ease-out ${
            isCompact || isMenuOpen
              ? 'border-white/75 bg-white/82 shadow-[0_2px_5px_rgba(15,23,42,0.04),0_22px_52px_-26px_rgba(15,23,42,0.28)]'
              : 'border-white/55 bg-white/58 shadow-[0_1px_2px_rgba(15,23,42,0.025),0_14px_38px_-26px_rgba(15,23,42,0.18)]'
          }`}
        >
          <div
            className={`relative flex items-center justify-between px-5 transition-[padding] duration-500 sm:px-8 lg:px-12 ${
              isCompact ? 'py-2' : 'py-2.5 sm:py-3'
            }`}
          >
            <Link
              aria-label="Davi Faria Physio — Início"
              className="flex shrink-0 items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4"
              href="#inicio"
              onClick={(event) => handleNavigation(event, '#inicio')}
            >
              <LogoSVG
                className={`w-auto text-slate-950 transition-[height] duration-500 ${
                  isCompact ? 'h-8' : 'h-10 sm:h-12'
                }`}
                name="DAVI FARIA"
                surname="PHYSIO"
              />
            </Link>

            <nav aria-label="Navegação principal" className="hidden lg:block">
              <ul className="flex items-center gap-6 text-sm font-medium xl:gap-8">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="group relative block py-2 text-slate-600 transition-colors duration-300 outline-none hover:text-slate-950 focus-visible:text-slate-950"
                      href={link.href}
                      onClick={(event) => handleNavigation(event, link.href)}
                    >
                      {link.name}
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1 left-1/2 h-px w-4 origin-center -translate-x-1/2 scale-x-0 bg-teal-600 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden lg:block">
              <Link
                className="group relative isolate flex min-h-10 items-center overflow-hidden rounded-full border border-slate-950/10 bg-slate-950 px-5 py-2 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.12),0_10px_24px_-12px_rgba(15,23,42,0.58)] transition-[transform,box-shadow] duration-300 outline-none hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(15,23,42,0.12),0_14px_28px_-12px_rgba(15,23,42,0.64)] focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-3 active:translate-y-0 active:scale-[0.985]"
                href="#contato"
                onClick={(event) => handleNavigation(event, '#contato')}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(45,212,191,0.3),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="relative">Agendar avaliação</span>
              </Link>
            </div>

            <button
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              className="relative grid size-11 shrink-0 place-items-center rounded-full border border-slate-900/8 bg-white/35 text-slate-900 transition-[background-color,border-color,transform] duration-300 outline-none hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 active:scale-95 lg:hidden"
              onClick={() => setIsMenuOpen((current) => !current)}
              ref={menuButtonRef}
              type="button"
            >
              <Menu
                aria-hidden="true"
                className={`absolute size-5 transition-[opacity,transform] duration-300 ${
                  isMenuOpen ? 'scale-75 rotate-45 opacity-0' : 'scale-100 rotate-0 opacity-100'
                }`}
                strokeWidth={1.8}
              />
              <X
                aria-hidden="true"
                className={`absolute size-5 transition-[opacity,transform] duration-300 ${
                  isMenuOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-45 opacity-0'
                }`}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>

        <MobileHeader
          isOpen={isMenuOpen}
          links={NAV_LINKS}
          onNavigate={navigateToSection}
          onRequestClose={() => setIsMenuOpen(false)}
          triggerRef={menuButtonRef}
        />
      </div>
    </header>
  );
}
