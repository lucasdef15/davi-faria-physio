'use client';

import dynamic from 'next/dynamic';

import { getIosDiagnosticOptions } from '@/lib/ios-diagnostics';

const HeroBackgroundCanvas = dynamic(() => import('./HeroBackgroundCanvas'), {
  loading: () => null,
  ssr: false,
});

/** Defers decorative canvas code until the server-rendered hero is already visible. */
export default function HeroCanvasRuntime() {
  if (getIosDiagnosticOptions().disableCanvas) {
    return <div aria-hidden="true" className="pointer-events-none absolute inset-0" />;
  }

  return <HeroBackgroundCanvas />;
}
