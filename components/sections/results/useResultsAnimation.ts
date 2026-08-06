'use client';

import type { RefObject } from 'react';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

gsap.registerPlugin(useGSAP);

interface ResultsConditions {
  isExpandedDesktop: boolean;
  reduceMotion: boolean;
}

type AnimationTarget =
  | HTMLElement
  | SVGElement
  | Array<HTMLElement | SVGElement>
  | null;

export function useResultsAnimation(rootRef: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const media = gsap.matchMedia();

      media.add(
        {
          isExpandedDesktop: '(min-width: 1280px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isExpandedDesktop, reduceMotion } =
            context.conditions as unknown as ResultsConditions;

          if (reduceMotion) {
            clearSignaturePathStyles(root);
            return;
          }

          const eyebrow = root.querySelector<HTMLElement>('[data-results-eyebrow]');
          const titleLines = gsap.utils.toArray<HTMLElement>('[data-results-title-line]', root);
          const summary = root.querySelector<HTMLElement>('[data-results-summary]');
          const journey = root.querySelector<HTMLElement>('[data-results-journey]');
          const mobileControls = root.querySelector<HTMLElement>('[data-results-mobile-controls]');
          const shell = root.querySelector<HTMLElement>('[data-results-shell]');
          const topbar = root.querySelector<HTMLElement>('[data-results-topbar]');
          const desktopSteps = gsap.utils.toArray<HTMLElement>('[data-results-step]', root);
          const progressLine = root.querySelector<HTMLElement>('[data-results-progress-line]');
          const stepNodes = gsap.utils.toArray<HTMLElement>('[data-results-step-node]', root);
          const cards = gsap.utils.toArray<HTMLElement>('[data-results-card]', root);
          const chain = root.querySelector<HTMLElement>('[data-results-chain]');
          const mobileHint = root.querySelector<HTMLElement>('[data-results-mobile-hint]');
          const footer = root.querySelector<HTMLElement>('[data-results-footer]');
          const disclaimer = root.querySelector<HTMLElement>('[data-results-disclaimer]');
          const cta = root.querySelector<HTMLElement>('[data-results-cta]');
          const track = root.querySelector<HTMLElement>('[data-results-track]');

          let entryPlayed = false;
          const cardObservers: IntersectionObserver[] = [];

          const playEntry = () => {
            if (entryPlayed) {
              return;
            }

            entryPlayed = true;

            const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

            addFrom(timeline, eyebrow, { autoAlpha: 0, duration: 0.42, y: 12 }, 0);
            addFrom(
              timeline,
              titleLines,
              { autoAlpha: 0, duration: 0.72, stagger: 0.1, yPercent: 28 },
              0.08,
            );
            addFrom(
              timeline,
              summary,
              {
                autoAlpha: 0,
                duration: 0.6,
                x: isExpandedDesktop ? 18 : 0,
                y: isExpandedDesktop ? 0 : 14,
              },
              0.24,
            );
            addFrom(timeline, journey, { autoAlpha: 0, duration: 0.68, y: 24 }, 0.38);
            addFrom(timeline, shell, { autoAlpha: 0, duration: 0.72, scale: 0.992 }, 0.44);
            addFrom(timeline, mobileControls, { autoAlpha: 0, duration: 0.42, y: 8 }, 0.48);

            if (isExpandedDesktop) {
              addFrom(timeline, topbar, { autoAlpha: 0, duration: 0.42, y: -8 }, 0.56);
              addFrom(
                timeline,
                desktopSteps,
                { autoAlpha: 0, duration: 0.42, stagger: 0.08, y: 8 },
                0.62,
              );
              addFrom(
                timeline,
                progressLine,
                {
                  duration: 0.9,
                  ease: 'power2.inOut',
                  scaleX: 0,
                  transformOrigin: '0% 50%',
                },
                0.7,
              );
              addFrom(
                timeline,
                stepNodes,
                {
                  autoAlpha: 0,
                  duration: 0.38,
                  ease: 'back.out(1.8)',
                  scale: 0.35,
                  stagger: 0.11,
                  transformOrigin: '50% 50%',
                },
                0.82,
              );
              addFrom(
                timeline,
                cards,
                { autoAlpha: 0, duration: 0.6, stagger: 0.1, y: 24 },
                0.9,
              );

              cards.forEach((card, index) => {
                addSignatureReveal(timeline, card, 1.08 + index * 0.11);
              });

              addFrom(timeline, chain, { autoAlpha: 0, duration: 0.44, y: 8 }, 1.62);
              addFrom(timeline, footer, { autoAlpha: 0, duration: 0.56, y: 18 }, 1.7);
              addFrom(timeline, disclaimer, { autoAlpha: 0, duration: 0.38, y: 8 }, 1.82);
              addFrom(
                timeline,
                cta,
                {
                  autoAlpha: 0,
                  duration: 0.48,
                  ease: 'back.out(1.45)',
                  scale: 0.96,
                  y: 8,
                },
                1.88,
              );
            } else {
              addFrom(timeline, mobileHint, { autoAlpha: 0, duration: 0.38, x: -8 }, 0.76);
              addFrom(timeline, footer, { autoAlpha: 0, duration: 0.5, y: 18 }, 0.86);
              addFrom(timeline, disclaimer, { autoAlpha: 0, duration: 0.36, y: 8 }, 0.94);
              addFrom(
                timeline,
                cta,
                { autoAlpha: 0, duration: 0.44, scale: 0.96, y: 8 },
                1,
              );

              setupCompactCardReveals(cards, track, cardObservers);
            }
          };

          const rootObserver =
            typeof IntersectionObserver === 'undefined'
              ? null
              : new IntersectionObserver(
                  (entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                      playEntry();
                      rootObserver?.disconnect();
                    }
                  },
                  {
                    rootMargin: '0px 0px -10% 0px',
                    threshold: 0.08,
                  },
                );

          rootObserver?.observe(root);

          const initialFrame = requestAnimationFrame(() => {
            const bounds = root.getBoundingClientRect();

            if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > 0) {
              playEntry();
              rootObserver?.disconnect();
            }
          });

          if (!rootObserver) {
            playEntry();
          }

          return () => {
            cancelAnimationFrame(initialFrame);
            rootObserver?.disconnect();
            cardObservers.forEach((observer) => observer.disconnect());
            clearSignaturePathStyles(root);
          };
        },
      );

      return () => media.revert();
    },
    { scope: rootRef },
  );
}

