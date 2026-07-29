export interface IosDiagnosticEntry {
  stage: IosDiagnosticStage;
  timestamp: number;
}

export interface IosDiagnosticOptions {
  disableAllMotion: boolean;
  disableBelowFoldRuntime: boolean;
  disableBreathing: boolean;
  disableCanvas: boolean;
  disableFilters: boolean;
  disableHeroMotion: boolean;
  enabled: boolean;
  staticOnly: boolean;
}

export type IosDiagnosticStage =
  | 'Canvas criado'
  | 'GSAP iniciado'
  | 'Hero montado'
  | 'Hidratação concluída'
  | 'HTML carregado'
  | 'JavaScript iniciado'
  | 'Página interativa'
  | 'Primeiro frame do canvas'
  | 'React iniciou';

interface IosDiagnosticStore {
  entries: IosDiagnosticEntry[];
  errors: string[];
  startedAt: number;
}

const DEFAULT_OPTIONS: IosDiagnosticOptions = {
  disableAllMotion: false,
  disableBelowFoldRuntime: false,
  disableBreathing: false,
  disableCanvas: false,
  disableFilters: false,
  disableHeroMotion: false,
  enabled: false,
  staticOnly: false,
};

const DIAGNOSTIC_EVENT = 'davi:ios-diagnostic-update';

export function getIosDiagnosticOptions(search?: string): IosDiagnosticOptions {
  const params = new URLSearchParams(
    search ?? (typeof window === 'undefined' ? '' : window.location.search),
  );

  if (params.get('diag') !== 'ios') {
    return DEFAULT_OPTIONS;
  }

  const staticOnly = params.get('static') === '1';
  const disableAllMotion = staticOnly || params.get('allMotion') === '0';

  return {
    disableAllMotion,
    disableBelowFoldRuntime: staticOnly || params.get('belowFold') === '0',
    disableBreathing: staticOnly || disableAllMotion || params.get('breathing') === '0',
    disableCanvas: staticOnly || disableAllMotion || params.get('canvas') === '0',
    disableFilters: staticOnly || params.get('filters') === '0',
    disableHeroMotion: staticOnly || disableAllMotion || params.get('heroMotion') === '0',
    enabled: true,
    staticOnly,
  };
}

export function getIosDiagnosticSnapshot(): IosDiagnosticStore | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return getStore(false);
}

export function markIosDiagnosticStage(stage: IosDiagnosticStage): void {
  if (!getIosDiagnosticOptions().enabled || typeof window === 'undefined') {
    return;
  }

  const store = getStore(true);

  if (!store || store.entries.some((entry) => entry.stage === stage)) {
    return;
  }

  store.entries.push({ stage, timestamp: performance.now() });
  window.dispatchEvent(new Event(DIAGNOSTIC_EVENT));
}

export function recordIosDiagnosticError(error: unknown): void {
  if (!getIosDiagnosticOptions().enabled || typeof window === 'undefined') {
    return;
  }

  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  const store = getStore(true);

  if (!store || store.errors.includes(message)) {
    return;
  }

  store.errors.push(message);
  window.dispatchEvent(new Event(DIAGNOSTIC_EVENT));
}

export function subscribeToIosDiagnostics(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(DIAGNOSTIC_EVENT, listener);
  return () => window.removeEventListener(DIAGNOSTIC_EVENT, listener);
}

function getStore(create: boolean): IosDiagnosticStore | null {
  const runtime = window as Window & { __daviIosDiagnostics?: IosDiagnosticStore };

  if (!runtime.__daviIosDiagnostics && create) {
    runtime.__daviIosDiagnostics = {
      entries: [],
      errors: [],
      startedAt: performance.now(),
    };
  }

  return runtime.__daviIosDiagnostics ?? null;
}
