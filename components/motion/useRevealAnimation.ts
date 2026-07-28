'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type RefObject, useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type RevealVariant = 'default' | 'media' | 'panel';

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

  useGSAP(() => {
    const container = containerRef.current;
    if (!container || disabled) return;
    const elements = gsap.utils.toArray<HTMLElement>(selector, container);
    if (!elements.length) return;

    const media = gsap.matchMedia();
    media.add({ isMobile: '(max-width: 767px)', reduceMotion: '(prefers-reduced-motion: reduce)' }, (context) => {
      const { isMobile, reduceMotion } = context.conditions as { isMobile: boolean; reduceMotion: boolean };
      if (reduceMotion) {
        gsap.set(elements, { autoAlpha: 1, clearProps: 'transform,opacity,visibility,willChange' });
        return;
      }

      const stagger = isMobile ? 0.065 : 0.085;
      const distanceFactor = isMobile ? 0.58 : 1;
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
          const initial = getInitialState(variant, distanceFactor);
          gsap.set(element, { ...initial, willChange: 'transform,opacity' });
          timeline.to(element, { autoAlpha: 1, duration: duration * (isMobile ? 0.76 : 1), ease, scale: variant === 'default' ? undefined : 1, y: 0 }, index * stagger);
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
  }, { dependencies: [disabled, duration, ease, markers, once, selector, start], revertOnUpdate: true, scope: containerRef });

  return { containerRef };
}

function getInitialState(variant: RevealVariant, factor: number) {
  if (variant === 'media') return { autoAlpha: 0, scale: 0.985, y: 30 * factor };
  if (variant === 'panel') return { autoAlpha: 0, scale: 0.992, y: 38 * factor };
  return { autoAlpha: 0, y: 26 * factor };
}

function getRevealVariant(element: HTMLElement): RevealVariant {
  const value = element.dataset.reveal;
  return value === 'media' || value === 'panel' || value === 'default' ? value : 'default';
}
