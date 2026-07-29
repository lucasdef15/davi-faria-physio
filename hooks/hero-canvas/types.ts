export interface CanvasCapability {
  isLowCapacity: boolean;
  isMediumCapacity: boolean;
}

export interface CanvasParticle {
  alpha: number;
  phase: number;
  radius: number;
  x: number;
  y: number;
}

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface CanvasPulseSample {
  attraction: number;
  deformation: number;
  finished: boolean;
  intensity: number;
  progress: number;
}

export interface CanvasPulseState {
  startedAt: number;
  x: number;
  y: number;
}

export interface CanvasQualityProfile {
  dprLimit: number;
  fps: number;
  interactionEnabled: boolean;
  maxHeight: number;
  maxPixels: number;
  maxWidth: number;
  particleCount: number;
  pointCount: number;
  simplifiedAmbient: boolean;
}

export type CanvasQualityTier = 'high' | 'low' | 'medium';

export interface CanvasStaticAmbient {
  primary: CanvasGradient;
  secondary: CanvasGradient;
}

export interface FlowLineDefinition {
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
