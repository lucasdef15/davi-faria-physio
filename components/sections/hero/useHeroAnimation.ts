'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { RefObject } from 'react';

gsap.registerPlugin(useGSAP);

interface HeroConditions {
  isDesktop: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
}

function setIfPresent(target: Element | null, vars: gsap.TweenVars) {
  if (target) {
    gsap.set(target, vars);
  }
}

function setIfAny<T extends Element>(targets: T[], vars: gsap.TweenVars) {
  if (targets.length > 0) {
    gsap.set(targets, vars);
  }
}

export function useHeroAnimation(rootRef: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const media = gsap.matchMedia();

      media.add(
        {
          isDesktop: '(min-width: 1024px)',
          isMobile: '(max-width: 1023px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, isMobile, reduceMotion } =
            context.conditions as unknown as HeroConditions;

          if (reduceMotion) {
            return;
          }

          const ambient = gsap.utils.toArray<HTMLElement>('[data-hero-ambient]', root);
          const eyebrow = root.querySelector<HTMLElement>('[data-hero-eyebrow]');
          const titleLines = gsap.utils.toArray<HTMLElement>('[data-hero-title-line]', root);
          const summary = root.querySelector<HTMLElement>('[data-hero-summary]');
          const actions = root.querySelector<HTMLElement>('[data-hero-actions]');
          const indicators = gsap.utils.toArray<HTMLElement>('[data-hero-indicator]', root);
          const visual = root.querySelector<HTMLElement>('[data-hero-visual]');
          const photo = root.querySelector<HTMLElement>('[data-hero-photo]');
          const photoImage = root.querySelector<HTMLElement>('[data-hero-photo-image]');
          const panel = root.querySelector<HTMLElement>('[data-hero-panel]');
          const route = root.querySelector<HTMLElement>('[data-hero-route]');
          const routeLine = root.querySelector<HTMLElement>('[data-hero-route-line]');
          const routeStages = gsap.utils.toArray<HTMLElement>('[data-hero-route-stage]', root);

          setIfAny(ambient, { autoAlpha: 0, scale: 0.94, transformOrigin: '50% 50%' });
          setIfPresent(eyebrow, { autoAlpha: 0, y: 12 });
          setIfAny(titleLines, { autoAlpha: 0, yPercent: 34 });
          setIfPresent(summary, { autoAlpha: 0, y: 16 });
          setIfPresent(actions, { autoAlpha: 0, y: 14 });
          setIfAny(indicators, { autoAlpha: 0, y: 10 });
          setIfPresent(visual, {
            autoAlpha: 0,
            scale: 0.985,
            x: isDesktop ? 26 : 0,
            y: isMobile ? 22 : 0,
            transformOrigin: '50% 45%',
          });
          setIfPresent(photo, { autoAlpha: 0, scale: 0.992, transformOrigin: '50% 50%' });
          setIfPresent(photoImage, { scale: 1.035, transformOrigin: '50% 50%' });
          setIfPresent(panel, { autoAlpha: 0, y: 16 });
          setIfPresent(route, { autoAlpha: 0 });
          setIfPresent(routeLine, { scaleX: 0, transformOrigin: '0% 50%' });
          setIfAny(routeStages, { autoAlpha: 0, scale: 0.76, transformOrigin: '50% 50%' });

          const timeline = gsap.timeline({
            defaults: { ease: 'power3.out' },
            delay: 0.04,
          });

          if (ambient.length > 0) {
            timeline.to(ambient, { autoAlpha: 1, duration: 1, scale: 1, stagger: 0.08 }, 0);
          }

          if (eyebrow) {
            timeline.to(eyebrow, { autoAlpha: 1, duration: 0.42, y: 0 }, 0.08);
          }

          if (titleLines.length > 0) {
            timeline.to(
              titleLines,
              { autoAlpha: 1, duration: 0.72, stagger: 0.1, yPercent: 0 },
              0.14,
            );
          }

          if (summary) {
            timeline.to(summary, { autoAlpha: 1, duration: 0.55, y: 0 }, 0.45);
          }

          if (actions) {
            timeline.to(actions, { autoAlpha: 1, duration: 0.5, y: 0 }, 0.58);
          }

          if (indicators.length > 0) {
            timeline.to(
              indicators,
              { autoAlpha: 1, duration: 0.38, stagger: 0.07, y: 0 },
              0.68,
            );
          }

          if (visual) {
            timeline.to(
              visual,
              { autoAlpha: 1, duration: 0.78, scale: 1, x: 0, y: 0 },
              isDesktop ? 0.22 : 0.56,
            );
          }

          if (photo) {
            timeline.to(photo, { autoAlpha: 1, duration: 0.68, scale: 1 }, isDesktop ? 0.3 : 0.64);
          }

          if (photoImage) {
            timeline.to(
              photoImage,
              { duration: 1.05, ease: 'power2.out', scale: 1 },
              isDesktop ? 0.3 : 0.64,
            );
          }

          if (panel) {
            timeline.to(panel, { autoAlpha: 1, duration: 0.56, y: 0 }, isDesktop ? 0.78 : 0.92);
          }

          if (route) {
            timeline.to(route, { autoAlpha: 1, duration: 0.28 }, isDesktop ? 0.96 : 1.08);
          }

          if (routeLine) {
            timeline.to(
              routeLine,
              { duration: 0.58, ease: 'power2.inOut', scaleX: 1 },
              isDesktop ? 1.02 : 1.14,
            );
          }

          if (routeStages.length > 0) {
            timeline.to(
              routeStages,
              {
                autoAlpha: 1,
                duration: 0.32,
                ease: 'back.out(1.45)',
                scale: 1,
                stagger: 0.08,
              },
              isDesktop ? 1.08 : 1.2,
            );
          }

          const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
              timeline.pause();
            } else if (timeline.progress() < 1) {
              timeline.play();
            }
          };

          document.addEventListener('visibilitychange', handleVisibilityChange);

          context.add(() => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
          });
        },
      );

      return () => media.revert();
    },
    { scope: rootRef },
  );
}
