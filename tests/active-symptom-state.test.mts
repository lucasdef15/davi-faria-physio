import assert from 'node:assert/strict';
import test from 'node:test';

import {
  INITIAL_SYMPTOM_STATE,
  reduceSymptomInteraction,
} from '../components/sections/for-whom/activeSymptomState.ts';

test('starts without preview or selection', () => {
  assert.deepEqual(INITIAL_SYMPTOM_STATE, {
    previewedId: null,
    selectedId: null,
  });
});

test('previews only while there is no persistent selection', () => {
  const previewed = reduceSymptomInteraction(INITIAL_SYMPTOM_STATE, {
    id: 'effort',
    type: 'preview',
  });
  const selected = reduceSymptomInteraction(previewed, {
    id: 'effort',
    type: 'select',
  });
  const ignoredPreview = reduceSymptomInteraction(selected, {
    id: 'cough',
    type: 'preview',
  });

  assert.equal(previewed.previewedId, 'effort');
  assert.deepEqual(selected, { previewedId: null, selectedId: 'effort' });
  assert.equal(ignoredPreview, selected);
});

test('clicking the selected symptom toggles the selection off', () => {
  const selected = reduceSymptomInteraction(INITIAL_SYMPTOM_STATE, {
    id: 'recovery',
    type: 'select',
  });
  const reset = reduceSymptomInteraction(selected, {
    id: 'recovery',
    type: 'select',
  });

  assert.equal(reset, INITIAL_SYMPTOM_STATE);
});

test('reset clears preview and persistent selection', () => {
  const selected = { previewedId: null, selectedId: 'cough' };
  const reset = reduceSymptomInteraction(selected, { type: 'reset' });

  assert.equal(reset, INITIAL_SYMPTOM_STATE);
});
