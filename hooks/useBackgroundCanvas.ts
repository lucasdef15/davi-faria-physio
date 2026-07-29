'use client';

import type { RefObject } from 'react';

import { useEffect } from 'react';

import type {
  CanvasPoint,
  CanvasPulseSample,
  CanvasPulseState,
  CanvasQualityTier,
  CanvasStaticAmbient,
} from '@/hooks/hero-canvas/types';

import { DESKTOP_FLOW_LINES, INTERACTIVE_SELECTOR, MOBILE_FLOW_LINES, POINTER_MOVE_TOLERANCE } from '@/hooks/hero-canvas/constants';
import {
  getCanvasCapability,
  getCanvasQualityProfile,
  getCanvasRenderScale,
  getInitialCanvasQualityTier,
  reduceCanvasQuality,
} from '@/hooks/hero-canvas/quality';
import {
  createParticles,
  createPointBuffers,
  createStaticAmbient,
  drawAmbientField,
  drawFlowLine,
  drawFlowMarkers,
  drawParticles,
  drawPulseAura,
  populateFlowPoints,
  updatePulseSample,
} from '@/hooks/hero-canvas/renderer';
import { markIosDiagnosticStage } from '@/lib/ios-diagnostics';
import { getMediaQuery, subscribeToMediaQuery } from '@/lib/media-query';

interface PointerGesture {
  eligible: boolean;
  id: number;
  moved: boolean;
  x: number;
  y: number;
}

interface UseBackgroundCanvasOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  desktopFps?: number;
  interactionRootSelector?: string;
  mobileFps?: number;
}

const INITIAL_PULSE_SAMPLE: CanvasPulseSample = {
  attraction: 0,
  deformation: 0,
  finished: false,
  intensity: 0,
  progress: 0,
};

const INITIAL_POINT: CanvasPoint = { x: 0, y: 0 };

/**
 * The canvas is deliberately isolated from the hero's content. If browser APIs or
 * rendering fail, the canvas becomes transparent and the CSS hero remains complete.
 */
