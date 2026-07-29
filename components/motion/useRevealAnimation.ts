'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type RefObject, useRef } from 'react';

import { getIosDiagnosticOptions } from '@/lib/ios-diagnostics';
import { getPerformanceTier, type PerformanceTier } from '@/lib/performance-tier';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type RevealVariant = 'default' | 'media' | 'panel';

interface CreateRevealAnimationOptions {
  container: HTMLElement;
  duration: number;
  ease: string;
  markers: boolean;
  once: boolean;
  performanceTier: PerformanceTier;
  selector: string;
  start: string;
}

interface RevealAnimationOptions {
  disabled?: boolean;
  duration?: number;
  ease?: string;
  markers?: boolean;
  once?: boolean;
  selector?: string;
  start?: string;
}

interface UseRevealAnimationResult<T extends HTMLElement> {
  containerRef: RefObject<null | T>;
}

/** The DOM is visible by default. Motion is applied only after this setup succeeds. */
export function useRevealAnimation<T extends HTMLElement = HTMLElement>(
  options: RevealAnimationOptions = {},
): UseRevealAnimationResult<T> {
  const containerRef = useRef<T>(null);
  const { disabled = false, duration = 0.9, ease = 'power3.out', markers = false, once = true, selector = '[data-reveal]', start = 'top 84%' } = options;
  const diagnostics = getIosDiagnosticOptions();
  const motionDisabled =
    disabled ||
    diagnostics.disableAllMotion ||
    diagnostics.disableBelowFoldRuntime ||
    diagnostics.disableScrollTriggers;

  useGSAP(() => {
    const container = containerRef.current;
    if (!container || motionDisabled) return;
    const performanceTier = getPerformanceTier(navigator, window.devicePixelRatio || 1);
    const initializeReveal = () => createRevealAnimation({
      container,
      duration,
      ease,
      markers,
      once,
      performanceTier,
      selector,
      start,
    });

    if (performanceTier === 'high' || typeof IntersectionObserver !== 'function') {
      return initializeReveal();
    }

    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || cleanup) return;

        observer.disconnect();
        cleanup = initializeReveal();
      },
      { rootMargin: '180px 0px', threshold: 0.01 },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, { dependencies: [duration, ease, markers, motionDisabled, once, selector, start], revertOnUpdate: true, scope: containerRef });

  return { containerRef };
}

function createRevealAnimation({
  container,
  duration,
  ease,
  markers,
  once,
  performanceTier,
  selector,
  start,
}: CreateRevealAnimationOptions): () => void {
  const elements = gsap.utils.toArray<HTMLElement>(selector, container);
  if (!elements.length) return () => undefined;

  const media = gsap.matchMedia();
  media.add({ isMobile: '(max-width: 767px)', reduceMotion: '(prefers-reduced-motion: reduce)' }, (context) => {
    const { isMobile, reduceMotion } = context.conditions as { isMobile: boolean; reduceMotion: boolean };
    if (reduceMotion) {
      gsap.set(elements, { autoAlpha: 1, clearProps: 'transform,opacity,visibility,willChange' });
      return;
    }

    const motionScale = performanceTier === 'low' ? 0.62 : performanceTier === 'medium' ? 0.82 : 1;
    const stagger = (isMobile ? 0.065 : 0.085) * motionScale;
    const distanceFactor = (isMobile ? 0.58 : 1) * motionScale;
    const preserveVisibility = performanceTier === 'low';
    let trigger: ScrollTrigger | undefined;

    try {
      const timeline = gsap.timeline({
        defaults: { ease },
        onComplete: () => {
          gsap.set(elements, { clearProps: 'transform,opacity,visibility,willChange' });
          if (once) trigger?.kill();
        },
        paused: true,
      });
      elements.forEach((element, index) => {
        const variant = getRevealVariant(element);
        const initial = getInitialState(variant, distanceFactor, preserveVisibility);
        gsap.set(element, { ...initial, willChange: 'transform,opacity' });
        timeline.to(
          element,
          {
            autoAlpha: 1,
            duration: duration * (isMobile ? 0.76 : 1) * motionScale,
            ease,
            scale: variant === 'default' ? undefined : 1,
            y: 0,
          },
          index * stagger,
        );
      });
      trigger = ScrollTrigger.create({
        invalidateOnRefresh: true,
        markers,
        once,
        onEnter: () => timeline.play(),
        onEnterBack: () => { if (!once) timeline.play(); },
        start,
        trigger: container,
      });
      return () => {
        trigger?.kill();
        timeline.kill();
        gsap.set(elements, { clearProps: 'transform,opacity,visibility,willChange' });
      };
    } catch (error) {
      gsap.set(elements, { clearProps: 'transform,opacity,visibility,willChange' });
      if (process.env.NODE_ENV !== 'production') console.error('Section reveal was disabled after an initialization error.', error);
    }
  });

  return () => media.revert();
}

function getInitialState(variant: RevealVariant, factor: number, preserveVisibility: boolean) {
  if (variant === 'media') return { autoAlpha: preserveVisibility ? 1 : 0, scale: 0.985, y: 30 * factor };
  if (variant === 'panel') return { autoAlpha: preserveVisibility ? 1 : 0, scale: 0.992, y: 38 * factor };
  return { autoAlpha: preserveVisibility ? 1 : 0, y: 26 * factor };
}

function getRevealVariant(element: HTMLElement): RevealVariant {
  const value = element.dataset.reveal;
  return value === 'media' || value === 'panel' || value === 'default' ? value : 'default';
}
