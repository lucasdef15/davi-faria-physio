import type { CanvasCapability, CanvasQualityProfile, CanvasQualityTier } from './types';

import { getPerformanceTier } from '../../lib/performance-tier.ts';

interface NavigatorWithMemory extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

export function getCanvasCapability(
  navigatorInfo: NavigatorWithMemory,
  devicePixelRatio = 1,
): CanvasCapability {
  const tier = getPerformanceTier(navigatorInfo, devicePixelRatio);

  return {
    isLowCapacity: tier === 'low',
    isMediumCapacity: tier === 'medium',
  };
}

export function getCanvasQualityProfile(
  tier: CanvasQualityTier,
  isMobile: boolean,
  desktopFps: number,
  mobileFps: number,
): CanvasQualityProfile {
  if (tier === 'low') {
    return {
      dprLimit: 1,
      fps: 12,
      interactionEnabled: false,
      maxHeight: 720,
      maxPixels: 420_000,
      maxWidth: 1_024,
      particleCount: 2,
      pointCount: 28,
      simplifiedAmbient: true,
    };
  }

  if (tier === 'medium') {
    return {
      dprLimit: isMobile ? 1.15 : 1.25,
      fps: isMobile ? Math.min(mobileFps, 16) : Math.min(desktopFps, 20),
      interactionEnabled: true,
      maxHeight: 960,
      maxPixels: 900_000,
      maxWidth: 1_440,
      particleCount: isMobile ? 5 : 6,
      pointCount: isMobile ? 36 : 42,
      simplifiedAmbient: false,
    };
  }

  return {
    dprLimit: 1.5,
    fps: desktopFps,
    interactionEnabled: true,
    maxHeight: 1_180,
    maxPixels: 2_000_000,
    maxWidth: 1_920,
    particleCount: 11,
    pointCount: 62,
    simplifiedAmbient: false,
  };
}

export function getCanvasRenderScale(
  width: number,
  height: number,
  devicePixelRatio: number,
  profile: CanvasQualityProfile,
): number {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const pixelBudgetScale = Math.sqrt(profile.maxPixels / (safeWidth * safeHeight));

  return Math.min(
    Math.max(1, devicePixelRatio),
    profile.dprLimit,
    profile.maxWidth / safeWidth,
    profile.maxHeight / safeHeight,
    pixelBudgetScale,
  );
}

export function getInitialCanvasQualityTier(
  capability: CanvasCapability,
): CanvasQualityTier {
  if (capability.isLowCapacity) {
    return 'low';
  }

  return capability.isMediumCapacity ? 'medium' : 'high';
}

export function reduceCanvasQuality(tier: CanvasQualityTier): CanvasQualityTier {
  if (tier === 'high') {
    return 'medium';
  }

  return 'low';
}
