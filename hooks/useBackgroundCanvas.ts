'use client';

import type { RefObject } from 'react';

import { useEffect } from 'react';

import { subscribeToMediaQuery } from '@/lib/media-query';

interface FlowLineDefinition {
  alpha: number;
  amplitude: number;
  baseY: number;
  frequency: number;
  markerPositions: readonly number[];
  overscan: number;
  phase: number;
  slope: number;
  width: number;
}

interface NavigatorWithMemory extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

interface Particle {
  alpha: number;
  phase: number;
  radius: number;
  x: number;
  y: number;
}

interface Point {
  x: number;
  y: number;
}

interface PointerGesture {
  eligible: boolean;
  id: number;
  moved: boolean;
  x: number;
  y: number;
}

interface PulseSample {
  attraction: number;
  deformation: number;
  finished: boolean;
  intensity: number;
  progress: number;
}

interface PulseState {
  startedAt: number;
  x: number;
  y: number;
}

interface QualityProfile {
  dprLimit: number;
  fps: number;
  particleCount: number;
  pointCount: number;
}

interface UseBackgroundCanvasOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  desktopFps?: number;
  interactionRootSelector?: string;
  mobileFps?: number;
}

const TAU = Math.PI * 2;
const PULSE_DURATION = 1250;
const POINTER_MOVE_TOLERANCE = 10;
const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[data-hero-ignore-interaction]',
].join(',');

const MOBILE_FLOW_LINES: readonly FlowLineDefinition[] = [
  {
    alpha: 0.22,
    amplitude: 0.047,
    baseY: 0.25,
    frequency: 0.72,
    markerPositions: [0.24, 0.69],
    overscan: 0.34,
    phase: 0.08,
    slope: 0.22,
    width: 1.15,
  },
  {
    alpha: 0.12,
    amplitude: 0.034,
    baseY: 0.41,
    frequency: 0.82,
    markerPositions: [0.52],
    overscan: 0.3,
    phase: 0.43,
    slope: -0.16,
    width: 0.9,
  },
  {
    alpha: 0.16,
    amplitude: 0.052,
    baseY: 0.61,
    frequency: 0.64,
    markerPositions: [0.34, 0.81],
    overscan: 0.35,
    phase: 0.71,
    slope: 0.19,
    width: 1,
  },
  {
    alpha: 0.075,
    amplitude: 0.031,
    baseY: 0.75,
    frequency: 0.88,
    markerPositions: [],
    overscan: 0.28,
    phase: 0.92,
    slope: -0.11,
    width: 0.8,
  },
];

