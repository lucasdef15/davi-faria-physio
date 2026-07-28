export interface MediaQueryListLike {
  addEventListener?: (type: 'change', listener: () => void) => void;
  addListener?: (listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
  removeListener?: (listener: () => void) => void;
}

export function subscribeToMediaQuery(
  mediaQuery: MediaQueryListLike,
  listener: () => void,
): () => void {
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener?.('change', listener);
    };
  }

  if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(listener);

    return () => {
      mediaQuery.removeListener?.(listener);
    };
  }

  return () => undefined;
}