export function useBackgroundCanvas({
  canvasRef,
  desktopFps = 30,
  interactionRootSelector,
  mobileFps = 18,
}: UseBackgroundCanvasOptions): void {
  useEffect(() => {
    if (typeof CanvasRenderingContext2D === 'undefined') {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    let context: CanvasRenderingContext2D | null = null;

    try {
      context = canvas.getContext('2d', { alpha: true, desynchronized: true });
    } catch {
      context = null;
    }

    if (!context) {
      try {
        context = canvas.getContext('2d', { alpha: true });
      } catch {
        return;
      }
    }

    if (!context) {
      return;
    }

    markIosDiagnosticStage('Canvas criado');

    try {
      const interactionRoot = interactionRootSelector
        ? canvas.closest<HTMLElement>(interactionRootSelector)
        : canvas.parentElement;
      const previousHeroQuality = interactionRoot?.dataset.heroQuality;
      const mobileQuery = getMediaQuery('(max-width: 767px)');
      const finePointerQuery = getMediaQuery('(hover: hover) and (pointer: fine)');
      const reduceMotionQuery = getMediaQuery('(prefers-reduced-motion: reduce)');
      const canAnimate =
        typeof window.requestAnimationFrame === 'function' &&
        typeof window.cancelAnimationFrame === 'function';
      const capability = getCanvasCapability(navigator, window.devicePixelRatio || 1);

      let width = 0;
      let height = 0;
      let animationFrame = 0;
      let resizeFrame = 0;
      let resizeTimer = 0;
      let startTimer = 0;
      let lastFrameTime = 0;
      let lastDrawTime = 0;
      let isRunning = false;
      let isIntersecting = true;
      let animationEnabled = false;
      let slowDrawCount = 0;
      let qualityTier: CanvasQualityTier = getInitialCanvasQualityTier(capability);
      let particles = createParticles(0, 0, 0);
      let pointBuffers: CanvasPoint[][] = [];
      let staticAmbient: CanvasStaticAmbient | null = null;
      let pointerGesture: null | PointerGesture = null;
      let pulse: CanvasPulseState | null = null;
      let pointerTargetX = 0;
      let pointerTargetY = 0;
      let pointerOffsetX = 0;
      let pointerOffsetY = 0;
      let reportedFirstFrame = false;
      let renderedConfiguration = '';

      const pulseSample: CanvasPulseSample = { ...INITIAL_PULSE_SAMPLE };
      const markerPoint: CanvasPoint = { ...INITIAL_POINT };

      const getQualityProfile = () =>
        getCanvasQualityProfile(qualityTier, isMobileViewport(), desktopFps, mobileFps);

      function isMobileViewport() {
        return mobileQuery.matches ?? false;
      }

      const lowerQualityForViewport = () => {
        const viewportTier = getInitialCanvasQualityTier(capability);

        if (viewportTier === 'low' && qualityTier !== 'low') {
          qualityTier = 'low';
        } else if (viewportTier === 'medium' && qualityTier === 'high') {
          qualityTier = 'medium';
        }
      };

      const getCanvasPoint = (clientX: number, clientY: number): CanvasPoint => {
        const bounds = canvas.getBoundingClientRect();

        return {
          x: clamp(clientX - bounds.left, 0, bounds.width),
          y: clamp(clientY - bounds.top, 0, bounds.height),
        };
      };

      const isIgnoredTarget = (target: EventTarget | null) =>
        target instanceof Element && target.closest(INTERACTIVE_SELECTOR) !== null;

      const rebuildCanvas = () => {
        lowerQualityForViewport();
        interactionRoot?.setAttribute('data-hero-quality', qualityTier);

        const bounds = canvas.getBoundingClientRect();
        width = Math.max(1, Math.round(bounds.width));
        height = Math.max(1, Math.round(bounds.height));

        const quality = getQualityProfile();
        const dpr = getCanvasRenderScale(width, height, window.devicePixelRatio || 1, quality);
        const pixelWidth = Math.max(1, Math.round(width * dpr));
        const pixelHeight = Math.max(1, Math.round(height * dpr));
        const nextConfiguration = [
          qualityTier,
          width,
          height,
          pixelWidth,
          pixelHeight,
          isMobileViewport(),
        ].join(':');

        if (renderedConfiguration === nextConfiguration) {
          return;
        }

        renderedConfiguration = nextConfiguration;

        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
          canvas.width = pixelWidth;
          canvas.height = pixelHeight;
        }

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.imageSmoothingEnabled = true;

        const flowLines = isMobileViewport() ? MOBILE_FLOW_LINES : DESKTOP_FLOW_LINES;
        particles = createParticles(quality.particleCount, width, height);
        pointBuffers = createPointBuffers(flowLines, quality.pointCount);
        staticAmbient = quality.simplifiedAmbient
          ? createStaticAmbient(context, width, height, isMobileViewport())
          : null;
        lastDrawTime = 0;
        drawFrame(0, true);
      };

      const drawFrame = (time: number, staticFrame = false) => {
        if (width <= 0 || height <= 0) {
          return;
        }

        const quality = getQualityProfile();
        const isMobile = isMobileViewport();
        const animationTime = staticFrame ? 0 : time * 0.001;
        const deltaSeconds = staticFrame
          ? 0
          : Math.min(0.08, Math.max(0.001, (time - lastDrawTime) / 1000 || 0.016));

        lastDrawTime = time;
        const followStrength = staticFrame ? 1 : 1 - Math.exp(-6.2 * deltaSeconds);
        pointerOffsetX += (pointerTargetX - pointerOffsetX) * followStrength;
        pointerOffsetY += (pointerTargetY - pointerOffsetY) * followStrength;

        updatePulseSample(pulse, time, pulseSample);

        if (pulse && pulseSample.finished) {
          pulse = null;
        }

        const pulseDirectionX = pulse ? (pulse.x / width - 0.5) * 2 : 0;
        const pulseDirectionY = pulse ? (pulse.y / height - 0.5) * 2 : 0;
        const attractionLimit = isMobile ? 4 : 7;
        const fieldOffsetX = pointerOffsetX + pulseDirectionX * attractionLimit * pulseSample.attraction;
        const fieldOffsetY = pointerOffsetY + pulseDirectionY * attractionLimit * pulseSample.attraction;
        const flowLines = isMobile ? MOBILE_FLOW_LINES : DESKTOP_FLOW_LINES;
        const breathing = staticFrame ? 0 : Math.sin(animationTime * 0.5) * 0.006;
        const phase = staticFrame ? 0.38 : animationTime * 0.055;

        context.clearRect(0, 0, width, height);
        drawAmbientField(
          context,
          width,
          height,
          animationTime,
          pulse,
          pulseSample,
          isMobile,
          staticAmbient,
        );
        drawParticles(context, particles, animationTime, staticFrame, pulse, pulseSample.intensity);

        for (let lineIndex = 0; lineIndex < flowLines.length; lineIndex += 1) {
          const line = flowLines[lineIndex];
          const points = pointBuffers[lineIndex];

          if (!line || !points) {
            continue;
          }

          populateFlowPoints({
            breathing,
            fieldOffsetX,
            fieldOffsetY,
            height,
            line,
            lineIndex,
            phase,
            points,
            pulse,
            pulseSample,
            width,
          });
          drawFlowLine(context, points, line, lineIndex, pulse, pulseSample, isMobile);
          drawFlowMarkers(context, points, line, pulse, pulseSample, isMobile, markerPoint);
        }

        if (pulse && pulseSample.intensity > 0 && !quality.simplifiedAmbient) {
          drawPulseAura(context, pulse, pulseSample.progress, isMobile);
        }

        if (!reportedFirstFrame) {
          reportedFirstFrame = true;
          markIosDiagnosticStage('Primeiro frame do canvas');
        }
      };

      const stopAnimation = () => {
        if (!isRunning) {
          return;
        }

        isRunning = false;
        window.cancelAnimationFrame(animationFrame);
      };

      const shouldAnimate = () => {
        const { fps } = getQualityProfile();

        return (
          canAnimate &&
          animationEnabled &&
          fps > 0 &&
          isIntersecting &&
          !document.hidden &&
          !(reduceMotionQuery.matches ?? false)
        );
      };

      const syncAnimationState = () => {
        if (!shouldAnimate()) {
          stopAnimation();
          return;
        }

        if (isRunning) {
          return;
        }

        isRunning = true;
        lastFrameTime = 0;
        lastDrawTime = 0;
        animationFrame = window.requestAnimationFrame(animationLoop);
      };

      const recordDrawCost = (drawCost: number) => {
        const threshold = qualityTier === 'high' ? 18 : 14;
        const framesBeforeReduction = qualityTier === 'high' ? 4 : 3;
        slowDrawCount = drawCost > threshold ? slowDrawCount + 1 : Math.max(0, slowDrawCount - 1);

        if (slowDrawCount < framesBeforeReduction || qualityTier === 'low') {
          return;
        }

        qualityTier = reduceCanvasQuality(qualityTier);
        slowDrawCount = 0;
        rebuildCanvas();
      };

      const animationLoop = (time: number) => {
        if (!isRunning) {
          return;
        }

        const { fps } = getQualityProfile();
        const frameInterval = fps > 0 ? 1000 / fps : Number.POSITIVE_INFINITY;
        const elapsed = time - lastFrameTime;

        if (elapsed >= frameInterval) {
          lastFrameTime = time - (elapsed % frameInterval);
          const drawStartedAt = getCurrentTime();
          drawFrame(time);
          recordDrawCost(getCurrentTime() - drawStartedAt);
        }

        animationFrame = window.requestAnimationFrame(animationLoop);
      };

      const triggerPulse = (clientX: number, clientY: number) => {
        const quality = getQualityProfile();

        if (!quality.interactionEnabled || reduceMotionQuery.matches) {
          return;
        }

        const point = getCanvasPoint(clientX, clientY);
        pulse = { startedAt: getCurrentTime(), x: point.x, y: point.y };
        syncAnimationState();
      };

      const updatePointerTarget = (clientX: number, clientY: number) => {
        if (!finePointerQuery.matches || reduceMotionQuery.matches || !getQualityProfile().interactionEnabled) {
          return;
        }

        const point = getCanvasPoint(clientX, clientY);
        pointerTargetX = (point.x / Math.max(1, width) - 0.5) * 9;
        pointerTargetY = (point.y / Math.max(1, height) - 0.5) * 6;
      };

      const resetPointerTarget = () => {
        pointerTargetX = 0;
        pointerTargetY = 0;
      };

      const handlePointerDown = (event: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0 || !getQualityProfile().interactionEnabled) {
          return;
        }

        pointerGesture = {
          eligible: !isIgnoredTarget(event.target),
          id: event.pointerId,
          moved: false,
          x: event.clientX,
          y: event.clientY,
        };
      };

      const handlePointerMove = (event: PointerEvent) => {
        updatePointerTarget(event.clientX, event.clientY);

        if (!pointerGesture || pointerGesture.id !== event.pointerId) {
          return;
        }

        const distanceX = event.clientX - pointerGesture.x;
        const distanceY = event.clientY - pointerGesture.y;

        if (distanceX * distanceX + distanceY * distanceY > POINTER_MOVE_TOLERANCE ** 2) {
          pointerGesture.moved = true;
        }
      };

      const handlePointerUp = (event: PointerEvent) => {
        const gesture = pointerGesture;
        pointerGesture = null;

        if (
          !gesture ||
          gesture.id !== event.pointerId ||
          gesture.moved ||
          !gesture.eligible ||
          isIgnoredTarget(event.target)
        ) {
          return;
        }

        triggerPulse(event.clientX, event.clientY);
      };

      const scheduleResize = () => {
        if (!canAnimate) {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(() => {
            rebuildCanvas();
            syncAnimationState();
          }, 32);
          return;
        }

        window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(() => {
          rebuildCanvas();
          syncAnimationState();
        });
      };

      const handleMediaChange = () => {
        resetPointerTarget();
        pointerGesture = null;
        pulse = null;
        scheduleResize();
      };

      const intersectionObserver =
        typeof window.IntersectionObserver === 'function'
          ? new IntersectionObserver(
              ([entry]) => {
                isIntersecting = entry?.isIntersecting ?? true;
                syncAnimationState();
              },
              { rootMargin: '120px 0px', threshold: 0.01 },
            )
          : null;
      const resizeObserver =
        typeof window.ResizeObserver === 'function' ? new ResizeObserver(scheduleResize) : null;
      const visualViewport = window.visualViewport;

      rebuildCanvas();
      intersectionObserver?.observe(canvas);
      resizeObserver?.observe(canvas);

      if (!resizeObserver) {
        window.addEventListener('resize', scheduleResize, { passive: true });
      }

      window.addEventListener('orientationchange', handleMediaChange, { passive: true });
      visualViewport?.addEventListener('resize', scheduleResize, { passive: true });
      interactionRoot?.addEventListener('pointerdown', handlePointerDown, { passive: true });
      interactionRoot?.addEventListener('pointermove', handlePointerMove, { passive: true });
      interactionRoot?.addEventListener('pointerup', handlePointerUp, { passive: true });
      interactionRoot?.addEventListener('pointercancel', handleMediaChange, { passive: true });
      interactionRoot?.addEventListener('pointerleave', resetPointerTarget, { passive: true });
      document.addEventListener('visibilitychange', syncAnimationState);

      const unsubscribeMobileQuery = subscribeToMediaQuery(mobileQuery, handleMediaChange);
      const unsubscribeFinePointerQuery = subscribeToMediaQuery(finePointerQuery, handleMediaChange);
      const unsubscribeReduceMotionQuery = subscribeToMediaQuery(reduceMotionQuery, handleMediaChange);

      startTimer = window.setTimeout(() => {
        animationEnabled = true;
        syncAnimationState();
      }, 160);

      return () => {
        stopAnimation();
        window.clearTimeout(startTimer);
        if (canAnimate) {
          window.cancelAnimationFrame(resizeFrame);
        }
        window.clearTimeout(resizeTimer);
        intersectionObserver?.disconnect();
        resizeObserver?.disconnect();

        if (!resizeObserver) {
          window.removeEventListener('resize', scheduleResize);
        }

        window.removeEventListener('orientationchange', handleMediaChange);
        visualViewport?.removeEventListener('resize', scheduleResize);
        interactionRoot?.removeEventListener('pointerdown', handlePointerDown);
        interactionRoot?.removeEventListener('pointermove', handlePointerMove);
        interactionRoot?.removeEventListener('pointerup', handlePointerUp);
        interactionRoot?.removeEventListener('pointercancel', handleMediaChange);
        interactionRoot?.removeEventListener('pointerleave', resetPointerTarget);
        document.removeEventListener('visibilitychange', syncAnimationState);
        unsubscribeMobileQuery();
        unsubscribeFinePointerQuery();
        unsubscribeReduceMotionQuery();

        if (interactionRoot) {
          if (previousHeroQuality === undefined) {
            delete interactionRoot.dataset.heroQuality;
          } else {
            interactionRoot.dataset.heroQuality = previousHeroQuality;
          }
        }

        canvas.width = 0;
        canvas.height = 0;
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Hero canvas was disabled after an initialization error.', error);
      }
    }
  }, [canvasRef, desktopFps, interactionRootSelector, mobileFps]);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function getCurrentTime(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}
