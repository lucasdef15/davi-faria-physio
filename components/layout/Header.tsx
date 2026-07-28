'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useLenis } from 'lenis/react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

import LogoSVG from '../svg/LogoSVG';
import MobileHeader from './MobileHeader';
import { NAV_LINKS } from './navLinks';

gsap.registerPlugin(useGSAP);

type HeaderMode = 'hidden' | 'top' | 'visible';
type QuickSetter = ReturnType<typeof gsap.quickSetter>;

type SurfaceMode = 'compact' | 'top';

const COMPACT_DISTANCE = 180;
const COMPACT_THRESHOLD = 24;
const TOP_THRESHOLD = 48;
const HIDE_THRESHOLD = 320;

const HEADER_TOP_Y = 16;
const HEADER_VISIBLE_Y = 8;
const HEADER_HIDDEN_Y = -112;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const menuIconRef = useRef<SVGSVGElement>(null);
  const closeIconRef = useRef<SVGSVGElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const headerModeRef = useRef<HeaderMode>('top');
  const surfaceModeRef = useRef<SurfaceMode>('top');

  const isNavigatingRef = useRef(false);
  const reduceMotionRef = useRef(false);

  const shellScaleSetterRef = useRef<null | QuickSetter>(null);
  const contentPaddingTopSetterRef = useRef<null | QuickSetter>(null);
  const contentPaddingBottomSetterRef = useRef<null | QuickSetter>(null);
  const logoScaleSetterRef = useRef<null | QuickSetter>(null);

  const setHeaderMode = useCallback((nextMode: HeaderMode) => {
    const header = headerRef.current;

    if (!header || headerModeRef.current === nextMode) {
      return;
    }

    headerModeRef.current = nextMode;

    const y =
      nextMode === 'hidden'
        ? HEADER_HIDDEN_Y
        : nextMode === 'top'
          ? HEADER_TOP_Y
          : HEADER_VISIBLE_Y;

    if (reduceMotionRef.current) {
      gsap.set(header, { y });
      return;
    }

    gsap.to(header, {
      duration: nextMode === 'hidden' ? 0.38 : 0.58,
      ease: nextMode === 'hidden' ? 'power3.inOut' : 'expo.out',
      overwrite: 'auto',
      y,
    });
  }, []);

  const setSurfaceMode = useCallback((nextMode: SurfaceMode) => {
    const shell = shellRef.current;

    if (!shell || surfaceModeRef.current === nextMode) {
      return;
    }

    surfaceModeRef.current = nextMode;

    const isCompact = nextMode === 'compact';

    const properties = {
      backgroundColor: isCompact ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.52)',

      borderColor: isCompact ? 'rgba(15, 23, 42, 0.075)' : 'rgba(255, 255, 255, 0.46)',

      boxShadow: isCompact
        ? '0 1px 2px rgba(15, 23, 42, 0.04), 0 18px 42px -20px rgba(15, 23, 42, 0.2)'
        : '0 1px 2px rgba(15, 23, 42, 0.025), 0 12px 36px -24px rgba(15, 23, 42, 0.14)',
    };

    if (reduceMotionRef.current) {
      gsap.set(shell, properties);
      return;
    }

    gsap.to(shell, {
      ...properties,
      duration: 0.46,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }, []);

  const applyCompactProgress = useCallback((scroll: number) => {
    const progress = gsap.utils.clamp(0, 1, scroll / COMPACT_DISTANCE);

    shellScaleSetterRef.current?.(1 - progress * 0.03);

    contentPaddingTopSetterRef.current?.(12 - progress * 5);

    contentPaddingBottomSetterRef.current?.(12 - progress * 5);

    logoScaleSetterRef.current?.(1 - progress * 0.08);
  }, []);

  useGSAP(
    () => {
      const header = headerRef.current;
      const shell = shellRef.current;
      const content = contentRef.current;
      const logo = logoRef.current;
      const menuIcon = menuIconRef.current;
      const closeIcon = closeIconRef.current;

      if (!header || !shell || !content || !logo || !menuIcon || !closeIcon) {
        return;
      }

      reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      gsap.set(header, {
        force3D: true,
        y: HEADER_TOP_Y,
      });

      gsap.set(shell, {
        backgroundColor: 'rgba(255, 255, 255, 0.52)',
        borderColor: 'rgba(255, 255, 255, 0.46)',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.025), 0 12px 36px -24px rgba(15, 23, 42, 0.14)',
        force3D: true,
        scaleX: 1,
        transformOrigin: 'center center',
      });

      gsap.set(content, {
        paddingBottom: 12,
        paddingTop: 12,
      });

      gsap.set(logo, {
        force3D: true,
        scale: 1,
        transformOrigin: 'left center',
      });

      shellScaleSetterRef.current = gsap.quickSetter(shell, 'scaleX');

      contentPaddingTopSetterRef.current = gsap.quickSetter(content, 'paddingTop', 'px');

      contentPaddingBottomSetterRef.current = gsap.quickSetter(content, 'paddingBottom', 'px');

      logoScaleSetterRef.current = gsap.quickSetter(logo, 'scale');

      gsap.set(menuIcon, {
        autoAlpha: 1,
        rotation: 0,
        scale: 1,
        transformOrigin: 'center center',
      });

      gsap.set(closeIcon, {
        autoAlpha: 0,
        rotation: -35,
        scale: 0.86,
        transformOrigin: 'center center',
      });

      const menuTimeline = gsap.timeline({
        defaults: {
          duration: reduceMotionRef.current ? 0 : 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
        },
        paused: true,
      });

      menuTimeline
        .to(
          menuIcon,
          {
            autoAlpha: 0,
            rotation: 35,
            scale: 0.86,
          },
          0,
        )
        .to(
          closeIcon,
          {
            autoAlpha: 1,
            rotation: 0,
            scale: 1,
          },
          0.05,
        );

      menuTimelineRef.current = menuTimeline;

      return () => {
        menuTimeline.kill();

        gsap.killTweensOf([header, shell, content, logo, menuIcon, closeIcon]);

        menuTimelineRef.current = null;

        shellScaleSetterRef.current = null;
        contentPaddingTopSetterRef.current = null;
        contentPaddingBottomSetterRef.current = null;
        logoScaleSetterRef.current = null;
      };
    },
    {
      scope: headerRef,
    },
  );

  const lenis = useLenis(
    (instance) => {
      const scroll = Math.max(0, instance.scroll);

      applyCompactProgress(scroll);

      setSurfaceMode(scroll > COMPACT_THRESHOLD ? 'compact' : 'top');

      if (scroll <= TOP_THRESHOLD) {
        setHeaderMode('top');
        return;
      }

      if (reduceMotionRef.current || isMenuOpen || isNavigatingRef.current) {
        setHeaderMode('visible');
        return;
      }

      const velocity = Math.abs(instance.velocity);

      const isScrollingDown = instance.direction === -1;

      const isScrollingUp = instance.direction === 1;

      if (isScrollingDown && scroll > HIDE_THRESHOLD && velocity > 0.08) {
        setHeaderMode('hidden');
        return;
      }

      if (isScrollingUp && velocity > 0.04) {
        setHeaderMode('visible');
        return;
      }

      if (headerModeRef.current === 'top') {
        setHeaderMode('visible');
      }
    },
    [applyCompactProgress, isMenuOpen, setHeaderMode, setSurfaceMode],
  );

  const navigateToSection = useCallback(
    (href: string) => {
      setIsMenuOpen(false);

      if (!href.startsWith('#')) {
        return;
      }

      const target = document.querySelector<HTMLElement>(href);

      if (!target) {
        return;
      }

      isNavigatingRef.current = true;

      const isHome = href === '#inicio';

      setHeaderMode(isHome ? 'top' : 'visible');

      if (window.location.hash !== href) {
        window.history.pushState(null, '', href);
      }

      if (!lenis) {
        target.scrollIntoView({
          behavior: reduceMotionRef.current ? 'auto' : 'smooth',
          block: 'start',
        });

        isNavigatingRef.current = false;
        return;
      }

      lenis.scrollTo(target, {
        force: true,
        immediate: reduceMotionRef.current,
        lerp: reduceMotionRef.current ? 1 : 0.095,
        lock: false,
        offset: isHome ? 0 : 100,

        onComplete: () => {
          isNavigatingRef.current = false;

          setHeaderMode(lenis.scroll <= TOP_THRESHOLD ? 'top' : 'visible');
        },
      });
    },
    [lenis, setHeaderMode],
  );

  const handleDesktopNavigation = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) {
        setIsMenuOpen(false);
        return;
      }

      event.preventDefault();
      navigateToSection(href);
    },
    [navigateToSection],
  );

  useEffect(() => {
    const timeline = menuTimelineRef.current;

    if (!timeline) {
      return;
    }

    if (reduceMotionRef.current) {
      timeline.progress(isMenuOpen ? 1 : 0).pause();

      return;
    }

    if (isMenuOpen) {
      timeline.play();
    } else {
      timeline.reverse();
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.body.classList.toggle('menu-open', isMenuOpen);

    if (isMenuOpen) {
      lenis?.stop();
      setHeaderMode('visible');

      window.addEventListener('keydown', handleKeyDown);
    } else {
      lenis?.start();

      const currentScroll = lenis?.scroll ?? window.scrollY;

      setHeaderMode(currentScroll <= TOP_THRESHOLD ? 'top' : 'visible');
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);

      document.body.classList.remove('menu-open');

      if (isMenuOpen) {
        lenis?.start();
      }
    };
  }, [isMenuOpen, lenis, setHeaderMode]);

  useEffect(() => {
    const currentScroll = lenis?.scroll ?? window.scrollY;

    applyCompactProgress(currentScroll);

    setSurfaceMode(currentScroll > COMPACT_THRESHOLD ? 'compact' : 'top');

    setHeaderMode(currentScroll <= TOP_THRESHOLD ? 'top' : 'visible');
  }, [applyCompactProgress, lenis, setHeaderMode, setSurfaceMode]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 mx-auto w-[calc(100%-1rem)] max-w-[92%] will-change-transform sm:w-[calc(100%-2rem)]"
      ref={headerRef}
    >
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[1.4rem] border border-white/45 bg-white/50 shadow-[0_1px_2px_rgba(15,23,42,0.025),0_12px_36px_-24px_rgba(15,23,42,0.14)] backdrop-blur-2xl backdrop-saturate-150 will-change-transform"
          ref={shellRef}
        />

        <div
          className="relative flex items-center justify-between px-5 sm:px-10 lg:px-15"
          ref={contentRef}
        >
          <Link
            aria-label="Ir para o início"
            className="flex shrink-0 items-center outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4"
            href="#inicio"
            onClick={(event) => handleDesktopNavigation(event, '#inicio')}
          >
            <div className="will-change-transform" ref={logoRef}>
              <LogoSVG className="w-29.78 h-12" fill="#0f172a" name="DAVI FARIA" surname="PHYSIO" />
            </div>
          </Link>

          <nav aria-label="Navegação principal" className="hidden items-center lg:flex">
            <ul className="flex items-center gap-7 text-sm font-medium xl:gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    className="group relative block py-2 text-slate-600 transition-colors duration-300 outline-none hover:text-slate-950 focus-visible:text-slate-950"
                    href={link.href}
                    onClick={(event) => handleDesktopNavigation(event, link.href)}
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

          <div className="hidden items-center lg:flex">
            <Link
              className="group relative isolate overflow-hidden rounded-full border border-slate-950/10 bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.12),0_10px_24px_-12px_rgba(15,23,42,0.55)] transition-[transform,box-shadow] duration-300 outline-none hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(15,23,42,0.12),0_14px_28px_-12px_rgba(15,23,42,0.6)] focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-3 active:translate-y-0 active:scale-[0.985]"
              href="#contato"
              onClick={(event) => handleDesktopNavigation(event, '#contato')}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(45,212,191,0.3),transparent_55%)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />

              <span className="relative">Agendar consulta</span>
            </Link>
          </div>

          <button
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-900 transition-colors duration-300 outline-none hover:bg-slate-900/5 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            ref={menuButtonRef}
            type="button"
          >
            <Menu
              className="absolute will-change-transform"
              ref={menuIconRef}
              size={24}
              strokeWidth={1.8}
            />

            <X
              className="invisible absolute will-change-transform"
              ref={closeIconRef}
              size={24}
              strokeWidth={1.8}
            />
          </button>
        </div>

        <MobileHeader
          isOpen={isMenuOpen}
          links={NAV_LINKS}
          onNavigate={navigateToSection}
          setIsMenuOpen={setIsMenuOpen}
          triggerRef={menuButtonRef}
        />
      </div>
    </header>
  );
}
