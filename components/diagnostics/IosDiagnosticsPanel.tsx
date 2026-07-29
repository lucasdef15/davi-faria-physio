'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  getIosDiagnosticSnapshot,
  type IosDiagnosticOptions,
  markIosDiagnosticStage,
  recordIosDiagnosticError,
  subscribeToIosDiagnostics,
} from '@/lib/ios-diagnostics';
import { getMediaQuery } from '@/lib/media-query';

interface DiagnosticDetails {
  canvas: boolean;
  clientChunk: null | string;
  deviceMemory: null | number;
  dpr: number;
  hardwareConcurrency: null | number;
  intersectionObserver: boolean;
  orientation: string;
  prefersReducedMotion: boolean;
  resizeObserver: boolean;
  saveData: boolean | null;
  userAgent: string;
  viewport: string;
}

interface IosDiagnosticsPanelProps {
  options: IosDiagnosticOptions;
}

export default function IosDiagnosticsPanel({ options }: IosDiagnosticsPanelProps) {
  const [, setRevision] = useState(0);
  const [details, setDetails] = useState<DiagnosticDetails | null>(null);
  const snapshot = getIosDiagnosticSnapshot();

  useEffect(() => {
    markIosDiagnosticStage('React iniciou');
    markIosDiagnosticStage('Hidratação concluída');

    const connection = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const updateDetails = () => {
      setDetails({
        canvas: typeof CanvasRenderingContext2D !== 'undefined',
        clientChunk: getClientChunkLabel(),
        deviceMemory: connection.deviceMemory ?? null,
        dpr: window.devicePixelRatio || 1,
        hardwareConcurrency: navigator.hardwareConcurrency ?? null,
        intersectionObserver: typeof IntersectionObserver === 'function',
        orientation: getMediaQuery('(orientation: portrait)').matches ? 'portrait' : 'landscape',
        prefersReducedMotion: getMediaQuery('(prefers-reduced-motion: reduce)').matches ?? false,
        resizeObserver: typeof ResizeObserver === 'function',
        saveData: connection.connection?.saveData ?? null,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth} × ${window.innerHeight}`,
      });
    };
    const handleError = (event: ErrorEvent) => recordIosDiagnosticError(event.error ?? event.message);
    const handleRejection = (event: PromiseRejectionEvent) => recordIosDiagnosticError(event.reason);
    const unsubscribe = subscribeToIosDiagnostics(() => setRevision((value) => value + 1));

    updateDetails();
    window.addEventListener('error', handleError);
    window.addEventListener('orientationchange', updateDetails);
    window.addEventListener('resize', updateDetails, { passive: true });
    window.addEventListener('unhandledrejection', handleRejection);

    window.setTimeout(() => markIosDiagnosticStage('Página interativa'), 0);

    return () => {
      unsubscribe();
      window.removeEventListener('error', handleError);
      window.removeEventListener('orientationchange', updateDetails);
      window.removeEventListener('resize', updateDetails);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const copySnapshot = useCallback(async () => {
    const payload = JSON.stringify({ details, options, snapshot: getIosDiagnosticSnapshot() }, null, 2);

    try {
      await navigator.clipboard?.writeText(payload);
    } catch {
      recordIosDiagnosticError('Não foi possível copiar o diagnóstico.');
    }
  }, [details, options]);

  return (
    <aside
      className="fixed right-3 bottom-3 z-[100] max-h-[42dvh] w-[min(22rem,calc(100vw-1.5rem))] overflow-auto rounded-xl border border-slate-700 bg-slate-950/95 p-3 font-mono text-[10px] leading-relaxed text-slate-100 shadow-2xl"
      data-ios-diagnostics
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <strong>Diagnóstico de desempenho</strong>
        <button className="rounded border border-slate-600 px-2 py-1" onClick={copySnapshot} type="button">
          Copiar
        </button>
      </div>

      <p>Build/chunk: {details?.clientChunk ?? 'coletando'}</p>
      <p>Viewport: {details?.viewport ?? 'coletando'}</p>
      <p>DPR: {details?.dpr ?? '—'} · orientação: {details?.orientation ?? '—'}</p>
      <p>Canvas/IO/RO: {String(details?.canvas)} / {String(details?.intersectionObserver)} / {String(details?.resizeObserver)}</p>
      <p>Memória/CPU: {details?.deviceMemory ?? 'n/d'} GB / {details?.hardwareConcurrency ?? 'n/d'} núcleos</p>
      <p>saveData/reduced motion: {String(details?.saveData)} / {String(details?.prefersReducedMotion)}</p>
      <p className="mt-2 break-all">UA: {details?.userAgent ?? 'coletando'}</p>

      <p className="mt-2">Flags: {JSON.stringify(options)}</p>
      <p className="mt-2">Estágios:</p>
      <ol className="list-inside list-decimal">
        {(snapshot?.entries ?? []).map((entry) => (
          <li key={entry.stage}>{entry.stage} ({Math.round(entry.timestamp - (snapshot?.startedAt ?? entry.timestamp))} ms)</li>
        ))}
      </ol>

      {(snapshot?.errors.length ?? 0) > 0 && (
        <p className="mt-2 break-all text-rose-300">Erros: {snapshot?.errors.join(' | ')}</p>
      )}
    </aside>
  );
}

function getClientChunkLabel(): null | string {
  if (typeof performance === 'undefined') {
    return null;
  }

  const resource = performance
    .getEntriesByType('resource')
    .find((entry) => entry.name.includes('/_next/static/chunks/'));

  return resource ? resource.name.split('/').pop() ?? null : null;
}
