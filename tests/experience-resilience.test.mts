import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { getAnchorScrollTop } from '../lib/anchor-navigation.ts';
import { subscribeToMediaQuery } from '../lib/media-query.ts';
import { lockDocumentScroll } from '../lib/scroll-lock.ts';

test('does not ship Lenis or a global experience profile', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(packageJson.dependencies.lenis, undefined);
  assert.equal(packageJson.dependencies['@studio-freight/lenis'], undefined);
});

test('calculates native anchor offsets without a scrolling runtime', () => {
  assert.equal(getAnchorScrollTop(360, 240, 100), 500);
  assert.equal(getAnchorScrollTop(-20, 0, 100), 0);
});

test('falls back to legacy MediaQueryList listeners and cleans them up', () => {
  let added = 0;
  let removed = 0;
  const listener = () => undefined;
  const unsubscribe = subscribeToMediaQuery(
    {
      addListener: () => {
        added += 1;
      },
      removeListener: () => {
        removed += 1;
      },
    },
    listener,
  );

  unsubscribe();

  assert.equal(added, 1);
  assert.equal(removed, 1);
});

test('restores document overflow after the menu closes or unmounts', () => {
  const documentLike = {
    body: { style: { overflow: 'scroll' } },
    documentElement: { style: { overflow: 'auto' } },
  };

  const unlock = lockDocumentScroll(documentLike);

  assert.equal(documentLike.body.style.overflow, 'hidden');
  assert.equal(documentLike.documentElement.style.overflow, 'hidden');

  unlock();

  assert.equal(documentLike.body.style.overflow, 'scroll');
  assert.equal(documentLike.documentElement.style.overflow, 'auto');
});
