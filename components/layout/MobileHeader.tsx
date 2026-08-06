'use client';

import Link from 'next/link';
import {
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  useEffect,
  useRef,
} from 'react';

import type { NavLink } from './navLinks';

interface MobileHeaderProps {
  isOpen: boolean;
  links: readonly NavLink[];
  onNavigate: (href: string) => void;
  onRequestClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export default function MobileHeader({
  isOpen,
  links,
  onNavigate,
  onRequestClose,
  triggerRef,
}: MobileHeaderProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      window.requestAnimationFrame(() => {
        menuRef.current
          ?.querySelector<HTMLElement>('[data-mobile-focusable]')
          ?.focus({ preventScroll: true });
      });
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus({ preventScroll: true });
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, triggerRef]);

  function handleNavigation(event: MouseEvent<HTMLAnchorElement>, href: string): void {
    if (!href.startsWith('#')) {
      onRequestClose();
      return;
    }

    event.preventDefault();
    onNavigate(href);
  }

  function trapFocus(event: KeyboardEvent<HTMLDivElement>): void {
    if (!isOpen || event.key !== 'Tab') {
      return;
    }

    const focusableElements = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[data-mobile-focusable]') ?? [],
    ).filter((element) => element.tabIndex !== -1);

    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (!firstElement || !lastElement) {
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return (
    <div
      aria-hidden={!isOpen}
      aria-label="Menu de navegação"
      aria-modal={isOpen}
      className={`absolute top-[calc(100%+0.55rem)] right-0 left-0 z-[-1] max-h-[calc(100dvh-7.5rem)] overflow-x-hidden overflow-y-auto overscroll-contain rounded-[1.4rem] border border-white/70 bg-white/78 shadow-[0_2px_5px_rgba(15,23,42,0.05),0_28px_70px_-28px_rgba(15,23,42,0.34)] backdrop-blur-2xl backdrop-saturate-150 transition-[opacity,transform,visibility,clip-path] duration-300 ease-out lg:hidden ${
        isOpen
          ? 'visible translate-y-0 scale-100 opacity-100 [clip-path:inset(0_0_0_0_round_1.4rem)] pointer-events-auto'
          : 'invisible -translate-y-2 scale-[0.985] opacity-0 [clip-path:inset(0_0_12%_0_round_1.4rem)] pointer-events-none'
      }`}
      id="mobile-menu"
      onKeyDown={trapFocus}
      ref={menuRef}
      role="dialog"
    >
      <nav aria-label="Navegação mobile" className="px-5 pt-4 pb-5 sm:px-7 sm:pt-5 sm:pb-6">
        <div className="px-1 pt-1 pb-2.5">
          <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Navegação
          </span>
        </div>

        <ul className="flex flex-col">
          {links.map((link) => (
            <li className="border-b border-slate-900/6 last:border-none" key={link.href}>
              <Link
                className="group flex min-h-13 items-center justify-between gap-4 py-3.5 text-[0.96rem] font-medium text-slate-600 outline-none transition-colors duration-300 hover:text-slate-950 focus-visible:text-slate-950"
                data-mobile-focusable
                href={link.href}
                onClick={(event) => handleNavigation(event, link.href)}
                tabIndex={isOpen ? 0 : -1}
              >
                <span>{link.name}</span>

                <span
                  aria-hidden="true"
                  className="relative h-px w-5 overflow-hidden bg-slate-900/10"
                >
                  <span className="absolute inset-0 -translate-x-full bg-teal-600 transition-transform duration-300 ease-out group-hover:translate-x-0 group-focus-visible:translate-x-0" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          className="group relative isolate mt-5 flex min-h-12 w-full items-center justify-center overflow-hidden rounded-full border border-slate-950/10 bg-slate-950 px-6 py-3 text-center text-[0.94rem] font-semibold text-white shadow-[0_2px_4px_rgba(15,23,42,0.12),0_15px_30px_-16px_rgba(15,23,42,0.68)] outline-none transition-[transform,box-shadow] duration-300 hover:-translate-y-px hover:shadow-[0_3px_6px_rgba(15,23,42,0.12),0_20px_34px_-16px_rgba(15,23,42,0.72)] focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-3 active:translate-y-0 active:scale-[0.985]"
          data-mobile-focusable
          href="#contato"
          onClick={(event) => handleNavigation(event, '#contato')}
          tabIndex={isOpen ? 0 : -1}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_130%,rgba(45,212,191,0.34),transparent_58%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
          <span className="relative">Agendar avaliação</span>
        </Link>
      </nav>
    </div>
  );
}
