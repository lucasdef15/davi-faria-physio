export type SymptomInteractionAction =
  | { id: string; type: 'preview' }
  | { id: string; type: 'select' }
  | { type: 'clear-preview' }
  | { type: 'reset' };

export interface SymptomInteractionState {
  previewedId: null | string;
  selectedId: null | string;
}

export const INITIAL_SYMPTOM_STATE: SymptomInteractionState = {
  previewedId: null,
  selectedId: null,
};

export function reduceSymptomInteraction(
  state: SymptomInteractionState,
  action: SymptomInteractionAction,
): SymptomInteractionState {
  switch (action.type) {
    case 'clear-preview':
      if (!state.previewedId) return state;
      return { ...state, previewedId: null };
    case 'preview':
      if (state.selectedId || state.previewedId === action.id) return state;
      return { ...state, previewedId: action.id };
    case 'reset':
      return INITIAL_SYMPTOM_STATE;
    case 'select':
      if (state.selectedId === action.id) return INITIAL_SYMPTOM_STATE;
      return { previewedId: null, selectedId: action.id };
  }
}
