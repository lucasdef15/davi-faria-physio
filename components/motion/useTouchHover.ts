'use client';

import {
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface PointerStart {
  id: number;
  x: number;
  y: number;
}

type TouchHoverProps<T extends HTMLElement> = Pick<
  HTMLAttributes<T>,
  'onPointerCancel' | 'onPointerDown' | 'onPointerLeave' | 'onPointerMove' | 'onPointerUp'
> & {
  'data-touch-active'?: 'true';
};

interface UseTouchHoverOptions {
  disabled?: boolean;

  duration?: number;

  movementTolerance?: number;
}

interface UseTouchHoverReturn<T extends HTMLElement> {
  activate: () => void;

  deactivate: () => void;

  isTouchActive: boolean;

  touchProps: TouchHoverProps<T>;
}

export function useTouchHover<T extends HTMLElement = HTMLElement>({
  disabled = false,
  duration = 1600,
  movementTolerance = 10,
}: UseTouchHoverOptions = {}): UseTouchHoverReturn<T> {
  const [isTouchActive, setIsTouchActive] = useState(false);

  const timeoutRef = useRef<null | number>(null);
  const pointerStartRef = useRef<null | PointerStart>(null);
  const hasMovedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current === null) {
      return;
    }

    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const resetPointer = useCallback(() => {
    pointerStartRef.current = null;
    hasMovedRef.current = false;
  }, []);

  const deactivate = useCallback(() => {
    clearTimer();
    setIsTouchActive(false);
  }, [clearTimer]);

  const activate = useCallback(() => {
    if (disabled) {
      return;
    }

    clearTimer();
    setIsTouchActive(true);

    timeoutRef.current = window.setTimeout(() => {
      setIsTouchActive(false);
      timeoutRef.current = null;
    }, duration);
  }, [clearTimer, disabled, duration]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (disabled || event.pointerType === 'mouse') {
        return;
      }

      pointerStartRef.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };

      hasMovedRef.current = false;
    },
    [disabled],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<T>) => {
      const pointerStart = pointerStartRef.current;

      if (!pointerStart || pointerStart.id !== event.pointerId) {
        return;
      }

      const distanceX = event.clientX - pointerStart.x;
      const distanceY = event.clientY - pointerStart.y;

      const movementSquared = distanceX ** 2 + distanceY ** 2;
      const toleranceSquared = movementTolerance ** 2;

      if (movementSquared > toleranceSquared) {
        hasMovedRef.current = true;
      }
    },
    [movementTolerance],
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<T>) => {
      const pointerStart = pointerStartRef.current;

      const shouldActivate =
        !disabled &&
        event.pointerType !== 'mouse' &&
        pointerStart?.id === event.pointerId &&
        !hasMovedRef.current;

      resetPointer();

      if (shouldActivate) {
        activate();
      }
    },
    [activate, disabled, resetPointer],
  );

  const handlePointerCancel = useCallback(() => {
    resetPointer();
  }, [resetPointer]);

  const handlePointerLeave = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (event.pointerType !== 'mouse') {
        resetPointer();
      }
    },
    [resetPointer],
  );

  useEffect(() => {
    if (!disabled) {
      return;
    }

    clearTimer();
    const timeoutId = window.setTimeout(() => {
      setIsTouchActive(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [clearTimer, disabled]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const touchProps = useMemo<TouchHoverProps<T>>(
    () => ({
      'data-touch-active': isTouchActive ? 'true' : undefined,
      onPointerCancel: handlePointerCancel,
      onPointerDown: handlePointerDown,
      onPointerLeave: handlePointerLeave,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    }),
    [
      handlePointerCancel,
      handlePointerDown,
      handlePointerLeave,
      handlePointerMove,
      handlePointerUp,
      isTouchActive,
    ],
  );

  return {
    activate,
    deactivate,
    isTouchActive,
    touchProps,
  };
}
