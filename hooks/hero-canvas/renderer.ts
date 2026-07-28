import type {
  CanvasParticle,
  CanvasPoint,
  CanvasPulseSample,
  CanvasPulseState,
  CanvasStaticAmbient,
  FlowLineDefinition,
} from './types';

import { PULSE_DURATION } from './constants';

const TAU = Math.PI * 2;

export function createParticles(count: number, width: number, height: number): CanvasParticle[] {
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

export function createPointBuffers(
  lines: readonly FlowLineDefinition[],
  pointCount: number,
): CanvasPoint[][] {
  return lines.map(() =>
    Array.from({ length: pointCount }, () => ({ x: 0, y: 0 })),
  );
}

export function createStaticAmbient(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  isMobile: boolean,
): CanvasStaticAmbient {
  const primaryX = width * (isMobile ? 0.22 : 0.24);
  const primaryY = height * (isMobile ? 0.34 : 0.31);
  const secondaryX = width * (isMobile ? 0.86 : 0.78);
  const secondaryY = height * (isMobile ? 0.66 : 0.61);
  const radius = Math.max(width, height) * (isMobile ? 0.53 : 0.49);
  const primary = context.createRadialGradient(primaryX, primaryY, 0, primaryX, primaryY, radius);
  const secondary = context.createRadialGradient(
    secondaryX,
    secondaryY,
    0,
    secondaryX,
    secondaryY,
    radius * 0.78,
  );

  primary.addColorStop(0, 'rgba(204, 251, 241, 0.2)');
  primary.addColorStop(0.5, 'rgba(103, 232, 249, 0.065)');
  primary.addColorStop(1, 'rgba(103, 232, 249, 0)');

  secondary.addColorStop(0, 'rgba(45, 212, 191, 0.09)');
  secondary.addColorStop(0.58, 'rgba(153, 246, 228, 0.04)');
  secondary.addColorStop(1, 'rgba(153, 246, 228, 0)');

  return { primary, secondary };
}

export function drawAmbientField(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pulse: CanvasPulseState | null,
  pulseSample: CanvasPulseSample,
  isMobile: boolean,
  staticAmbient: CanvasStaticAmbient | null,
): void {
  context.save();

  if (staticAmbient) {
    context.fillStyle = staticAmbient.primary;
    context.fillRect(0, 0, width, height);
    context.fillStyle = staticAmbient.secondary;
    context.fillRect(0, 0, width, height);
    context.restore();
    return;
  }

  const driftX = Math.sin(time * 0.11) * width * 0.018;
  const driftY = Math.cos(time * 0.09) * height * 0.012;
  const primaryX = width * (isMobile ? 0.22 : 0.24) + driftX;
  const primaryY = height * (isMobile ? 0.34 : 0.31) + driftY;
  const secondaryX = width * (isMobile ? 0.86 : 0.78) - driftX * 0.6;
  const secondaryY = height * (isMobile ? 0.66 : 0.61) - driftY * 0.7;
  const radius = Math.max(width, height) * (isMobile ? 0.53 : 0.49);
  const primaryGlow = context.createRadialGradient(primaryX, primaryY, 0, primaryX, primaryY, radius);
  const secondaryGlow = context.createRadialGradient(
    secondaryX,
    secondaryY,
    0,
    secondaryX,
    secondaryY,
    radius * 0.78,
  );

  primaryGlow.addColorStop(0, 'rgba(204, 251, 241, 0.25)');
  primaryGlow.addColorStop(0.48, 'rgba(103, 232, 249, 0.09)');
  primaryGlow.addColorStop(1, 'rgba(103, 232, 249, 0)');
  secondaryGlow.addColorStop(0, 'rgba(45, 212, 191, 0.13)');
  secondaryGlow.addColorStop(0.56, 'rgba(153, 246, 228, 0.055)');
  secondaryGlow.addColorStop(1, 'rgba(153, 246, 228, 0)');

  context.fillStyle = primaryGlow;
  context.fillRect(0, 0, width, height);
  context.fillStyle = secondaryGlow;
  context.fillRect(0, 0, width, height);

  if (pulse && pulseSample.intensity > 0) {
    const pulseRadius = (isMobile ? 118 : 170) * (0.76 + pulseSample.progress * 0.4);
    const pulseGlow = context.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, pulseRadius);
    pulseGlow.addColorStop(0, `rgba(204, 251, 241, ${pulseSample.intensity * 0.11})`);
    pulseGlow.addColorStop(0.46, `rgba(45, 212, 191, ${pulseSample.intensity * 0.05})`);
    pulseGlow.addColorStop(1, 'rgba(45, 212, 191, 0)');
    context.fillStyle = pulseGlow;
    context.fillRect(0, 0, width, height);
  }

  context.restore();
}