function setupCompactCardReveals(
  cards: HTMLElement[],
  track: HTMLElement | null,
  observers: IntersectionObserver[],
) {
  if (cards.length === 0) {
    return;
  }

  const revealedCards = new WeakSet<Element>();

  const revealCard = (card: HTMLElement) => {
    if (revealedCards.has(card)) {
      return;
    }

    revealedCards.add(card);

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    timeline.from(card, {
      autoAlpha: 0,
      duration: 0.5,
      scale: 0.985,
      y: 16,
    });
    addSignatureReveal(timeline, card, 0.1);
  };

  revealCard(cards[0]);

  if (!track || typeof IntersectionObserver === 'undefined') {
    cards.slice(1).forEach(revealCard);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.38) {
          revealCard(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: track,
      threshold: [0.38, 0.55, 0.72],
    },
  );

  cards.slice(1).forEach((card) => observer.observe(card));
  observers.push(observer);
}

function addFrom(
  timeline: gsap.core.Timeline,
  target: AnimationTarget,
  vars: gsap.TweenVars,
  position: number,
) {
  if (!target || (Array.isArray(target) && target.length === 0)) {
    return;
  }

  timeline.from(target, vars, position);
}

function addSignatureReveal(
  timeline: gsap.core.Timeline,
  scope: ParentNode,
  position: number,
) {
  const elements = getSignatureElements(scope);

  if (elements.frames.length > 0) {
    timeline.from(elements.frames, { autoAlpha: 0, duration: 0.42, y: 10 }, position);
  }

  if (elements.grids.length > 0) {
    timeline.from(elements.grids, { autoAlpha: 0, duration: 0.5 }, position + 0.05);
  }

  if (elements.paths.length > 0) {
    gsap.set(elements.paths, { strokeDasharray: 1, strokeDashoffset: 1 });
    timeline.to(
      elements.paths,
      {
        duration: 0.72,
        ease: 'power2.inOut',
        stagger: 0.035,
        strokeDashoffset: 0,
      },
      position + 0.09,
    );
  }

  if (elements.fills.length > 0) {
    timeline.from(
      elements.fills,
      { autoAlpha: 0, duration: 0.44, stagger: 0.04 },
      position + 0.27,
    );
  }

  if (elements.nodes.length > 0) {
    timeline.from(
      elements.nodes,
      {
        autoAlpha: 0,
        duration: 0.34,
        ease: 'back.out(1.7)',
        scale: 0.45,
        stagger: 0.035,
        transformBox: 'fill-box',
        transformOrigin: '50% 50%',
      },
      position + 0.35,
    );
  }

  if (elements.labels.length > 0) {
    timeline.from(
      elements.labels,
      { autoAlpha: 0, duration: 0.3, stagger: 0.025, y: 2 },
      position + 0.39,
    );
  }

  timeline.call(() => clearSignaturePathStyles(scope), [], position + 1.06);
}

function clearSignaturePathStyles(scope: ParentNode) {
  const paths = gsap.utils.toArray<SVGPathElement>('[data-signature-path]', scope);

  if (paths.length > 0) {
    gsap.set(paths, { clearProps: 'strokeDasharray,strokeDashoffset' });
  }
}

function getSignatureElements(scope: ParentNode) {
  return {
    fills: gsap.utils.toArray<SVGElement>('[data-signature-fill]', scope),
    frames: gsap.utils.toArray<HTMLElement>('[data-result-signature]', scope),
    grids: gsap.utils.toArray<SVGElement>('[data-signature-grid]', scope),
    labels: gsap.utils.toArray<SVGElement>('[data-signature-label]', scope),
    nodes: gsap.utils.toArray<SVGElement>('[data-signature-node]', scope),
    paths: gsap.utils.toArray<SVGPathElement>('[data-signature-path]', scope),
  };
}
