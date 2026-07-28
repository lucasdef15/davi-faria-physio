'use client';

import dynamic from 'next/dynamic';

const HeroBackgroundCanvas = dynamic(() => import('./HeroBackgroundCanvas'), {
  loading: () => null,
  ssr: false,
});

/** Defers decorative canvas code until the server-rendered hero is already visible. */
export default function HeroCanvasRuntime() {
  return <HeroBackgroundCanvas />;
}