export function drawFlowLine(
  context: CanvasRenderingContext2D,
  points: CanvasPoint[],
  line: FlowLineDefinition,
  lineIndex: number,
  pulse: CanvasPulseState | null,
  pulseSample: CanvasPulseSample,
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
      const proximity = clamp(1 - distance / (isMobile ? 210 : 290), 0, 1);

      if (proximity > 0) {
        const segmentRadius = Math.max(3, Math.round(points.length * 0.085));
        traceOpenSmoothPath(
          context,
          points,
          Math.max(0, nearestIndex - segmentRadius),
          Math.min(points.length - 1, nearestIndex + segmentRadius),
        );
        context.lineWidth = line.width + 0.8;
        context.strokeStyle = `rgba(45, 212, 191, ${proximity * pulseSample.intensity * 0.42})`;
        context.stroke();
      }
    }
  }

  context.restore();
}

export function drawFlowMarkers(
  context: CanvasRenderingContext2D,
  points: CanvasPoint[],
  line: FlowLineDefinition,
  pulse: CanvasPulseState | null,
  pulseSample: CanvasPulseSample,
  isMobile: boolean,
  samplePoint: CanvasPoint,
): void {
  if (line.markerPositions.length === 0 || points.length < 2) {
    return;
  }

  context.save();

  for (const position of line.markerPositions) {
    samplePointAt(points, position, samplePoint);
    let proximity = 0;

    if (pulse && pulseSample.intensity > 0) {
      proximity = clamp(
        1 - Math.hypot(samplePoint.x - pulse.x, samplePoint.y - pulse.y) / (isMobile ? 180 : 240),
        0,
        1,
      );
    }

    const emphasis = proximity * pulseSample.intensity;
    const radius = 1.25 + emphasis * 1.1;
    context.beginPath();
    context.arc(samplePoint.x, samplePoint.y, radius + 3.2, 0, TAU);
    context.fillStyle = `rgba(45, 212, 191, ${0.025 + emphasis * 0.055})`;
    context.fill();
    context.beginPath();
    context.arc(samplePoint.x, samplePoint.y, radius, 0, TAU);
    context.fillStyle = `rgba(13, 148, 136, ${0.4 + emphasis * 0.38})`;
    context.fill();
  }

  context.restore();
}

export function drawParticles(
  context: CanvasRenderingContext2D,
  particles: CanvasParticle[],
  time: number,
  staticFrame: boolean,
  pulse: CanvasPulseState | null,
  pulseIntensity: number,
): void {
  if (particles.length === 0) {
    return;
  }

  context.save();
  context.fillStyle = 'rgb(20, 184, 166)';

  for (const particle of particles) {
    const breath = staticFrame ? 0.5 : (Math.sin(time * 0.48 + particle.phase) + 1) / 2;
    let x = particle.x;
    let y = particle.y;
    let proximity = 0;

    if (pulse && pulseIntensity > 0) {
      const distanceX = particle.x - pulse.x;
      const distanceY = particle.y - pulse.y;
      const distance = Math.hypot(distanceX, distanceY);
      proximity = Math.max(0, 1 - distance / 230);

      if (distance > 0) {
        const displacement = proximity * pulseIntensity * 3.5;
        x += (distanceX / distance) * displacement;
        y += (distanceY / distance) * displacement;
      }
    }

    context.globalAlpha = particle.alpha * (0.58 + breath * 0.42) * (1 + proximity * pulseIntensity * 0.24);
    context.beginPath();
    context.arc(x, y, particle.radius, 0, TAU);
    context.fill();
  }

  context.restore();
}

