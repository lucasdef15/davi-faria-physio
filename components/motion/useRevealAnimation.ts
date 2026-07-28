'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type RefObject, useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type RevealVariant = 'default' | 'media' | 'panel';

interface RevealAnimationOptions {
  /**
   * Desativa todas as animações deste container.
   */
  disabled?: boolean;

  /**
   * Duração padrão da animação.
   */
  duration?: number;

  /**
   * Curva de movimento padrão.
   */
  ease?: string;

  /**
   * Exibe os marcadores do ScrollTrigger.
   * Use somente durante desenvolvimento.
   */
  markers?: boolean;

  /**
   * Mantém a animação executando apenas uma vez.
   */
  once?: boolean;

  /**
   * Seletor dos elementos que serão animados
   * dentro do container retornado pelo hook.
   */
  selector?: string;

  /**
   * Posição em que a animação começa.
   *
   * Exemplo:
   * "top 86%" significa que o reveal começa quando
   * o topo do elemento alcança 86% da viewport.
   */
  start?: string;
}

interface RevealAnimationState {
  autoAlpha: number;
  clearProps: string;
  duration: number;
  ease: string;
  scale?: number;
  y: number;
}

interface RevealInitialState {
  autoAlpha: number;
  scale?: number;
  y: number;
}

interface UseRevealAnimationResult<T extends HTMLElement> {
  containerRef: RefObject<null | T>;
}

/**
 * Cria reveals individuais para elementos marcados com `data-reveal`
 * dentro do container retornado.
 *
 * Variações disponíveis:
 *
 * data-reveal="default"
 * data-reveal="media"
 * data-reveal="panel"
 *
 * Elementos sem valor, como `data-reveal`, usam a variação "default".
 */
export function useRevealAnimation<T extends HTMLElement = HTMLElement>(
  options: RevealAnimationOptions = {},
): UseRevealAnimationResult<T> {
  const containerRef = useRef<T>(null);

  const {
    disabled = false,
    duration = 0.9,
    ease = 'power3.out',
    markers = false,
    once = true,
    selector = '[data-reveal]',
    start = 'top 86%',
  } = options;

  useGSAP(
    () => {
      const container = containerRef.current;

      if (!container || disabled) {
        return;
      }

      const revealElements = gsap.utils.toArray<HTMLElement>(selector, container);

      if (revealElements.length === 0) {
        return;
      }

      const mediaQuery = gsap.matchMedia();

      mediaQuery.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          /*
           * Em dispositivos com redução de movimento,
           * garantimos que todo o conteúdo fique imediatamente
           * visível e sem transformações.
           */
          if (reduceMotion) {
            gsap.set(revealElements, {
              autoAlpha: 1,
              clearProps: 'transform,opacity,visibility',
            });

            return;
          }

          revealElements.forEach((element) => {
            const variant = getRevealVariant(element);

            const initialState = getInitialState(variant, isMobile);

            const animationState = getAnimationState({
              duration,
              ease,
              isMobile,
              variant,
            });

            gsap.fromTo(element, initialState, {
              ...animationState,

              scrollTrigger: {
                invalidateOnRefresh: true,
                markers,
                once,
                start,
                toggleActions: once ? 'play none none none' : 'play none none reverse',
                trigger: element,
              },
            });
          });
        },
      );

      /*
       * O gsap.matchMedia() também possui seu próprio cleanup.
       * O useGSAP cuida das animações e ScrollTriggers criados
       * dentro de seu contexto.
       */
      return () => {
        mediaQuery.revert();
      };
    },
    {
      dependencies: [selector, start, duration, ease, once, disabled, markers],
      revertOnUpdate: true,
      scope: containerRef,
    },
  );

  return {
    containerRef,
  };
}

function getAnimationState({
  duration,
  ease,
  isMobile,
  variant,
}: {
  duration: number;
  ease: string;
  isMobile: boolean;
  variant: RevealVariant;
}): RevealAnimationState {
  /*
   * No mobile diminuímos um pouco a duração.
   * A animação continua elegante, mas responde
   * mais rapidamente durante a rolagem.
   */
  const durationFactor = isMobile ? 0.88 : 1;

  const baseState: RevealAnimationState = {
    autoAlpha: 1,
    clearProps: 'transform,opacity,visibility',
    duration: duration * durationFactor,
    ease,
    y: 0,
  };

  switch (variant) {
    case 'media':
    case 'panel':
      return {
        ...baseState,
        scale: 1,
      };

    case 'default':
    default:
      return baseState;
  }
}

function getInitialState(variant: RevealVariant, isMobile: boolean): RevealInitialState {
  const mobileFactor = isMobile ? 0.72 : 1;

  switch (variant) {
    case 'media':
      return {
        autoAlpha: 0,
        scale: 0.985,
        y: 30 * mobileFactor,
      };

    case 'panel':
      return {
        autoAlpha: 0,
        scale: 0.992,
        y: 38 * mobileFactor,
      };

    case 'default':
    default:
      return {
        autoAlpha: 0,
        y: 26 * mobileFactor,
      };
  }
}

function getRevealVariant(element: HTMLElement): RevealVariant {
  const value = element.dataset.reveal;

  if (value === 'media' || value === 'panel' || value === 'default') {
    return value;
  }

  return 'default';
}
