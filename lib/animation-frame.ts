export type AnimationFrameCallback = (time: number) => void;

export interface AnimationFrameRuntime {
  cancelAnimationFrame?: (id: number) => void;
  clearTimeout: (id: number) => void;
  requestAnimationFrame?: (callback: AnimationFrameCallback) => number;
  setTimeout: (callback: () => void, delay?: number) => number;
}

/** Uses a short timeout only in runtimes that do not implement requestAnimationFrame. */
export function cancelScheduledFrame(id: number, runtime: AnimationFrameRuntime = window): void {
  if (typeof runtime.cancelAnimationFrame === 'function') {
    runtime.cancelAnimationFrame(id);
    return;
  }

  runtime.clearTimeout(id);
}

export function scheduleFrame(
  callback: AnimationFrameCallback,
  runtime: AnimationFrameRuntime = window,
): number {
  if (typeof runtime.requestAnimationFrame === 'function') {
    return runtime.requestAnimationFrame(callback);
  }

  return runtime.setTimeout(() => callback(Date.now()), 16);
}