const DESKTOP_FLOW_LINES: readonly FlowLineDefinition[] = [
  {
    alpha: 0.2,
    amplitude: 0.055,
    baseY: 0.27,
    frequency: 0.68,
    markerPositions: [0.19, 0.73],
    overscan: 0.18,
    phase: 0.08,
    slope: 0.08,
    width: 1.2,
  },
  {
    alpha: 0.105,
    amplitude: 0.038,
    baseY: 0.42,
    frequency: 0.78,
    markerPositions: [0.48],
    overscan: 0.16,
    phase: 0.4,
    slope: -0.055,
    width: 0.9,
  },
  {
    alpha: 0.145,
    amplitude: 0.05,
    baseY: 0.6,
    frequency: 0.63,
    markerPositions: [0.28, 0.82],
    overscan: 0.2,
    phase: 0.7,
    slope: 0.075,
    width: 1.05,
  },
  {
    alpha: 0.065,
    amplitude: 0.034,
    baseY: 0.74,
    frequency: 0.84,
    markerPositions: [],
    overscan: 0.16,
    phase: 0.94,
    slope: -0.045,
    width: 0.8,
  },
];

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

    try {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const context = canvas.getContext('2d', {
        alpha: true,
        desynchronized: true,
      });

      if (!context) {
        return;
      }

    const interactionRoot = interactionRootSelector
      ? canvas.closest<HTMLElement>(interactionRootSelector)
      : canvas.parentElement;

    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const navigatorInfo = navigator as NavigatorWithMemory;
    const processorCount = navigator.hardwareConcurrency;
    const memory = navigatorInfo.deviceMemory;

    const isLowCapacity =
      navigatorInfo.connection?.saveData === true ||
      (processorCount !== undefined && processorCount <= 2) ||
      (memory !== undefined && memory <= 2);
    const isMediumCapacity =
      (processorCount !== undefined && processorCount <= 4) ||
      (memory !== undefined && memory <= 4);

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let resizeFrame = 0;
    let startTimer = 0;
    let lastFrameTime = 0;
    let lastDrawTime = 0;
    let isRunning = false;
    let isIntersecting = true;
    let animationEnabled = false;
    let particles: Particle[] = [];
    let pointerGesture: null | PointerGesture = null;
    let pulse: null | PulseState = null;

    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerOffsetX = 0;
    let pointerOffsetY = 0;

    const getQualityProfile = (): QualityProfile => {
      const isMobile = mobileQuery.matches;

      if (isLowCapacity) {
        return {
          dprLimit: 1,
          fps: 12,
          particleCount: 2,
          pointCount: 28,
        };
      }

      if (isMobile || isMediumCapacity) {
        return {
          dprLimit: isMobile ? 1.15 : 1.25,
          fps: isMobile ? Math.min(mobileFps, 16) : Math.min(desktopFps, 20),
          particleCount: isMobile ? 5 : 6,
          pointCount: isMobile ? 36 : 42,
        };
      }

      return {
        dprLimit: 1.5,
        fps: desktopFps,
        particleCount: 11,
        pointCount: 62,
      };
    };

    const getCanvasPoint = (clientX: number, clientY: number): Point => {
      const bounds = canvas.getBoundingClientRect();

      return {
        x: clamp(clientX - bounds.left, 0, bounds.width),
        y: clamp(clientY - bounds.top, 0, bounds.height),
      };
    };

    const isIgnoredTarget = (target: EventTarget | null) =>
      target instanceof Element && target.closest(INTERACTIVE_SELECTOR) !== null;

    const rebuildCanvas = () => {
      const bounds = canvas.getBoundingClientRect();

      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));

      const quality = getQualityProfile();
      const dpr = Math.min(window.devicePixelRatio || 1, quality.dprLimit);
      const pixelWidth = Math.max(1, Math.round(width * dpr));
      const pixelHeight = Math.max(1, Math.round(height * dpr));

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = true;

      particles = createParticles(quality.particleCount, width, height);
      lastDrawTime = 0;

      drawFrame(0, true);
    };

    const drawFrame = (time: number, staticFrame = false) => {
      if (width <= 0 || height <= 0) {
        return;
      }

      const quality = getQualityProfile();
      const isMobile = mobileQuery.matches;
      const animationTime = staticFrame ? 0 : time * 0.001;
      const deltaSeconds = staticFrame
        ? 0
        : Math.min(0.08, Math.max(0.001, (time - lastDrawTime) / 1000 || 0.016));

      lastDrawTime = time;

      const followStrength = staticFrame ? 1 : 1 - Math.exp(-6.2 * deltaSeconds);

      pointerOffsetX += (pointerTargetX - pointerOffsetX) * followStrength;
      pointerOffsetY += (pointerTargetY - pointerOffsetY) * followStrength;

      const pulseSample = getPulseSample(pulse, time);

      if (pulse && pulseSample.finished) {
        pulse = null;
      }

      const pulseDirectionX = pulse ? (pulse.x / width - 0.5) * 2 : 0;
      const pulseDirectionY = pulse ? (pulse.y / height - 0.5) * 2 : 0;
      const attractionLimit = isMobile ? 4 : 7;

      const fieldOffsetX =
        pointerOffsetX + pulseDirectionX * attractionLimit * pulseSample.attraction;
      const fieldOffsetY =
        pointerOffsetY + pulseDirectionY * attractionLimit * pulseSample.attraction;

      context.clearRect(0, 0, width, height);

      drawAmbientField(context, width, height, animationTime, pulse, pulseSample, isMobile);

      drawParticles(context, particles, animationTime, staticFrame, {
        pulse,
        pulseIntensity: pulseSample.intensity,
      });

      const flowLines = isMobile ? MOBILE_FLOW_LINES : DESKTOP_FLOW_LINES;
      const breathing = staticFrame ? 0 : Math.sin(animationTime * 0.5) * 0.006;
      const phase = staticFrame ? 0.38 : animationTime * 0.055;

      flowLines.forEach((line, lineIndex) => {
        const points = createFlowPoints({
          breathing,
          fieldOffsetX,
          fieldOffsetY,
          height,
          line,
          lineIndex,
          phase,
          pointCount: quality.pointCount,
          pulse,
          pulseSample,
          width,
        });

        drawFlowLine(context, points, line, lineIndex, pulse, pulseSample, isMobile);
        drawFlowMarkers(context, points, line, pulse, pulseSample, isMobile);
      });

      if (pulse && pulseSample.intensity > 0) {
        drawPulseAura(context, pulse, pulseSample.progress, isMobile);
      }
    };

    const stopAnimation = () => {
      if (!isRunning) {
        return;
      }

      isRunning = false;
      window.cancelAnimationFrame(animationFrame);
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
        drawFrame(time);
      }

      animationFrame = window.requestAnimationFrame(animationLoop);
    };

    const shouldAnimate = () => {
      const { fps } = getQualityProfile();

      return (
        animationEnabled &&
        fps > 0 &&
        isIntersecting &&
        !document.hidden &&
        !reduceMotionQuery.matches
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

    const triggerPulse = (clientX: number, clientY: number) => {
      if (reduceMotionQuery.matches || getQualityProfile().fps <= 0) {
        return;
      }

      const point = getCanvasPoint(clientX, clientY);

      pulse = {
        startedAt: performance.now(),
        x: point.x,
        y: point.y,
      };

      syncAnimationState();
    };

    const updatePointerTarget = (clientX: number, clientY: number) => {
      if (!finePointerQuery.matches || reduceMotionQuery.matches) {
        return;
      }

      const point = getCanvasPoint(clientX, clientY);
      const normalizedX = point.x / Math.max(1, width) - 0.5;
      const normalizedY = point.y / Math.max(1, height) - 0.5;

      pointerTargetX = normalizedX * 9;
      pointerTargetY = normalizedY * 6;
    };

    const resetPointerTarget = () => {
      pointerTargetX = 0;
      pointerTargetY = 0;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) {
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

      if (
        distanceX * distanceX + distanceY * distanceY >
        POINTER_MOVE_TOLERANCE * POINTER_MOVE_TOLERANCE
      ) {
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

    const handlePointerCancel = () => {
      pointerGesture = null;
    };

    const scheduleResize = () => {
      window.cancelAnimationFrame(resizeFrame);

      resizeFrame = window.requestAnimationFrame(() => {
        rebuildCanvas();
        syncAnimationState();
      });
    };

    const handleVisibilityChange = () => {
      syncAnimationState();
    };

    const handleMediaChange = () => {
      resetPointerTarget();
      pointerGesture = null;
      pulse = null;
      scheduleResize();
    };

    const intersectionObserver =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            ([entry]) => {
              isIntersecting = entry?.isIntersecting ?? true;
              syncAnimationState();
            },
            {
              rootMargin: '120px 0px',
              threshold: 0.01,
            },
          )
        : null;

    const resizeObserver =
      'ResizeObserver' in window
        ? new ResizeObserver(() => {
            scheduleResize();
          })
        : null;

    rebuildCanvas();

    intersectionObserver?.observe(canvas);
    resizeObserver?.observe(canvas);

    if (!resizeObserver) {
      window.addEventListener('resize', scheduleResize, { passive: true });
    }

    interactionRoot?.addEventListener('pointerdown', handlePointerDown, {
      passive: true,
    });
    interactionRoot?.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });
    interactionRoot?.addEventListener('pointerup', handlePointerUp, {
      passive: true,
    });
    interactionRoot?.addEventListener('pointercancel', handlePointerCancel, {
      passive: true,
    });
    interactionRoot?.addEventListener('pointerleave', resetPointerTarget, {
      passive: true,
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const unsubscribeMobileQuery = subscribeToMediaQuery(mobileQuery, handleMediaChange);
    const unsubscribeFinePointerQuery = subscribeToMediaQuery(finePointerQuery, handleMediaChange);
    const unsubscribeReduceMotionQuery = subscribeToMediaQuery(
      reduceMotionQuery,
      handleMediaChange,
    );

    startTimer = window.setTimeout(() => {
      animationEnabled = true;
      syncAnimationState();
    }, 160);

    return () => {
      stopAnimation();
      window.clearTimeout(startTimer);
      window.cancelAnimationFrame(resizeFrame);

      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();

      if (!resizeObserver) {
        window.removeEventListener('resize', scheduleResize);
      }

      interactionRoot?.removeEventListener('pointerdown', handlePointerDown);
      interactionRoot?.removeEventListener('pointermove', handlePointerMove);
      interactionRoot?.removeEventListener('pointerup', handlePointerUp);
      interactionRoot?.removeEventListener('pointercancel', handlePointerCancel);
      interactionRoot?.removeEventListener('pointerleave', resetPointerTarget);

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribeMobileQuery();
      unsubscribeFinePointerQuery();
      unsubscribeReduceMotionQuery();
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

function createFlowPoints({
  breathing,
  fieldOffsetX,
  fieldOffsetY,
  height,
  line,
  lineIndex,
  phase,
  pointCount,
  pulse,
  pulseSample,
  width,
}: {
  breathing: number;
  fieldOffsetX: number;
  fieldOffsetY: number;
  height: number;
  line: FlowLineDefinition;
  lineIndex: number;
  phase: number;
  pointCount: number;
  pulse: null | PulseState;
  pulseSample: PulseSample;
  width: number;
}): Point[] {
  const points: Point[] = [];
  const startX = -width * line.overscan;
  const endX = width * (1 + line.overscan);
  const pulseInfluenceRadius = Math.min(Math.max(width, height) * 0.28, 320);

  for (let index = 0; index < pointCount; index += 1) {
    const progress = index / Math.max(1, pointCount - 1);
    const wavePhase = (progress * line.frequency + line.phase + phase) * TAU;
    const secondaryPhase =
      (progress * (line.frequency * 1.7) - line.phase * 0.6 - phase * 0.45) * TAU;

    let x = lerp(startX, endX, progress) + fieldOffsetX;
    let y =
      height * line.baseY +
      height * line.slope * (progress - 0.5) +
      Math.sin(wavePhase) * height * line.amplitude * (1 + breathing) +
      Math.sin(secondaryPhase) * height * line.amplitude * 0.18 +
      fieldOffsetY * (0.72 + lineIndex * 0.06);

    if (pulse && pulseSample.intensity > 0) {
      const distanceX = pulse.x - x;
      const distanceY = pulse.y - y;
      const distance = Math.hypot(distanceX, distanceY);
      const proximity = smoothstep(clamp(1 - distance / pulseInfluenceRadius, 0, 1));

      if (distance > 0 && proximity > 0) {
        const deformationStrength = pulseSample.deformation * proximity * 15;

        x += (distanceX / distance) * deformationStrength;
        y += (distanceY / distance) * deformationStrength;
      }
    }

    points.push({ x, y });
  }

  return points;
}

function createParticles(count: number, width: number, height: number): Particle[] {
  return Array.from({ length: count }, (_, index) => {
    const horizontalSeed = pseudoRandom(index * 17 + 11);
    const verticalSeed = pseudoRandom(index * 29 + 7);
    const radiusSeed = pseudoRandom(index * 37 + 5);

    return {
      alpha: 0.08 + pseudoRandom(index * 43 + 3) * 0.14,
      phase: pseudoRandom(index * 53 + 13) * TAU,
      radius: 0.7 + radiusSeed * 1.15,
      x: horizontalSeed * width,
      y: verticalSeed * height,
    };
  });
}

function drawAmbientField(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pulse: null | PulseState,
  pulseSample: PulseSample,
  isMobile: boolean,
): void {
  const driftX = Math.sin(time * 0.11) * width * 0.018;
  const driftY = Math.cos(time * 0.09) * height * 0.012;
  const primaryX = width * (isMobile ? 0.22 : 0.24) + driftX;
  const primaryY = height * (isMobile ? 0.34 : 0.31) + driftY;
  const secondaryX = width * (isMobile ? 0.86 : 0.78) - driftX * 0.6;
  const secondaryY = height * (isMobile ? 0.66 : 0.61) - driftY * 0.7;
  const radius = Math.max(width, height) * (isMobile ? 0.53 : 0.49);

  context.save();

  const primaryGlow = context.createRadialGradient(
    primaryX,
    primaryY,
    0,
    primaryX,
    primaryY,
    radius,
  );

  primaryGlow.addColorStop(0, 'rgba(204, 251, 241, 0.25)');
  primaryGlow.addColorStop(0.48, 'rgba(103, 232, 249, 0.09)');
  primaryGlow.addColorStop(1, 'rgba(103, 232, 249, 0)');

  context.fillStyle = primaryGlow;
  context.fillRect(0, 0, width, height);

  const secondaryGlow = context.createRadialGradient(
    secondaryX,
    secondaryY,
    0,
    secondaryX,
    secondaryY,
    radius * 0.78,
  );

  secondaryGlow.addColorStop(0, 'rgba(45, 212, 191, 0.13)');
  secondaryGlow.addColorStop(0.56, 'rgba(153, 246, 228, 0.055)');
  secondaryGlow.addColorStop(1, 'rgba(153, 246, 228, 0)');

  context.fillStyle = secondaryGlow;
  context.fillRect(0, 0, width, height);

  if (pulse && pulseSample.intensity > 0) {
    const pulseRadius = (isMobile ? 118 : 170) * (0.76 + pulseSample.progress * 0.4);
    const pulseGlow = context.createRadialGradient(
      pulse.x,
      pulse.y,
      0,
      pulse.x,
      pulse.y,
      pulseRadius,
    );

    pulseGlow.addColorStop(0, `rgba(204, 251, 241, ${pulseSample.intensity * 0.11})`);
    pulseGlow.addColorStop(0.46, `rgba(45, 212, 191, ${pulseSample.intensity * 0.05})`);
    pulseGlow.addColorStop(1, 'rgba(45, 212, 191, 0)');

    context.fillStyle = pulseGlow;
    context.fillRect(0, 0, width, height);
  }

  context.restore();
}

function drawFlowLine(
  context: CanvasRenderingContext2D,
  points: Point[],
  line: FlowLineDefinition,
  lineIndex: number,
  pulse: null | PulseState,
  pulseSample: PulseSample,
  isMobile: boolean,
): void {
  if (points.length < 2) {
    return;
  }

  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';

  traceOpenSmoothPath(context, points);
  context.lineWidth = line.width + 3.6;
  context.strokeStyle = `rgba(45, 212, 191, ${line.alpha * 0.09})`;
  context.stroke();

  traceOpenSmoothPath(context, points);
  context.lineWidth = line.width;
  context.strokeStyle =
    lineIndex === 0 ? `rgba(13, 148, 136, ${line.alpha})` : `rgba(14, 165, 233, ${line.alpha})`;
  context.stroke();

  if (pulse && pulseSample.intensity > 0) {
    const nearestIndex = findNearestPointIndex(points, pulse);
    const nearestPoint = points[nearestIndex];

    if (nearestPoint) {
      const distance = Math.hypot(nearestPoint.x - pulse.x, nearestPoint.y - pulse.y);
      const influenceRadius = isMobile ? 210 : 290;
      const proximity = clamp(1 - distance / influenceRadius, 0, 1);

      if (proximity > 0) {
        const segmentRadius = Math.max(3, Math.round(points.length * 0.085));
        const start = Math.max(0, nearestIndex - segmentRadius);
        const end = Math.min(points.length, nearestIndex + segmentRadius + 1);
        const segment = points.slice(start, end);

        if (segment.length > 1) {
          traceOpenSmoothPath(context, segment);
          context.lineWidth = line.width + 0.8;
          context.strokeStyle = `rgba(45, 212, 191, ${proximity * pulseSample.intensity * 0.42})`;
          context.stroke();
        }
      }
    }
  }

  context.restore();
}

function drawFlowMarkers(
  context: CanvasRenderingContext2D,
  points: Point[],
  line: FlowLineDefinition,
  pulse: null | PulseState,
  pulseSample: PulseSample,
  isMobile: boolean,
): void {
  if (line.markerPositions.length === 0 || points.length < 2) {
    return;
  }

  context.save();

  line.markerPositions.forEach((position) => {
    const point = samplePoint(points, position);
    let proximity = 0;

    if (pulse && pulseSample.intensity > 0) {
      const distance = Math.hypot(point.x - pulse.x, point.y - pulse.y);
      proximity = clamp(1 - distance / (isMobile ? 180 : 240), 0, 1);
    }

    const emphasis = proximity * pulseSample.intensity;
    const radius = 1.25 + emphasis * 1.1;

    context.beginPath();
    context.arc(point.x, point.y, radius + 3.2, 0, TAU);
    context.fillStyle = `rgba(45, 212, 191, ${0.025 + emphasis * 0.055})`;
    context.fill();

    context.beginPath();
    context.arc(point.x, point.y, radius, 0, TAU);
    context.fillStyle = `rgba(13, 148, 136, ${0.4 + emphasis * 0.38})`;
    context.fill();
  });

  context.restore();
}

function drawParticles(
  context: CanvasRenderingContext2D,
  particles: Particle[],
  time: number,
  staticFrame: boolean,
  interaction: {
    pulse: null | PulseState;
    pulseIntensity: number;
  },
): void {
  if (particles.length === 0) {
    return;
  }

  context.save();
  context.fillStyle = 'rgb(20, 184, 166)';

  particles.forEach((particle) => {
    const pulse = staticFrame ? 0.5 : (Math.sin(time * 0.48 + particle.phase) + 1) / 2;

    let x = particle.x;
    let y = particle.y;
    let proximity = 0;

    if (interaction.pulse && interaction.pulseIntensity > 0) {
      const distanceX = particle.x - interaction.pulse.x;
      const distanceY = particle.y - interaction.pulse.y;
      const distance = Math.hypot(distanceX, distanceY);
      const influenceRadius = 230;

      proximity = Math.max(0, 1 - distance / influenceRadius);

      if (distance > 0) {
        const displacement = proximity * interaction.pulseIntensity * 3.5;
        x += (distanceX / distance) * displacement;
        y += (distanceY / distance) * displacement;
      }
    }

    context.globalAlpha =
      particle.alpha * (0.58 + pulse * 0.42) * (1 + proximity * interaction.pulseIntensity * 0.24);

    context.beginPath();
    context.arc(x, y, particle.radius, 0, TAU);
    context.fill();
  });

  context.restore();
}

function drawPulseAura(
  context: CanvasRenderingContext2D,
  pulse: PulseState,
  progress: number,
  isMobile: boolean,
): void {
  const easedProgress = easeOutCubic(progress);
  const radius = 18 + easedProgress * (isMobile ? 72 : 104);
  const alpha = (1 - easedProgress) * 0.07;

  const gradient = context.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, radius);

  gradient.addColorStop(0, `rgba(20, 184, 166, ${alpha})`);
  gradient.addColorStop(0.44, `rgba(45, 212, 191, ${alpha * 0.42})`);
  gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');

  context.save();
  context.fillStyle = gradient;
  context.fillRect(pulse.x - radius, pulse.y - radius, radius * 2, radius * 2);
  context.restore();
}

function easeOutCubic(value: number): number {
  return 1 - (1 - value) ** 3;
}

function findNearestPointIndex(points: Point[], target: Point): number {
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  points.forEach((point, index) => {
    const distance = (point.x - target.x) ** 2 + (point.y - target.y) ** 2;

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

function getPulseSample(pulse: null | PulseState, time: number): PulseSample {
  if (!pulse || time <= 0) {
    return {
      attraction: 0,
      deformation: 0,
      finished: false,
      intensity: 0,
      progress: 0,
    };
  }

  const progress = clamp((time - pulse.startedAt) / PULSE_DURATION, 0, 1);

  return {
    attraction: sampleKeyframes(progress, [0, 0.17, 0.52, 1], [0, 1, 0.48, 0]),
    deformation: sampleKeyframes(progress, [0, 0.18, 0.48, 1], [0, 1, -0.58, 0]),
    finished: progress >= 1,
    intensity: sampleKeyframes(progress, [0, 0.14, 0.58, 1], [0, 1, 0.62, 0]),
    progress,
  };
}

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;

  return value - Math.floor(value);
}

function sampleKeyframes(progress: number, times: number[], values: number[]): number {
  for (let index = 0; index < times.length - 1; index += 1) {
    const startTime = times[index];
    const endTime = times[index + 1];
    const startValue = values[index];
    const endValue = values[index + 1];

    if (
      startTime === undefined ||
      endTime === undefined ||
      startValue === undefined ||
      endValue === undefined
    ) {
      continue;
    }

    if (progress <= endTime) {
      const localProgress = clamp(
        (progress - startTime) / Math.max(0.0001, endTime - startTime),
        0,
        1,
      );
      const eased = smoothstep(localProgress);

      return startValue + (endValue - startValue) * eased;
    }
  }

  return values.at(-1) ?? 0;
}

function samplePoint(points: Point[], progress: number): Point {
  const clampedProgress = clamp(progress, 0, 1);
  const scaledIndex = clampedProgress * Math.max(0, points.length - 1);
  const lowerIndex = Math.floor(scaledIndex);
  const upperIndex = Math.min(points.length - 1, lowerIndex + 1);
  const localProgress = scaledIndex - lowerIndex;
  const lower = points[lowerIndex] ?? { x: 0, y: 0 };
  const upper = points[upperIndex] ?? lower;

  return {
    x: lerp(lower.x, upper.x, localProgress),
    y: lerp(lower.y, upper.y, localProgress),
  };
}

function smoothstep(value: number): number {
  return value * value * (3 - 2 * value);
}

function traceOpenSmoothPath(context: CanvasRenderingContext2D, points: Point[]): void {
  const first = points[0];
  const last = points.at(-1);

  if (!first || !last) {
    return;
  }

  context.beginPath();
  context.moveTo(first.x, first.y);

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];

    if (!current || !next) {
      continue;
    }

    const midpointX = (current.x + next.x) / 2;
    const midpointY = (current.y + next.y) / 2;

    context.quadraticCurveTo(current.x, current.y, midpointX, midpointY);
  }

  const penultimate = points.at(-2);

  if (penultimate) {
    context.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y);
  }
}
