'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import {
  INITIAL_SYMPTOM_STATE,
  reduceSymptomInteraction,
} from '@/components/sections/for-whom/activeSymptomState';
import { Symptom } from '@/components/sections/for-whom/symptoms';

interface UseActiveSymptom {
  active: Symptom;
  activeId: string;
  clearHover: () => void;
  clearSelection: () => void;
  hasSelection: boolean;
  hover: (id: string) => void;
  isActive: (id: string) => boolean;
  isSelected: (id: string) => boolean;
  select: (id: string) => void;
}

export function useActiveSymptom(symptoms: Symptom[]): UseActiveSymptom {
  const [interaction, dispatch] = useReducer(reduceSymptomInteraction, INITIAL_SYMPTOM_STATE);
  const hoverTimer = useRef<null | ReturnType<typeof setTimeout>>(null);

  const { previewedId, selectedId } = interaction;
  const activeId = selectedId ?? previewedId ?? symptoms[0].id;
  const hasSelection = selectedId !== null;
  const active = useMemo(
    () => symptoms.find((s) => s.id === activeId) ?? symptoms[0],
    [symptoms, activeId],
  );

  const cancelHoverTimer = useCallback(() => {
    if (!hoverTimer.current) return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  }, []);

  useEffect(() => cancelHoverTimer, [cancelHoverTimer]);

  const hover = useCallback(
    (id: string) => {
      cancelHoverTimer();
      if (hasSelection || id === previewedId) return;
      hoverTimer.current = setTimeout(() => dispatch({ id, type: 'preview' }), 140);
    },
    [cancelHoverTimer, hasSelection, previewedId],
  );
  const clearHover = useCallback(() => {
    cancelHoverTimer();
    dispatch({ type: 'clear-preview' });
  }, [cancelHoverTimer]);
  const select = useCallback(
    (id: string) => {
      cancelHoverTimer();
      dispatch({ id, type: 'select' });
    },
    [cancelHoverTimer],
  );
  const clearSelection = useCallback(() => {
    cancelHoverTimer();
    dispatch({ type: 'reset' });
  }, [cancelHoverTimer]);
  const isActive = useCallback(
    (id: string) => id === selectedId || (!hasSelection && id === previewedId),
    [hasSelection, previewedId, selectedId],
  );
  const isSelected = useCallback((id: string) => id === selectedId, [selectedId]);

  return {
    active,
    activeId,
    clearHover,
    clearSelection,
    hasSelection,
    hover,
    isActive,
    isSelected,
    select,
  };
}
