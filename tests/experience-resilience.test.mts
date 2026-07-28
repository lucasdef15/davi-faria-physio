import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  getCanvasCapability,
  getCanvasQualityProfile,
  getInitialCanvasQualityTier,
  reduceCanvasQuality,
} from '../hooks/hero-canvas/quality.ts';
import { getAnchorScrollTop } from '../lib/anchor-navigation.ts';
import { cancelScheduledFrame, scheduleFrame } from '../lib/animation-frame.ts';
import { getMediaQuery, subscribeToMediaQuery } from '../lib/media-query.ts';
import { lockDocumentScroll } from '../lib/scroll-lock.ts';
import { getStructuredData } from '../lib/seo.ts';
import { getContentLastModified, isPreviewDeployment, resolveSiteUrl } from '../lib/site.ts';

test('does not ship Lenis or a global experience profile', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(packageJson.dependencies.lenis, undefined);
  assert.equal(packageJson.dependencies['@studio-freight/lenis'], undefined);
});

test('keeps the hero canvas on mobile while adapting quality progressively', () => {
  const highCapability = getCanvasCapability({ hardwareConcurrency: 8 } as Navigator);
  const lowCapability = getCanvasCapability(
    { deviceMemory: 2, hardwareConcurrency: 2 } as unknown as Navigator,
  );

  assert.equal(getInitialCanvasQualityTier(highCapability, false), 'high');
  assert.equal(getInitialCanvasQualityTier(highCapability, true), 'medium');
  assert.equal(getInitialCanvasQualityTier(lowCapability, true), 'low');
  assert.deepEqual(getCanvasQualityProfile('high', false, 30, 18), {
    dprLimit: 1.5,
    fps: 30,
    interactionEnabled: true,
    particleCount: 11,
    pointCount: 62,
    simplifiedAmbient: false,
  });
  assert.deepEqual(getCanvasQualityProfile('medium', true, 30, 18), {
    dprLimit: 1.15,
    fps: 16,
    interactionEnabled: true,
    particleCount: 5,
    pointCount: 36,
    simplifiedAmbient: false,
  });
  assert.deepEqual(getCanvasQualityProfile('low', true, 30, 18), {
    dprLimit: 1,
    fps: 12,
    interactionEnabled: false,
    particleCount: 2,
    pointCount: 28,
    simplifiedAmbient: true,
  });
  assert.equal(reduceCanvasQuality('high'), 'medium');
  assert.equal(reduceCanvasQuality('medium'), 'low');
  assert.equal(reduceCanvasQuality('low'), 'low');
});

test('keeps animation fallbacks local and cleans canvas lifecycle resources', () => {
  const canvasSource = readFileSync(new URL('../hooks/useBackgroundCanvas.ts', import.meta.url), 'utf8');
  const breathingSource = readFileSync(
    new URL('../hooks/useBreathingAnimation.ts', import.meta.url),
    'utf8',
  );
  const mediaQuerySource = readFileSync(new URL('../lib/media-query.ts', import.meta.url), 'utf8');
  const heroMotionSource = readFileSync(
    new URL('../components/motion/useHeroAnimation.ts', import.meta.url),
    'utf8',
  );
  const revealSource = readFileSync(
    new URL('../components/motion/useRevealAnimation.ts', import.meta.url),
    'utf8',
  );

  assert.match(canvasSource, /canvas\.getContext\('2d', \{ alpha: true \}\)/);
  assert.match(canvasSource, /typeof window\.IntersectionObserver === 'function'/);
  assert.match(canvasSource, /typeof window\.ResizeObserver === 'function'/);
  assert.match(canvasSource, /getMediaQuery/);
  assert.match(canvasSource, /typeof window\.requestAnimationFrame === 'function'/);
  assert.match(canvasSource, /orientationchange/);
  assert.match(canvasSource, /cancelAnimationFrame\(animationFrame\)/);
  assert.match(canvasSource, /reduceCanvasQuality/);
  assert.match(heroMotionSource, /revealImmediately/);
  assert.match(heroMotionSource, /window\.setTimeout/);
  assert.match(revealSource, /trigger\?\.kill\(\)/);
  assert.doesNotMatch(revealSource, /ScrollTrigger\.killAll/);
  assert.match(breathingSource, /typeof IntersectionObserver !== 'function'/);
  assert.match(breathingSource, /typeof requestAnimationFrame !== 'function'/);
  assert.match(breathingSource, /visibilitychange/);
  assert.match(breathingSource, /cancelAnimationFrame\(raf\)/);
  assert.match(breathingSource, /subscribeToMediaQuery/);
  assert.match(mediaQuerySource, /mediaQuery\.addListener/);
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

test('uses a static media query when matchMedia is unavailable', () => {
  assert.deepEqual(getMediaQuery('(prefers-reduced-motion: reduce)'), { matches: false });
});

test('uses a cancellable timeout when requestAnimationFrame is unavailable', () => {
  let callback: (() => void) | undefined;
  let cleared = 0;
  const runtime = {
    clearTimeout: () => {
      cleared += 1;
    },
    setTimeout: (next: () => void) => {
      callback = next;
      return 17;
    },
  };
  let timestamp = 0;

  const id = scheduleFrame((nextTimestamp) => {
    timestamp = nextTimestamp;
  }, runtime);
  callback?.();
  cancelScheduledFrame(id, runtime);

  assert.equal(id, 17);
  assert.ok(timestamp > 0);
  assert.equal(cleared, 1);
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

test('preserves the mobile menu, native scroll, and image sizing contracts', () => {
  const headerSource = readFileSync(new URL('../components/layout/Header.tsx', import.meta.url), 'utf8');
  const mobileMenuSource = readFileSync(
    new URL('../components/layout/MobileHeader.tsx', import.meta.url),
    'utf8',
  );
  const canvasSource = readFileSync(new URL('../hooks/useBackgroundCanvas.ts', import.meta.url), 'utf8');
  const imageSource = readFileSync(
    new URL('../components/sections/about/AboutImage.tsx', import.meta.url),
    'utf8',
  );

  assert.match(headerSource, /window\.scrollTo/);
  assert.match(mobileMenuSource, /touch-pan-y/);
  assert.match(mobileMenuSource, /inert=\{!isOpen\}/);
  assert.match(mobileMenuSource, /scheduleFrame/);
  assert.match(canvasSource, /export function useBackgroundCanvas/);
  assert.match(canvasSource, /desktopFps\?: number/);
  assert.match(canvasSource, /mobileFps\?: number/);
  assert.match(imageSource, /from 'next\/image'/);
  assert.match(imageSource, /sizes="\(max-width: 640px\) 92vw, 512px"/);
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