export function drawPulseAura(
  context: CanvasRenderingContext2D,
  pulse: CanvasPulseState,
  progress: number,
  isMobile: boolean,
): void {
  const easedProgress = 1 - (1 - progress) ** 3;
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

export function populateFlowPoints({
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
}: {
  breathing: number;
  fieldOffsetX: number;
  fieldOffsetY: number;
  height: number;
  line: FlowLineDefinition;
  lineIndex: number;
  phase: number;
  points: CanvasPoint[];
  pulse: CanvasPulseState | null;
  pulseSample: CanvasPulseSample;
  width: number;
}): void {
  const startX = -width * line.overscan;
  const endX = width * (1 + line.overscan);
  const pulseInfluenceRadius = Math.min(Math.max(width, height) * 0.28, 320);

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];

    if (!point) {
      continue;
    }

    const progress = index / Math.max(1, points.length - 1);
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

    point.x = x;
    point.y = y;
  }
}

export function updatePulseSample(
  pulse: CanvasPulseState | null,
  time: number,
  sample: CanvasPulseSample,
): void {
  if (!pulse || time <= 0) {
    sample.attraction = 0;
    sample.deformation = 0;
    sample.finished = false;
    sample.intensity = 0;
    sample.progress = 0;
    return;
  }

  const progress = clamp((time - pulse.startedAt) / PULSE_DURATION, 0, 1);
  sample.attraction = sampleKeyframes(progress, [0, 0.17, 0.52, 1], [0, 1, 0.48, 0]);
  sample.deformation = sampleKeyframes(progress, [0, 0.18, 0.48, 1], [0, 1, -0.58, 0]);
  sample.finished = progress >= 1;
  sample.intensity = sampleKeyframes(progress, [0, 0.14, 0.58, 1], [0, 1, 0.62, 0]);
  sample.progress = progress;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function findNearestPointIndex(points: CanvasPoint[], target: CanvasPoint): number {
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];

    if (!point) {
      continue;
    }

    const distance = (point.x - target.x) ** 2 + (point.y - target.y) ** 2;

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  }

  return nearestIndex;
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
      return startValue + (endValue - startValue) * smoothstep(localProgress);
    }
  }

  return values.at(-1) ?? 0;
}

function samplePointAt(points: CanvasPoint[], progress: number, target: CanvasPoint): void {
  const scaledIndex = clamp(progress, 0, 1) * Math.max(0, points.length - 1);
  const lowerIndex = Math.floor(scaledIndex);
  const upperIndex = Math.min(points.length - 1, lowerIndex + 1);
  const lower = points[lowerIndex] ?? { x: 0, y: 0 };
  const upper = points[upperIndex] ?? lower;
  const localProgress = scaledIndex - lowerIndex;

  target.x = lerp(lower.x, upper.x, localProgress);
  target.y = lerp(lower.y, upper.y, localProgress);
}

function smoothstep(value: number): number {
  return value * value * (3 - 2 * value);
}

function traceOpenSmoothPath(
  context: CanvasRenderingContext2D,
  points: CanvasPoint[],
  start = 0,
  end = points.length - 1,
): void {
  const first = points[start];
  const last = points[end];

  if (!first || !last) {
    return;
  }

  context.beginPath();
  context.moveTo(first.x, first.y);

  for (let index = start + 1; index < end; index += 1) {
    const current = points[index];
    const next = points[index + 1];

    if (!current || !next) {
      continue;
    }

    context.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
  }

  const penultimate = points[Math.max(start, end - 1)];

  if (penultimate && end > start) {
    context.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y);
  }
}
