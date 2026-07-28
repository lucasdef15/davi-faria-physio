'use client';

import {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
  useEffect,
  useRef,
} from 'react';

interface HorizontalScrollHandlers {
  onClickCapture: (event: ReactMouseEvent<HTMLElement>) => void;
  onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
}

interface HorizontalScrollOptions {
  itemSelector?: string;
  onActiveChange?: (id: string) => void;
}

const DEFAULT_ITEM_SELECTOR = '[data-horizontal-scroll-item]';
const SCROLL_END_DELAY = 120;

export function useHorizontalScroll(
  scrollRef: RefObject<HTMLElement | null>,
  options: HorizontalScrollOptions = {},
): HorizontalScrollHandlers {
  const { itemSelector = DEFAULT_ITEM_SELECTOR, onActiveChange } = options;

  const drag = useRef({ active: false, moved: false, startScroll: 0, startX: 0 });
  const activeIdRef = useRef<null | string>(null);
  const onActiveChangeRef = useRef(onActiveChange);
  const scrollEndTimerRef = useRef<null | number>(null);

  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const getClosestItem = () => {
      const items = Array.from(element.querySelectorAll<HTMLElement>(itemSelector));
      if (!items.length) return null;

      const containerRect = element.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      return items.reduce<HTMLElement | null>((closest, item) => {
        if (!closest) return item;

        const itemRect = item.getBoundingClientRect();
        const closestRect = closest.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const closestCenter = closestRect.left + closestRect.width / 2;
        const itemDistance = Math.abs(itemCenter - containerCenter);
        const closestDistance = Math.abs(closestCenter - containerCenter);

        return itemDistance < closestDistance ? item : closest;
      }, null);
    };

    const finishAtClosestItem = (behavior: ScrollBehavior = 'smooth') => {
      if (element.scrollWidth <= element.clientWidth + 1) return;

      const closestItem = getClosestItem();
      if (!closestItem) return;

      const containerRect = element.getBoundingClientRect();
      const itemRect = closestItem.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      const itemCenter = itemRect.left + itemRect.width / 2;
      const distanceToCenter = itemCenter - containerCenter;
      const id = closestItem.dataset.scrollId;

      if (id && activeIdRef.current !== id) {
        activeIdRef.current = id;
        onActiveChangeRef.current?.(id);
      }

      if (Math.abs(distanceToCenter) < 1) return;

      element.scrollTo({
        behavior,
        left: element.scrollLeft + distanceToCenter,
      });
    };

    const scheduleSnap = () => {
      if (scrollEndTimerRef.current !== null) {
        window.clearTimeout(scrollEndTimerRef.current);
      }

      scrollEndTimerRef.current = window.setTimeout(() => {
        scrollEndTimerRef.current = null;
        finishAtClosestItem();
      }, SCROLL_END_DELAY);
    };

    const onScroll = () => {
      scheduleSnap();
    };

    const onWheel = (event: WheelEvent) => {
      if (
        element.scrollWidth <= element.clientWidth ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX)
      ) {
        return;
      }

      const atStart = element.scrollLeft <= 0;
      const atEnd = element.scrollLeft >= element.scrollWidth - element.clientWidth - 1;

      if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;

      event.preventDefault();
      element.scrollLeft += event.deltaY;
    };

    element.addEventListener('scroll', onScroll, { passive: true });
    element.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('wheel', onWheel);

      if (scrollEndTimerRef.current !== null) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, [itemSelector, scrollRef]);

  const snapAfterDrag = (element: HTMLElement) => {
    window.setTimeout(() => {
      const items = Array.from(element.querySelectorAll<HTMLElement>(itemSelector));
      if (!items.length || element.scrollWidth <= element.clientWidth + 1) return;

      const containerRect = element.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      const closestItem = items.reduce<HTMLElement | null>((closest, item) => {
        if (!closest) return item;

        const itemRect = item.getBoundingClientRect();
        const closestRect = closest.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const closestCenter = closestRect.left + closestRect.width / 2;
        const itemDistance = Math.abs(itemCenter - containerCenter);
        const closestDistance = Math.abs(closestCenter - containerCenter);

        return itemDistance < closestDistance ? item : closest;
      }, null);

      if (!closestItem) return;

      const itemRect = closestItem.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const distanceToCenter = itemCenter - containerCenter;
      const id = closestItem.dataset.scrollId;

      if (id && activeIdRef.current !== id) {
        activeIdRef.current = id;
        onActiveChangeRef.current?.(id);
      }

      element.scrollTo({
        behavior: 'smooth',
        left: element.scrollLeft + distanceToCenter,
      });
    }, 0);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!drag.current.active) return;

    const shouldSnap = drag.current.moved;

    drag.current.active = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    event.currentTarget.removeAttribute('data-dragging');

    if (shouldSnap) {
      snapAfterDrag(event.currentTarget);
    }
  };

  return {
    onClickCapture: (event) => {
      if (!drag.current.moved) return;

      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = false;
    },
    onPointerCancel: finishDrag,
    onPointerDown: (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;

      drag.current = {
        active: true,
        moved: false,
        startScroll: event.currentTarget.scrollLeft,
        startX: event.clientX,
      };
    },
    onPointerLeave: (event) => {
      if (drag.current.active && !drag.current.moved) {
        finishDrag(event);
      }
    },
    onPointerMove: (event) => {
      if (!drag.current.active) return;

      if (event.buttons !== 1) {
        finishDrag(event);
        return;
      }

      const distance = event.clientX - drag.current.startX;

      if (Math.abs(distance) > 5 && !drag.current.moved) {
        drag.current.moved = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.setAttribute('data-dragging', 'true');
      }

      if (!drag.current.moved) return;

      event.currentTarget.scrollLeft = drag.current.startScroll - distance;
    },
    onPointerUp: finishDrag,
  };
}
