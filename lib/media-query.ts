export interface MediaQueryListLike {
  addEventListener?: (type: 'change', listener: () => void) => void;
  addListener?: (listener: () => void) => void;
  matches?: boolean;
  removeEventListener?: (type: 'change', listener: () => void) => void;
  removeListener?: (listener: () => void) => void;
}

/** Returns a harmless static query when a browser runtime does not expose matchMedia. */
export function getMediaQuery(query: string): MediaQueryListLike {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia(query);
  }

  return { matches: false };
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
