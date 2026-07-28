'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Link from 'next/link';
import {
  type Dispatch,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';

gsap.registerPlugin(useGSAP);

interface MobileHeaderProps {
  isOpen: boolean;

  links: {
    href: string;
    name: string;
  }[];

  onNavigate: (href: string) => void;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export default function MobileHeader({
  isOpen,
  links,
  onNavigate,
  setIsMenuOpen,
  triggerRef,
}: MobileHeaderProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reduceMotionRef = useRef(false);
  const wasOpenRef = useRef(false);

  useGSAP(
    () => {
      const menu = menuRef.current;

      if (!menu) {
        return;
      }

      const menuItems = Array.from(menu.querySelectorAll<HTMLElement>('[data-mobile-menu-item]'));

      const cta = menu.querySelector<HTMLElement>('[data-mobile-menu-cta]');

      reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      gsap.set(menu, {
        autoAlpha: 0,
        clipPath: 'inset(0 0 14% 0 round 1.4rem)',
        force3D: true,
        pointerEvents: 'none',
        scale: 0.985,
        transformOrigin: 'center top',
        visibility: 'hidden',
        y: -10,
      });

      gsap.set(menuItems, {
        autoAlpha: 0,
        force3D: true,
        y: 14,
      });

      if (cta) {
        gsap.set(cta, {
          autoAlpha: 0,
          force3D: true,
          scale: 0.985,
          y: 12,
        });
      }

      if (reduceMotionRef.current) {
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          overwrite: 'auto',
        },

        onReverseComplete: () => {
          gsap.set(menu, {
            pointerEvents: 'none',
            visibility: 'hidden',
          });
        },

        paused: true,
      });

      timeline
        .to(
          menu,
          {
            autoAlpha: 1,
            clipPath: 'inset(0 0 0% 0 round 1.4rem)',
            duration: 0.5,
            ease: 'power4.out',
            scale: 1,
            y: 0,
          },
          0,
        )
        .to(
          menuItems,
          {
            autoAlpha: 1,
            duration: 0.42,
            ease: 'power3.out',
            stagger: 0.055,
            y: 0,
          },
          0.1,
        );

      if (cta) {
        timeline.to(
          cta,
          {
            autoAlpha: 1,
            duration: 0.44,
            ease: 'power3.out',
            scale: 1,
            y: 0,
          },
          0.18,
        );
      }

      timelineRef.current = timeline;

      return () => {
        timeline.kill();

        gsap.killTweensOf([menu, ...menuItems, cta]);

        timelineRef.current = null;
      };
    },
    {
      dependencies: [links.length],
      revertOnUpdate: true,
      scope: menuRef,
    },
  );

  useEffect(() => {
    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    const menuItems = Array.from(menu.querySelectorAll<HTMLElement>('[data-mobile-menu-item]'));

    const cta = menu.querySelector<HTMLElement>('[data-mobile-menu-cta]');

    if (reduceMotionRef.current) {
      gsap.set(menu, {
        autoAlpha: isOpen ? 1 : 0,
        clipPath: 'inset(0 0 0% 0 round 1.4rem)',
        pointerEvents: isOpen ? 'auto' : 'none',
        scale: 1,
        visibility: isOpen ? 'visible' : 'hidden',
        y: 0,
      });

      gsap.set(menuItems, {
        autoAlpha: isOpen ? 1 : 0,
        y: 0,
      });

      if (cta) {
        gsap.set(cta, {
          autoAlpha: isOpen ? 1 : 0,
          scale: 1,
          y: 0,
        });
      }

      return;
    }

    const timeline = timelineRef.current;

    if (!timeline) {
      return;
    }

    if (isOpen) {
      gsap.set(menu, {
        pointerEvents: 'auto',
        visibility: 'visible',
      });

      timeline.timeScale(1).play();
      return;
    }
    timeline.timeScale(1.15).reverse();
  }, [isOpen]);

  useEffect(() => {
    let frameId: number | undefined;

    if (isOpen) {
      frameId = window.requestAnimationFrame(() => {
        menuRef.current?.querySelector<HTMLElement>('[data-mobile-focusable]')?.focus({
          preventScroll: true,
        });
      });
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus({
        preventScroll: true,
      });
    }

    wasOpenRef.current = isOpen;

    return () => {
      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isOpen, triggerRef]);

  const handleNavigation = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) {
        setIsMenuOpen(false);
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      setIsMenuOpen(false);

      window.requestAnimationFrame(() => {
        onNavigate(href);
      });
    },
    [onNavigate, setIsMenuOpen],
  );

  const trapFocus = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
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
    },
    [isOpen],
  );

  return (
    <div
      aria-hidden={!isOpen}
      className="invisible absolute top-[calc(100%+0.5rem)] right-0 left-0 z-[70] max-h-[calc(100dvh-7rem)] touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain rounded-[1.4rem] border border-slate-900/7 bg-white/92 shadow-[0_2px_4px_rgba(15,23,42,0.04),0_24px_64px_-24px_rgba(15,23,42,0.28)] backdrop-blur-2xl backdrop-saturate-150 will-change-[transform,opacity,clip-path] lg:hidden"
      data-lenis-prevent
      id="mobile-menu"
      inert={!isOpen}
      onKeyDown={trapFocus}
      ref={menuRef}
    >
      <nav aria-label="Navegação mobile" className="px-5 pt-4 pb-5 sm:px-6">
        <div className="px-1 pt-1 pb-2" data-mobile-menu-item>
          <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
            Navegação
          </span>
        </div>

        <ul className="flex flex-col">
          {links.map((link) => (
            <li
              className="border-b border-slate-900/6 last:border-none"
              data-mobile-menu-item
              key={link.name}
            >
              <Link
                className="group text-slate-650 flex min-h-13 items-center justify-between gap-4 py-3.5 text-[15px] font-medium transition-colors duration-300 outline-none hover:text-slate-950 focus-visible:text-slate-950"
                data-mobile-focusable
                href={link.href}
                onClick={(event) => handleNavigation(event, link.href)}
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
          className="group relative isolate mt-5 flex w-full items-center justify-center overflow-hidden rounded-full border border-slate-950/10 bg-slate-950 px-6 py-3.5 text-center text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.12),0_12px_26px_-14px_rgba(15,23,42,0.7)] transition-[transform,box-shadow] duration-300 outline-none hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(15,23,42,0.12),0_16px_30px_-14px_rgba(15,23,42,0.7)] focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-3 active:translate-y-0 active:scale-[0.985]"
          data-mobile-focusable
          data-mobile-menu-cta
          href="#contato"
          onClick={(event) => handleNavigation(event, '#contato')}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_130%,rgba(45,212,191,0.32),transparent_58%)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
          />

          <span className="relative">Agendar consulta</span>
        </Link>
      </nav>
    </div>
  );
}
