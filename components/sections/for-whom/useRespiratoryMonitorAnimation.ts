'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefObject } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface MonitorConditions {
  isDesktop: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
}

/**
 * Coordinates the monitor as one GSAP system:
 * one entrance timeline, one visibility trigger and a small set of paused
 * continuous animations. The DOM remains fully visible when JavaScript or
 * motion is unavailable.
 */
export function useRespiratoryMonitorAnimation(rootRef: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const media = gsap.matchMedia();

      media.add(
        {
          isDesktop: '(min-width: 740px)',
          isMobile: '(max-width: 739px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, isMobile, reduceMotion } = context.conditions as unknown as MonitorConditions;

          const shell = root;
          const grid = root.querySelector<HTMLElement>('[data-monitor-grid]');
          const scanlines = root.querySelector<HTMLElement>('[data-monitor-scanlines]');
          const topbar = root.querySelector<HTMLElement>('[data-monitor-topbar]');
          const statusLight = root.querySelector<HTMLElement>('[data-monitor-status]');
          const modules = gsap.utils.toArray<HTMLElement>('[data-monitor-module]', root);
          const lungStage = root.querySelector<HTMLElement>('[data-lung-stage]');
          const lungBreath = root.querySelector<SVGGElement>('[data-lung-breath]');
          const lungGlow = root.querySelector<SVGGElement>('[data-lung-glow]');
          const lungRings = root.querySelector<SVGGElement>('[data-lung-rings]');
          const lungOutlines = gsap.utils.toArray<SVGPathElement>('[data-lung-outline]', root);
          const bronchialBranches = gsap.utils.toArray<SVGPathElement>('[data-bronchial-branch]', root);
          const bronchialFlow = root.querySelector<SVGPathElement>('[data-bronchial-flow]');
          const flowPoints = gsap.utils.toArray<SVGCircleElement>('[data-flow-point]', root);
          const waveRows = gsap.utils.toArray<HTMLElement>('[data-wave-row]', root);
          const waveViewports = gsap.utils.toArray<HTMLElement>('[data-wave-viewport]', root);
          const waveTracks = gsap.utils.toArray<HTMLElement>('[data-wave-track]', root);
          const waveCursors = gsap.utils.toArray<HTMLElement>('[data-wave-cursor]', root);
          const timelineStages = gsap.utils.toArray<HTMLElement>('[data-timeline-stage]', root);
          const recoveryIntro = root.querySelector<HTMLElement>('[data-recovery-intro]');
          const recoverySteps = gsap.utils.toArray<HTMLElement>('[data-recovery-step]', root);
          const monitorNote = root.querySelector<HTMLElement>('[data-monitor-note]');

          gsap.set(waveTracks, { xPercent: 0 });
          gsap.set(waveCursors, { autoAlpha: 0, xPercent: 0 });

          if (reduceMotion) {
            gsap.set(waveCursors, { display: 'none' });
            return;
          }

          const entryTargets = [
            shell,
            grid,
            scanlines,
            topbar,
            ...modules,
            lungStage,
            lungRings,
            ...waveRows,
            ...waveViewports,
            ...timelineStages,
            recoveryIntro,
            ...recoverySteps,
            monitorNote,
          ].filter(Boolean);

          gsap.set(shell, {
            autoAlpha: 0,
            scale: isMobile ? 0.992 : 0.985,
            transformOrigin: '50% 50%',
            y: isMobile ? 22 : 34,
          });
          gsap.set(grid, { autoAlpha: 0 });
          gsap.set(scanlines, { autoAlpha: 0 });
          gsap.set(topbar, { autoAlpha: 0, y: -10 });
          gsap.set(modules, { autoAlpha: 0, y: isMobile ? 14 : 20 });
          gsap.set(lungStage, { autoAlpha: 0, scale: 0.92, transformOrigin: '50% 52%' });
          gsap.set(lungRings, { autoAlpha: 0, rotation: -4, transformOrigin: '50% 50%' });
          gsap.set(lungOutlines, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(bronchialBranches, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(bronchialFlow, { autoAlpha: 0, strokeDashoffset: 0 });
          gsap.set(flowPoints, { autoAlpha: 0, scale: 0.35, transformOrigin: '50% 50%' });
          gsap.set(waveRows, { autoAlpha: 0, y: 10 });
          gsap.set(waveViewports, { clipPath: 'inset(0 100% 0 0)' });
          gsap.set(timelineStages, { autoAlpha: 0, y: 8 });
          gsap.set(recoveryIntro, { autoAlpha: 0, y: 12 });
          gsap.set(recoverySteps, { autoAlpha: 0, x: isMobile ? 0 : 14, y: isMobile ? 10 : 0 });
          gsap.set(monitorNote, { autoAlpha: 0, y: 8 });

          let isInView = false;
          let hasEntered = false;
          let entryCompleted = false;

          const continuousAnimations: gsap.core.Animation[] = [];

          const waveMotion = gsap.to(waveTracks, {
            duration: isMobile ? 14.5 : 12,
            ease: 'none',
            force3D: true,
            paused: true,
            repeat: -1,
            xPercent: -50,
          });
          continuousAnimations.push(waveMotion);

          if (lungBreath) {
            continuousAnimations.push(
              gsap.to(lungBreath, {
                duration: isMobile ? 3.2 : 2.85,
                ease: 'sine.inOut',
                paused: true,
                repeat: -1,
                scaleX: isMobile ? 1.012 : 1.018,
                scaleY: isMobile ? 1.018 : 1.026,
                svgOrigin: '180 198',
                yoyo: true,
              }),
            );
          }

          if (lungGlow) {
            continuousAnimations.push(
              gsap.to(lungGlow, {
                duration: isMobile ? 3.2 : 2.85,
                ease: 'sine.inOut',
                opacity: isMobile ? 0.78 : 0.72,
                paused: true,
                repeat: -1,
                yoyo: true,
              }),
            );
          }

          if (bronchialFlow) {
            continuousAnimations.push(
              gsap.to(bronchialFlow, {
                duration: isMobile ? 3.1 : 2.45,
                ease: 'none',
                paused: true,
                repeat: -1,
                strokeDashoffset: -36,
              }),
            );
          }

          if (flowPoints.length) {
            continuousAnimations.push(
              gsap.to(flowPoints, {
                autoAlpha: 0.98,
                duration: 1.15,
                ease: 'sine.inOut',
                paused: true,
                repeat: -1,
                scale: 1.35,
                stagger: {
                  amount: 0.85,
                  from: 'start',
                },
                yoyo: true,
              }),
            );
          }

          if (statusLight) {
            continuousAnimations.push(
              gsap.to(statusLight, {
                duration: 1.7,
                ease: 'sine.inOut',
                opacity: 0.68,
                paused: true,
                repeat: -1,
                scale: 1.2,
                yoyo: true,
              }),
            );
          }

          if (isDesktop) {
            waveCursors.forEach((cursor, index) => {
              const sweep = gsap.timeline({
                delay: index * 0.22,
                paused: true,
                repeat: -1,
                repeatDelay: 0.72,
              });

              sweep
                .set(cursor, { autoAlpha: 0, xPercent: 0 })
                .to(cursor, { autoAlpha: 0.7, duration: 0.14 })
                .to(
                  cursor,
                  {
                    duration: 4.2,
                    ease: 'none',
                    force3D: true,
                    xPercent: 100,
                  },
                  0,
                )
                .to(cursor, { autoAlpha: 0, duration: 0.18 }, 4.02);

              continuousAnimations.push(sweep);
            });
          }

          const shouldRun = () => isInView && entryCompleted && document.visibilityState === 'visible';

          const syncContinuousPlayback = () => {
            continuousAnimations.forEach((animation) => {
              if (shouldRun()) {
                animation.play();
              } else {
                animation.pause();
              }
            });
          };

          const entryTimeline = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
              entryCompleted = true;
              gsap.set(entryTargets, { clearProps: 'transform,opacity,visibility,willChange' });
              gsap.set(waveViewports, { clearProps: 'clipPath' });
              gsap.set(lungOutlines, { clearProps: 'strokeDasharray,strokeDashoffset' });
              gsap.set(bronchialBranches, { clearProps: 'strokeDasharray,strokeDashoffset' });
              syncContinuousPlayback();
            },
            paused: true,
          });

          entryTimeline
            .to(shell, { autoAlpha: 1, duration: 0.82, scale: 1, y: 0 })
            .to(topbar, { autoAlpha: 1, duration: 0.5, y: 0 }, 0.14)
            .to(grid, { autoAlpha: 1, duration: 0.8 }, 0.2)
            .to(scanlines, { autoAlpha: 0.5, duration: 0.75 }, 0.28)
            .to(modules, { autoAlpha: 1, duration: 0.64, stagger: 0.08, y: 0 }, 0.3)
            .to(lungStage, { autoAlpha: 1, duration: 0.8, scale: 1 }, 0.42)
            .to(lungRings, { autoAlpha: 1, duration: 0.75, rotation: 0 }, 0.48)
            .to(lungOutlines, { duration: 1.05, ease: 'power2.out', stagger: 0.08, strokeDashoffset: 0 }, 0.5)
            .to(
              bronchialBranches,
              {
                duration: 0.78,
                ease: 'power2.out',
                stagger: { amount: 0.72, from: 'start' },
                strokeDashoffset: 0,
              },
              0.66,
            )
            .to(bronchialFlow, { autoAlpha: 0.76, duration: 0.45 }, 1.03)
            .to(flowPoints, { autoAlpha: 0.72, duration: 0.34, scale: 1, stagger: 0.045 }, 0.98)
            .to(waveRows, { autoAlpha: 1, duration: 0.46, stagger: 0.11, y: 0 }, 0.62)
            .to(waveViewports, { clipPath: 'inset(0 0% 0 0)', duration: 0.94, ease: 'power2.inOut', stagger: 0.1 }, 0.72)
            .to(timelineStages, { autoAlpha: 1, duration: 0.4, stagger: 0.08, y: 0 }, 1.02)
            .to(recoveryIntro, { autoAlpha: 1, duration: 0.52, y: 0 }, 0.9)
            .to(recoverySteps, { autoAlpha: 1, duration: 0.54, stagger: 0.12, x: 0, y: 0 }, 1.02)
            .to(monitorNote, { autoAlpha: 1, duration: 0.45, y: 0 }, 1.34);

          const syncEntryPlayback = () => {
            const canRun = isInView && document.visibilityState === 'visible';

            if (!canRun) {
              entryTimeline.pause();
              syncContinuousPlayback();
              return;
            }

            if (!entryCompleted) {
              hasEntered = true;
              entryTimeline.play();
              return;
            }

            syncContinuousPlayback();
          };

          const trigger = ScrollTrigger.create({
            end: 'bottom 10%',
            invalidateOnRefresh: true,
            onEnter: () => {
              isInView = true;
              syncEntryPlayback();
            },
            onEnterBack: () => {
              isInView = true;
              syncEntryPlayback();
            },
            onLeave: () => {
              isInView = false;
              syncEntryPlayback();
            },
            onLeaveBack: () => {
              isInView = false;
              syncEntryPlayback();
            },
            start: 'top 82%',
            trigger: root,
          });

          const handleVisibilityChange = () => {
            if (hasEntered) {
              syncEntryPlayback();
            }
          };

          document.addEventListener('visibilitychange', handleVisibilityChange);

          return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            trigger.kill();
            entryTimeline.kill();
            continuousAnimations.forEach((animation) => animation.kill());
          };
        },
      );

      return () => media.revert();
    },
    { scope: rootRef },
  );
}
