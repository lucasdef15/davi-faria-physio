import type { CanvasCapability, CanvasQualityProfile, CanvasQualityTier } from './types';

interface NavigatorWithMemory extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

export function getCanvasCapability(navigatorInfo: NavigatorWithMemory): CanvasCapability {
  const processorCount = navigatorInfo.hardwareConcurrency;
  const memory = navigatorInfo.deviceMemory;

  return {
    isLowCapacity:
      navigatorInfo.connection?.saveData === true ||
      (processorCount !== undefined && processorCount <= 2) ||
      (memory !== undefined && memory <= 2),
    isMediumCapacity:
      (processorCount !== undefined && processorCount <= 4) ||
      (memory !== undefined && memory <= 4),
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
      particleCount: isMobile ? 5 : 6,
      pointCount: isMobile ? 36 : 42,
      simplifiedAmbient: false,
    };
  }

  return {
    dprLimit: 1.5,
    fps: desktopFps,
    interactionEnabled: true,
    particleCount: 11,
    pointCount: 62,
    simplifiedAmbient: false,
  };
}

export function getInitialCanvasQualityTier(
  capability: CanvasCapability,
  isMobile: boolean,
): CanvasQualityTier {
  if (capability.isLowCapacity) {
    return 'low';
  }

  return isMobile || capability.isMediumCapacity ? 'medium' : 'high';
}

export function reduceCanvasQuality(tier: CanvasQualityTier): CanvasQualityTier {
  if (tier === 'high') {
    return 'medium';
  }

  return 'low';
}
