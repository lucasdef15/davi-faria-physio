import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { getAnchorScrollTop } from '../lib/anchor-navigation.ts';
import { subscribeToMediaQuery } from '../lib/media-query.ts';
import { lockDocumentScroll } from '../lib/scroll-lock.ts';
import { getStructuredData } from '../lib/seo.ts';
import { getContentLastModified, isPreviewDeployment, resolveSiteUrl } from '../lib/site.ts';

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

test('uses only an explicit public URL or the Vercel production host', () => {
  assert.equal(
    resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://davi-faria-physio.vercel.app' }).toString(),
    'https://davi-faria-physio.vercel.app/',
  );
  assert.equal(
    resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'davi-faria-physio.vercel.app' }).toString(),
    'https://davi-faria-physio.vercel.app/',
  );
  assert.throws(() => resolveSiteUrl({ VERCEL_ENV: 'production' }));
  assert.equal(
    resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: 'https://davi-faria-physio-git-main-team.vercel.app',
      VERCEL_ENV: 'preview',
      VERCEL_PROJECT_PRODUCTION_URL: 'davi-faria-physio.vercel.app',
    }).toString(),
    'https://davi-faria-physio.vercel.app/',
  );
  assert.throws(() =>
    resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: 'https://davi-faria-physio-git-main-team.vercel.app',
      VERCEL_ENV: 'preview',
    }),
  );
  assert.throws(() => resolveSiteUrl({ VERCEL_ENV: 'preview' }));
  assert.throws(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'ftp://example.com' }));
});

test('recognizes only Vercel previews as noindex deployments', () => {
  assert.equal(isPreviewDeployment({ VERCEL_ENV: 'preview' }), true);
  assert.equal(isPreviewDeployment({ VERCEL_ENV: 'production' }), false);
  assert.equal(isPreviewDeployment({}), false);
});

test('accepts only real ISO dates for sitemap lastmod', () => {
  assert.equal(getContentLastModified(undefined), undefined);
  assert.equal(getContentLastModified('2026-07-28')?.toISOString(), '2026-07-28T00:00:00.000Z');
  assert.throws(() => getContentLastModified('2026-02-30'));
  assert.throws(() => getContentLastModified('28/07/2026'));
});

test('serves one shared structured-data graph without incompatible specialty fields', () => {
  const graph = getStructuredData()['@graph'];
  const practice = graph.find((item) => item['@type'] === 'Physiotherapy');

  assert.equal(graph.length, 4);
  assert.equal('medicalSpecialty' in practice!, false);
});

test('refuses IndexNow from Preview and localhost before any submission', () => {
  const execute = (environment: Record<string, string>) =>
    spawnSync(process.execPath, ['scripts/submit-indexnow.mjs'], {
      cwd: new URL('..', import.meta.url),
      encoding: 'utf8',
      env: { ...process.env, ...environment },
    });

  const preview = execute({
    INDEXNOW_KEY: '12345678',
    NEXT_PUBLIC_SITE_URL: 'https://davi-faria-physio.vercel.app',
    VERCEL_ENV: 'preview',
  });
  const localhost = execute({
    INDEXNOW_KEY: '12345678',
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    VERCEL_ENV: '',
  });

  assert.equal(preview.status, 1);
  assert.match(preview.stderr, /só é permitido no ambiente Production/);
  assert.equal(localhost.status, 1);
  assert.match(localhost.stderr, /nunca localhost ou Preview/);
});
