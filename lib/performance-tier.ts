export interface PerformanceNavigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export type PerformanceTier = 'high' | 'low' | 'medium';

/**
 * Uses only hints that describe computational cost. Missing hints never mark a
 * high-density device as high-capacity by themselves; continuous effects can
 * still step down after observing slow frames.
 */
export function getPerformanceTier(
  navigatorInfo: PerformanceNavigator | undefined,
  devicePixelRatio = 1,
): PerformanceTier {
  const processorCount = navigatorInfo?.hardwareConcurrency;
  const memory = navigatorInfo?.deviceMemory;

  if (processorCount === undefined && memory === undefined && devicePixelRatio >= 1.5) {
    return 'medium';
  }

  if (
    navigatorInfo?.connection?.saveData === true ||
    (processorCount !== undefined && processorCount <= 2) ||
    (memory !== undefined && memory <= 2)
  ) {
    return 'low';
  }

  if (
    (processorCount !== undefined && processorCount <= 4) ||
    (memory !== undefined && memory <= 4) ||
    (devicePixelRatio >= 2.75 && processorCount !== undefined && processorCount <= 6)
  ) {
    return 'medium';
  }

  return 'high';
}
