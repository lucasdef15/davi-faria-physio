'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { type RefObject, useRef } from 'react';

import { cancelScheduledFrame, scheduleFrame } from '@/lib/animation-frame';
import { getIosDiagnosticOptions, markIosDiagnosticStage } from '@/lib/ios-diagnostics';
import { getPerformanceTier } from '@/lib/performance-tier';

gsap.registerPlugin(useGSAP);

interface UseHeroAnimationResult {
  containerRef: RefObject<HTMLElement | null>;
}

export function useHeroAnimation(): UseHeroAnimationResult {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const diagnostics = getIosDiagnosticOptions();
      const performanceTier = getPerformanceTier(navigator, window.devicePixelRatio || 1);
      markIosDiagnosticStage('Hero montado');

      const ambient = container.querySelector<HTMLElement>('[data-hero-ambient]');
      const canvas = container.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
      const eyebrow = container.querySelector<HTMLElement>('[data-hero-eyebrow]');
      const copy = container.querySelector<HTMLElement>('[data-hero-copy]');
      const scrollBadge = container.querySelector<HTMLElement>('[data-hero-scroll]');

      const headingLines = Array.from(container.querySelectorAll<HTMLElement>('[data-hero-line]'));

      const actionItems = Array.from(container.querySelectorAll<HTMLElement>('[data-hero-action]'));

      const indicatorItems = Array.from(
        container.querySelectorAll<HTMLElement>('[data-hero-indicator]'),
      );

      const animatedElements = [
        ambient,
        canvas,
        eyebrow,
        copy,
        scrollBadge,
        ...headingLines,
        ...actionItems,
        ...indicatorItems,
      ].filter((element): element is HTMLElement => element !== null);

      const mediaQuery = gsap.matchMedia();

      if (diagnostics.disableHeroMotion) {
        return;
      }

      mediaQuery.add(
        {
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions as {
            isMobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(animatedElements, {
              autoAlpha: 1,
              clearProps: 'transform,opacity,visibility,willChange',
            });
            return;
          }

          let animationFrame = 0;
          let entranceTimeline: gsap.core.Timeline | null = null;
          let fallbackTimer = 0;

          const revealImmediately = () => {
            gsap.set(animatedElements, {
              autoAlpha: 1,
              clearProps: 'transform,opacity,visibility,willChange',
            });
          };

          const startAnimation = () => {
            try {
              markIosDiagnosticStage('GSAP iniciado');
              const isLowCapacity = performanceTier === 'low';
              const motionScale = performanceTier === 'medium' ? 0.82 : 1;
              const distance = (isMobile ? 14 : 22) * motionScale;
              const lineDuration = (isMobile ? 0.78 : 0.94) * motionScale;
              const decorativeElements = [ambient, canvas, scrollBadge].filter(
                (element): element is HTMLElement => element !== null,
              );

              gsap.set(isLowCapacity ? decorativeElements : animatedElements, {
                willChange: 'transform, opacity',
              });

              if (ambient) gsap.set(ambient, { autoAlpha: 0, scale: 1.025 });
              if (canvas) gsap.set(canvas, { autoAlpha: 0, scale: 1.018 });
              if (!isLowCapacity && eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: distance * 0.65 });
              if (!isLowCapacity) gsap.set(headingLines, { autoAlpha: 0, yPercent: 108 });
              if (!isLowCapacity && copy) gsap.set(copy, { autoAlpha: 0, y: distance });
              if (!isLowCapacity) gsap.set(actionItems, { autoAlpha: 0, y: distance * 0.8 });
              if (!isLowCapacity) gsap.set(indicatorItems, { autoAlpha: 0, y: distance * 0.65 });
              if (scrollBadge) gsap.set(scrollBadge, { autoAlpha: 0, y: 10 });

              entranceTimeline = gsap.timeline({
                defaults: { ease: 'power3.out' },
                onComplete: revealImmediately,
              });

              if (ambient) {
                entranceTimeline.to(ambient, { autoAlpha: 1, duration: 1.15, ease: 'power2.out', scale: 1 }, 0);
              }

              if (canvas) {
                entranceTimeline.to(canvas, { autoAlpha: 1, duration: 1.35, ease: 'power2.out', scale: 1 }, 0.04);
              }

              if (!isLowCapacity) {
                if (eyebrow) entranceTimeline.to(eyebrow, { autoAlpha: 1, duration: 0.58 * motionScale, y: 0 }, 0.12);

                entranceTimeline.to(
                  headingLines,
                  {
                    autoAlpha: 1,
                    duration: lineDuration,
                    ease: 'expo.out',
                    stagger: (isMobile ? 0.075 : 0.095) * motionScale,
                    yPercent: 0,
                  },
                  0.2,
                );

                if (copy) entranceTimeline.to(copy, { autoAlpha: 1, duration: (isMobile ? 0.62 : 0.72) * motionScale, y: 0 }, 0.58);

                entranceTimeline.to(
                  actionItems,
                  { autoAlpha: 1, duration: (isMobile ? 0.56 : 0.64) * motionScale, stagger: 0.08 * motionScale, y: 0 },
                  0.7,
                );
                entranceTimeline.to(
                  indicatorItems,
                  {
                    autoAlpha: 1,
                    duration: (isMobile ? 0.48 : 0.58) * motionScale,
                    stagger: (isMobile ? 0.045 : 0.065) * motionScale,
                    y: 0,
                  },
                  0.85,
                );
              }

              if (scrollBadge) entranceTimeline.to(scrollBadge, { autoAlpha: 1, duration: 0.52, y: 0 }, 1.02);
            } catch (error) {
              revealImmediately();

              if (process.env.NODE_ENV !== 'production') {
                console.error('Hero animation was disabled after an initialization error.', error);
              }
            }
          };

          animationFrame = scheduleFrame(startAnimation);
          fallbackTimer = window.setTimeout(() => {
            if (!entranceTimeline) revealImmediately();
          }, 900);

          return () => {
            cancelScheduledFrame(animationFrame);
            window.clearTimeout(fallbackTimer);
            entranceTimeline?.kill();
            revealImmediately();
          };
        },
      );

      return () => mediaQuery.revert();
    },
    {
      scope: containerRef,
    },
  );

  return {
    containerRef,
  };
}
