import type { FlowLineDefinition } from './types';

export const PULSE_DURATION = 1250;
export const POINTER_MOVE_TOLERANCE = 10;

export const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[data-hero-ignore-interaction]',
].join(',');

export const MOBILE_FLOW_LINES: readonly FlowLineDefinition[] = [
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

export const DESKTOP_FLOW_LINES: readonly FlowLineDefinition[] = [
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
