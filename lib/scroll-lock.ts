'use client';

const LOCK_ATTRIBUTE = 'data-scroll-lock-active';

interface ScrollLockState {
  bodyLeft: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
  bodyPosition: string;
  bodyRight: string;
  bodyTop: string;
  bodyWidth: string;
  htmlOverflow: string;
  htmlOverscrollBehavior: string;
  htmlScrollBehavior: string;
  scrollTop: number;
}

let activeLocks = 0;
let savedState: ScrollLockState | null = null;

export function lockDocumentScroll(): () => void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return () => undefined;
  }

  activeLocks += 1;

  if (activeLocks === 1) {
    savedState = saveLockState();
    applyLock(savedState.scrollTop);
  }

  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;
    activeLocks = Math.max(0, activeLocks - 1);

    if (activeLocks === 0 && savedState) {
      const state = savedState;
      savedState = null;
      restoreLock(state);
    }
  };
}

function applyLock(scrollTop: number): void {
  const { body, documentElement } = document;
  const compensation = Math.max(0, window.innerWidth - documentElement.clientWidth);
  const currentPaddingRight =
    Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

  documentElement.style.overflow = 'hidden';
  documentElement.style.overscrollBehavior = 'none';

  body.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${scrollTop}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';

  if (compensation > 0) {
    body.style.paddingRight = `${currentPaddingRight + compensation}px`;
  }

  documentElement.setAttribute(LOCK_ATTRIBUTE, 'true');
  body.dataset.scrollLock = 'true';
}

function restoreLock(state: ScrollLockState): void {
  const { body, documentElement } = document;

  documentElement.style.overflow = state.htmlOverflow;
  documentElement.style.overscrollBehavior = state.htmlOverscrollBehavior;
  documentElement.style.scrollBehavior = 'auto';

  body.style.overflow = state.bodyOverflow;
  body.style.position = state.bodyPosition;
  body.style.top = state.bodyTop;
  body.style.left = state.bodyLeft;
  body.style.right = state.bodyRight;
  body.style.width = state.bodyWidth;
  body.style.paddingRight = state.bodyPaddingRight;

  documentElement.removeAttribute(LOCK_ATTRIBUTE);
  delete body.dataset.scrollLock;

  window.scrollTo({ behavior: 'auto', left: 0, top: state.scrollTop });
  documentElement.style.scrollBehavior = state.htmlScrollBehavior;
}

function saveLockState(): ScrollLockState {
  const { body, documentElement } = document;

  return {
    bodyLeft: body.style.left,
    bodyOverflow: body.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
    bodyPosition: body.style.position,
    bodyRight: body.style.right,
    bodyTop: body.style.top,
    bodyWidth: body.style.width,
    htmlOverflow: documentElement.style.overflow,
    htmlOverscrollBehavior: documentElement.style.overscrollBehavior,
    htmlScrollBehavior: documentElement.style.scrollBehavior,
    scrollTop: window.scrollY,
  };
}
