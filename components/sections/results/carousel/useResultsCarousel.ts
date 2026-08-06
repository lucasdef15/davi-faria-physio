import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseResultsCarouselOptions {
  slideCount: number;
}

export function useResultsCarousel({ slideCount }: UseResultsCarouselOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [endSpacer, setEndSpacer] = useState(20);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startScroll: 0,
    startX: 0,
  });

  const getSlides = useCallback(() => {
    const track = trackRef.current;

    return track
      ? Array.from(track.querySelectorAll<HTMLElement>('[data-result-slide]'))
      : [];
  }, []);

  const getSlideTarget = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const slide = getSlides()[index];

      if (!track || !slide) {
        return null;
      }

      const maximumPosition = Math.max(0, track.scrollWidth - track.clientWidth);

      if (index === 0) {
        return 0;
      }

      const trackRect = track.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();
      const slideLeft = track.scrollLeft + slideRect.left - trackRect.left;
      const centeredPosition = slideLeft - (track.clientWidth - slideRect.width) / 2;

      return Math.min(Math.max(0, centeredPosition), maximumPosition);
    },
    [getSlides],
  );

  const updateTrackMetrics = useCallback(() => {
    const track = trackRef.current;
    const slides = getSlides();

    if (!track || slides.length === 0) {
      return;
    }

    const lastSlide = slides.at(-1);

    if (lastSlide) {
      setEndSpacer(Math.max(20, (track.clientWidth - lastSlide.offsetWidth) / 2));
    }

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((_, index) => {
      const target = getSlideTarget(index);

      if (target === null) {
        return;
      }

      const distance = Math.abs(track.scrollLeft - target);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, [getSlideTarget, getSlides]);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const scheduleUpdate = () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }

      scrollFrameRef.current = requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        updateTrackMetrics();
      });
    };

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleUpdate);

    resizeObserver?.observe(track);
    getSlides().forEach((slide) => resizeObserver?.observe(slide));
    track.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    scheduleUpdate();

    return () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }

      resizeObserver?.disconnect();
      track.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [getSlides, updateTrackMetrics]);

  const scrollToSlide = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const track = trackRef.current;
      const target = getSlideTarget(index);

      if (!track || target === null || track.scrollWidth <= track.clientWidth + 1) {
        return;
      }

      track.scrollTo({ behavior, left: target });
    },
    [getSlideTarget],
  );

  const scrollToClosestSlide = useCallback(() => {
    const track = trackRef.current;
    const slides = getSlides();

    if (!track || slides.length === 0 || track.scrollWidth <= track.clientWidth + 1) {
      return;
    }

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((_, index) => {
      const target = getSlideTarget(index);

      if (target === null) {
        return;
      }

      const distance = Math.abs(track.scrollLeft - target);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    scrollToSlide(closestIndex);
  }, [getSlideTarget, getSlides, scrollToSlide]);

  const finishMouseDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;

      if (!drag.active || drag.pointerId !== event.pointerId) {
        return;
      }

      const moved = drag.moved;

      drag.active = false;
      drag.moved = false;
      drag.pointerId = -1;
      event.currentTarget.removeAttribute('data-dragging');

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      if (!moved) {
        return;
      }

      suppressClickRef.current = true;

      requestAnimationFrame(() => {
        scrollToClosestSlide();
      });

      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    },
    [scrollToClosestSlide],
  );

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const track = event.currentTarget;

    if (
      event.pointerType !== 'mouse' ||
      event.button !== 0 ||
      track.scrollWidth <= track.clientWidth + 1
    ) {
      return;
    }

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startScroll: track.scrollLeft,
      startX: event.clientX,
    };
  }, []);

  const handlePointerLeave = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag.active || drag.moved || drag.pointerId !== event.pointerId) {
      return;
    }

    drag.active = false;
    drag.pointerId = -1;
  }, []);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;

      if (!drag.active || drag.pointerId !== event.pointerId) {
        return;
      }

      if (event.buttons !== 1) {
        finishMouseDrag(event);
        return;
      }

      const distance = event.clientX - drag.startX;

      if (!drag.moved && Math.abs(distance) > 6) {
        drag.moved = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.setAttribute('data-dragging', 'true');
      }

      if (!drag.moved) {
        return;
      }

      event.preventDefault();
      event.currentTarget.scrollLeft = drag.startScroll - distance;
    },
    [finishMouseDrag],
  );

  const handleClickCapture = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }, []);

  const goToPrevious = useCallback(() => {
    scrollToSlide(Math.max(0, activeIndex - 1));
  }, [activeIndex, scrollToSlide]);

  const goToNext = useCallback(() => {
    scrollToSlide(Math.min(slideCount - 1, activeIndex + 1));
  }, [activeIndex, scrollToSlide, slideCount]);

  return {
    activeIndex,
    endSpacer,
    finishMouseDrag,
    goToNext,
    goToPrevious,
    handleClickCapture,
    handlePointerDown,
    handlePointerLeave,
    handlePointerMove,
    scrollToSlide,
    trackRef,
  };
}
