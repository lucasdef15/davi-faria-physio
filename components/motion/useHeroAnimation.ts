'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { type RefObject, useRef } from 'react';

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

      const ambient = container.querySelector<HTMLElement>('[data-hero-ambient]');
      const canvas = container.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
      const eyebrow = container.querySelector<HTMLElement>('[data-hero-eyebrow]');
      const copy = container.querySelector<HTMLElement>('[data-hero-copy]');
      const scrollBadge = container.querySelector<HTMLElement>('[data-hero-scroll]');

      const headingLines = gsap.utils.toArray<HTMLElement>('[data-hero-line]', container);

      const actionItems = gsap.utils.toArray<HTMLElement>('[data-hero-action]', container);

      const indicatorItems = gsap.utils.toArray<HTMLElement>('[data-hero-indicator]', container);

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

          const distance = isMobile ? 14 : 22;
          const lineDuration = isMobile ? 0.78 : 0.94;

          gsap.set(animatedElements, {
            willChange: 'transform, opacity',
          });

          if (ambient) {
            gsap.set(ambient, {
              autoAlpha: 0,
              scale: 1.025,
            });
          }

          if (canvas) {
            gsap.set(canvas, {
              autoAlpha: 0,
              scale: 1.018,
            });
          }

          if (eyebrow) {
            gsap.set(eyebrow, {
              autoAlpha: 0,
              y: distance * 0.65,
            });
          }

          gsap.set(headingLines, {
            autoAlpha: 0,
            yPercent: 108,
          });

          if (copy) {
            gsap.set(copy, {
              autoAlpha: 0,
              y: distance,
            });
          }

          gsap.set(actionItems, {
            autoAlpha: 0,
            y: distance * 0.8,
          });

          gsap.set(indicatorItems, {
            autoAlpha: 0,
            y: distance * 0.65,
          });

          if (scrollBadge) {
            gsap.set(scrollBadge, {
              autoAlpha: 0,
              y: 10,
            });
          }

          const timeline = gsap.timeline({
            defaults: {
              ease: 'power3.out',
            },
            onComplete: () => {
              gsap.set(animatedElements, {
                clearProps: 'transform,opacity,visibility,willChange',
              });
            },
            paused: true,
          });

          if (ambient) {
            timeline.to(
              ambient,
              {
                autoAlpha: 1,
                duration: 1.15,
                ease: 'power2.out',
                scale: 1,
              },
              0,
            );
          }

          if (canvas) {
            timeline.to(
              canvas,
              {
                autoAlpha: 1,
                duration: 1.35,
                ease: 'power2.out',
                scale: 1,
              },
              0.04,
            );
          }

          if (eyebrow) {
            timeline.to(
              eyebrow,
              {
                autoAlpha: 1,
                duration: 0.58,
                y: 0,
              },
              0.12,
            );
          }

          timeline.to(
            headingLines,
            {
              autoAlpha: 1,
              duration: lineDuration,
              ease: 'expo.out',
              stagger: isMobile ? 0.075 : 0.095,
              yPercent: 0,
            },
            0.2,
          );

          if (copy) {
            timeline.to(
              copy,
              {
                autoAlpha: 1,
                duration: isMobile ? 0.62 : 0.72,
                y: 0,
              },
              0.58,
            );
          }

          timeline.to(
            actionItems,
            {
              autoAlpha: 1,
              duration: isMobile ? 0.56 : 0.64,
              stagger: 0.08,
              y: 0,
            },
            0.7,
          );

          timeline.to(
            indicatorItems,
            {
              autoAlpha: 1,
              duration: isMobile ? 0.48 : 0.58,
              stagger: isMobile ? 0.045 : 0.065,
              y: 0,
            },
            0.85,
          );

          if (scrollBadge) {
            timeline.to(
              scrollBadge,
              {
                autoAlpha: 1,
                duration: 0.52,
                y: 0,
              },
              1.02,
            );
          }

          let secondFrameId = 0;

          const firstFrameId = window.requestAnimationFrame(() => {
            secondFrameId = window.requestAnimationFrame(() => {
              timeline.play(0);
            });
          });

          return () => {
            window.cancelAnimationFrame(firstFrameId);
            window.cancelAnimationFrame(secondFrameId);
            timeline.kill();
          };
        },
      );

      return () => {
        mediaQuery.revert();
      };
    },
    {
      scope: containerRef,
    },
  );

  return {
    containerRef,
  };
}
